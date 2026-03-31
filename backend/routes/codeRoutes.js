import express from "express";
import { submitToExecutionEngine } from "../services/aiExecutionService.js";
import fs from "fs";
import path from "path";

const router = express.Router();

// Load test cases
const testcasesPath = path.join(process.cwd(), 'backend', 'data', 'testcases.json');
let TEST_CASES_DB = {};
try {
  if (fs.existsSync(testcasesPath)) {
    TEST_CASES_DB = JSON.parse(fs.readFileSync(testcasesPath, 'utf8'));
  }
} catch (err) {
  console.error('Failed to load test cases:', err);
}

// Function to handle multiple test cases
const runMultipleTestCases = async (code, language, testCases) => {
  const results = [];
  for (const tc of testCases) {
    // Execute each test case sequentially
    const result = await submitToExecutionEngine(code, language, tc.input, tc.output);
    results.push({
      input: tc.input,
      expected_output: tc.output,
      ...result
    });
  }

  // Evaluate overall result
  const passedCount = results.filter(r => r.status.id === 3).length; // 3 is Accepted
  const totalCount = testCases.length;
  const isAccepted = passedCount === totalCount;

  return {
    status: isAccepted ? "Accepted" : "Rejected",
    passed: passedCount,
    total: totalCount,
    results
  };
};

// Route for "Run" (2 test cases)
router.post("/submit", async (req, res) => {
  const { code, language, questionId, stdin, expected_output } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Load fresh test cases each time during development
    let currentTcs = TEST_CASES_DB;
    try {
      if (fs.existsSync(testcasesPath)) currentTcs = JSON.parse(fs.readFileSync(testcasesPath, 'utf8'));
    } catch (e) {}

    const tcs = currentTcs[questionId] || (stdin ? [{ input: stdin, output: expected_output || "" }] : []);
    
    // User wants 2 test cases for "Run"
    const runTcs = tcs.slice(0, 2);

    if (runTcs.length > 0) {
      const data = await runMultipleTestCases(code, language, runTcs);
      res.json({ ...data, isBatch: true, statusText: data.status });
    } else {
      // Complete fallback (no testcases and no stdin)
      const result = await submitToExecutionEngine(code, language, "", "");
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to submit code" });
  }
});

// Route for "Submit" (5 test cases)
router.post("/submit-all", async (req, res) => {
  const { code, language, questionId, testCases } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Load fresh test cases
    let currentTcs = TEST_CASES_DB;
    try {
      if (fs.existsSync(testcasesPath)) currentTcs = JSON.parse(fs.readFileSync(testcasesPath, 'utf8'));
    } catch (e) {}

    const tcs = currentTcs[questionId] || (testCases && Array.isArray(testCases) ? testCases : []);
    
    // User wants 5 test cases for "Submit"
    const submitTcs = tcs.slice(0, 5);

    if (submitTcs.length === 0) {
      return res.status(404).json({ error: "No test cases found for this question" });
    }

    const data = await runMultipleTestCases(code, language, submitTcs);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to submit batch" });
  }
});

export default router;
