const CASES = {
  'arr-1': {
    visible: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' },
    ],
    hidden: [
      { input: 'nums = [1,5,9,13], target = 14', output: '[0,3]' },
      { input: 'nums = [-3,4,3,90], target = 0', output: '[0,2]' },
      { input: 'nums = [0,4,3,0], target = 0', output: '[0,3]' },
      { input: 'nums = [-1,-2,-3,-4,-5], target = -8', output: '[2,4]' },
      { input: 'nums = [10,20,30,40], target = 70', output: '[2,3]' },
      { input: 'nums = [5,75,25], target = 100', output: '[1,2]' },
    ],
  },
  'arr-2': {
    hidden: [
      { input: 'nums = [1]', output: 'false' },
      { input: 'nums = [1,2,3,4,5,1]', output: 'true' },
      { input: 'nums = [-1,-2,-3,-1]', output: 'true' },
      { input: 'nums = [0,1,2,3]', output: 'false' },
      { input: 'nums = [100000,100000]', output: 'true' },
      { input: 'nums = [9,8,7,6]', output: 'false' },
    ],
  },
  'arr-3': {
    visible: [
      { input: 's = "anagram", t = "nagaram"', output: 'true' },
      { input: 's = "rat", t = "car"', output: 'false' },
      { input: 's = "aacc", t = "ccac"', output: 'false' },
    ],
    hidden: [
      { input: 's = "listen", t = "silent"', output: 'true' },
      { input: 's = "a", t = "ab"', output: 'false' },
      { input: 's = "ab", t = "ba"', output: 'true' },
      { input: 's = "aa", t = "a"', output: 'false' },
      { input: 's = "night", t = "thing"', output: 'true' },
      { input: 's = "hello", t = "bello"', output: 'false' },
    ],
  },
  'arr-4': {
    visible: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5' },
      { input: 'prices = [7,6,4,3,1]', output: '0' },
      { input: 'prices = [1,2]', output: '1' },
    ],
    hidden: [
      { input: 'prices = [2,4,1]', output: '2' },
      { input: 'prices = [3,2,6,5,0,3]', output: '4' },
      { input: 'prices = [1]', output: '0' },
      { input: 'prices = [1,2,3,4,5]', output: '4' },
      { input: 'prices = [5,4,3,2,10]', output: '8' },
      { input: 'prices = [2,1,2,0,1]', output: '1' },
    ],
  },
  'arr-5': {
    hidden: [
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [8,8,7,7,7]', output: '7' },
      { input: 'nums = [2,2,2,1,3]', output: '2' },
      { input: 'nums = [-1,-1,-1,2,3]', output: '-1' },
      { input: 'nums = [4,4,4,4,5,6,7]', output: '4' },
      { input: 'nums = [9,1,9,2,9]', output: '9' },
    ],
  },
  'arr-6': {
    visible: [
      { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]' },
      { input: 'nums = [0]', output: '[0]' },
      { input: 'nums = [1,0]', output: '[1,0]' },
    ],
    hidden: [
      { input: 'nums = [1,2,3]', output: '[1,2,3]' },
      { input: 'nums = [0,0,1]', output: '[1,0,0]' },
      { input: 'nums = [4,0,5,0,0,6]', output: '[4,5,6,0,0,0]' },
      { input: 'nums = [0,0]', output: '[0,0]' },
      { input: 'nums = [2,0,1]', output: '[2,1,0]' },
      { input: 'nums = [-1,0,-2,0]', output: '[-1,-2,0,0]' },
    ],
  },
  'arr-7': {
    hidden: [
      { input: 'nums = [-5,-3,-2,-1]', output: '[1,4,9,25]' },
      { input: 'nums = [0,1,2]', output: '[0,1,4]' },
      { input: 'nums = [-2,0]', output: '[0,4]' },
      { input: 'nums = [-10,-5,0,5,10]', output: '[0,25,25,100,100]' },
      { input: 'nums = [1]', output: '[1]' },
      { input: 'nums = [-1,2,2]', output: '[1,4,4]' },
    ],
  },
  'arr-8': {
    hidden: [
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [1,1,1]', output: '1' },
      { input: 'nums = [1,2,3]', output: '3' },
      { input: 'nums = [-1,0,0,1,1,2]', output: '4' },
      { input: 'nums = [0,0,0,0,1]', output: '2' },
      { input: 'nums = [-3,-2,-2,-1]', output: '3' },
    ],
  },
  'arr-9': {
    visible: [
      { input: 'nums1 = [1,2,2,1], nums2 = [2,2]', output: '[2]' },
      { input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', output: '[4,9]' },
      { input: 'nums1 = [1], nums2 = [2]', output: '[]' },
    ],
    hidden: [
      { input: 'nums1 = [1,2,3], nums2 = [3,4,5]', output: '[3]' },
      { input: 'nums1 = [7,7,7], nums2 = [7]', output: '[7]' },
      { input: 'nums1 = [], nums2 = [1]', output: '[]' },
      { input: 'nums1 = [0,-1,2], nums2 = [-1,2,3]', output: '[-1,2]' },
      { input: 'nums1 = [5,6], nums2 = [7,8]', output: '[]' },
      { input: 'nums1 = [1,2,2,3], nums2 = [2,3,3]', output: '[2,3]' },
    ],
  },
  'arr-10': {
    visible: [
      { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]' },
      { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]' },
      { input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', output: '[1]' },
    ],
    hidden: [
      { input: 'nums1 = [2,0], m = 1, nums2 = [1], n = 1', output: '[1,2]' },
      { input: 'nums1 = [4,5,6,0,0,0], m = 3, nums2 = [1,2,3], n = 3', output: '[1,2,3,4,5,6]' },
      { input: 'nums1 = [1,2,4,5,6,0], m = 5, nums2 = [3], n = 1', output: '[1,2,3,4,5,6]' },
      { input: 'nums1 = [-1,0,0,3,3,3,0,0,0], m = 6, nums2 = [1,2,2], n = 3', output: '[-1,0,0,1,2,2,3,3,3]' },
      { input: 'nums1 = [0,0,0], m = 0, nums2 = [2,5,6], n = 3', output: '[2,5,6]' },
      { input: 'nums1 = [1,2,3,0,0], m = 3, nums2 = [4,5], n = 2', output: '[1,2,3,4,5]' },
    ],
  },
  'arr-11': {
    visible: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,1,1]', output: '[]' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
    ],
    hidden: [
      { input: 'nums = [0,0,0,0]', output: '[[0,0,0]]' },
      { input: 'nums = [-2,0,1,1,2]', output: '[[-2,0,2],[-2,1,1]]' },
      { input: 'nums = [-1,0,1]', output: '[[-1,0,1]]' },
      { input: 'nums = [1,2,-2,-1]', output: '[]' },
      { input: 'nums = [-4,-2,-2,-2,0,1,2,2,3,3,4,4,6,6]', output: '[[-4,-2,6],[-4,0,4],[-4,1,3],[-4,2,2],[-2,-2,4],[-2,0,2]]' },
      { input: 'nums = [-2,-1,3]', output: '[[-2,-1,3]]' },
    ],
  },
  'arr-12': {
    visible: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
      { input: 'nums = [2,3]', output: '[3,2]' },
    ],
    hidden: [
      { input: 'nums = [5,6,2]', output: '[12,10,30]' },
      { input: 'nums = [0,0]', output: '[0,0]' },
      { input: 'nums = [1,0]', output: '[0,1]' },
      { input: 'nums = [-1,-2,-3]', output: '[6,3,2]' },
      { input: 'nums = [4,3,2,1,2]', output: '[12,16,24,48,24]' },
      { input: 'nums = [10]', output: '[1]' },
    ],
  },
  'arr-13': {
    visible: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6' },
      { input: 'nums = [1]', output: '1' },
      { input: 'nums = [5,4,-1,7,8]', output: '23' },
    ],
    hidden: [
      { input: 'nums = [-1]', output: '-1' },
      { input: 'nums = [-2,-3,-1]', output: '-1' },
      { input: 'nums = [1,2,3]', output: '6' },
      { input: 'nums = [8,-19,5,-4,20]', output: '21' },
      { input: 'nums = [0,0,0]', output: '0' },
      { input: 'nums = [-2,1]', output: '1' },
    ],
  },
  'arr-14': {
    visible: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
      { input: 'height = [1,1]', output: '1' },
      { input: 'height = [4,3,2,1,4]', output: '16' },
    ],
    hidden: [
      { input: 'height = [1,2,1]', output: '2' },
      { input: 'height = [2,3,4,5,18,17,6]', output: '17' },
      { input: 'height = [1,2,4,3]', output: '4' },
      { input: 'height = [5,5,5,5]', output: '15' },
      { input: 'height = [1,3,2,5,25,24,5]', output: '24' },
      { input: 'height = [2,1]', output: '1' },
    ],
  },
  'arr-15': {
    visible: [
      { input: 's = "babad"', output: '"bab"' },
      { input: 's = "cbbd"', output: '"bb"' },
      { input: 's = "a"', output: '"a"' },
    ],
    hidden: [
      { input: 's = "racecar"', output: '"racecar"' },
      { input: 's = "forgeeksskeegfor"', output: '"geeksskeeg"' },
      { input: 's = "abcda"', output: '"a"' },
      { input: 's = "abb"', output: '"bb"' },
      { input: 's = "bananas"', output: '"anana"' },
      { input: 's = "xyzzyx"', output: '"xyzzyx"' },
    ],
  },
  'arr-16': {
    visible: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]' },
      { input: 'strs = [""]', output: '[[""]]' },
      { input: 'strs = ["a"]', output: '[["a"]]' },
    ],
    hidden: [
      { input: 'strs = ["abc","bca","cab"]', output: '[["abc","bca","cab"]]' },
      { input: 'strs = ["ab","ba","cd","dc"]', output: '[["ab","ba"],["cd","dc"]]' },
      { input: 'strs = ["a","b","c"]', output: '[["a"],["b"],["c"]]' },
      { input: 'strs = ["listen","silent","enlist","google"]', output: '[["listen","silent","enlist"],["google"]]' },
      { input: 'strs = []', output: '[]' },
      { input: 'strs = ["aa","aa"]', output: '[["aa","aa"]]' },
    ],
  },
  'arr-17': {
    visible: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]' },
      { input: 'nums = [1], k = 1', output: '[1]' },
      { input: 'nums = [4,4,4,5,5,6], k = 1', output: '[4]' },
    ],
    hidden: [
      { input: 'nums = [3,3,3,2,2,1], k = 2', output: '[3,2]' },
      { input: 'nums = [5,5,6,6,6,7], k = 1', output: '[6]' },
      { input: 'nums = [-1,-1,-1,2,2,3], k = 2', output: '[-1,2]' },
      { input: 'nums = [9,8,8,7,7,7], k = 3', output: '[7,8,9]' },
      { input: 'nums = [1,2,2,3,3,3,4,4,4,4], k = 2', output: '[4,3]' },
      { input: 'nums = [10], k = 1', output: '[10]' },
    ],
  },
  'arr-18': {
    visible: [
      { input: 'nums = [1,1,1], k = 2', output: '2' },
      { input: 'nums = [1,2,3], k = 3', output: '2' },
      { input: 'nums = [1], k = 0', output: '0' },
    ],
    hidden: [
      { input: 'nums = [1,-1,0], k = 0', output: '3' },
      { input: 'nums = [3,4,7,2,-3,1,4,2], k = 7', output: '4' },
      { input: 'nums = [0,0,0], k = 0', output: '6' },
      { input: 'nums = [-1,-1,1], k = 0', output: '1' },
      { input: 'nums = [1,2,1,2,1], k = 3', output: '4' },
      { input: 'nums = [5], k = 5', output: '1' },
    ],
  },
  'arr-19': {
    visible: [
      { input: 'nums = [1,0,-1,0,-2,2], target = 0', output: '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]' },
      { input: 'nums = [2,2,2,2,2], target = 8', output: '[[2,2,2,2]]' },
      { input: 'nums = [1,2,3,4], target = 10', output: '[[1,2,3,4]]' },
    ],
    hidden: [
      { input: 'nums = [0,0,0,0], target = 0', output: '[[0,0,0,0]]' },
      { input: 'nums = [-3,-1,0,2,4,5], target = 2', output: '[[-3,-1,2,4]]' },
      { input: 'nums = [1,1,1,1], target = 5', output: '[]' },
      { input: 'nums = [-2,-1,-1,1,1,2,2], target = 0', output: '[[-2,-1,1,2],[-1,-1,1,1]]' },
      { input: 'nums = [1000000000,1000000000,1000000000,1000000000], target = -294967296', output: '[]' },
      { input: 'nums = [-1,0,1,2,-1,-4], target = -1', output: '[[-4,0,1,2],[-1,-1,0,1]]' },
    ],
  },
  'arr-20': {
    visible: [
      { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]' },
      { input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]' },
      { input: 'nums = [1,2], k = 1', output: '[2,1]' },
    ],
    hidden: [
      { input: 'nums = [1], k = 0', output: '[1]' },
      { input: 'nums = [1,2,3], k = 4', output: '[3,1,2]' },
      { input: 'nums = [1,2,3], k = 3', output: '[1,2,3]' },
      { input: 'nums = [0,1,2,3], k = 1', output: '[3,0,1,2]' },
      { input: 'nums = [-1,-2,-3], k = 2', output: '[-2,-3,-1]' },
      { input: 'nums = [10,20,30,40,50], k = 7', output: '[40,50,10,20,30]' },
    ],
  },
};

