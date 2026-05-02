import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Sandbox } from "@e2b/code-interpreter";
import { wrapCode } from "../utils/codeUtils.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const E2B_API_KEY = process.env.E2B_API_KEY;

// Timeouts (ms)
const SANDBOX_TIMEOUT_MS  = 30_000; // max sandbox lifetime
const COMPILE_TIMEOUT_MS  = 15_000; // javac compile step
const RUN_TIMEOUT_MS      = 10_000; // user code execution
const SANDBOX_CREATE_RETRIES = 2;   // how many times to retry sandbox creation

// ─── Status codes (mirrors Judge0 / LeetCode conventions) ────────────────────
const STATUS = {
  ACCEPTED:          { id: 3,  description: "Accepted" },
  WRONG_ANSWER:      { id: 4,  description: "Wrong Answer" },
  TIME_LIMIT:        { id: 5,  description: "Time Limit Exceeded" },
  COMPILATION_ERROR: { id: 6,  description: "Compilation Error" },
  RUNTIME_ERROR:     { id: 7,  description: "Runtime Error" },
  INTERNAL_ERROR:    { id: 13, description: "Internal Error" },
};

function createExecutionId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function getCommandOutput(err) {
  return {
    stdout: (err?.stdout || "").trim(),
    stderr: (err?.stderr || err?.message || "").trim(),
    exitCode: typeof err?.exitCode === "number" ? err.exitCode : 1,
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Creates an E2B sandbox with retry logic.
 * Sometimes the first create() call fails transiently – retrying fixes it.
 */
async function createSandbox(retries = SANDBOX_CREATE_RETRIES) {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      const sandbox = await Sandbox.create({
        apiKey: E2B_API_KEY,
        timeoutMs: SANDBOX_TIMEOUT_MS,
      });
      return sandbox;
    } catch (err) {
      lastError = err;
      if (i < retries) {
        // Brief back-off before next attempt
        await new Promise((r) => setTimeout(r, 500 * (i + 1)));
      }
    }
  }
  throw lastError;
}

/**
 * Builds a structured error response.
 */
function errorResult(status, detail = "") {
  return {
    stdout:          "",
    stderr:          detail,
    compile_output:  null,
    message:         null,
    status,
    time:            "0",
    memory:          0,
  };
}

/**
 * Cleans up a sandbox safely (never throws).
 */
async function killSandbox(sandbox) {
  if (!sandbox) return;
  try {
    await sandbox.kill();
  } catch (_) {
    // Ignore – sandbox may have already timed out
  }
}

// ─── Java stdin serialization ─────────────────────────────────────────────────

/**
 * Converts the JSON stdin object into the pipe-delimited format expected by
 * the Java harness in codeUtils.js.
 *
 * e.g. { nums: [2,7,11,15], target: 9 }  →  "[2,7,11,15]|9"
 */
function buildJavaStdin(stdinJson, params) {
  try {
    const data = JSON.parse(stdinJson);
    return params
      .map((p) => {
        const val = data[p];
        if (Array.isArray(val)) return "[" + val.join(",") + "]";
        return String(val);
      })
      .join("|");
  } catch {
    return stdinJson; // fall back to raw string
  }
}

// ─── Core executor ───────────────────────────────────────────────────────────

/**
 * Executes user code in an E2B sandbox.
 *
 * @param {string}   code         - Raw user code
 * @param {string}   language     - "python" | "java"
 * @param {string}   stdin        - JSON-stringified input object
 * @param {string}   [expected]   - Expected output string (unused here, kept for API compat)
 * @param {string[]} [params]     - Ordered parameter names from the problem
 * @param {string}   [functionName] - Entry-point function name
 * @returns {Promise<object>}
 */
