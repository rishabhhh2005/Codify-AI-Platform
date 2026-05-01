function extractParams(exampleInput) {
  if (!exampleInput) return [];
  // Split by comma but not inside brackets/quotes
  const parts = exampleInput.split(/,(?![^\[]*\])(?![^"]*")/);
  return parts.map(part => {
    const [name, val] = part.split('=').map(s => s.trim());
    let type = 'any';
    let cppType = 'int';
    
    if (val) {
      if (val.startsWith('[') && val.endsWith(']')) {
        type = 'number[]';
        cppType = 'vector<int>&';
      } else if (val.startsWith('"') || val.startsWith("'")) {
        type = 'string';
        cppType = 'string';
      } else if (val === 'true' || val === 'false') {
        type = 'boolean';
        cppType = 'bool';
      } else if (!isNaN(val) && val.trim() !== '') {
        type = 'number';
        cppType = 'int';
      }
    }
    
    return { name, type, cppType };
  });
}

function deriveJavaReturnType(exampleOutput) {
  if (!exampleOutput) return 'Object';
  const out = exampleOutput.trim();
  if (out === 'true' || out === 'false') return 'boolean';
  if (out.startsWith('[') && out.endsWith(']')) return 'int[]'; // Simplified, could be more complex
  if (out.startsWith('"') || out.startsWith("'")) return 'String';
  if (!isNaN(out) && out !== '') return 'int';
  return 'Object';
}

export function buildBoilerplateForQuestion(question, language) {
  const exampleInput = question?.examples?.[0]?.input || '';
  const exampleOutput = question?.examples?.[0]?.output || '';
  const functionName = question?.functionName || (language === 'python' || language === 'java' ? 'solve' : 'solution');
  
  const params = extractParams(exampleInput);
  const paramListJs = params.map(p => p.name).join(', ');
  const paramListCpp = params.map(p => `${p.cppType} ${p.name}`).join(', ');

  if (language === 'python') {
    const paramListPy = params.map(p => p.name).join(', ');
    return `class Solution:
    def ${functionName}(self, ${paramListPy}):
        # Write your code here
        pass
`;
  }

  if (language === 'javascript') {
    const jsdoc = params.map(p => ` * @param {${p.type}} ${p.name}`).join('\n');
    return `/**
${jsdoc}
 * @return {any}
 */
function ${functionName}(${paramListJs}) {
    // Write your code here
};
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

  return `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    void ${functionName}(${paramListCpp}) {
        // Write your code here
    }
};
`;
}
