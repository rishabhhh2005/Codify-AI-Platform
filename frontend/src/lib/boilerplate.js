function isTreeParam(name) {
  return ['root', 'root1', 'root2', 'p', 'q', 'node', 'target_node'].includes(name);
}

function isGraphParam(name) {
  return ['adjList', 'graph', 'prerequisites', 'edges', 'times'].includes(name);
}

function sanitizeFunctionName(name) {
  if (!name) return 'solve';
  const clean = name.replace(/[^a-zA-Z0-9_$]/g, '');
  return /^[a-zA-Z_$]/.test(clean) ? clean : `_${clean}`;
}

function splitTopLevel(input, delimiter = ',') {
  const parts = [];
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
        parts.push(current.trim());
        current = '';
        continue;
      }
    }

    current += ch;
  }

  if (current.trim()) parts.push(current.trim());
  return parts;
}

function extractParams(exampleInput, topic) {
  if (!exampleInput) return [];
  const parts = splitTopLevel(exampleInput);
  return parts.map(part => {
    const eqIdx = part.indexOf('=');
    const name = eqIdx === -1 ? part.trim() : part.slice(0, eqIdx).trim();
    const val = eqIdx === -1 ? '' : part.slice(eqIdx + 1).trim();
    let type = 'any';
    
    if (topic === 'trees_graphs' && isTreeParam(name)) {
      type = 'tree';
    } else if (topic === 'trees_graphs' && isGraphParam(name)) {
      type = 'graph';
    } else if (val) {
      if (val.startsWith('[') && val.endsWith(']')) {
        type = val.startsWith('[[') ? 'number[][]' : 'number[]';
      } else if (val.startsWith('"') || val.startsWith("'")) {
        type = 'string';
      } else if (val === 'true' || val === 'false') {
        type = 'boolean';
      } else if (!isNaN(val) && val.trim() !== '') {
        type = 'number';
      }
    }
    
    return { name, type };
  });
}

function deriveJavaReturnType(exampleOutput, question) {
  if (!exampleOutput) return 'Object';
  const out = exampleOutput.trim();
  const title = question?.title || '';

  if (question?.topic === 'trees_graphs' && /level order/i.test(title)) return 'List<List<Integer>>';
  if (question?.topic === 'trees_graphs' && /right side view/i.test(title)) return 'List<Integer>';
  if (question?.topic === 'trees_graphs' && /binary tree|bst|root/i.test(title) && out.startsWith('[')) {
    return 'TreeNode';
  }

  if (out === 'true' || out === 'false') return 'boolean';
  if (out.startsWith('[[') && out.endsWith(']')) return 'List<List<Integer>>';
  if (out.startsWith('[') && out.endsWith(']')) return 'int[]'; 
  if (out.startsWith('"') || out.startsWith("'")) return 'String';
  if (!isNaN(out) && out !== '') return 'int';
  return 'Object';
}

export function buildBoilerplateForQuestion(question, language) {
  const exampleInput = question?.examples?.[0]?.input || '';
  const exampleOutput = question?.examples?.[0]?.output || '';
  const functionName = sanitizeFunctionName(question?.functionName || 'solve');
  
  const params = extractParams(exampleInput, question?.topic);

  if (language === 'python') {
    const paramListPy = params.map(p => p.name).join(', ');
    return `class Solution:
    def ${functionName}(self, ${paramListPy}):
        # Write your code here
        pass
`;
  }

  if (language === 'java') {
    const returnType = deriveJavaReturnType(exampleOutput, question);
    const paramListJava = params.map(p => {
      if (p.type === 'tree') return 'TreeNode';
      if (p.type === 'graph') return 'List<List<Integer>>';
      if (p.type === 'number[][]') return 'int[][]';
      if (p.type === 'number[]') return 'int[]';
      if (p.type === 'number') return 'int';
      if (p.type === 'boolean') return 'boolean';
      if (p.type === 'string') return 'String';
      return 'Object';
    }).map((type, i) => `${type} ${params[i].name}`).join(', ');

    const defaultReturn = returnType === 'int'
      ? '0'
      : returnType === 'boolean'
        ? 'false'
        : 'null';

    return `class Solution {
    public ${returnType} ${functionName}(${paramListJava}) {
        // Write your code here
        return ${defaultReturn};
    }
}
`;
  }

  return '';
}