export async function executeCode(
  code,
  language,
  stdin = "",
  expected_output = "",
  params = [],
  functionName = null
) {
  const executionId = createExecutionId();

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!E2B_API_KEY) {
    console.error(`[E2B:${executionId}] E2B_API_KEY is not set`);
    return errorResult(STATUS.INTERNAL_ERROR, "Server configuration error: E2B_API_KEY missing");
  }

  if (!code || !code.trim()) {
    return errorResult(STATUS.RUNTIME_ERROR, "No code provided");
  }

  const lang = language?.toLowerCase() || "python";
  if (!["python", "java"].includes(lang)) {
    return errorResult(STATUS.INTERNAL_ERROR, `Unsupported language: ${language}`);
  }

  // ── Prepare stdin ───────────────────────────────────────────────────────────
  let finalStdin = stdin;
  if (lang === "java" && stdin) {
    finalStdin = buildJavaStdin(stdin, params);
  }

  // ── Wrap code with test harness ─────────────────────────────────────────────
  let wrappedSource;
  const useHarness = Array.isArray(params) && params.length > 0;
  try {
    wrappedSource = useHarness ? wrapCode(code, lang, params, functionName || "solution") : code;
  } catch (wrapErr) {
    console.error(`[E2B:${executionId}] wrapCode failed:`, wrapErr.message);
    return errorResult(STATUS.INTERNAL_ERROR, `Code wrapping error: ${wrapErr.message}`);
  }

  const filename = lang === "java" ? "Main.java" : "main.py";
  console.log(`[E2B:${executionId}] Executing ${lang} | harness=${useHarness} | stdin=${JSON.stringify(finalStdin)} | function=${functionName || "script"}`);

  // ── Sandbox lifecycle ────────────────────────────────────────────────────────
  let sandbox;
  try {
    sandbox = await createSandbox();
  } catch (createErr) {
    console.error(`[E2B:${executionId}] Sandbox creation failed:`, createErr.message);
    return errorResult(
      STATUS.INTERNAL_ERROR,
      `Sandbox unavailable – please try again. (${createErr.message})`
    );
  }

  try {
    // Write source file
    await sandbox.files.write(filename, wrappedSource);

    // Write stdin file (always write it; harness reads from file when present)
    if (finalStdin) {
      await sandbox.files.write("input.txt", finalStdin);
    }

    // ── Java: compile first ───────────────────────────────────────────────────
    if (lang === "java") {
      let compile;
      try {
        compile = await sandbox.commands.run("javac Main.java 2>&1", {
          timeoutMs: COMPILE_TIMEOUT_MS,
        });
      } catch (compileErr) {
        const msg = compileErr.message || "";
        if (msg.toLowerCase().includes("timeout") || msg.toLowerCase().includes("timed out")) {
          console.error(`[E2B:${executionId}] Java compilation timed out`);
          return errorResult(STATUS.COMPILATION_ERROR, "Compilation timed out");
        }

        const failedCompile = getCommandOutput(compileErr);
        const cleanError = (failedCompile.stdout || failedCompile.stderr || "Compilation failed")
          .replace(/Main\.java:\d+:/g, "Solution.java:")
          .replace(/public class Main[\s\S]*/, "")
          .trim();

        console.error(`[E2B:${executionId}] Java compilation failed:`, cleanError);
        return {
          stdout:          "",
          stderr:          cleanError || "Compilation failed",
          compile_output:  cleanError || "Compilation failed",
          message:         null,
          status:          STATUS.COMPILATION_ERROR,
          time:            "0",
          memory:          0,
        };
      }

      if (compile.exitCode !== 0) {
        // Strip internal harness class references from error output to give
        // the user a cleaner message (similar to LeetCode)
        const cleanError = (compile.stdout || compile.stderr || "")
          .replace(/Main\.java:\d+:/g, "Solution.java:")
          .replace(/public class Main[\s\S]*/, "") // hide harness internals
          .trim();

        return {
          stdout:          "",
          stderr:          cleanError || "Compilation failed",
          compile_output:  cleanError || "Compilation failed",
          message:         null,
          status:          STATUS.COMPILATION_ERROR,
          time:            "0",
          memory:          0,
        };
      }
    }

    // ── Run ───────────────────────────────────────────────────────────────────
    const runCmd =
      lang === "java"
        ? `java Main${finalStdin ? " < input.txt" : ""}`
        : `python3 main.py${finalStdin ? " < input.txt" : ""}`;

    let execution;
    try {
      execution = await sandbox.commands.run(runCmd, {
        timeoutMs: RUN_TIMEOUT_MS,
      });
    } catch (runErr) {
      // Distinguish TLE from other errors
      const msg = runErr.message || "";
      if (
        msg.toLowerCase().includes("timeout") ||
        msg.toLowerCase().includes("timed out")
      ) {
        console.error(`[E2B:${executionId}] Execution timed out`);
        return errorResult(
          STATUS.TIME_LIMIT,
          "Your code exceeded the time limit (10s). Check for infinite loops or inefficient algorithms."
        );
      }

      const failedRun = getCommandOutput(runErr);
      const errMsg = failedRun.stderr || failedRun.stdout || "Runtime error (unknown cause)";
      console.error(`[E2B:${executionId}] Runtime error:`, errMsg);
      return {
        stdout:         failedRun.stdout,
        stderr:         errMsg,
        compile_output: null,
        message:        null,
        status:         STATUS.RUNTIME_ERROR,
        time:           "0",
        memory:         0,
      };
    }

    const rawStdout = (execution.stdout || "").trim();
    const rawStderr = (execution.stderr || "").trim();
    const exitCode  = execution.exitCode ?? 0;

    // ── Classify result ───────────────────────────────────────────────────────
    if (exitCode !== 0 || (rawStderr && !rawStdout)) {
      // Non-zero exit = runtime error
      // Give a friendly error: prefer stderr, fall back to stdout
      const errMsg = rawStderr || rawStdout || "Runtime error (unknown cause)";
      return {
        stdout:         rawStdout,
        stderr:         errMsg,
        compile_output: null,
        message:        null,
        status:         STATUS.RUNTIME_ERROR,
        time:           "0",
        memory:         0,
      };
    }

    console.log(`[E2B:${executionId}] Completed successfully | stdout=${rawStdout.length} chars | stderr=${rawStderr.length} chars`);
    return {
      stdout:         rawStdout,
      stderr:         rawStderr || null,
      compile_output: null,
      message:        null,
      status:         STATUS.ACCEPTED, // route layer will re-evaluate vs expected
      time:           "0",
      memory:         0,
    };

  } catch (err) {
    console.error(`[E2B:${executionId}] Unexpected error during execution:`, err);
    return errorResult(
      STATUS.INTERNAL_ERROR,
      `Execution failed: ${err.message}`
    );
  } finally {
    await killSandbox(sandbox);
  }
}