const GENERIC_BY_FUNCTION = {
  climbingStairs: [
    ['n = 2', '2'], ['n = 3', '3'], ['n = 4', '5'], ['n = 5', '8'], ['n = 1', '1'], ['n = 10', '89'],
  ],
  fibonacciNumber: [
    ['n = 0', '0'], ['n = 1', '1'], ['n = 2', '1'], ['n = 5', '5'], ['n = 10', '55'], ['n = 20', '6765'],
  ],
  minCostClimbingStairs: [
    ['cost = [10,15,20]', '15'], ['cost = [1,100,1,1,1,100,1,1,100,1]', '6'], ['cost = [0,0,0,0]', '0'], ['cost = [5,10]', '5'], ['cost = [1,2,3,4]', '4'], ['cost = [10,1,10,1]', '2'],
  ],
  maximumSubarray: [
    ['nums = [-2,1,-3,4,-1,2,1,-5,4]', '6'], ['nums = [1]', '1'], ['nums = [5,4,-1,7,8]', '23'], ['nums = [-1]', '-1'], ['nums = [-2,-3,-1]', '-1'], ['nums = [0,0]', '0'],
  ],
  houseRobber: [
    ['nums = [1,2,3,1]', '4'], ['nums = [2,7,9,3,1]', '12'], ['nums = [2,1,1,2]', '4'], ['nums = [0]', '0'], ['nums = [5]', '5'], ['nums = [4,1,2,7,5,3,1]', '14'],
  ],
  pascalSTriangle: [
    ['numRows = 1', '[[1]]'], ['numRows = 2', '[[1],[1,1]]'], ['numRows = 3', '[[1],[1,1],[1,2,1]]'], ['numRows = 4', '[[1],[1,1],[1,2,1],[1,3,3,1]]'], ['numRows = 5', '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]'], ['numRows = 6', '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1]]'],
  ],
  divisorGame: [
    ['n = 2', 'true'], ['n = 3', 'false'], ['n = 4', 'true'], ['n = 5', 'false'], ['n = 100', 'true'], ['n = 99', 'false'],
  ],
  isSubsequence: [
    ['s = "abc", t = "ahbgdc"', 'true'], ['s = "axc", t = "ahbgdc"', 'false'], ['s = "", t = "abc"', 'true'], ['s = "abc", t = ""', 'false'], ['s = "ace", t = "abcde"', 'true'], ['s = "aec", t = "abcde"', 'false'],
  ],
  rangeSumQueryImmutable: [
    ['nums = [-2,0,3,-5,2,-1], left = 0, right = 2', '1'], ['nums = [-2,0,3,-5,2,-1], left = 2, right = 5', '-1'], ['nums = [1,2,3], left = 0, right = 2', '6'], ['nums = [5], left = 0, right = 0', '5'], ['nums = [1,-1,1], left = 0, right = 1', '0'], ['nums = [10,20,30], left = 1, right = 1', '20'],
  ],
  countingBits: [
    ['n = 2', '[0,1,1]'], ['n = 5', '[0,1,1,2,1,2]'], ['n = 0', '[0]'], ['n = 1', '[0,1]'], ['n = 8', '[0,1,1,2,1,2,2,3,1]'], ['n = 10', '[0,1,1,2,1,2,2,3,1,2,2]'],
  ],
  longestCommonSubsequence: [
    ['text1 = "abcde", text2 = "ace"', '3'], ['text1 = "abc", text2 = "abc"', '3'], ['text1 = "abc", text2 = "def"', '0'], ['text1 = "bsbininm", text2 = "jmjkbkjkv"', '1'], ['text1 = "", text2 = "abc"', '0'], ['text1 = "abcba", text2 = "abcbcba"', '5'],
  ],
  coinChange: [
    ['coins = [1,2,5], amount = 11', '3'], ['coins = [2], amount = 3', '-1'], ['coins = [1], amount = 0', '0'], ['coins = [1], amount = 2', '2'], ['coins = [2,5,10,1], amount = 27', '4'], ['coins = [186,419,83,408], amount = 6249', '20'],
  ],
  longestIncreasingSubsequence: [
    ['nums = [10,9,2,5,3,7,101,18]', '4'], ['nums = [0,1,0,3,2,3]', '4'], ['nums = [7,7,7,7]', '1'], ['nums = [1,2,3,4]', '4'], ['nums = [4,3,2,1]', '1'], ['nums = [-1,3,4,-2,0,6,2,3]', '4'],
  ],
  wordBreak: [
    ['s = "leetcode", wordDict = ["leet","code"]', 'true'], ['s = "applepenapple", wordDict = ["apple","pen"]', 'true'], ['s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', 'false'], ['s = "a", wordDict = ["a"]', 'true'], ['s = "aaaaaaa", wordDict = ["aaaa","aaa"]', 'true'], ['s = "cars", wordDict = ["car","ca","rs"]', 'true'],
  ],
  uniquePaths: [
    ['m = 3, n = 7', '28'], ['m = 3, n = 2', '3'], ['m = 1, n = 1', '1'], ['m = 1, n = 10', '1'], ['m = 4, n = 4', '20'], ['m = 10, n = 10', '48620'],
  ],
  editDistance: [
    ['word1 = "horse", word2 = "ros"', '3'], ['word1 = "intention", word2 = "execution"', '5'], ['word1 = "", word2 = "abc"', '3'], ['word1 = "abc", word2 = ""', '3'], ['word1 = "abc", word2 = "abc"', '0'], ['word1 = "kitten", word2 = "sitting"', '3'],
  ],
  decodeWays: [
    ['s = "12"', '2'], ['s = "226"', '3'], ['s = "06"', '0'], ['s = "0"', '0'], ['s = "10"', '1'], ['s = "11106"', '2'],
  ],
  palindromicSubstrings: [
    ['s = "abc"', '3'], ['s = "aaa"', '6'], ['s = "aba"', '4'], ['s = "abba"', '6'], ['s = "a"', '1'], ['s = "fdsklf"', '6'],
  ],
  maximumProductSubarray: [
    ['nums = [2,3,-2,4]', '6'], ['nums = [-2,0,-1]', '0'], ['nums = [-2,3,-4]', '24'], ['nums = [0,2]', '2'], ['nums = [-1,-2,-3]', '6'], ['nums = [2,-5,-2,-4,3]', '24'],
  ],
  targetSum: [
    ['nums = [1,1,1,1,1], target = 3', '5'], ['nums = [1], target = 1', '1'], ['nums = [1], target = 2', '0'], ['nums = [0,0,0,0,0,0,0,0,1], target = 1', '256'], ['nums = [1,2,1], target = 0', '2'], ['nums = [2,3,5,7], target = 3', '2'],
  ],
  invertBinaryTree: [
    ['root = [4,2,7,1,3,6,9]', '[4,7,2,9,6,3,1]'], ['root = [2,1,3]', '[2,3,1]'], ['root = []', '[]'], ['root = [1]', '[1]'], ['root = [1,2]', '[1,null,2]'], ['root = [1,null,2]', '[1,2]'],
  ],
  maximumDepthOfBinaryTree: [
    ['root = [3,9,20,null,null,15,7]', '3'], ['root = [1,null,2]', '2'], ['root = []', '0'], ['root = [1]', '1'], ['root = [1,2,3,4]', '3'], ['root = [1,2,null,3,null,4]', '4'],
  ],
  diameterOfBinaryTree: [
    ['root = [1,2,3,4,5]', '3'], ['root = [1,2]', '1'], ['root = []', '0'], ['root = [1]', '0'], ['root = [4,-7,-3,null,null,-9,-3,9,-7,-4,null,6,null,-6,-6,null,null,0,6,5,null,9,null,null,-1,-4,null,null,null,-2]', '8'], ['root = [1,2,3,4,5,6,7]', '4'],
  ],
  balancedBinaryTree: [
    ['root = [3,9,20,null,null,15,7]', 'true'], ['root = [1,2,2,3,3,null,null,4,4]', 'false'], ['root = []', 'true'], ['root = [1]', 'true'], ['root = [1,2,null,3]', 'false'], ['root = [1,2,3,4,5]', 'true'],
  ],
  sameTree: [
    ['p = [1,2,3], q = [1,2,3]', 'true'], ['p = [1,2], q = [1,null,2]', 'false'], ['p = [1,2,1], q = [1,1,2]', 'false'], ['p = [], q = []', 'true'], ['p = [1], q = []', 'false'], ['p = [1,null,2], q = [1,null,2]', 'true'],
  ],
  binaryTreeLevelOrderTraversal: [
    ['root = [3,9,20,null,null,15,7]', '[[3],[9,20],[15,7]]'], ['root = [1]', '[[1]]'], ['root = []', '[]'], ['root = [1,2,3,4,5]', '[[1],[2,3],[4,5]]'], ['root = [1,null,2,3]', '[[1],[2],[3]]'], ['root = [1,2,null,3,null,4]', '[[1],[2],[3],[4]]'],
  ],
  lowestCommonAncestorOfABinaryTree: [
    ['root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', '3'], ['root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', '5'], ['root = [1,2], p = 1, q = 2', '1'], ['root = [1,2,3], p = 2, q = 3', '1'], ['root = [1,2,3,4], p = 4, q = 3', '1'], ['root = [1,2,3,4,5], p = 4, q = 5', '2'],
  ],
  binaryTreeRightSideView: [
    ['root = [1,2,3,null,5,null,4]', '[1,3,4]'], ['root = [1,null,3]', '[1,3]'], ['root = []', '[]'], ['root = [1,2,3,4]', '[1,3,4]'], ['root = [1,2]', '[1,2]'], ['root = [1,2,3,4,5,6,7]', '[1,3,7]'],
  ],
  numberOfIslands: [
    ['grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', '1'], ['grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', '3'], ['grid = [["0"]]', '0'], ['grid = [["1"]]', '1'], ['grid = [["1","0","1","0","1"]]', '3'], ['grid = [["1","1"],["1","1"]]', '1'],
  ],
  courseSchedule: [
    ['numCourses = 2, prerequisites = [[1,0]]', 'true'], ['numCourses = 2, prerequisites = [[1,0],[0,1]]', 'false'], ['numCourses = 1, prerequisites = []', 'true'], ['numCourses = 3, prerequisites = [[1,0],[2,1]]', 'true'], ['numCourses = 3, prerequisites = [[0,1],[0,2],[1,2]]', 'true'], ['numCourses = 3, prerequisites = [[1,0],[2,1],[0,2]]', 'false'],
  ],
  cloneGraph: [
    ['adjList = [[2,4],[1,3],[2,4],[1,3]]', '[[2,4],[1,3],[2,4],[1,3]]'], ['adjList = [[]]', '[[]]'], ['adjList = []', '[]'], ['adjList = [[2],[1]]', '[[2],[1]]'], ['adjList = [[2,3],[1,3],[1,2]]', '[[2,3],[1,3],[1,2]]'], ['adjList = [[2],[1,3],[2]]', '[[2],[1,3],[2]]'],
  ],
  pacificAtlanticWaterFlow: [
    ['heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]'], ['heights = [[1]]', '[[0,0]]'], ['heights = [[1,2],[4,3]]', '[[0,1],[1,0],[1,1]]'], ['heights = [[2,1],[1,2]]', '[[0,0],[0,1],[1,0],[1,1]]'], ['heights = [[10,10,10],[10,1,10],[10,10,10]]', '[[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]]'], ['heights = [[1,2,3]]', '[[0,0],[0,1],[0,2]]'],
  ],
  rottingOranges: [
    ['grid = [[2,1,1],[1,1,0],[0,1,1]]', '4'], ['grid = [[2,1,1],[0,1,1],[1,0,1]]', '-1'], ['grid = [[0,2]]', '0'], ['grid = [[1]]', '-1'], ['grid = [[2]]', '0'], ['grid = [[2,1,1],[1,1,1],[0,1,2]]', '2'],
  ],
  networkDelayTime: [
    ['times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', '2'], ['times = [[1,2,1]], n = 2, k = 1', '1'], ['times = [[1,2,1]], n = 2, k = 2', '-1'], ['times = [[1,2,1],[2,3,2],[1,3,4]], n = 3, k = 1', '3'], ['times = [[1,2,1],[2,1,3]], n = 2, k = 2', '3'], ['times = [[1,2,1],[2,3,1],[3,4,1]], n = 4, k = 1', '3'],
  ],
  kthSmallestElementInABST: [
    ['root = [3,1,4,null,2], k = 1', '1'], ['root = [5,3,6,2,4,null,null,1], k = 3', '3'], ['root = [1], k = 1', '1'], ['root = [2,1,3], k = 2', '2'], ['root = [4,2,5,1,3], k = 4', '4'], ['root = [10,5,15,3,7], k = 5', '15'],
  ],
  validateBinarySearchTree: [
    ['root = [2,1,3]', 'true'], ['root = [5,1,4,null,null,3,6]', 'false'], ['root = [1]', 'true'], ['root = [2,2,2]', 'false'], ['root = [5,4,6,null,null,3,7]', 'false'], ['root = [0,null,-1]', 'false'],
  ],
  populatingNextRightPointersInEachNode: [
    ['root = [1,2,3,4,5,6,7]', '[1,2,3,4,5,6,7]'], ['root = []', '[]'], ['root = [1]', '[1]'], ['root = [1,2,3]', '[1,2,3]'], ['root = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]', '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]'], ['root = [0,1,2]', '[0,1,2]'],
  ],
  redundantConnection: [
    ['edges = [[1,2],[1,3],[2,3]]', '[2,3]'], ['edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]', '[1,4]'], ['edges = [[1,2],[2,3],[3,1]]', '[3,1]'], ['edges = [[1,4],[3,4],[1,3],[1,2],[4,5]]', '[1,3]'], ['edges = [[1,5],[3,4],[3,5],[4,5],[2,4]]', '[4,5]'], ['edges = [[9,10],[5,8],[2,6],[1,5],[3,8],[4,9],[8,10],[4,10],[6,8],[7,9]]', '[4,10]'],
  ],
  pathSumIII: [
    ['root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8', '3'], ['root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22', '3'], ['root = [], targetSum = 0', '0'], ['root = [1], targetSum = 1', '1'], ['root = [1,-2,-3,1,3,-2,null,-1], targetSum = -1', '4'], ['root = [0,1,1], targetSum = 1', '4'],
  ],
};

