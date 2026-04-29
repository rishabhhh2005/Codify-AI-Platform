import express from "express";
import { executeCode } from "../services/judge0Service.js";
import { requireAuth } from "../middleware/auth.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const router = express.Router();
router.use(requireAuth);

function splitTopLevel(input, delimiter = ',') {
  const out = [];
  let current = '';
  let depthSquare = 0;
  let depthCurly = 0;
  let inString = false;
  let quote = null;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    const prev = input[i - 1];

    if ((ch === '"' || ch === "'") && prev !== '\\') {
      if (!inString) {
        inString = true;
        quote = ch;
      } else if (quote === ch) {
        inString = false;
        quote = null;
      }
    }

    if (!inString) {
      if (ch === '[') depthSquare += 1;
      if (ch === ']') depthSquare -= 1;
      if (ch === '{') depthCurly += 1;
      if (ch === '}') depthCurly -= 1;

      if (ch === delimiter && depthSquare === 0 && depthCurly === 0) {
        out.push(current.trim());
        current = '';
        continue;
      }
    }

    current += ch;
  }

  if (current.trim()) out.push(current.trim());
  return out;
}

function parseValue(raw) {
  const trimmed = raw.trim();
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) {
    return trimmed.slice(1, -1);
  }
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  if (!Number.isNaN(Number(trimmed))) return Number(trimmed);
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      return JSON.parse(trimmed.replace(/'/g, '"'));
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

function parseAssignmentInput(inputLine = '') {
  const parsed = {};
  const parts = splitTopLevel(inputLine, ',');
  for (const part of parts) {
    const [key, ...rest] = part.split('=');
    if (!key || rest.length === 0) continue;
    parsed[key.trim()] = parseValue(rest.join('=').trim());
  }
  return parsed;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Normalizes output for comparison
 * 1. Trims whitespace
 * 2. If it looks like JSON, parse and re-stringify to normalize formatting
 * 3. Otherwise, collapse multiple whitespaces into one
 */
function normalizeOutput(value) {
  if (value === null || value === undefined) return '';
  let str = String(value).trim();
  if (!str) return '';

  // Try to normalize JSON-like output
  try {
    // Replace single quotes with double quotes if it looks like a JSON array or object
    if ((str.startsWith('[') && str.endsWith(']')) || (str.startsWith('{') && str.endsWith('}'))) {
      const fixedJson = str.replace(/'/g, '"');
      return JSON.stringify(JSON.parse(fixedJson));
    }
    // Try parsing as is
    return JSON.stringify(JSON.parse(str));
  } catch {
    // If not JSON, just normalize spaces
    return str.replace(/\s+/g, ' ').toLowerCase();
  }
}

/**
 * Compares actual output with expected output
 */
function compareOutputs(actual, expected) {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);
  
  if (!normExpected && !normActual) return true;
  if (!normExpected) return true; // If problem statement didn't specify output, assume ok if it ran
  if (!normActual) return false; // Expected something, got nothing
  
  return normActual === normExpected;
}

// Function to handle multiple test cases
const runMultipleTestCases = async (code, language, testCases, isRun = false) => {
  const results = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const parsedInput = parseAssignmentInput(tc.input || '');
    const stdin = JSON.stringify(parsedInput);
    const params = Object.keys(parsedInput);
    
    // For "Run", we don't send expected_output to Judge0 to avoid potential bias/errors in its comparison
    // For "Submit", we can send it but we still do our own manual comparison for reliability
    const result = await executeCode(code, language, stdin, isRun ? "" : tc.output, params);
    
    const actualOutput = result.stdout || "";
    const isPassed = result.status.id === 3 || (result.status.id === 4 && compareOutputs(actualOutput, tc.output));
    
    // Double check with our manual comparison
    const manualPassed = compareOutputs(actualOutput, tc.output);
    
    // Final decision on status
    let statusId = result.status.id;
    let statusDescription = result.status.description;

    if (statusId === 3 || statusId === 4) {
      if (manualPassed) {
        statusId = 3;
        statusDescription = 'Accepted';
        passedCount++;
      } else {
        statusId = 4;
        statusDescription = 'Wrong Answer';
      }
    } else if (statusId === 6) {
        statusDescription = 'Compilation Error';
    }

    results.push({
      input: tc.input,
      expected_output: tc.output,
      ...result,
      status: {
        id: statusId,
        description: statusDescription
      }
    });
  }

  const totalCount = testCases.length || 1;
  const isAccepted = passedCount === totalCount;

  return {
    status: isAccepted ? "Accepted" : "Rejected",
    passed: passedCount,
    total: totalCount,
    results
  };
};

// Route for "Run" (Uses examples from frontend)
router.post("/submit", async (req, res) => {
  const { code, language, testCases } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // If frontend provides test cases (examples), use the first 2
    const runTcs = Array.isArray(testCases) ? testCases.slice(0, 2) : [];

    if (runTcs.length > 0) {
      const data = await runMultipleTestCases(code, language, runTcs, true);
      res.json({ ...data, isBatch: true, statusText: data.status });
    } else {
      // Complete fallback: simple execution with no input
      const result = await executeCode(code, language, "", "");
      res.json(result);
    }
  } catch (error) {
    console.error("Run Error:", error);
    res.status(500).json({ error: error.message || "Failed to execute code" });
  }
});

// Route for "Submit" (Uses all examples from frontend)
router.post("/submit-all", async (req, res) => {
  const { code, language, testCases } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const submitTcs = Array.isArray(testCases) ? testCases : [];

    if (submitTcs.length === 0) {
      return res.status(400).json({ error: "No test cases provided for submission" });
    }

    const data = await runMultipleTestCases(code, language, submitTcs, false);
    res.json(data);
  } catch (error) {
    console.error("Submit All Error:", error);
    res.status(500).json({ error: error.message || "Failed to submit batch" });
  }
});

export default router;
