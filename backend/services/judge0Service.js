import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const GLOT_API_URL = 'https://glot.io/api/run';
const GLOT_API_TOKEN = process.env.GLOT_API_TOKEN;

const LANGUAGE_CONFIG = {
  javascript: { id: 'javascript', filename: 'main.js' },
  python: { id: 'python', filename: 'main.py' },
  java: { id: 'java', filename: 'Main.java' },
  cpp: { id: 'cpp', filename: 'main.cpp' }
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
                    parsedArgs.add(s.replace("\\\"", ""));
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
 * Submits code to Glot.io and returns the result
 */
export const executeCode = async (code, language, stdin = "", expected_output = "", params = [], functionName = "") => {
  const langLower = language.toLowerCase();
  const config = LANGUAGE_CONFIG[langLower] || LANGUAGE_CONFIG.javascript;
  
  let finalStdin = stdin;
  // If Java or C++, transform JSON stdin to positional values for our simple harnesses
  if (langLower === 'java' || langLower === 'cpp') {
      try {
          const data = JSON.parse(stdin);
          finalStdin = params.map(p => {
              const val = data[p];
              if (Array.isArray(val)) return "[" + val.join(",") + "]";
              return String(val);
          }).join(" ");
      } catch (e) {}
  }

  const wrappedSource = wrapCode(code, langLower, params, functionName);

  try {
    const body = {
      files: [{
        name: config.filename,
        content: wrappedSource
      }],
      stdin: finalStdin
    };

    const response = await fetch(`${GLOT_API_URL}/${config.id}/latest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Token ${GLOT_API_TOKEN}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`Execution Service Error: ${response.status}`);
    }

    const result = await response.json();
    
    // Glot.io returns { stdout, stderr, error }
    // We transform it to match our internal format
    const hasError = !!result.error || !!result.stderr;
    
    return {
      stdout: result.stdout || "",
      stderr: result.stderr || result.error || null,
      compile_output: null, // Glot.io doesn't separate compile output usually
      message: result.error || null,
      status: {
        id: hasError ? 4 : 3, // 3 = Accepted, 4 = Wrong Answer/Error in our internal logic
        description: hasError ? (result.error ? "Runtime Error" : "Finished with Errors") : "Finished"
      },
      time: "0", // Glot.io doesn't provide detailed timing in basic API
      memory: 0
    };

  } catch (error) {
    console.error("Execution Service Error:", error.message);
    return {
      stdout: null,
      stderr: error.message,
      compile_output: null,
      status: { id: 13, description: "Connection Error" },
      time: "0",
      memory: 0
    };
  }
};