for (const [functionName, cases] of Object.entries(GENERIC_BY_FUNCTION)) {
  const hidden = cases.map(([input, output]) => ({ input, output }));
  Object.defineProperty(hidden, 'functionName', { value: functionName });
}

function genericCasesFor(question) {
  const rows = GENERIC_BY_FUNCTION[question?.functionName] || [];
  return rows.map(([input, output]) => ({ input, output }));
}

function dedupeCases(cases) {
  const seen = new Set();
  return cases.filter((tc) => {
    if (!tc?.input) return false;
    const key = `${tc.input}=>${tc.output ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function padCases(cases, minimum) {
  const clean = dedupeCases(cases);
  if (clean.length === 0) return [];
  const out = [...clean];
  let idx = 0;
  while (out.length < minimum) {
    const base = clean[idx % clean.length];
    out.push({ ...base });
    idx += 1;
  }
  return out;
}

export function getVisibleTestCases(question) {
  const bank = CASES[question?.id] || {};
  const generic = genericCasesFor(question);
  const base = bank.visible || (generic.length ? generic : question?.examples || []);
  return padCases([...base, ...generic], 3).slice(0, 3);
}

export function getHiddenTestCases(question) {
  const bank = CASES[question?.id] || {};
  const explicit = bank.hidden || genericCasesFor(question);
  const hidden = explicit.length ? explicit : question?.examples || [];
  return padCases(hidden, 6).slice(0, 6);
}
