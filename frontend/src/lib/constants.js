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
];

export const DIFFICULTIES = [
  { id: 'easy', label: 'Easy', color: 'text-green-code', border: 'border-green-code/40', bg: 'bg-green-code/10' },
  { id: 'medium', label: 'Medium', color: 'text-warning', border: 'border-warning/40', bg: 'bg-warning/10' },
];

export const LANGUAGES = [
  { id: 'python', label: 'Python', monaco: 'python', ext: '.py' },
  { id: 'java', label: 'Java', monaco: 'java', ext: '.java' },
];

export const LANGUAGE_STARTERS = {
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
};
