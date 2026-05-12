const CASES = {
  'arr-1': {
    visible: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9, so indices [0,1] are returned.' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6, so indices [1,2] are returned.' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]', explanation: 'nums[0] + nums[1] = 3 + 3 = 6, so indices [0,1] are returned.' },
    ],
    hidden: [
      { input: 'nums = [1,5,9,13], target = 14', output: '[0,3]', explanation: 'nums[0] + nums[3] = 1 + 13 = 14, so indices [0,3] are returned.' },
      { input: 'nums = [-3,4,3,90], target = 0', output: '[0,2]', explanation: 'nums[0] + nums[2] = -3 + 3 = 0, so indices [0,2] are returned.' },
      { input: 'nums = [0,4,3,0], target = 0', output: '[0,3]', explanation: 'nums[0] + nums[3] = 0 + 0 = 0, so indices [0,3] are returned.' },
      { input: 'nums = [-1,-2,-3,-4,-5], target = -8', output: '[2,4]', explanation: 'nums[2] + nums[4] = -3 + (-5) = -8, so indices [2,4] are returned.' },
      { input: 'nums = [10,20,30,40], target = 70', output: '[2,3]', explanation: 'nums[2] + nums[3] = 30 + 40 = 70, so indices [2,3] are returned.' },
      { input: 'nums = [5,75,25], target = 100', output: '[1,2]', explanation: 'nums[1] + nums[2] = 75 + 25 = 100, so indices [1,2] are returned.' },
    ],
  },
  'arr-2': {
    hidden: [
      { input: 'nums = [1]', output: 'false', explanation: 'A single-element array cannot have a duplicate, so the result is false.' },
      { input: 'nums = [1,2,3,4,5,1]', output: 'true', explanation: 'The value 1 appears at indices 0 and 5, confirming a duplicate exists.' },
      { input: 'nums = [-1,-2,-3,-1]', output: 'true', explanation: 'The value -1 appears at indices 0 and 3, confirming a duplicate exists.' },
      { input: 'nums = [0,1,2,3]', output: 'false', explanation: 'All four values are distinct, so no duplicate exists.' },
      { input: 'nums = [100000,100000]', output: 'true', explanation: 'The value 100000 appears twice, confirming a duplicate exists.' },
      { input: 'nums = [9,8,7,6]', output: 'false', explanation: 'All values are distinct and strictly decreasing, so no duplicate exists.' },
    ],
  },
  'arr-3': {
    visible: [
      { input: 's = "anagram", t = "nagaram"', output: 'true', explanation: 'Both strings contain exactly a×3, n×1, g×1, r×1, m×1, so they are anagrams.' },
      { input: 's = "rat", t = "car"', output: 'false', explanation: '"rat" has r,a,t while "car" has c,a,r — the characters c and t differ, so they are not anagrams.' },
      { input: 's = "aacc", t = "ccac"', output: 'false', explanation: '"aacc" has a×2,c×2 but "ccac" has c×3,a×1 — character counts differ, so not anagrams.' },
    ],
    hidden: [
      { input: 's = "listen", t = "silent"', output: 'true', explanation: 'Both strings share identical character counts (l,i,s,t,e,n each once), so they are anagrams.' },
      { input: 's = "a", t = "ab"', output: 'false', explanation: '"a" has length 1 and "ab" has length 2 — different lengths means they cannot be anagrams.' },
      { input: 's = "ab", t = "ba"', output: 'true', explanation: 'Both contain a×1 and b×1, just in different order, so they are anagrams.' },
      { input: 's = "aa", t = "a"', output: 'false', explanation: '"aa" has a×2 but "a" has a×1 — character counts differ, so not anagrams.' },
      { input: 's = "night", t = "thing"', output: 'true', explanation: 'Both strings contain n,i,g,h,t each exactly once, so they are anagrams.' },
      { input: 's = "hello", t = "bello"', output: 'false', explanation: '"hello" has h×1 while "bello" has b×1 instead — one character differs, so not anagrams.' },
    ],
  },
  'arr-4': {
    visible: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6) for a profit of 6-1=5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'Prices decrease every day, so no profitable transaction is possible. Return 0.' },
      { input: 'prices = [1,2]', output: '1', explanation: 'Buy on day 1 (price=1), sell on day 2 (price=2) for a profit of 2-1=1.' },
    ],
    hidden: [
      { input: 'prices = [2,4,1]', output: '2', explanation: 'Buy on day 1 (price=2), sell on day 2 (price=4) for a profit of 4-2=2.' },
      { input: 'prices = [3,2,6,5,0,3]', output: '4', explanation: 'Buy on day 2 (price=2), sell on day 3 (price=6) for a profit of 6-2=4.' },
      { input: 'prices = [1]', output: '0', explanation: 'Only one day available, so no buy-sell transaction is possible. Return 0.' },
      { input: 'prices = [1,2,3,4,5]', output: '4', explanation: 'Buy on day 1 (price=1), sell on day 5 (price=5) for a maximum profit of 5-1=4.' },
      { input: 'prices = [5,4,3,2,10]', output: '8', explanation: 'Buy on day 4 (price=2), sell on day 5 (price=10) for a profit of 10-2=8.' },
      { input: 'prices = [2,1,2,0,1]', output: '1', explanation: 'Best options are buy at 1/sell at 2, each giving profit=1. Maximum profit is 1.' },
    ],
  },
  'arr-5': {
    hidden: [
      { input: 'nums = [1]', output: '1', explanation: 'Single element array; the majority element is 1 (appears 1/1 times, which is >n/2).' },
      { input: 'nums = [8,8,7,7,7]', output: '7', explanation: '7 appears 3 times out of 5, which is more than n/2=2.5, so 7 is the majority element.' },
      { input: 'nums = [2,2,2,1,3]', output: '2', explanation: '2 appears 3 times out of 5, which is more than n/2=2.5, so 2 is the majority element.' },
      { input: 'nums = [-1,0,0,1,1,2]', output: '4', explanation: 'Wait — this returns the count of distinct values: -1, 0, 1, 2 = 4 unique elements after removing duplicates in-place.' },
      { input: 'nums = [4,4,4,4,5,6,7]', output: '4', explanation: '4 appears 4 times out of 7, which is more than n/2=3.5, so 4 is the majority element.' },
      { input: 'nums = [9,1,9,2,9]', output: '9', explanation: '9 appears 3 times out of 5, which is more than n/2=2.5, so 9 is the majority element.' },
    ],
  },
  'arr-6': {
    visible: [
      { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]', explanation: 'Non-zero elements 1, 3, 12 are moved to the front preserving order; the two zeros fill the remaining positions.' },
      { input: 'nums = [0]', output: '[0]', explanation: 'Single zero element; array remains unchanged as there are no non-zero elements to move.' },
      { input: 'nums = [1,0]', output: '[1,0]', explanation: 'Non-zero 1 stays at front; zero moves to the end. Array already satisfies the condition.' },
    ],
    hidden: [
      { input: 'nums = [1,2,3]', output: '[1,2,3]', explanation: 'No zeros present; array is already in the correct order, so it remains unchanged.' },
      { input: 'nums = [0,0,1]', output: '[1,0,0]', explanation: 'Non-zero element 1 moves to the front; both zeros shift to the end.' },
      { input: 'nums = [4,0,5,0,0,6]', output: '[4,5,6,0,0,0]', explanation: 'Non-zero elements 4, 5, 6 move to the front preserving order; three zeros fill the remaining positions.' },
      { input: 'nums = [0,0]', output: '[0,0]', explanation: 'All elements are zero; the array remains unchanged.' },
      { input: 'nums = [2,0,1]', output: '[2,1,0]', explanation: 'Non-zero elements 2, 1 move to the front preserving order; the zero moves to the end.' },
      { input: 'nums = [-1,0,-2,0]', output: '[-1,-2,0,0]', explanation: 'Non-zero elements -1, -2 move to the front preserving order; the two zeros fill the remaining positions.' },
    ],
  },
  'arr-7': {
    hidden: [
      { input: 'nums = [-5,-3,-2,-1]', output: '[1,4,9,25]', explanation: 'Squaring gives [25,9,4,1]; sorted in non-decreasing order yields [1,4,9,25].' },
      { input: 'nums = [0,1,2]', output: '[0,1,4]', explanation: 'Squaring gives [0,1,4]; already sorted in non-decreasing order.' },
      { input: 'nums = [-2,0]', output: '[0,4]', explanation: 'Squaring gives [4,0]; sorted in non-decreasing order yields [0,4].' },
      { input: 'nums = [-10,-5,0,5,10]', output: '[0,25,25,100,100]', explanation: 'Squaring gives [100,25,0,25,100]; sorted in non-decreasing order yields [0,25,25,100,100].' },
      { input: 'nums = [1]', output: '[1]', explanation: 'Single element; 1²=1, so the result is [1].' },
      { input: 'nums = [-1,2,2]', output: '[1,4,4]', explanation: 'Squaring gives [1,4,4]; already sorted in non-decreasing order.' },
    ],
  },
  'arr-8': {
    hidden: [
      { input: 'nums = [1]', output: '1', explanation: 'Single element array; only one unique value exists, so there is 1 unique element.' },
      { input: 'nums = [1,1,1]', output: '1', explanation: 'All elements are duplicates of 1; after removing duplicates, 1 unique element remains.' },
      { input: 'nums = [1,2,3]', output: '3', explanation: 'All three values are already unique; removing duplicates leaves 3 elements.' },
      { input: 'nums = [-1,0,0,1,1,2]', output: '4', explanation: 'Unique values are -1, 0, 1, 2; after removing duplicates, 4 elements remain.' },
      { input: 'nums = [0,0,0,0,1]', output: '2', explanation: 'Unique values are 0 and 1; after removing duplicates, 2 elements remain.' },
      { input: 'nums = [-3,-2,-2,-1]', output: '3', explanation: 'Unique values are -3, -2, -1; after removing duplicates, 3 elements remain.' },
    ],
  },
  'arr-9': {
    visible: [
      { input: 'nums1 = [1,2,2,1], nums2 = [2,2]', output: '[2]', explanation: 'The only value common to both arrays is 2. Duplicates are ignored, so the result is [2].' },
      { input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', output: '[4,9]', explanation: 'Values 4 and 9 appear in both arrays. The result contains each unique common value once.' },
      { input: 'nums1 = [1], nums2 = [2]', output: '[]', explanation: 'No common values exist between the two arrays, so the intersection is empty.' },
    ],
    hidden: [
      { input: 'nums1 = [1,2,3], nums2 = [3,4,5]', output: '[3]', explanation: 'Only 3 is common to both arrays, so the intersection is [3].' },
      { input: 'nums1 = [7,7,7], nums2 = [7]', output: '[7]', explanation: '7 appears in both arrays; duplicates are ignored, so the result is [7].' },
      { input: 'nums1 = [], nums2 = [1]', output: '[]', explanation: 'An empty array shares no elements with any array, so the intersection is empty.' },
      { input: 'nums1 = [0,-1,2], nums2 = [-1,2,3]', output: '[-1,2]', explanation: 'Values -1 and 2 are common to both arrays, so the intersection is [-1,2].' },
      { input: 'nums1 = [5,6], nums2 = [7,8]', output: '[]', explanation: 'No values are shared between the two arrays, so the intersection is empty.' },
      { input: 'nums1 = [1,2,2,3], nums2 = [2,3,3]', output: '[2,3]', explanation: 'Values 2 and 3 appear in both arrays; duplicates are ignored, so the result is [2,3].' },
    ],
  },
  'arr-10': {
    visible: [
      { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]', explanation: 'Merging sorted [1,2,3] and [2,5,6] in-place yields [1,2,2,3,5,6].' },
      { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]', explanation: 'nums2 is empty, so nums1 remains unchanged as [1].' },
      { input: 'nums1 = [0], m = 0, nums2 = [1], n = 1', output: '[1]', explanation: 'nums1 has no valid elements; after merging with [1], the result is [1].' },
    ],
    hidden: [
      { input: 'nums1 = [2,0], m = 1, nums2 = [1], n = 1', output: '[1,2]', explanation: 'Merging [2] and [1] in sorted order yields [1,2].' },
      { input: 'nums1 = [4,5,6,0,0,0], m = 3, nums2 = [1,2,3], n = 3', output: '[1,2,3,4,5,6]', explanation: 'Merging sorted [4,5,6] and [1,2,3] in-place yields [1,2,3,4,5,6].' },
      { input: 'nums1 = [1,2,4,5,6,0], m = 5, nums2 = [3], n = 1', output: '[1,2,3,4,5,6]', explanation: 'Inserting 3 from nums2 into its correct sorted position in [1,2,4,5,6] yields [1,2,3,4,5,6].' },
      { input: 'nums1 = [-1,0,0,3,3,3,0,0,0], m = 6, nums2 = [1,2,2], n = 3', output: '[-1,0,0,1,2,2,3,3,3]', explanation: 'Merging sorted [-1,0,0,3,3,3] and [1,2,2] in-place yields [-1,0,0,1,2,2,3,3,3].' },
      { input: 'nums1 = [0,0,0], m = 0, nums2 = [2,5,6], n = 3', output: '[2,5,6]', explanation: 'nums1 has no valid elements; after merging with [2,5,6], the result is [2,5,6].' },
      { input: 'nums1 = [1,2,3,0,0], m = 3, nums2 = [4,5], n = 2', output: '[1,2,3,4,5]', explanation: 'Merging sorted [1,2,3] and [4,5] in-place yields [1,2,3,4,5].' },
    ],
  },
  'arr-11': {
    visible: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'Sorted: [-4,-1,-1,0,1,2]. Triplets summing to 0 are [-1,-1,2] and [-1,0,1]. Duplicates are skipped.' },
      { input: 'nums = [0,1,1]', output: '[]', explanation: 'No combination of three elements sums to 0: 0+1+1=2. Result is an empty array.' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]', explanation: '0+0+0=0, so [0,0,0] is the only valid triplet.' },
    ],
    hidden: [
      { input: 'nums = [0,0,0,0]', output: '[[0,0,0]]', explanation: 'All elements are 0; the only unique triplet summing to 0 is [0,0,0]. Duplicates are skipped.' },
      { input: 'nums = [-2,0,1,1,2]', output: '[[-2,0,2],[-2,1,1]]', explanation: 'Triplets summing to 0: -2+0+2=0 and -2+1+1=0. No other unique combinations exist.' },
      { input: 'nums = [-1,0,1]', output: '[[-1,0,1]]', explanation: '-1+0+1=0, so [-1,0,1] is the only valid triplet.' },
      { input: 'nums = [1,2,-2,-1]', output: '[]', explanation: 'No combination of three elements sums to 0: all possible triplets yield non-zero sums.' },
      { input: 'nums = [-4,-2,-2,-2,0,1,2,2,3,3,4,4,6,6]', output: '[[-4,-2,6],[-4,0,4],[-4,1,3],[-4,2,2],[-2,-2,4],[-2,0,2]]', explanation: 'All unique triplets that sum to 0, found using a sorted two-pointer approach.' },
      { input: 'nums = [-2,-1,3]', output: '[[-2,-1,3]]', explanation: '-2+(-1)+3=0, so [-2,-1,3] is the only valid triplet.' },
    ],
  },
  'arr-12': {
    visible: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: 'Product of all elements = 24. Each output element is 24 divided by that position: 24/1=24, 24/2=12, 24/3=8, 24/4=6.' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]', explanation: 'The array contains a zero, so most positions get 0. Only index 2 (value=0) gets the product of all others: -1×1×-3×3=9.' },
      { input: 'nums = [2,3]', output: '[3,2]', explanation: 'Each element is replaced by the product of all other elements: [3,2].' },
    ],
    hidden: [
      { input: 'nums = [5,6,2]', output: '[12,10,30]', explanation: 'Products: 6×2=12, 5×2=10, 5×6=30. Each position gets the product of all other elements.' },
      { input: 'nums = [0,0]', output: '[0,0]', explanation: 'Both positions have another zero as a factor, so both products are 0.' },
      { input: 'nums = [1,0]', output: '[0,1]', explanation: 'Product excluding index 0 is 0; product excluding index 1 is 1.' },
      { input: 'nums = [-1,-2,-3]', output: '[6,3,2]', explanation: 'Products: -2×-3=6, -1×-3=3, -1×-2=2. Each position gets the product of all other elements.' },
      { input: 'nums = [4,3,2,1,2]', output: '[12,16,24,48,24]', explanation: 'Total product = 48. Products excluding each element: 48/4=12, 48/3=16, 48/2=24, 48/1=48, 48/2=24.' },
      { input: 'nums = [10]', output: '[1]', explanation: 'Single element; the product of all other elements is the empty product = 1.' },
    ],
  },
  'arr-13': {
    visible: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the maximum sum of 4+(-1)+2+1=6.' },
      { input: 'nums = [1]', output: '1', explanation: 'Single element array; the maximum subarray sum is 1.' },
      { input: 'nums = [5,4,-1,7,8]', output: '23', explanation: 'The entire array [5,4,-1,7,8] sums to 23, which is the maximum subarray sum.' },
    ],
    hidden: [
      { input: 'nums = [-1]', output: '-1', explanation: 'Single negative element; the maximum subarray must include it, so the answer is -1.' },
      { input: 'nums = [-2,-3,-1]', output: '-1', explanation: 'All elements are negative; the least negative element -1 forms the maximum subarray.' },
      { input: 'nums = [1,2,3]', output: '6', explanation: 'All elements are positive; the entire array sums to 1+2+3=6, the maximum subarray sum.' },
      { input: 'nums = [8,-19,5,-4,20]', output: '21', explanation: 'The subarray [5,-4,20] has sum 5+(-4)+20=21, which is the maximum.' },
      { input: 'nums = [0,0,0]', output: '0', explanation: 'All elements are 0; the maximum subarray sum is 0.' },
      { input: 'nums = [-2,1]', output: '1', explanation: 'The subarray [1] has the maximum sum of 1, which is better than including -2.' },
    ],
  },
  'arr-14': {
    visible: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Lines at indices 1 (height=8) and 8 (height=7) form the largest container: min(8,7)×(8-1)=7×7=49.' },
      { input: 'height = [1,1]', output: '1', explanation: 'Only two lines of height 1; the container holds min(1,1)×(1-0)=1×1=1.' },
      { input: 'height = [4,3,2,1,4]', output: '16', explanation: 'Lines at indices 0 (height=4) and 4 (height=4) form the largest container: min(4,4)×(4-0)=4×4=16.' },
    ],
    hidden: [
      { input: 'height = [1,2,1]', output: '2', explanation: 'Lines at indices 0 (height=1) and 2 (height=1) give min(1,1)×2=2. Lines at indices 1 and 2 give min(2,1)×1=1. Maximum is 2.' },
      { input: 'height = [2,3,4,5,18,17,6]', output: '17', explanation: 'Lines at indices 4 (height=18) and 5 (height=17) form the largest container: min(18,17)×(5-4)=17×1=17.' },
      { input: 'height = [1,2,4,3]', output: '4', explanation: 'Lines at indices 1 (height=2) and 3 (height=3) give min(2,3)×2=4. That is the maximum container size.' },
      { input: 'height = [5,5,5,5]', output: '15', explanation: 'Lines at indices 0 and 3 (both height=5) form the largest container: min(5,5)×(3-0)=5×3=15.' },
      { input: 'height = [1,3,2,5,25,24,5]', output: '24', explanation: 'Lines at indices 4 (height=25) and 5 (height=24) form the largest container: min(25,24)×1=24.' },
      { input: 'height = [2,1]', output: '1', explanation: 'Two lines of heights 2 and 1; the container holds min(2,1)×(1-0)=1×1=1.' },
    ],
  },
  'arr-15': {
    visible: [
      { input: 's = "babad"', output: '"bab"', explanation: '"bab" (indices 0–2) is a valid palindrome of length 3. "aba" (indices 1–3) is also valid; either is accepted.' },
      { input: 's = "cbbd"', output: '"bb"', explanation: '"bb" (indices 1–2) is the longest palindromic substring, expanding from the center between indices 1 and 2.' },
      { input: 's = "a"', output: '"a"', explanation: 'A single character is always a palindrome; the longest palindromic substring is "a".' },
    ],
    hidden: [
      { input: 's = "racecar"', output: '"racecar"', explanation: 'The entire string "racecar" is a palindrome, so it is the longest palindromic substring.' },
      { input: 's = "forgeeksskeegfor"', output: '"geeksskeeg"', explanation: '"geeksskeeg" (indices 3–12) is the longest palindromic substring of length 10.' },
      { input: 's = "abcda"', output: '"a"', explanation: 'No substring longer than 1 character is a palindrome; any single character qualifies.' },
      { input: 's = "abb"', output: '"bb"', explanation: '"bb" (indices 1–2) is the longest palindromic substring of length 2.' },
      { input: 's = "bananas"', output: '"anana"', explanation: '"anana" (indices 1–5) is the longest palindromic substring of length 5.' },
      { input: 's = "xyzzyx"', output: '"xyzzyx"', explanation: 'The entire string "xyzzyx" is a palindrome, so it is the longest palindromic substring.' },
    ],
  },
  'arr-16': {
    visible: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]', explanation: '"eat","tea","ate" share the same sorted characters "aet"; "tan","nat" share "ant"; "bat" is alone with "abt".' },
      { input: 'strs = [""]', output: '[[""]]', explanation: 'A single empty string forms its own anagram group.' },
      { input: 'strs = ["a"]', output: '[["a"]]', explanation: 'A single one-character string forms its own anagram group.' },
    ],
    hidden: [
      { input: 'strs = ["abc","bca","cab"]', output: '[["abc","bca","cab"]]', explanation: 'All three strings sort to "abc", so they form a single anagram group.' },
      { input: 'strs = ["ab","ba","cd","dc"]', output: '[["ab","ba"],["cd","dc"]]', explanation: '"ab" and "ba" both sort to "ab"; "cd" and "dc" both sort to "cd". Two groups are formed.' },
      { input: 'strs = ["a","b","c"]', output: '[["a"],["b"],["c"]]', explanation: 'Each single-character string is unique; each forms its own group of one.' },
      { input: 'strs = ["listen","silent","enlist","google"]', output: '[["listen","silent","enlist"],["google"]]', explanation: '"listen","silent","enlist" all sort to "eilnst"; "google" sorts to "eggloo" and forms its own group.' },
      { input: 'strs = []', output: '[]', explanation: 'An empty input array produces an empty output with no groups.' },
      { input: 'strs = ["aa","aa"]', output: '[["aa","aa"]]', explanation: 'Both strings are identical and sort to "aa", so they form one anagram group.' },
    ],
  },
  'arr-17': {
    visible: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]', explanation: 'Frequencies: 1→3, 2→2, 3→1. The top 2 most frequent elements are 1 (×3) and 2 (×2).' },
      { input: 'nums = [1], k = 1', output: '[1]', explanation: 'Only one element exists; it is trivially the top-1 most frequent element.' },
      { input: 'nums = [4,4,4,5,5,6], k = 1', output: '[4]', explanation: 'Frequencies: 4→3, 5→2, 6→1. The top 1 most frequent element is 4.' },
    ],
    hidden: [
      { input: 'nums = [3,3,3,2,2,1], k = 2', output: '[3,2]', explanation: 'Frequencies: 3→3, 2→2, 1→1. The top 2 most frequent elements are 3 (×3) and 2 (×2).' },
      { input: 'nums = [5,5,6,6,6,7], k = 1', output: '[6]', explanation: 'Frequencies: 6→3, 5→2, 7→1. The top 1 most frequent element is 6.' },
      { input: 'nums = [-1,-1,-1,2,2,3], k = 2', output: '[-1,2]', explanation: 'Frequencies: -1→3, 2→2, 3→1. The top 2 most frequent elements are -1 (×3) and 2 (×2).' },
      { input: 'nums = [9,8,8,7,7,7], k = 3', output: '[7,8,9]', explanation: 'Frequencies: 7→3, 8→2, 9→1. The top 3 elements by frequency are 7, 8, and 9.' },
      { input: 'nums = [1,2,2,3,3,3,4,4,4,4], k = 2', output: '[4,3]', explanation: 'Frequencies: 4→4, 3→3, 2→2, 1→1. The top 2 most frequent elements are 4 (×4) and 3 (×3).' },
      { input: 'nums = [10], k = 1', output: '[10]', explanation: 'Only one element exists; it is trivially the top-1 most frequent element.' },
    ],
  },
  'arr-18': {
    visible: [
      { input: 'nums = [1,1,1], k = 2', output: '2', explanation: 'Subarrays with sum=2: [1,1] (indices 0–1) and [1,1] (indices 1–2). Total count is 2.' },
      { input: 'nums = [1,2,3], k = 3', output: '2', explanation: 'Subarrays with sum=3: [3] (index 2) and [1,2] (indices 0–1). Total count is 2.' },
      { input: 'nums = [1], k = 0', output: '0', explanation: 'No subarray of [1] sums to 0, so the count is 0.' },
    ],
    hidden: [
      { input: 'nums = [1,-1,0], k = 0', output: '3', explanation: 'Subarrays summing to 0: [-1] is not one, but [1,-1], [1,-1,0], and [0] work — checking: [1,-1]=0, [1,-1,0]=0, [0]=0. Count is 3.' },
      { input: 'nums = [3,4,7,2,-3,1,4,2], k = 7', output: '4', explanation: 'Four subarrays sum to 7: [7], [3,4], [7,2,-3,1], and [1,4,2]. Count is 4.' },
      { input: 'nums = [0,0,0], k = 0', output: '6', explanation: 'Every possible subarray sums to 0: [0]×3, [0,0]×2, [0,0,0]×1. Total count is 6.' },
      { input: 'nums = [-1,-1,1], k = 0', output: '1', explanation: 'Only one subarray sums to 0: [-1,-1,1] (indices 0–2). Count is 1.' },
      { input: 'nums = [1,2,1,2,1], k = 3', output: '4', explanation: 'Subarrays summing to 3: [1,2] (×2 occurrences), [2,1] (×2 occurrences). Count is 4.' },
      { input: 'nums = [5], k = 5', output: '1', explanation: 'The single-element subarray [5] sums to 5=k. Count is 1.' },
    ],
  },
  'arr-19': {
    visible: [
      { input: 'nums = [1,0,-1,0,-2,2], target = 0', output: '[[-2,-1,1,2],[-2,0,0,2],[-1,0,0,1]]', explanation: 'All unique quadruplets summing to 0, found after sorting and using two pointers with duplicate skipping.' },
      { input: 'nums = [2,2,2,2,2], target = 8', output: '[[2,2,2,2]]', explanation: 'The only quadruplet is [2,2,2,2] with sum 2+2+2+2=8. Duplicates are collapsed into one result.' },
      { input: 'nums = [1,2,3,4], target = 10', output: '[[1,2,3,4]]', explanation: '1+2+3+4=10; this is the only quadruplet and it exactly equals the target.' },
    ],
    hidden: [
      { input: 'nums = [0,0,0,0], target = 0', output: '[[0,0,0,0]]', explanation: '0+0+0+0=0; the only unique quadruplet is [0,0,0,0].' },
      { input: 'nums = [-3,-1,0,2,4,5], target = 2', output: '[[-3,-1,2,4]]', explanation: '-3+(-1)+2+4=2 is the only quadruplet summing to the target.' },
      { input: 'nums = [1,1,1,1], target = 5', output: '[]', explanation: 'The only possible quadruplet [1,1,1,1] sums to 4≠5. No valid quadruplets exist.' },
      { input: 'nums = [-2,-1,-1,1,1,2,2], target = 0', output: '[[-2,-1,1,2],[-1,-1,1,1]]', explanation: 'Unique quadruplets summing to 0: -2+(-1)+1+2=0 and -1+(-1)+1+1=0.' },
      { input: 'nums = [1000000000,1000000000,1000000000,1000000000], target = -294967296', output: '[]', explanation: 'The only quadruplet sums to 4×10⁹, which far exceeds the target. No valid quadruplets exist.' },
      { input: 'nums = [-1,0,1,2,-1,-4], target = -1', output: '[[-4,0,1,2],[-1,-1,0,1]]', explanation: 'Quadruplets summing to -1: -4+0+1+2=-1 and -1+(-1)+0+1=-1.' },
    ],
  },
  'arr-20': {
    visible: [
      { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]', explanation: 'Rotating right by 3 moves the last 3 elements [5,6,7] to the front, giving [5,6,7,1,2,3,4].' },
      { input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]', explanation: 'Rotating right by 2 moves [3,99] to the front, giving [3,99,-1,-100].' },
      { input: 'nums = [1,2], k = 1', output: '[2,1]', explanation: 'Rotating right by 1 moves the last element [2] to the front, giving [2,1].' },
    ],
    hidden: [
      { input: 'nums = [1], k = 0', output: '[1]', explanation: 'Rotating by 0 positions leaves the single-element array unchanged.' },
      { input: 'nums = [1,2,3], k = 4', output: '[3,1,2]', explanation: 'k=4 is equivalent to k=4%3=1 rotation. Moving last element [3] to front gives [3,1,2].' },
      { input: 'nums = [1,2,3], k = 3', output: '[1,2,3]', explanation: 'k=3 equals the array length, so a full rotation returns the array to its original order.' },
      { input: 'nums = [0,1,2,3], k = 1', output: '[3,0,1,2]', explanation: 'Rotating right by 1 moves the last element [3] to the front, giving [3,0,1,2].' },
      { input: 'nums = [-1,-2,-3], k = 2', output: '[-2,-3,-1]', explanation: 'Rotating right by 2 moves [-2,-3] to the front, giving [-2,-3,-1].' },
      { input: 'nums = [10,20,30,40,50], k = 7', output: '[40,50,10,20,30]', explanation: 'k=7 is equivalent to k=7%5=2 rotation. Moving last 2 elements [40,50] to front gives [40,50,10,20,30].' },
    ],
  },
};

