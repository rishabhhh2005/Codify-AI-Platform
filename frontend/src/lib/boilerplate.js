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
      }
    }
    
    return { name, type, cppType };
  });
}

export function buildBoilerplateForQuestion(question, language) {
  const exampleInput = question?.examples?.[0]?.input || '';
  const params = extractParams(exampleInput);
  const paramListJs = params.map(p => p.name).join(', ');
  const paramListCpp = params.map(p => `${p.cppType} ${p.name}`).join(', ');

  if (language === 'python') {
    const paramListPy = params.map(p => p.name).join(', ');
    return `class Solution:
    def solve(self, ${paramListPy}):
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
function solution(${paramListJs}) {
    // Write your code here
};
`;
  }

  if (language === 'java') {
    const paramListJava = params.map(p => `${p.type === 'number[]' ? 'int[]' : p.type} ${p.name}`).join(', ');
    return `public class Solution {
    public Object solve(${paramListJava}) {
        // Write your code here
        return null;
    }
}
`;
  }

  return `#include <bits/stdc++.h>
using namespace std;

class Solution {
public:
    void solve(${paramListCpp}) {
        // Write your code here
    }
};
`;
}
