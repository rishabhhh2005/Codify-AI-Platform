/**
 * Normalizes output for comparison
 * 1. Trims whitespace
 * 2. If it looks like JSON, parse and re-stringify to normalize formatting
 * 3. Otherwise, collapse multiple whitespaces and lowercase
 */
export function normalizeOutput(value) {
  if (value === null || value === undefined) return '';
  let str = String(value).trim();
  if (!str) return '';

  try {
    if (
      (str.startsWith('[') && str.endsWith(']')) ||
      (str.startsWith('{') && str.endsWith('}'))
    ) {
      const fixedJson = str.replace(/'/g, '"');
      return JSON.stringify(JSON.parse(fixedJson));
    }
    return JSON.stringify(JSON.parse(str));
  } catch {
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
  if (!normExpected) return true;
  if (!normActual) return false;

  return normActual === normExpected;
}

/**
 * Splits a string by a delimiter at the top level only
 * (ignoring delimiters inside brackets or quotes)
 */
export function splitTopLevel(input, delimiter) {
  if (delimiter === undefined) delimiter = ',';
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
      if (!inString) { inString = true; quote = ch; }
      else if (quote === ch) { inString = false; quote = null; }
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
 * Parses a raw value string into its appropriate JS type
 */
export function parseValue(raw) {
  const trimmed = raw.trim();
  if (trimmed.startsWith('"') || trimmed.startsWith("'")) return trimmed.slice(1, -1);
  if (trimmed === 'true') return true;
  if (trimmed === 'false') return false;
  if (trimmed === 'null') return null;
  if (!Number.isNaN(Number(trimmed))) return Number(trimmed);
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try { return JSON.parse(trimmed.replace(/'/g, '"')); } catch { return trimmed; }
  }
  return trimmed;
}

/**
 * Parses input in the format "key1=val1, key2=val2"
 */
export function parseAssignmentInput(inputLine) {
  if (!inputLine) inputLine = '';
  const parsed = {};
  const parts = splitTopLevel(inputLine, ',');
  for (const part of parts) {
    const eqIdx = part.indexOf('=');
    if (eqIdx === -1) continue;
    const key = part.slice(0, eqIdx).trim();
    const val = part.slice(eqIdx + 1).trim();
    if (!key) continue;
    parsed[key] = parseValue(val);
  }
  return parsed;
}

// ─── Python harness builder ───────────────────────────────────────────────────
//
// IMPORTANT: We build Python source using string concatenation and array joins,
// NOT JavaScript template literals (backtick strings). Python code contains
// {dict comprehensions}, f-strings, and other {} syntax that JS would try to
// interpolate as template expressions, corrupting the generated file.

function buildPythonHarness(userCode, params, functionName) {
  const finalFunc = functionName || 'solve';

  // Build the args list: deserialized.get("nums"), deserialized.get("target"), ...
  const argsStr = params.map(function(p) {
    return 'deserialized.get("' + p + '")';
  }).join(', ');

  const lines = [];

  // ── Imports ──────────────────────────────────────────────────────────────────
  lines.push('import json, sys, io');
  lines.push('from typing import List, Optional, Dict, Any, Set, Tuple');
  lines.push('from collections import deque, defaultdict, Counter');
  lines.push('import heapq, math, bisect, functools, itertools');
  lines.push('');

  // ── LeetCode data structures ─────────────────────────────────────────────────
  lines.push('class TreeNode:');
  lines.push('    def __init__(self, val=0, left=None, right=None):');
  lines.push('        self.val = val; self.left = left; self.right = right');
  lines.push('    def __repr__(self): return "TreeNode(" + str(self.val) + ")"');
  lines.push('');
  lines.push('class ListNode:');
  lines.push('    def __init__(self, val=0, next=None):');
  lines.push('        self.val = val; self.next = next');
  lines.push('    def __repr__(self): return "ListNode(" + str(self.val) + ")"');
  lines.push('');

  // ── Tree helpers ──────────────────────────────────────────────────────────────
  lines.push('def _list_to_tree(arr):');
  lines.push('    if not arr or arr[0] is None: return None');
  lines.push('    root = TreeNode(arr[0]); q = deque([root]); i = 1');
  lines.push('    while q and i < len(arr):');
  lines.push('        node = q.popleft()');
  lines.push('        if i < len(arr) and arr[i] is not None:');
  lines.push('            node.left = TreeNode(arr[i]); q.append(node.left)');
  lines.push('        i += 1');
  lines.push('        if i < len(arr) and arr[i] is not None:');
  lines.push('            node.right = TreeNode(arr[i]); q.append(node.right)');
  lines.push('        i += 1');
  lines.push('    return root');
  lines.push('');
  lines.push('def _tree_to_list(root):');
  lines.push('    if not root: return []');
  lines.push('    result = []; q = deque([root])');
  lines.push('    while q:');
  lines.push('        node = q.popleft()');
  lines.push('        if node: result.append(node.val); q.append(node.left); q.append(node.right)');
  lines.push('        else: result.append(None)');
  lines.push('    while result and result[-1] is None: result.pop()');
  lines.push('    return result');
  lines.push('');

  // ── Linked list helpers ───────────────────────────────────────────────────────
  lines.push('def _list_to_linkedlist(arr):');
  lines.push('    if not arr: return None');
  lines.push('    head = ListNode(arr[0]); cur = head');
  lines.push('    for v in arr[1:]: cur.next = ListNode(v); cur = cur.next');
  lines.push('    return head');
  lines.push('');
  lines.push('def _linkedlist_to_list(head):');
  lines.push('    result = []; seen = set()');
  lines.push('    while head and id(head) not in seen:');
  lines.push('        seen.add(id(head)); result.append(head.val); head = head.next');
  lines.push('    return result');
  lines.push('');

  // ── Deserializer / serializer ────────────────────────────────────────────────
  lines.push('_TREE_PARAMS = {"root", "root1", "root2", "p", "q", "node", "target_node"}');
  lines.push('_LIST_PARAMS = {"head", "list1", "list2", "l1", "l2"}');
  lines.push('');
  lines.push('def _deserialize_arg(key, val):');
  lines.push('    if isinstance(val, list):');
  lines.push('        if key in _TREE_PARAMS: return _list_to_tree(val)');
  lines.push('        if key in _LIST_PARAMS: return _list_to_linkedlist(val)');
  lines.push('    return val');
  lines.push('');
  lines.push('def _serialize_result(result):');
  lines.push('    if isinstance(result, TreeNode): return _tree_to_list(result)');
  lines.push('    if isinstance(result, ListNode): return _linkedlist_to_list(result)');
  lines.push('    return result');
  lines.push('');

  // ── User code ─────────────────────────────────────────────────────────────────
  lines.push('# ── User code ────────────────────────────────────────────────────────────────');
  lines.push(userCode);
  lines.push('');

  // ── Runner ────────────────────────────────────────────────────────────────────
  lines.push('# ── Runner ───────────────────────────────────────────────────────────────────');
  lines.push('try:');
  lines.push('    raw = sys.stdin.read().strip()');
  lines.push('    data = json.loads(raw) if raw else {}');
  lines.push('    deserialized = {k: _deserialize_arg(k, v) for k, v in data.items()}');
  lines.push('    args = [' + argsStr + ']');
  lines.push('    _saved_stdout = sys.stdout');
  lines.push('    sys.stdout = io.StringIO()');
  lines.push('    try:');
  lines.push('        if "' + finalFunc + '" in globals():');
  lines.push('            result = globals()["' + finalFunc + '"](*args)');
  lines.push('        elif "Solution" in globals():');
  lines.push('            sol = Solution()');
  lines.push('            method = getattr(sol, "' + finalFunc + '", None) or getattr(sol, "solve", None)');
  lines.push('            if method is None:');
  lines.push('                raise Exception("No method \'' + finalFunc + '\' or \'solve\' found in Solution class")');
  lines.push('            result = method(*args)');
  lines.push('        else:');
  lines.push('            raise Exception("No function \'' + finalFunc + '\' or Solution class found")');
  lines.push('        printed_output = sys.stdout.getvalue()');
  lines.push('    finally:');
  lines.push('        sys.stdout = _saved_stdout');
  lines.push('    result = _serialize_result(result)');
  lines.push('    if result is not None:');
  lines.push('        print(json.dumps(result))');
  lines.push('    elif printed_output.strip():');
  lines.push('        print(printed_output.rstrip())');
  lines.push('except Exception as e:');
  lines.push('    sys.stderr.write(str(e) + "\\n")');
  lines.push('    sys.exit(1)');

  return lines.join('\n');
}

// ─── Java harness builder ─────────────────────────────────────────────────────

function buildJavaHarness(userCode, params, functionName) {
  const finalFunc = functionName || 'solve';
  const processedCode = userCode.replace(/public\s+class\s+Solution/g, 'class Solution');

  const lines = [];

  lines.push('import java.util.*;');
  lines.push('import java.util.stream.*;');
  lines.push('import java.lang.reflect.*;');
  lines.push('');
  lines.push(processedCode);
  lines.push('');
  lines.push('public class Main {');

  // TreeNode inner class
  lines.push('    static class TreeNode {');
  lines.push('        int val; TreeNode left, right;');
  lines.push('        TreeNode(int v) { val = v; }');
  lines.push('    }');
  lines.push('');

  // listToTree
  lines.push('    static TreeNode listToTree(List<Integer> arr) {');
  lines.push('        if (arr == null || arr.isEmpty() || arr.get(0) == null) return null;');
  lines.push('        TreeNode root = new TreeNode(arr.get(0));');
  lines.push('        Queue<TreeNode> q = new LinkedList<>();');
  lines.push('        q.add(root); int i = 1;');
  lines.push('        while (!q.isEmpty() && i < arr.size()) {');
  lines.push('            TreeNode node = q.poll();');
  lines.push('            if (i < arr.size() && arr.get(i) != null) { node.left = new TreeNode(arr.get(i)); q.add(node.left); } i++;');
  lines.push('            if (i < arr.size() && arr.get(i) != null) { node.right = new TreeNode(arr.get(i)); q.add(node.right); } i++;');
  lines.push('        }');
  lines.push('        return root;');
  lines.push('    }');
  lines.push('');

  // treeToList
  lines.push('    static List<Integer> treeToList(TreeNode root) {');
  lines.push('        List<Integer> result = new ArrayList<>();');
  lines.push('        if (root == null) return result;');
  lines.push('        Queue<TreeNode> q = new LinkedList<>(); q.add(root);');
  lines.push('        while (!q.isEmpty()) {');
  lines.push('            TreeNode node = q.poll();');
  lines.push('            if (node != null) { result.add(node.val); q.add(node.left); q.add(node.right); }');
  lines.push('            else result.add(null);');
  lines.push('        }');
  lines.push('        while (!result.isEmpty() && result.get(result.size()-1) == null) result.remove(result.size()-1);');
  lines.push('        return result;');
  lines.push('    }');
  lines.push('');

  // parsePipeParts
  lines.push('    static List<String> parsePipeParts(String raw) {');
  lines.push('        List<String> parts = new ArrayList<>();');
  lines.push('        int depth = 0; StringBuilder cur = new StringBuilder();');
  lines.push('        for (char c : raw.toCharArray()) {');
  lines.push('            if (c == \'[\') depth++; else if (c == \']\') depth--;');
  lines.push('            if (c == \'|\' && depth == 0) { parts.add(cur.toString().trim()); cur = new StringBuilder(); }');
  lines.push('            else cur.append(c);');
  lines.push('        }');
  lines.push('        if (cur.length() > 0) parts.add(cur.toString().trim());');
  lines.push('        return parts;');
  lines.push('    }');
  lines.push('');

  // parseIntArray
  lines.push('    static int[] parseIntArray(String s) {');
  lines.push('        s = s.trim();');
  lines.push('        if (s.startsWith("[")) s = s.substring(1, s.length()-1);');
  lines.push('        if (s.isEmpty()) return new int[0];');
  lines.push('        String[] p = s.split(",");');
  lines.push('        int[] arr = new int[p.length];');
  lines.push('        for (int i = 0; i < p.length; i++) arr[i] = Integer.parseInt(p[i].trim());');
  lines.push('        return arr;');
  lines.push('    }');
  lines.push('');

  // parseIntList
  lines.push('    static List<Integer> parseIntList(String s) {');
  lines.push('        s = s.trim();');
  lines.push('        if (s.startsWith("[")) s = s.substring(1, s.length()-1);');
  lines.push('        List<Integer> list = new ArrayList<>();');
  lines.push('        if (s.isEmpty()) return list;');
  lines.push('        for (String p : s.split(",")) {');
  lines.push('            String t = p.trim();');
  lines.push('            list.add(t.equals("null") ? null : Integer.parseInt(t));');
  lines.push('        }');
  lines.push('        return list;');
  lines.push('    }');
  lines.push('');

  // serializeResult
  lines.push('    static String serializeResult(Object result) {');
  lines.push('        if (result == null) return "null";');
  lines.push('        if (result instanceof TreeNode) {');
  lines.push('            List<Integer> l = treeToList((TreeNode) result);');
  lines.push('            return l.stream().map(v -> v == null ? "null" : v.toString()).collect(Collectors.joining(",", "[", "]"));');
  lines.push('        }');
  lines.push('        if (result instanceof int[]) return Arrays.toString((int[]) result).replace(", ", ",");');
  lines.push('        if (result instanceof boolean[]) return Arrays.toString((boolean[]) result);');
  lines.push('        if (result instanceof List) {');
  lines.push('            return "[" + ((List<?>)result).stream().map(Object::toString).collect(Collectors.joining(",")) + "]";');
  lines.push('        }');
  lines.push('        return result.toString();');
  lines.push('    }');
  lines.push('');

  // main
  lines.push('    public static void main(String[] args) {');
  lines.push('        try {');
  lines.push('            Scanner sc = new Scanner(System.in);');
  lines.push('            String rawInput = sc.hasNextLine() ? sc.useDelimiter("\\\\z").next() : "";');
  lines.push('            List<String> parts = parsePipeParts(rawInput.trim());');
  lines.push('');
  lines.push('            Solution sol = new Solution();');
  lines.push('            Method target = null;');
  lines.push('            for (Method m : Solution.class.getDeclaredMethods()) {');
  lines.push('                if (m.getName().equals("' + finalFunc + '")) { target = m; break; }');
  lines.push('            }');
  lines.push('            if (target == null) {');
  lines.push('                for (Method m : Solution.class.getDeclaredMethods()) {');
  lines.push('                    if (m.getName().equals("solve")) { target = m; break; }');
  lines.push('                }');
  lines.push('            }');
  lines.push('            if (target == null) throw new Exception("Method \'' + finalFunc + '\' or \'solve\' not found in Solution");');
  lines.push('');
  lines.push('            Class<?>[] paramTypes = target.getParameterTypes();');
  lines.push('            List<Object> parsedArgs = new ArrayList<>();');
  lines.push('            for (int i = 0; i < paramTypes.length && i < parts.size(); i++) {');
  lines.push('                String s = parts.get(i).trim();');
  lines.push('                Class<?> type = paramTypes[i];');
  lines.push('                if (type == int.class || type == Integer.class) parsedArgs.add(Integer.parseInt(s));');
  lines.push('                else if (type == long.class || type == Long.class) parsedArgs.add(Long.parseLong(s));');
  lines.push('                else if (type == boolean.class || type == Boolean.class) parsedArgs.add(Boolean.parseBoolean(s));');
  lines.push('                else if (type == String.class) parsedArgs.add(s.replaceAll("^\\"|\\"$", ""));');
  lines.push('                else if (type == int[].class) parsedArgs.add(parseIntArray(s));');
  lines.push('                else if (type == TreeNode.class) parsedArgs.add(listToTree(parseIntList(s)));');
  lines.push('                else if (type == List.class) parsedArgs.add(parseIntList(s));');
  lines.push('                else parsedArgs.add(s);');
  lines.push('            }');
  lines.push('');
  lines.push('            Object result = target.invoke(sol, parsedArgs.toArray());');
  lines.push('            if (target.getReturnType() != void.class) {');
  lines.push('                System.out.println(serializeResult(result));');
  lines.push('            }');
  lines.push('        } catch (InvocationTargetException e) {');
  lines.push('            System.err.println(e.getCause() != null ? e.getCause().getMessage() : e.getMessage());');
  lines.push('            System.exit(1);');
  lines.push('        } catch (Exception e) {');
  lines.push('            System.err.println(e.getMessage());');
  lines.push('            System.exit(1);');
  lines.push('        }');
  lines.push('    }');
  lines.push('}');

  return lines.join('\n');
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Wraps user code with a LeetCode-style test harness.
 *
 * @param {string}   userCode     - Raw user code
 * @param {string}   language     - "python" | "java"
 * @param {string[]} params       - Ordered parameter names from the problem
 * @param {string}   functionName - Entry-point function name
 * @returns {string} Complete source file ready to run
 */
export function wrapCode(userCode, language, params, functionName) {
  if (params === undefined) params = [];
  if (functionName === undefined) functionName = 'solution';

  if (!userCode || !userCode.trim()) {
    throw new Error('No user code provided');
  }

  if (language === 'python') {
    return buildPythonHarness(userCode, params, functionName);
  }
  if (language === 'java') {
    return buildJavaHarness(userCode, params, functionName);
  }
  return userCode;
}