const GENERIC_BY_FUNCTION = {
  climbingStairs: [
    ['n = 2', '2', 'There are 2 ways to climb 2 stairs: (1+1) or (2).'],
    ['n = 3', '3', 'There are 3 ways to climb 3 stairs: (1+1+1), (1+2), or (2+1).'],
    ['n = 4', '5', 'There are 5 ways to climb 4 stairs: (1+1+1+1), (1+1+2), (1+2+1), (2+1+1), (2+2).'],
    ['n = 5', '8', 'The number of ways follows the Fibonacci pattern: f(5)=f(4)+f(3)=5+3=8.'],
    ['n = 1', '1', 'There is only 1 way to climb 1 stair: a single step of (1).'],
    ['n = 10', '89', 'The number of ways follows the Fibonacci sequence: f(10)=89.'],
  ],
  fibonacciNumber: [
    ['n = 0', '0', 'The 0th Fibonacci number is defined as 0.'],
    ['n = 1', '1', 'The 1st Fibonacci number is defined as 1.'],
    ['n = 2', '1', 'F(2) = F(1) + F(0) = 1 + 0 = 1.'],
    ['n = 5', '5', 'F(5) = F(4)+F(3) = 3+2 = 5.'],
    ['n = 10', '55', 'F(10) = 55, computed by summing the two preceding Fibonacci numbers repeatedly.'],
    ['n = 20', '6765', 'F(20) = 6765, the 20th term in the Fibonacci sequence.'],
  ],
  minCostClimbingStairs: [
    ['cost = [10,15,20]', '15', 'Start at index 1 (cost=15), jump 2 steps to the top. Total cost is 15.'],
    ['cost = [1,100,1,1,1,100,1,1,100,1]', '6', 'Optimal path steps on low-cost stairs (1,1,1,1,1,1) totaling 6, skipping the costly steps.'],
    ['cost = [0,0,0,0]', '0', 'All steps have cost 0; any path to the top costs 0.'],
    ['cost = [5,10]', '5', 'Start at index 0 (cost=5), jump 2 steps to the top. Total cost is 5.'],
    ['cost = [1,2,3,4]', '4', 'Optimal path: step 0 (cost=1) → step 2 (cost=3) → top. Total cost is 1+3=4.'],
    ['cost = [10,1,10,1]', '2', 'Optimal path: step 1 (cost=1) → step 3 (cost=1) → top. Total cost is 1+1=2.'],
  ],
  maximumSubarray: [
    ['nums = [-2,1,-3,4,-1,2,1,-5,4]', '6', 'The subarray [4,-1,2,1] has the maximum sum of 6.'],
    ['nums = [1]', '1', 'Single element array; the maximum subarray sum is 1.'],
    ['nums = [5,4,-1,7,8]', '23', 'The entire array sums to 23, which is the maximum subarray sum.'],
    ['nums = [-1]', '-1', 'Single negative element; the only subarray is [-1] with sum -1.'],
    ['nums = [-2,-3,-1]', '-1', 'All negative; the least-negative element -1 gives the maximum subarray sum.'],
    ['nums = [0,0]', '0', 'All zeros; the maximum subarray sum is 0.'],
  ],
  houseRobber: [
    ['nums = [1,2,3,1]', '4', 'Rob houses 1 and 3 (0-indexed: 0 and 2): 1+3=4. Adjacent houses cannot both be robbed.'],
    ['nums = [2,7,9,3,1]', '12', 'Rob houses 0, 2, 4: 2+9+1=12. This is the maximum non-adjacent sum.'],
    ['nums = [2,1,1,2]', '4', 'Rob houses 0 and 3: 2+2=4. Houses 1 and 2 are skipped.'],
    ['nums = [0]', '0', 'Single house with value 0; robbing it yields 0.'],
    ['nums = [5]', '5', 'Single house with value 5; robbing it yields 5.'],
    ['nums = [4,1,2,7,5,3,1]', '14', 'Rob houses 0, 3, 5: 4+7+3=14. This is the maximum non-adjacent sum.'],
  ],
  pascalSTriangle: [
    ['numRows = 1', '[[1]]', 'Pascal\'s triangle with 1 row: just the apex [1].'],
    ['numRows = 2', '[[1],[1,1]]', 'Row 2 is formed by summing adjacent elements of row 1: [1,1].'],
    ['numRows = 3', '[[1],[1,1],[1,2,1]]', 'Row 3: each inner element is the sum of the two above it: 1+1=2.'],
    ['numRows = 4', '[[1],[1,1],[1,2,1],[1,3,3,1]]', 'Row 4: sums of adjacent pairs in row 3 give [1,3,3,1].'],
    ['numRows = 5', '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]', 'Row 5: sums of adjacent pairs in row 4 give [1,4,6,4,1].'],
    ['numRows = 6', '[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1],[1,5,10,10,5,1]]', 'Row 6: sums of adjacent pairs in row 5 give [1,5,10,10,5,1].'],
  ],
  divisorGame: [
    ['n = 2', 'true', 'Alice picks x=1 (1 divides 2), leaving n=1 for Bob. Bob has no valid move, so Alice wins.'],
    ['n = 3', 'false', 'Any move Alice makes leaves an even number for Bob. Bob can always win from an even number, so Alice loses.'],
    ['n = 4', 'true', 'Even n always results in a win for Alice with optimal play.'],
    ['n = 5', 'false', 'Odd n always results in a loss for Alice with optimal play.'],
    ['n = 100', 'true', 'n=100 is even; Alice wins with optimal play.'],
    ['n = 99', 'false', 'n=99 is odd; Alice loses with optimal play.'],
  ],
  isSubsequence: [
    ['s = "abc", t = "ahbgdc"', 'true', '"a","b","c" can be found in t in order at indices 0, 2, 5. So "abc" is a subsequence of "ahbgdc".'],
    ['s = "axc", t = "ahbgdc"', 'false', 'After matching "a" and then looking for "x" in "hbgdc", "x" is not found. Not a subsequence.'],
    ['s = "", t = "abc"', 'true', 'An empty string is a subsequence of any string.'],
    ['s = "abc", t = ""', 'false', 'A non-empty string cannot be a subsequence of an empty string.'],
    ['s = "ace", t = "abcde"', 'true', '"a","c","e" are found at indices 0, 2, 4 in t. So "ace" is a subsequence of "abcde".'],
    ['s = "aec", t = "abcde"', 'false', 'After matching "a" and "e" (index 4), "c" cannot be found after index 4 in t. Not a subsequence.'],
  ],
  rangeSumQueryImmutable: [
    ['nums = [-2,0,3,-5,2,-1], left = 0, right = 2', '1', 'Sum of nums[0..2] = -2+0+3 = 1.'],
    ['nums = [-2,0,3,-5,2,-1], left = 2, right = 5', '-1', 'Sum of nums[2..5] = 3+(-5)+2+(-1) = -1.'],
    ['nums = [1,2,3], left = 0, right = 2', '6', 'Sum of all elements: 1+2+3 = 6.'],
    ['nums = [5], left = 0, right = 0', '5', 'Single element range; sum is just nums[0] = 5.'],
    ['nums = [1,-1,1], left = 0, right = 1', '0', 'Sum of nums[0..1] = 1+(-1) = 0.'],
    ['nums = [10,20,30], left = 1, right = 1', '20', 'Single element range at index 1; sum is nums[1] = 20.'],
  ],
  countingBits: [
    ['n = 2', '[0,1,1]', 'Bit counts: 0→0 bits, 1→1 bit, 2→1 bit (binary: 0,1,10).'],
    ['n = 5', '[0,1,1,2,1,2]', 'Bit counts for 0–5: 0,1,1,2,1,2 (binary: 0,1,10,11,100,101).'],
    ['n = 0', '[0]', 'Only 0 is in range; 0 has 0 set bits.'],
    ['n = 1', '[0,1]', 'Bit counts: 0→0 bits, 1→1 bit.'],
    ['n = 8', '[0,1,1,2,1,2,2,3,1]', 'Bit counts for 0–8: 8 in binary is 1000, which has 1 set bit.'],
    ['n = 10', '[0,1,1,2,1,2,2,3,1,2,2]', 'Bit counts for 0–10: 10 in binary is 1010, which has 2 set bits.'],
  ],
  longestCommonSubsequence: [
    ['text1 = "abcde", text2 = "ace"', '3', 'The LCS is "ace" (length 3), found by matching a→a, c→c, e→e in order.'],
    ['text1 = "abc", text2 = "abc"', '3', 'The strings are identical; the LCS is "abc" with length 3.'],
    ['text1 = "abc", text2 = "def"', '0', 'No characters are common to both strings; the LCS length is 0.'],
    ['text1 = "bsbininm", text2 = "jmjkbkjkv"', '1', 'Only one character ("b" or "m") can be matched; the LCS length is 1.'],
    ['text1 = "", text2 = "abc"', '0', 'An empty string has no common subsequence with any string; LCS length is 0.'],
    ['text1 = "abcba", text2 = "abcbcba"', '5', 'The LCS is "abcba" (length 5), a common subsequence of both strings.'],
  ],
  coinChange: [
    ['coins = [1,2,5], amount = 11', '3', 'Minimum coins to make 11: 5+5+1=11 uses 3 coins.'],
    ['coins = [2], amount = 3', '-1', 'Amount 3 is odd and only coin is 2 (even); it is impossible to make 3. Return -1.'],
    ['coins = [1], amount = 0', '0', 'Amount 0 requires 0 coins regardless of available denominations.'],
    ['coins = [1], amount = 2', '2', 'Only coin is 1; making amount 2 requires 1+1=2 coins.'],
    ['coins = [2,5,10,1], amount = 27', '4', 'Minimum coins: 10+10+5+2=27 uses 4 coins.'],
    ['coins = [186,419,83,408], amount = 6249', '20', 'The minimum number of coins to make 6249 is 20.'],
  ],
  longestIncreasingSubsequence: [
    ['nums = [10,9,2,5,3,7,101,18]', '4', 'The LIS is [2,3,7,101] or [2,5,7,101] with length 4.'],
    ['nums = [0,1,0,3,2,3]', '4', 'The LIS is [0,1,2,3] with length 4.'],
    ['nums = [7,7,7,7]', '1', 'All elements are equal; no strictly increasing subsequence longer than 1 exists.'],
    ['nums = [1,2,3,4]', '4', 'The array is already sorted; the LIS is the entire array with length 4.'],
    ['nums = [4,3,2,1]', '1', 'The array is strictly decreasing; the LIS length is 1 (any single element).'],
    ['nums = [-1,3,4,-2,0,6,2,3]', '4', 'The LIS is [-1,0,2,3] or [-1,3,4,6] with length 4.'],
  ],
  wordBreak: [
    ['s = "leetcode", wordDict = ["leet","code"]', 'true', '"leetcode" can be segmented as "leet" + "code", both present in the dictionary.'],
    ['s = "applepenapple", wordDict = ["apple","pen"]', 'true', '"applepenapple" can be segmented as "apple" + "pen" + "apple".'],
    ['s = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', 'false', '"catsandog" cannot be fully segmented using the dictionary words; "og" has no match.'],
    ['s = "a", wordDict = ["a"]', 'true', 'The single character "a" is found directly in the dictionary.'],
    ['s = "aaaaaaa", wordDict = ["aaaa","aaa"]', 'true', '"aaaaaaa" can be segmented as "aaaa"+"aaa" or "aaa"+"aaaa".'],
    ['s = "cars", wordDict = ["car","ca","rs"]', 'true', '"cars" can be segmented as "ca"+"rs", both present in the dictionary.'],
  ],
  uniquePaths: [
    ['m = 3, n = 7', '28', 'A 3×7 grid has 28 unique paths from top-left to bottom-right moving only right or down.'],
    ['m = 3, n = 2', '3', 'A 3×2 grid has 3 unique paths: (R,D,D), (D,R,D), (D,D,R).'],
    ['m = 1, n = 1', '1', 'A 1×1 grid has exactly 1 path: stay at the start (already at destination).'],
    ['m = 1, n = 10', '1', 'A 1×10 grid has only 1 path: move right all 9 steps.'],
    ['m = 4, n = 4', '20', 'A 4×4 grid has 20 unique paths, computed by C(6,3)=20.'],
    ['m = 10, n = 10', '48620', 'A 10×10 grid has 48620 unique paths, computed by C(18,9)=48620.'],
  ],
  editDistance: [
    ['word1 = "horse", word2 = "ros"', '3', 'Minimum edits: replace "h"→"r", delete "r", delete "e". Total 3 operations.'],
    ['word1 = "intention", word2 = "execution"', '5', 'Minimum of 5 insert/delete/replace operations to transform "intention" to "execution".'],
    ['word1 = "", word2 = "abc"', '3', 'Transforming empty string to "abc" requires 3 insertions.'],
    ['word1 = "abc", word2 = ""', '3', 'Transforming "abc" to an empty string requires 3 deletions.'],
    ['word1 = "abc", word2 = "abc"', '0', 'Strings are identical; no edit operations are needed.'],
    ['word1 = "kitten", word2 = "sitting"', '3', 'Minimum edits: replace "k"→"s", replace "e"→"i", insert "g". Total 3 operations.'],
  ],
  decodeWays: [
    ['s = "12"', '2', '"12" can be decoded as "AB" (1,2) or "L" (12). There are 2 ways.'],
    ['s = "226"', '3', '"226" decodes as "BZ" (2,26), "VF" (22,6), or "BBF" (2,2,6). There are 3 ways.'],
    ['s = "06"', '0', '"06" starts with 0, which has no valid mapping. There are 0 ways to decode it.'],
    ['s = "0"', '0', '"0" alone has no valid mapping (valid codes are 1–26). There are 0 ways.'],
    ['s = "10"', '1', '"10" can only be decoded as "J" (10). The "0" cannot stand alone. There is 1 way.'],
    ['s = "11106"', '2', '"11106" decodes as "AAJF" (1,1,10,6) or "KJF" (11,10,6). There are 2 ways.'],
  ],
  palindromicSubstrings: [
    ['s = "abc"', '3', 'Each single character is a palindrome: "a","b","c". Total 3 palindromic substrings.'],
    ['s = "aaa"', '6', 'Palindromes: "a"(×3), "aa"(×2), "aaa"(×1). Total 3+2+1=6 palindromic substrings.'],
    ['s = "aba"', '4', 'Palindromes: "a"(×2), "b"(×1), "aba"(×1). Total 4 palindromic substrings.'],
    ['s = "abba"', '6', 'Palindromes: "a"(×2), "b"(×2), "bb"(×1), "abba"(×1). Total 6 palindromic substrings.'],
    ['s = "a"', '1', 'Single character "a" is itself a palindrome. Total 1 palindromic substring.'],
    ['s = "fdsklf"', '6', 'Only the 6 individual characters are palindromes; no longer palindromic substrings exist.'],
  ],
  maximumProductSubarray: [
    ['nums = [2,3,-2,4]', '6', 'The subarray [2,3] has the maximum product of 2×3=6.'],
    ['nums = [-2,0,-1]', '0', 'The subarray [0] has product 0, which is the maximum since other products are negative.'],
    ['nums = [-2,3,-4]', '24', 'The entire array has product (-2)×3×(-4)=24, which is the maximum.'],
    ['nums = [0,2]', '2', 'The subarray [2] has the maximum product of 2.'],
    ['nums = [-1,-2,-3]', '6', 'The subarray [-2,-3] has product (-2)×(-3)=6, which is the maximum.'],
    ['nums = [2,-5,-2,-4,3]', '24', 'The subarray [-5,-2,-4] has product (-5)×(-2)×(-4)=... checking: 2×-5=-10, then [-2,-4,3]: (-2)×(-4)×3=24. Maximum is 24.'],
  ],
  targetSum: [
    ['nums = [1,1,1,1,1], target = 3', '5', 'Five ways to assign +/- signs: e.g. +1+1+1+1-1=3. There are 5 valid assignments.'],
    ['nums = [1], target = 1', '1', 'Assigning +1=1 hits the target. Only 1 valid assignment.'],
    ['nums = [1], target = 2', '0', 'Assigning +1=1 or -1=-1; neither equals 2. There are 0 valid assignments.'],
    ['nums = [0,0,0,0,0,0,0,0,1], target = 1', '256', 'The eight zeros can each be + or - without affecting the sum; 2⁸=256 ways to reach target 1.'],
    ['nums = [1,2,1], target = 0', '2', 'Valid assignments: (+1-2+1)=0 and (-1+2-1)=0. There are 2 ways.'],
    ['nums = [2,3,5,7], target = 3', '2', 'Valid assignments: (+2+3-5+3) — checking: (-2+3-5+7)=3 and (2-3+5-7)... verifying: -2+3-5+7=3 and 2+3+5-7=3. Two ways.'],
  ],
  invertBinaryTree: [
    ['root = [4,2,7,1,3,6,9]', '[4,7,2,9,6,3,1]', 'Left and right children are swapped at every node: 2↔7, then 1↔3 and 6↔9.'],
    ['root = [2,1,3]', '[2,3,1]', 'Root stays 2; left child 1 and right child 3 are swapped to give [2,3,1].'],
    ['root = []', '[]', 'An empty tree remains empty after inversion.'],
    ['root = [1]', '[1]', 'A single-node tree with no children is unchanged after inversion.'],
    ['root = [1,2]', '[1,null,2]', 'Node 2 is the left child; after inversion it becomes the right child.'],
    ['root = [1,null,2]', '[1,2]', 'Node 2 is the right child; after inversion it becomes the left child.'],
  ],
  maximumDepthOfBinaryTree: [
    ['root = [3,9,20,null,null,15,7]', '3', 'The longest root-to-leaf path is 3→20→15 or 3→20→7, giving depth 3.'],
    ['root = [1,null,2]', '2', 'The path 1→2 has length 2, which is the maximum depth.'],
    ['root = []', '0', 'An empty tree has depth 0.'],
    ['root = [1]', '1', 'A single-node tree has depth 1.'],
    ['root = [1,2,3,4]', '3', 'The longest path is 1→2→4, giving depth 3.'],
    ['root = [1,2,null,3,null,4]', '4', 'The longest path is 1→2→3→4, giving depth 4.'],
  ],
  diameterOfBinaryTree: [
    ['root = [1,2,3,4,5]', '3', 'The longest path is 4→2→1→3 (or 5→2→1→3) passing through the root, with 3 edges.'],
    ['root = [1,2]', '1', 'The only path is 1→2, which has 1 edge. Diameter is 1.'],
    ['root = []', '0', 'An empty tree has no edges; diameter is 0.'],
    ['root = [1]', '0', 'A single-node tree has no edges; diameter is 0.'],
    ['root = [4,-7,-3,null,null,-9,-3,9,-7,-4,null,6,null,-6,-6,null,null,0,6,5,null,9,null,null,-1,-4,null,null,null,-2]', '8', 'The longest path in this deep tree spans 8 edges between its two farthest leaf nodes.'],
    ['root = [1,2,3,4,5,6,7]', '4', 'The longest path goes through the root connecting deepest nodes on each side, spanning 4 edges.'],
  ],
  balancedBinaryTree: [
    ['root = [3,9,20,null,null,15,7]', 'true', 'Both subtrees have heights differing by at most 1 at every node; the tree is height-balanced.'],
    ['root = [1,2,2,3,3,null,null,4,4]', 'false', 'The left subtree reaches depth 4 while the right stays at depth 2; difference exceeds 1.'],
    ['root = []', 'true', 'An empty tree is trivially balanced.'],
    ['root = [1]', 'true', 'A single-node tree with no children is trivially balanced.'],
    ['root = [1,2,null,3]', 'false', 'Left subtree has height 2 (1→2→3); right subtree has height 0. Difference is 2, so not balanced.'],
    ['root = [1,2,3,4,5]', 'true', 'All subtrees satisfy the height-balance condition; the tree is balanced.'],
  ],
  sameTree: [
    ['p = [1,2,3], q = [1,2,3]', 'true', 'Both trees have identical structure and node values at every position.'],
    ['p = [1,2], q = [1,null,2]', 'false', 'p has 2 as the left child while q has 2 as the right child; structures differ.'],
    ['p = [1,2,1], q = [1,1,2]', 'false', 'Left and right children have swapped values (2 vs 1); the trees are not the same.'],
    ['p = [], q = []', 'true', 'Both trees are empty; they are identical.'],
    ['p = [1], q = []', 'false', 'p has one node while q is empty; the trees are not the same.'],
    ['p = [1,null,2], q = [1,null,2]', 'true', 'Both trees have identical structure (root with only a right child of value 2).'],
  ],
  binaryTreeLevelOrderTraversal: [
    ['root = [3,9,20,null,null,15,7]', '[[3],[9,20],[15,7]]', 'Level 0: [3], Level 1: [9,20], Level 2: [15,7]. Nodes are grouped by their depth.'],
    ['root = [1]', '[[1]]', 'Single node; only one level containing [1].'],
    ['root = []', '[]', 'Empty tree produces an empty level-order traversal.'],
    ['root = [1,2,3,4,5]', '[[1],[2,3],[4,5]]', 'Level 0: [1], Level 1: [2,3], Level 2: [4,5].'],
    ['root = [1,null,2,3]', '[[1],[2],[3]]', 'Level 0: [1], Level 1: [2] (right child), Level 2: [3] (left child of 2).'],
    ['root = [1,2,null,3,null,4]', '[[1],[2],[3],[4]]', 'Each level has one node in this left-skewed chain: [1],[2],[3],[4].'],
  ],
  lowestCommonAncestorOfABinaryTree: [
    ['root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', '3', 'Nodes 5 and 1 are in different subtrees of root 3; their LCA is 3.'],
    ['root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', '5', 'Node 4 is a descendant of node 5; the LCA of 5 and its descendant is 5 itself.'],
    ['root = [1,2], p = 1, q = 2', '1', 'Node 2 is the child of node 1; the LCA is the ancestor node 1.'],
    ['root = [1,2,3], p = 2, q = 3', '1', 'Nodes 2 and 3 are left and right children of root 1; their LCA is 1.'],
    ['root = [1,2,3,4], p = 4, q = 3', '1', 'Node 4 is in the left subtree and node 3 is the right child; they meet at root 1.'],
    ['root = [1,2,3,4,5], p = 4, q = 5', '2', 'Nodes 4 and 5 are both children of node 2; their LCA is 2.'],
  ],
  binaryTreeRightSideView: [
    ['root = [1,2,3,null,5,null,4]', '[1,3,4]', 'Rightmost nodes at each level: level 0→1, level 1→3, level 2→4.'],
    ['root = [1,null,3]', '[1,3]', 'Rightmost nodes: level 0→1, level 1→3 (only right child exists).'],
    ['root = []', '[]', 'Empty tree produces an empty right side view.'],
    ['root = [1,2,3,4]', '[1,3,4]', 'Rightmost nodes: level 0→1, level 1→3, level 2→4 (leftmost at that level, but only node).'],
    ['root = [1,2]', '[1,2]', 'Level 0 rightmost is 1; level 1 only has 2 (left child), so 2 is visible from the right.'],
    ['root = [1,2,3,4,5,6,7]', '[1,3,7]', 'Rightmost nodes: level 0→1, level 1→3, level 2→7.'],
  ],
  numberOfIslands: [
    ['grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', '1', 'All "1" cells are connected into a single island in the top-left region.'],
    ['grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', '3', 'Three separate groups of connected "1" cells form 3 distinct islands.'],
    ['grid = [["0"]]', '0', 'No land cells exist; the island count is 0.'],
    ['grid = [["1"]]', '1', 'A single land cell forms one island.'],
    ['grid = [["1","0","1","0","1"]]', '3', 'Three isolated "1" cells separated by "0"s form 3 islands.'],
    ['grid = [["1","1"],["1","1"]]', '1', 'All four cells are "1" and fully connected; they form a single island.'],
  ],
  courseSchedule: [
    ['numCourses = 2, prerequisites = [[1,0]]', 'true', 'Course 1 depends on course 0; taking 0 then 1 works. No cycle exists, so all courses can be finished.'],
    ['numCourses = 2, prerequisites = [[1,0],[0,1]]', 'false', 'Courses 0 and 1 each depend on the other; this cycle makes it impossible to finish all courses.'],
    ['numCourses = 1, prerequisites = []', 'true', 'Single course with no prerequisites; it can always be finished.'],
    ['numCourses = 3, prerequisites = [[1,0],[2,1]]', 'true', 'Linear chain 0→1→2; courses can be taken in that order without any cycle.'],
    ['numCourses = 3, prerequisites = [[0,1],[0,2],[1,2]]', 'true', 'No cycle exists; take course 2, then 1, then 0.'],
    ['numCourses = 3, prerequisites = [[1,0],[2,1],[0,2]]', 'false', 'A cycle exists: 0→1→2→0. It is impossible to finish all courses.'],
  ],
  cloneGraph: [
    ['adjList = [[2,4],[1,3],[2,4],[1,3]]', '[[2,4],[1,3],[2,4],[1,3]]', 'A deep copy of the 4-node graph is returned; all adjacency relationships are preserved.'],
    ['adjList = [[]]', '[[]]', 'Single node with no neighbors; the clone is also a single node with no neighbors.'],
    ['adjList = []', '[]', 'Empty graph; the clone is also empty.'],
    ['adjList = [[2],[1]]', '[[2],[1]]', 'Two nodes connected to each other; the clone preserves this single bidirectional edge.'],
    ['adjList = [[2,3],[1,3],[1,2]]', '[[2,3],[1,3],[1,2]]', 'A triangle graph (3 nodes all connected); the clone preserves all three edges.'],
    ['adjList = [[2],[1,3],[2]]', '[[2],[1,3],[2]]', 'Three nodes in a chain 1-2-3; node 2 connects to both 1 and 3. Clone preserves the structure.'],
  ],
  pacificAtlanticWaterFlow: [
    ['heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]', '[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]', 'These cells can flow to both the Pacific (top/left border) and Atlantic (bottom/right border) oceans.'],
    ['heights = [[1]]', '[[0,0]]', 'Single cell touches both oceans directly; it is the only cell that flows to both.'],
    ['heights = [[1,2],[4,3]]', '[[0,1],[1,0],[1,1]]', 'Three cells can reach both oceans: the top-right, bottom-left, and bottom-right cells.'],
    ['heights = [[2,1],[1,2]]', '[[0,0],[0,1],[1,0],[1,1]]', 'All four cells can flow to both oceans in this 2×2 grid.'],
    ['heights = [[10,10,10],[10,1,10],[10,10,10]]', '[[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2]]', 'All border cells can reach both oceans; the center cell (value 1) cannot flow outward to either.'],
    ['heights = [[1,2,3]]', '[[0,0],[0,1],[0,2]]', 'All cells in a single row touch both the Pacific (left/top) and Atlantic (right/bottom) borders.'],
  ],
  rottingOranges: [
    ['grid = [[2,1,1],[1,1,0],[0,1,1]]', '4', 'The rot spreads via BFS from the single rotten orange; it takes 4 minutes to rot all reachable fresh oranges.'],
    ['grid = [[2,1,1],[0,1,1],[1,0,1]]', '-1', 'The fresh orange at [2,0] is isolated by zeros and can never be reached by rot. Return -1.'],
    ['grid = [[0,2]]', '0', 'No fresh oranges exist; 0 minutes are needed.'],
    ['grid = [[1]]', '-1', 'A single fresh orange with no rotten neighbors can never rot. Return -1.'],
    ['grid = [[2]]', '0', 'Single rotten orange and no fresh oranges; 0 minutes are needed.'],
    ['grid = [[2,1,1],[1,1,1],[0,1,2]]', '2', 'Two rotten oranges spread simultaneously; all fresh oranges are reached within 2 minutes.'],
  ],
  networkDelayTime: [
    ['times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2', '2', 'From node 2: reach 1 in 1, reach 3 in 1, reach 4 via 3 in 2. Maximum time is 2.'],
    ['times = [[1,2,1]], n = 2, k = 1', '1', 'Signal travels from node 1 to node 2 in 1 unit. Maximum time is 1.'],
    ['times = [[1,2,1]], n = 2, k = 2', '-1', 'Starting from node 2, node 1 has no outgoing edge back. Node 1 is unreachable. Return -1.'],
    ['times = [[1,2,1],[2,3,2],[1,3,4]], n = 3, k = 1', '3', 'From node 1: reach 2 in 1, reach 3 via 2 in 1+2=3 (faster than direct edge of 4). Max is 3.'],
    ['times = [[1,2,1],[2,1,3]], n = 2, k = 2', '3', 'From node 2: reach 1 directly in 3. Then from 1, reach 2 via edge of 1, but 2 already reached. Max time is 3.'],
    ['times = [[1,2,1],[2,3,1],[3,4,1]], n = 4, k = 1', '3', 'From node 1: chain 1→2→3→4 takes 1+1+1=3. Maximum time is 3.'],
  ],
  kthSmallestElementInABST: [
    ['root = [3,1,4,null,2], k = 1', '1', 'In-order traversal gives [1,2,3,4]. The 1st smallest element is 1.'],
    ['root = [5,3,6,2,4,null,null,1], k = 3', '3', 'In-order traversal gives [1,2,3,4,5,6]. The 3rd smallest element is 3.'],
    ['root = [1], k = 1', '1', 'Single node BST; the 1st smallest element is 1.'],
    ['root = [2,1,3], k = 2', '2', 'In-order traversal gives [1,2,3]. The 2nd smallest element is 2.'],
    ['root = [4,2,5,1,3], k = 4', '4', 'In-order traversal gives [1,2,3,4,5]. The 4th smallest element is 4.'],
    ['root = [10,5,15,3,7], k = 5', '15', 'In-order traversal gives [3,5,7,10,15]. The 5th smallest element is 15.'],
  ],
  validateBinarySearchTree: [
    ['root = [2,1,3]', 'true', 'Left child 1 < root 2 < right child 3; all BST properties hold.'],
    ['root = [5,1,4,null,null,3,6]', 'false', 'Right child 4 < root 5 violates the BST property (right child must be greater).'],
    ['root = [1]', 'true', 'Single node; trivially satisfies BST properties.'],
    ['root = [2,2,2]', 'false', 'Equal values in children violate the strict BST property (left must be strictly less).'],
    ['root = [5,4,6,null,null,3,7]', 'false', 'Node 3 is in the right subtree of 5 but 3 < 5, violating the global BST constraint.'],
    ['root = [0,null,-1]', 'false', 'Right child -1 < root 0 violates the BST property (right child must be greater).'],
  ],
  populatingNextRightPointersInEachNode: [
    ['root = [1,2,3,4,5,6,7]', '[1,2,3,4,5,6,7]', 'Each node\'s next pointer links to its right neighbor on the same level: 2→3, 4→5→6→7.'],
    ['root = []', '[]', 'Empty tree; no next pointers to set.'],
    ['root = [1]', '[1]', 'Single node; its next pointer is null (no neighbor on the same level).'],
    ['root = [1,2,3]', '[1,2,3]', 'Level 1: 2→3. Root\'s next is null. Level 1 nodes are connected left to right.'],
    ['root = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]', '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]', 'Perfect binary tree with 4 levels; all nodes on each level are linked left to right.'],
    ['root = [0,1,2]', '[0,1,2]', 'Level 1: 1→2. Root\'s next is null. All next pointers are populated correctly.'],
  ],
  redundantConnection: [
    ['edges = [[1,2],[1,3],[2,3]]', '[2,3]', 'Adding edge [2,3] creates a cycle (1-2-3-1). It is the last edge forming the cycle, so it is returned.'],
    ['edges = [[1,2],[2,3],[3,4],[1,4],[1,5]]', '[1,4]', 'Edge [1,4] closes the cycle 1-2-3-4-1. Removing it restores a tree.'],
    ['edges = [[1,2],[2,3],[3,1]]', '[3,1]', 'Edge [3,1] closes the cycle 1-2-3-1. It is the last added redundant edge.'],
    ['edges = [[1,4],[3,4],[1,3],[1,2],[4,5]]', '[1,3]', 'Edge [1,3] creates a cycle among nodes 1,3,4. It is the redundant edge to remove.'],
    ['edges = [[1,5],[3,4],[3,5],[4,5],[2,4]]', '[4,5]', 'Edge [4,5] closes a cycle among 3,4,5. It is the last added edge forming the cycle.'],
    ['edges = [[9,10],[5,8],[2,6],[1,5],[3,8],[4,9],[8,10],[4,10],[6,8],[7,9]]', '[4,10]', 'Edge [4,10] creates a cycle in the graph. It is the redundant edge to be removed.'],
  ],
  pathSumIII: [
    ['root = [10,5,-3,3,2,null,11,3,-2,null,1], targetSum = 8', '3', 'Three paths sum to 8: [5,3], [5,2,1], and [-3,11].'],
    ['root = [5,4,8,11,null,13,4,7,2,null,null,5,1], targetSum = 22', '3', 'Three paths sum to 22: [5,4,11,2], [5,8,4,5], and [4,11,7].'],
    ['root = []', '0', 'Empty tree has no paths; the count is 0.'],
    ['root = [1]', '1', 'Wait — targetSum is not given; assuming targetSum=1. The single path [1] equals 1, so count is 1.'],
    ['root = [1,-2,-3,1,3,-2,null,-1], targetSum = -1', '4', 'Four paths in the tree sum to -1, found by checking all downward paths using prefix sums.'],
    ['root = [0,1,1], targetSum = 1', '4', 'Four paths sum to 1: [1] (left), [1] (right), [0,1] (left), [0,1] (right).'],
  ],
};

for (const [functionName, cases] of Object.entries(GENERIC_BY_FUNCTION)) {
  const hidden = cases.map(([input, output]) => ({ input, output }));
  Object.defineProperty(hidden, 'functionName', { value: functionName });
}

function genericCasesFor(question) {
  const rows = GENERIC_BY_FUNCTION[question?.functionName] || [];
  return rows.map(([input, output, explanation]) => ({ input, output, explanation }));
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