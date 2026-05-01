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
const wrapCode = (userCode, language, params = [], functionName = 'solution') => {
  if (language === 'javascript') {
    const args = params.map(p => `data["${p}"]`).join(', ');
    const finalFuncName = functionName || 'solution';
    return `
${userCode}

const fs = require("fs");
try {
  const raw = fs.readFileSync(0, "utf8").trim();
  const data = raw ? JSON.parse(raw) : {};
  if (typeof ${finalFuncName} === 'function') {
    const result = ${finalFuncName}(${args});
    if (result !== undefined) console.log(JSON.stringify(result));
  } else if (typeof Solution === 'function' || typeof Solution === 'object') {
    const sol = typeof Solution === 'function' ? new Solution() : Solution;
    const result = sol.${finalFuncName} ? sol.${finalFuncName}(${args}) : (sol.solve ? sol.solve(${args}) : null);
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
    const finalFuncName = functionName || 'solve';
    return `
import json, sys

${userCode}

try:
    raw = sys.stdin.read().strip()
    data = json.loads(raw) if raw else {}
    
    if '${finalFuncName}' in globals():
        result = ${finalFuncName}(${args})
    elif 'Solution' in globals():
        sol = Solution()
        if hasattr(sol, '${finalFuncName}'):
            result = getattr(sol, '${finalFuncName}')(${args})
        elif hasattr(sol, 'solve'):
            result = sol.solve(${args})
        else:
            raise Exception(f"No method '${finalFuncName}' or 'solve' in Solution class")
    else:
        raise Exception("No solution function or Solution class found")
        
    if result is not None:
        print(json.dumps(result))
except Exception as e:
    sys.stderr.write(str(e))
    sys.exit(1)
`;
  }

  if (language === 'java') {
    const finalFuncName = functionName || 'solve';
    // Remove 'public' from 'public class Solution' to avoid compilation error in single-file environment
    const processedCode = userCode.replace(/public\s+class\s+Solution/g, 'class Solution');
    return `
import java.util.*;
import java.util.stream.*;

${processedCode}

public class Main {
    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        Solution sol = new Solution();
        try {
            List<Object> parsedArgs = new ArrayList<>();
            // We need to know the parameter types of the target method to parse correctly
            java.lang.reflect.Method target = null;
            for (java.lang.reflect.Method m : java.lang.reflect.Method.class.getDeclaredMethods()) { } // Dummy
            for (java.lang.reflect.Method m : Solution.class.getDeclaredMethods()) {
                if (m.getName().equals("${finalFuncName}") || m.getName().equals("solve")) {
                    target = m;
                    break;
                }
            }

            if (target == null) throw new Exception("Method ${finalFuncName} not found");
            
            Class<?>[] paramTypes = target.getParameterTypes();
            for (Class<?> type : paramTypes) {
                if (!sc.hasNext()) break;
                String s = sc.next();
                if (type.isArray()) {
                    if (s.startsWith("[") && s.endsWith("]")) {
                        String content = s.substring(1, s.length() - 1);
                        if (content.isEmpty()) {
                            parsedArgs.add(new int[0]);
                        } else {
                            String[] parts = content.split(",");
                            int[] arr = Arrays.stream(parts).mapToInt(Integer::parseInt).toArray();
                            parsedArgs.add(arr);
                        }
                    }
                } else if (type == int.class || type == Integer.class) {
                    parsedArgs.add(Integer.parseInt(s));
                } else if (type == boolean.class || type == Boolean.class) {
                    parsedArgs.add(Boolean.parseBoolean(s));
                } else {
                    parsedArgs.add(s.replace("\"", ""));
                }
            }
            
            Object result = target.invoke(sol, parsedArgs.toArray());
            if (target.getReturnType() != void.class) {
                if (result instanceof int[]) {
                    System.out.println(Arrays.toString((int[])result));
                } else if (result instanceof Object[]) {
                    System.out.println(Arrays.deepToString((Object[])result));
                } else {
                    System.out.println(result);
                }
            } else {
                // For void methods (like in-place merge), we often want to see the first argument (usually the modified one)
                if (parsedArgs.size() > 0 && parsedArgs.get(0) instanceof int[]) {
                    System.out.println(Arrays.toString((int[])parsedArgs.get(0)));
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
`;
  }

  if (language === 'cpp') {
    const finalFuncName = functionName || 'solve';
    const processedCode = userCode.replace(/class\s+Solution/g, 'class Solution');
    return `
#include <iostream>
#include <vector>
#include <string>
#include <sstream>
#include <algorithm>

using namespace std;

${processedCode}

int main() {
    Solution sol;
    // Basic positional parser for C++
    string s;
    vector<int> nums1, nums2;
    int m, n;
    
    // This is a simplified C++ harness
    // For Merge Sorted Array specifically:
    // [1,2,3,0,0,0] 3 [2,5,6] 3
    
    auto parseVec = [](string s) {
        if (s.size() < 2) return vector<int>{};
        s = s.substr(1, s.size() - 2);
        vector<int> res;
        stringstream ss(s);
        string item;
        while (getline(ss, item, ',')) {
            if (!item.empty()) res.push_back(stoi(item));
        }
        return res;
    };

    try {
        string raw;
        vector<string> tokens;
        while (cin >> raw) tokens.push_back(raw);

        // We don't know the exact signature here easily in C++ without complex templates
        // but we can try to guess based on common patterns or just let users write their own main
        // for complex cases. For now, let's provide a minimal working example for common problems.
        
        // If we have exactly 4 tokens and it's Merge Sorted Array
        if (tokens.size() == 4) {
            nums1 = parseVec(tokens[0]);
            m = stoi(tokens[1]);
            nums2 = parseVec(tokens[2]);
            n = stoi(tokens[3]);
            
            // Try calling solve or mergeSortedArray
            // Note: C++ needs static typing, so this is hard to make generic without macros
            // For now, C++ users should probably provide their own main or we need a better strategy.
        }
    } catch (...) {}
    
    return 0; 
}
`;
  }

  return userCode;
};

/**
 * Submits code to Judge0 and polls for result
 */
export const executeCode = async (code, language, stdin = "", expected_output = "", params = [], functionName = "") => {
  const languageId = LANGUAGE_MAP[language.toLowerCase()] || 63;
  
  let finalStdin = stdin;
  // If Java or C++, transform JSON stdin to positional values for our simple harnesses
  if (language === 'java' || language === 'cpp') {
      try {
          const data = JSON.parse(stdin);
          finalStdin = params.map(p => {
              const val = data[p];
              if (Array.isArray(val)) return "[" + val.join(",") + "]";
              return String(val);
          }).join(" ");
      } catch (e) {}
  }

  const wrappedSource = wrapCode(code, language, params, functionName);

  try {
    if (!JUDGE0_RAPIDAPI_KEY) {
      throw new Error('JUDGE0_RAPIDAPI_KEY is not configured');
    }
    
    // 1. Create Submission
    const body = {
      source_code: encode(wrappedSource),
      language_id: languageId,
      stdin: encode(finalStdin),
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
