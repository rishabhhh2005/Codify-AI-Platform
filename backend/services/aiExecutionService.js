import { generateJSON } from "./geminiService.js";

/**
 * Simulate code execution using Gemini AI.
 * This "runs" the code against a test case and compares it with expected output.
 */
export const submitToExecutionEngine = async (code, language, stdin = "", expected_output = "") => {
  const prompt = `You are a strict code execution engine. Your task is to simulate the execution of the provided code against a specific input.
  
  Language: ${language}
  Code Source:
  ${code}
  
  Input (stdin):
  ${stdin}
  
  Expected Output:
  ${expected_output}

  Instructions:
  1. Analyze the logic of the code as if you were a compiler/interpreter.
  2. Determine what the actual output (stdout) or error (stderr) would be.
  3. Compare the actual output with the expected output (case and whitespace sensitive, but lenient if reasonable).
  4. Return a status based on Judge0 IDs: 
     - 3 for Accepted (if output matches expected output)
     - 4 for Wrong Answer (if output does not match expected output)
     - 11 for Runtime Error (if code has a logical/execution error based on input)
     - 6 for Compilation Error (if code has any syntax/compilation issues).

  IMPORTANT: Return ONLY a JSON object with this exact structure:
  {
    "stdout": "the full string of actual output if it worked",
    "stderr": "the full string of any errors encountered, or null",
    "compile_output": "any compilation errors or null",
    "status": {
      "id": number (3, 4, 11, 6),
      "description": "string like 'Accepted', 'Wrong Answer', 'Error'"
    },
    "time": "0.1",
    "memory": 1024
  }`;

  try {
    const result = await generateJSON(prompt);

    // Ensure standard structure is matched
    return {
      stdout: result.stdout || null,
      stderr: result.stderr || null,
      compile_output: result.compile_output || null,
      status: {
        id: result.status?.id || 13,
        description: result.status?.description || "Unknown Status"
      },
      time: result.time || "0",
      memory: result.memory || 0
    };
  } catch (error) {
    console.error("AI Execution Error:", error.message);
    return {
      stdout: null,
      stderr: error.message,
      compile_output: null,
      status: { id: 13, description: "AI Simulation Failed" },
      time: "0",
      memory: 0
    };
  }
};
