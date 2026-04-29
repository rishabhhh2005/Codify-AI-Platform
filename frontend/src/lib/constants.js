export const TOPICS = [
  {
    id: 'arrays',
    label: 'Arrays & Strings',
    icon: '[]',
    description: 'Two pointers, sliding window, sorting',
    color: 'text-cyan',
  },
  {
    id: 'dynamic_programming',
    label: 'Dynamic Programming',
    icon: 'DP',
    description: 'Memoization, tabulation, optimization',
    color: 'text-purple-code',
  },
  {
    id: 'trees_graphs',
    label: 'Trees & Graphs',
    icon: '🌲',
    description: 'BFS, DFS, traversals, shortest path',
    color: 'text-green-code',
  },
  {
    id: 'system_design',
    label: 'System Design',
    icon: '⚙️',
    description: 'Architecture, scalability, trade-offs',
    color: 'text-orange-code',
  },
];

export const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', color: 'text-green-code', border: 'border-green-code/40', bg: 'bg-green-code/10' },
  { id: 'medium', label: 'Medium', color: 'text-warning', border: 'border-warning/40', bg: 'bg-warning/10' },
  { id: 'hard', label: 'Hard', color: 'text-red-code', border: 'border-red-code/40', bg: 'bg-red-code/10' },
  { id: 'very-hard', label: 'Very Hard', color: 'text-purple-code', border: 'border-purple-code/40', bg: 'bg-purple-code/10' },
];

export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', monaco: 'javascript', ext: '.js' },
  { id: 'python', label: 'Python', monaco: 'python', ext: '.py' },
  { id: 'java', label: 'Java', monaco: 'java', ext: '.java' },
  { id: 'cpp', label: 'C++', monaco: 'cpp', ext: '.cpp' },
];

export const LANGUAGE_STARTERS = {
  javascript: `// Write your solution here
function solution() {
  
}
`,
  python: `# Write your solution here
def solution():
    pass
`,
  java: `// Write your solution here
public class Solution {
    public static void main(String[] args) {
        
    }
}
`,
  cpp: `// Write your solution here
#include <bits/stdc++.h>
using namespace std;

int main() {
    
    return 0;
}
`,
};
