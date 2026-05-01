/**
 * Normalizes output for comparison
 * 1. Trims whitespace
 * 2. If it looks like JSON, parse and re-stringify to normalize formatting
 * 3. Otherwise, collapse multiple whitespaces into one
 */
export function normalizeOutput(value) {
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
export function compareOutputs(actual, expected) {
  const normActual = normalizeOutput(actual);
  const normExpected = normalizeOutput(expected);
  
  if (!normExpected && !normActual) return true;
  if (!normExpected) return true; // If problem statement didn't specify output, assume ok if it ran
  if (!normActual) return false; // Expected something, got nothing
  
  return normActual === normExpected;
}

/**
 * Splits a string by a delimiter, but only at the top level (ignoring delimiters inside brackets or quotes)
 */
export function splitTopLevel(input, delimiter = ',') {
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

/**
 * Parses a raw value string into its appropriate type
 */
export function parseValue(raw) {
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

/**
 * Parses input in the format "key1=val1, key2=val2"
 */
export function parseAssignmentInput(inputLine = '') {
  const parsed = {};
  const parts = splitTopLevel(inputLine, ',');
  for (const part of parts) {
    const [key, ...rest] = part.split('=');
    if (!key || rest.length === 0) continue;
    parsed[key.trim()] = parseValue(rest.join('=').trim());
  }
  return parsed;
}

/**
 * Wraps user code with a hidden test harness (LeetCode style)
 */
export function wrapCode(userCode, language, params = [], functionName = 'solution') {
  if (language === 'python') {
    const args = params.map(p => `data.get("${p}")`).join(', ');
    const finalFuncName = functionName || 'solve';
    return `
import json, sys
from typing import List, Optional, Dict, Any, Set

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
            
            for (java.lang.reflect.Method m : Solution.class.getDeclaredMethods()) {
                if (m.getName().equals("${finalFuncName}") || m.getName().equals("solve")) {
                    target = m;
                    if (m.getName().equals("${finalFuncName}")) break;
                }
            }

            if (target == null) throw new Exception("Method ${finalFuncName} not found");
            
            Class<?>[] paramTypes = target.getParameterTypes();
            for (Class<?> type : paramTypes) {
                if (!sc.hasNext()) {
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

  return userCode;
}

