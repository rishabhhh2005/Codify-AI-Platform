import dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import { Sandbox } from "@e2b/code-interpreter";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../../.env') });

const E2B_API_KEY = process.env.E2B_API_KEY;

const LANGUAGE_CONFIG = {
  javascript: { id: 'javascript', filename: 'main.js', run: 'node main.js' },
  python: { id: 'python', filename: 'main.py', run: 'python3 main.py' },
  java: { id: 'java', filename: 'Main.java', run: 'javac Main.java && java Main' },
  cpp: { id: 'cpp', filename: 'main.cpp', run: 'g++ -o main main.cpp && ./main' }
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
    const processedCode = userCode.replace(/public\s+class\s+Solution/g, 'class Solution');
    return `
import java.util.*;
import java.util.stream.*;

${processedCode}

public class Main {
    public static void main(String[] args) {
        try {
            Scanner sc = new Scanner(System.in);
            sc.useDelimiter("\\\\|"); 
            Solution sol = new Solution();
            List<Object> parsedArgs = new ArrayList<>();
            java.lang.reflect.Method target = null;
            
            // Expected parameter count from our stdin (number of pipes + 1)
            // But better to just find the method that matches the name
            for (java.lang.reflect.Method m : Solution.class.getDeclaredMethods()) {
                if (m.getName().equals("${finalFuncName}") || m.getName().equals("solve")) {
                    target = m;
                    // If we find an exact name match, that's likely it
                    if (m.getName().equals("${finalFuncName}")) break;
                }
            }

            if (target == null) throw new Exception("Method ${finalFuncName} not found");
            
            Class<?>[] paramTypes = target.getParameterTypes();
            for (Class<?> type : paramTypes) {
                if (!sc.hasNext()) {
                    // Fill with default if missing, or handle error
                    break;
                }
                String s = sc.next().trim();
                if (type.isArray()) {
                    if (s.startsWith("[") && s.endsWith("]")) {
                        String content = s.substring(1, s.length() - 1);
                        if (content.isEmpty()) {
                            parsedArgs.add(new int[0]);
                        } else {
                            String[] parts = content.split(",");
                            int[] arr = Arrays.stream(parts).map(String::trim).mapToInt(Integer::parseInt).toArray();
                            parsedArgs.add(arr);
                        }
                    }
                } else if (type == int.class || type == Integer.class) {
                    parsedArgs.add(Integer.parseInt(s));
                } else if (type == boolean.class || type == Boolean.class) {
                    parsedArgs.add(Boolean.parseBoolean(s));
                } else if (type == String.class) {
                    parsedArgs.add(s);
                } else {
                    parsedArgs.add(s);
                }
            }
            
            if (parsedArgs.size() != paramTypes.length) {
                System.err.println("Error: Expected " + paramTypes.length + " args, but got " + parsedArgs.size());
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
    string s;
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
        // Minimal harness logic...
    } catch (...) {}
    
    return 0; 
}
`;
  }

  return userCode;
};

/**
 * Submits code to E2B Sandbox and returns the result
 */
export const executeCode = async (code, language, stdin = "", expected_output = "", params = [], functionName = "") => {
  const langLower = language.toLowerCase();
  const config = LANGUAGE_CONFIG[langLower] || LANGUAGE_CONFIG.javascript;
  
  let finalStdin = stdin;
  if (langLower === 'java' || langLower === 'cpp') {
      try {
          const data = JSON.parse(stdin);
          finalStdin = params.map(p => {
              const val = data[p];
              if (Array.isArray(val)) return "[" + val.join(",") + "]";
              return String(val);
          }).join("|"); // Use pipe as delimiter for Java/C++
      } catch (e) {}
  }

  const wrappedSource = wrapCode(code, langLower, params, functionName);
  
  // Debug log
  console.log(`[E2B] Executing ${language} with stdin: "${finalStdin}"`);

  let sandbox;
  try {
    sandbox = await Sandbox.create({ apiKey: E2B_API_KEY });
    
    // Write the source code and input to files
    await sandbox.files.write(config.filename, wrappedSource);
    await sandbox.files.write("input.txt", finalStdin);

    // Run the code with redirection
    const execution = await sandbox.commands.run(`${config.run} < input.txt`, { 
      timeoutMs: 10000 
    });

    const hasError = execution.exitCode !== 0 || !!execution.stderr;
    
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
