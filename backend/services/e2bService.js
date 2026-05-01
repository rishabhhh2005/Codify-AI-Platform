import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { Sandbox } from "@e2b/code-interpreter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const E2B_API_KEY = process.env.E2B_API_KEY;

const LANGUAGE_CONFIG = {
  python: { id: 'python', filename: 'main.py', run: 'python3' },
  java: { id: 'java', filename: 'Main.java', run: 'java' }
};

import { wrapCode } from "../utils/codeUtils.js";


/**
 * Submits code to E2B Sandbox and returns the result
 */
export const executeCode = async (code, language, stdin = "", expected_output = "", params = [], functionName = "") => {
  const langLower = language.toLowerCase();
  const config = LANGUAGE_CONFIG[langLower] || LANGUAGE_CONFIG.python;
  
  let finalStdin = stdin;
  if (langLower === 'java') {
      try {
          const data = JSON.parse(stdin);
          finalStdin = params.map(p => {
              const val = data[p];
              if (Array.isArray(val)) return "[" + val.join(",") + "]";
              return String(val);
          }).join("|"); 
      } catch (e) {}
  }

  const wrappedSource = wrapCode(code, langLower, params, functionName);
  
  console.log(`[E2B] Executing ${language} with stdin: "${finalStdin}"`);

  let sandbox;
  try {
    sandbox = await Sandbox.create({ apiKey: E2B_API_KEY });
    
    await sandbox.files.write(config.filename, wrappedSource);

    let runCmd = config.run;
    let runArgs = [config.filename];

    if (langLower === 'java') {
      const compile = await sandbox.commands.run('javac Main.java', { timeoutMs: 10000 });
      if (compile.exitCode !== 0) {
        return {
          stdout: "",
          stderr: compile.stderr,
          status: { id: 6, description: "Compilation Error" }
        };
      }
      runCmd = 'java';
      runArgs = ['Main'];
    } else if (langLower === 'python') {
      runCmd = 'python3';
      runArgs = ['main.py'];
    }

    const execution = await sandbox.commands.run(`${runCmd} ${runArgs.join(' ')}`, { 
      stdin: finalStdin,
      timeoutMs: 10000 
    });

    const hasError = execution.exitCode !== 0 || (execution.stderr && !execution.stdout);
    
    return {
      stdout: execution.stdout || "",
      stderr: execution.stderr || null,
      compile_output: null, 
      message: execution.error || null,
      status: {
        id: hasError ? 4 : 3, 
        description: hasError ? "Execution Error" : "Finished"
      },
      time: "0", 
      memory: 0
    };

  } catch (error) {
    console.error("E2B Execution Error:", error.message);
    return {
      stdout: null,
      stderr: error.message,
      compile_output: null,
      status: { id: 13, description: "Sandbox Error" },
      time: "0",
      memory: 0
    };
  } finally {
    if (sandbox) {
      await sandbox.kill();
    }
  }
};
