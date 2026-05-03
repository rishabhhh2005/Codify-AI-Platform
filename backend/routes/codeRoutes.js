import express from "express";
import { executeCode } from "../services/e2bService.js";
import { parseAssignmentInput, compareOutputs } from "../utils/codeUtils.js";
import { loadQuestions } from "../services/aiService.js";
import { getHiddenTestCases, getVisibleTestCases } from "../data/testCases.js";

const router = express.Router();

/**
 * Handles multiple test cases execution and comparison
 */
const runMultipleTestCases = async (code, language, testCases, isRun = false, functionName = 'solution', options = {}) => {
  const { hideCaseDetails = false, caseLabel = "Test Case" } = options;
  const results = [];
  let passedCount = 0;

  for (const [index, tc] of testCases.entries()) {
    const parsedInput = parseAssignmentInput(tc.input || '');
    const stdin = JSON.stringify(parsedInput);
    const params = Object.keys(parsedInput);

    console.log(
      `[Code] ${isRun ? "run" : "submit"} case ${index + 1}/${testCases.length} | language=${language} | function=${functionName || "script"} | params=${params.join(",") || "none"}`
    );
    
    // Execute code using E2B service
    const result = await executeCode(code, language, stdin, isRun ? "" : tc.output, params, functionName);
    
    const actualOutput = result.stdout || "";
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

    console.log(
      `[Code] case ${index + 1} result | status=${statusDescription} | stdout=${actualOutput.length} chars | stderr=${(result.stderr || "").length} chars`
    );

    const caseResult = {
      input: hideCaseDetails ? `${caseLabel} ${index + 1}` : tc.input,
      expected_output: hideCaseDetails ? "Hidden" : tc.output,
      isHidden: hideCaseDetails,
      caseNumber: index + 1,
      ...result,
      status: {
        id: statusId,
        description: statusDescription
      }
    };

    if (hideCaseDetails) {
      caseResult.stdout = "";
      caseResult.stderr = statusId === 3 ? null : (result.stderr || statusDescription);
      caseResult.compile_output = result.compile_output || null;
    }

    results.push(caseResult);
  }

  const totalCount = testCases.length || 1;
  const isAccepted = passedCount === totalCount;

  return {
    status: isAccepted ? "Accepted" : "Rejected",
    passed: passedCount,
    total: totalCount,
    results,
    testResults: results
  };
};

const findQuestion = (questionId) => {
  if (!questionId) return null;
  return loadQuestions().find((question) => question.id === questionId) || null;
};

/**
 * Route: POST /api/code/run
 * Purpose: "Run" code with a subset of test cases
 */
router.post("/run", async (req, res) => {
  const { code, language, testCases, functionName, questionId } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const question = findQuestion(questionId);
    const runTcs = question
      ? getVisibleTestCases(question).slice(0, 3)
      : (Array.isArray(testCases) ? testCases.slice(0, 3) : []);

    if (runTcs.length > 0) {
      const data = await runMultipleTestCases(code, language, runTcs, true, functionName || question?.functionName);
      res.json({ ...data, isBatch: true, statusText: data.status, testResults: data.results });
    } else {
      const result = await executeCode(code, language, "", "", [], null);
      res.json(result);
    }
  } catch (error) {
    console.error("Run Error:", error);
    res.status(500).json({ error: error.message || "Failed to execute code" });
  }
});

/**
 * Route: POST /api/code/submit
 * Purpose: "Submit" code with all test cases
 */
router.post("/submit", async (req, res) => {
  const { code, language, testCases, functionName, questionId } = req.body;

  if (!code || !language) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const question = findQuestion(questionId);
    const submitTcs = question
      ? getHiddenTestCases(question)
      : (Array.isArray(testCases) ? testCases.slice(0, 6) : []);

    if (submitTcs.length === 0) {
      return res.status(400).json({ error: "No test cases provided for submission" });
    }

    const data = await runMultipleTestCases(
      code,
      language,
      submitTcs,
      false,
      functionName || question?.functionName,
      { hideCaseDetails: true, caseLabel: "Hidden Test Case" }
    );
    res.json({ ...data, isHiddenBatch: true, suiteName: "Hidden TestCases" });
  } catch (error) {
    console.error("Submit All Error:", error);
    res.status(500).json({ error: error.message || "Failed to submit batch" });
  }
});

export default router;
