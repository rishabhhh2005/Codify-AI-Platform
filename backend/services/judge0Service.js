import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
const JUDGE0_RAPIDAPI_KEY = process.env.JUDGE0_RAPIDAPI_KEY;
const JUDGE0_RAPIDAPI_HOST = process.env.JUDGE0_RAPIDAPI_HOST || 'judge0-ce.p.rapidapi.com';

// Map our frontend language IDs to Judge0 IDs
const LANGUAGE_MAP = {
  javascript: 63, // Node.js 12.14.0
  python: 71,     // Python 3.8.1
  cpp: 54,        // GCC 9.2.0
  java: 62        // OpenJDK 13.0.1
};

/**
 * Encodes string to Base64
 */
const encode = (str) => {
  if (str === null || str === undefined) return "";
  return Buffer.from(String(str)).toString("base64");
};

/**
 * Decodes Base64 to string
 */
const decode = (base64) => {
  if (!base64) return null;
  try {
    return Buffer.from(base64, "base64").toString("utf-8");
  } catch (err) {
    console.error("Decode error:", err);
    return null;
  }
};

/**
 * Wraps user code with a hidden test harness (LeetCode style)
 */
const wrapCode = (userCode, language, params = []) => {
  if (language === 'javascript') {
    const args = params.map(p => `data["${p}"]`).join(', ');
    return `
${userCode}

const fs = require("fs");
try {
  const raw = fs.readFileSync(0, "utf8").trim();
  const data = raw ? JSON.parse(raw) : {};
  // Try calling 'solution' function (default)
  if (typeof solution === 'function') {
    const result = solution(${args});
    if (result !== undefined) console.log(JSON.stringify(result));
  }
} catch (e) {
  process.stderr.write(e.message);
  process.exit(1);
}
`;
  }

  if (language === 'python') {
    const args = params.map(p => `data.get("${p}")`).join(', ');
    return `
import json, sys

${userCode}

try:
    raw = sys.stdin.read().strip()
    data = json.loads(raw) if raw else {}
    
    # Try calling 'solution' function or Solution().solve()
    if 'solution' in globals():
        result = solution(${args})
    elif 'Solution' in globals():
        result = Solution().solve(${args})
    else:
        raise Exception("No 'solution' function or 'Solution' class found")
        
    if result is not None:
        print(json.dumps(result))
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
`;
  }

  if (language === 'cpp') {
    return `
#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>

${userCode}

int main() {
    // Basic C++ harness could be more complex, 
    // but for now we rely on user providing main if they don't use the boilerplate class.
    // However, to make it feel like LeetCode, we can inject a simple main that doesn't exist yet.
    // For now, C++ users often write their own main or use our boilerplate.
    return 0; 
}
`;
  }

  return userCode;
};

/**
 * Submits code to Judge0 and polls for result
 */
export const executeCode = async (code, language, stdin = "", expected_output = "", params = []) => {
  const languageId = LANGUAGE_MAP[language.toLowerCase()] || 63;
  const wrappedSource = wrapCode(code, language, params);

  try {
    if (!JUDGE0_RAPIDAPI_KEY) {
      throw new Error('JUDGE0_RAPIDAPI_KEY is not configured');
    }
    
    // 1. Create Submission
    const body = {
      source_code: encode(wrappedSource),
      language_id: languageId,
      stdin: encode(stdin),
    };

    // Only add expected_output if it's provided and not empty
    if (expected_output) {
      body.expected_output = encode(expected_output);
    }

    const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=true&wait=false`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": JUDGE0_RAPIDAPI_KEY,
        "X-RapidAPI-Host": JUDGE0_RAPIDAPI_HOST
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.status}`);
    }

    const { token } = await response.json();

    // 2. Poll for results
    let result = null;
    let attempts = 0;
    const maxAttempts = 30; // Increased for potential API latency

    while (attempts < maxAttempts) {
      const pollResponse = await fetch(`${JUDGE0_API_URL}/submissions/${token}?base64_encoded=true`, {
        headers: {
          "X-RapidAPI-Key": JUDGE0_RAPIDAPI_KEY,
          "X-RapidAPI-Host": JUDGE0_RAPIDAPI_HOST
        }
      });

      if (!pollResponse.ok) throw new Error("Failed to poll submission status");

      result = await pollResponse.json();
      
      // Status ID 1 = In Queue, 2 = Processing
      if (result.status && result.status.id > 2) {
        break;
      }

      // Wait 1 second before next poll
      await new Promise(resolve => setTimeout(resolve, 1000));
      attempts++;
    }

    if (attempts >= maxAttempts) {
      throw new Error("Execution timed out (polling)");
    }

    // 3. Transform response
    return {
      stdout: decode(result.stdout),
      stderr: decode(result.stderr),
      compile_output: decode(result.compile_output),
      message: decode(result.message),
      status: {
        id: result.status?.id || 13,
        description: result.status?.description || "Unknown Status"
      },
      time: result.time,
      memory: result.memory
    };

  } catch (error) {
    console.error("CodeArena API Error:", error.message);
    let errorMsg = error.message;
    if (error.message.includes("fetch")) {
      errorMsg = "CodeArena API endpoint is not reachable. Check your connection or API key.";
    }
    
    return {
      stdout: null,
      stderr: errorMsg,
      compile_output: null,
      status: { id: 13, description: "Connection Error" },
      time: "0",
      memory: 0
    };
  }
};
