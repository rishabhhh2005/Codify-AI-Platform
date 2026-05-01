function extractParams(exampleInput) {
  if (!exampleInput) return [];
  // Split by comma but not inside brackets/quotes
  const parts = exampleInput.split(/,(?![^\[]*\])(?![^"]*")/);
  return parts.map(part => {
    const [name, val] = part.split('=').map(s => s.trim());
    let type = 'any';
    
    if (val) {
      if (val.startsWith('[') && val.endsWith(']')) {
        type = 'number[]';
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

function deriveJavaReturnType(exampleOutput) {
  if (!exampleOutput) return 'Object';
  const out = exampleOutput.trim();
  if (out === 'true' || out === 'false') return 'boolean';
  if (out.startsWith('[') && out.endsWith(']')) return 'int[]'; 
  if (out.startsWith('"') || out.startsWith("'")) return 'String';
  if (!isNaN(out) && out !== '') return 'int';
  return 'Object';
}

export function buildBoilerplateForQuestion(question, language) {
  const exampleInput = question?.examples?.[0]?.input || '';
  const exampleOutput = question?.examples?.[0]?.output || '';
  const functionName = question?.functionName || 'solve';
  
  const params = extractParams(exampleInput);

  if (language === 'python') {
    const paramListPy = params.map(p => p.name).join(', ');
    return `class Solution:
    def ${functionName}(self, ${paramListPy}):
        # Write your code here
        pass
`;
  }

  if (language === 'java') {
    const returnType = deriveJavaReturnType(exampleOutput);
    const paramListJava = params.map(p => {
      if (p.type === 'number[]') return 'int[]';
      if (p.type === 'number') return 'int';
      if (p.type === 'boolean') return 'boolean';
      if (p.type === 'string') return 'String';
      return 'Object';
    }).map((type, i) => `${type} ${params[i].name}`).join(', ');

    return `class Solution {
    public ${returnType} ${functionName}(${paramListJava}) {
        // Write your code here
        return ${returnType === 'int' ? '0' : returnType === 'boolean' ? 'false' : 'null'};
    }
}
`;
  }

  return '';
}

