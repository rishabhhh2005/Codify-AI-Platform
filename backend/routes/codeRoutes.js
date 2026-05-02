import express from "express";
import { executeCode } from "../services/e2bService.js";
import { parseAssignmentInput, compareOutputs } from "../utils/codeUtils.js";

const router = express.Router();

/**
 * Handles multiple test cases execution and comparison
 */
const runMultipleTestCases = async (code, language, testCases, isRun = false, functionName = 'solution') => {
  const results = [];
  let passedCount = 0;

  for (const tc of testCases) {
    const parsedInput = parseAssignmentInput(tc.input || '');
    const stdin = JSON.stringify(parsedInput);
    const params = Object.keys(parsedInput);
    
    // Execute code using E2B service
    const result = await executeCode(code, language, stdin, isRun ? "" : tc.output, params, functionName);
    
    const actualOutput = result.stdout || "";
    const isPassed = result.status.id === 3 || (result.status.id === 4 && compareOutputs(actualOutput, tc.output));
    
    // Manual comparison for reliability
    const manualPassed = compareOutputs(actualOutput, tc.output);
    
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

/**
 * Route: POST /api/code/submit
 * Purpose: "Run" code with a subset of test cases
 */
router.post("/submit", async (req, res) => {
  const { code, language, testCases, functionName } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const runTcs = Array.isArray(testCases) ? testCases.slice(0, 2) : [];

    if (runTcs.length > 0) {
      const data = await runMultipleTestCases(code, language, runTcs, true, functionName);
      res.json({ ...data, isBatch: true, statusText: data.status });
    } else {
      const result = await executeCode(code, language, "", "");
      res.json(result);
    }
  } catch (error) {
    console.error("Run Error:", error);
    res.status(500).json({ error: error.message || "Failed to execute code" });
  }
});

/**
 * Route: POST /api/code/submit-all
 * Purpose: "Submit" code with all test cases
 */
router.post("/submit-all", async (req, res) => {
  const { code, language, testCases, functionName } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const submitTcs = Array.isArray(testCases) ? testCases : [];

    if (submitTcs.length === 0) {
      return res.status(400).json({ error: "No test cases provided for submission" });
    }

    const data = await runMultipleTestCases(code, language, submitTcs, false, functionName);
    res.json(data);
  } catch (error) {
    console.error("Submit All Error:", error);
    res.status(500).json({ error: error.message || "Failed to submit batch" });
  }
});

export default router;

