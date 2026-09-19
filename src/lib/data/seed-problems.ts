import { Problem, TestCase } from '@/types';

export const SEED_PROBLEMS: Problem[] = [
  {
    id: 'find-largest-element',
    title: 'Find the Largest Element',
    difficulty: 'easy',
    topic: 'Arrays',
    tags: ['arrays', 'iteration', 'comparison'],
    description: `Given a list of integers, write a function that returns the largest element in the list.

The list will contain at least one element. All elements are integers (positive, negative, or zero).`,
    examples: [
      { input: '[4, 2, 9, 7, 1]', output: '9', explanation: '9 is the largest element in the list.' },
      { input: '[-3, -1, -7, -2]', output: '-1', explanation: '-1 is the largest among all negative numbers.' },
      { input: '[42]', output: '42', explanation: 'Single element list returns that element.' },
    ],
    constraints: ['1 <= len(nums) <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    starterCode: {
      python: `def find_largest(nums: list[int]) -> int:
    # Write your solution here
    pass`,
    },
    supportedLanguages: ['python'],
    concepts: ['arrays', 'iteration', 'comparison'],
    hints: [
      'Think about tracking something as you go through the list.',
      'What if you kept track of the biggest number you\'ve seen so far?',
      'Initialize a variable with the first element, then compare each element against it.',
    ],
  },
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'medium',
    topic: 'Hashing',
    tags: ['arrays', 'hashing', 'dictionary'],
    description: `Given a list of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to the target.

You may assume that each input has exactly one solution, and you may not use the same element twice.

Return the indices in any order.`,
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
      { input: 'nums = [3, 3], target = 6', output: '[0, 1]', explanation: 'nums[0] + nums[1] = 3 + 3 = 6' },
    ],
    constraints: ['2 <= len(nums) <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Exactly one valid answer exists.'],
    starterCode: {
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Write your solution here
    pass`,
    },
    supportedLanguages: ['python'],
    concepts: ['hashing', 'dictionary', 'complement'],
    hints: [
      'For each number, what other number would you need to reach the target?',
      'Can you use a dictionary to remember numbers you\'ve already seen?',
      'Store each number\'s index in a dictionary. For each new number, check if (target - number) exists in the dictionary.',
    ],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'medium',
    topic: 'Stack',
    tags: ['stack', 'strings', 'matching'],
    description: `Given a string \`s\` containing just the characters \`'('\`, \`')'\`, \`'{'\`, \`'}'\`, \`'['\` and \`']'\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets are closed by the same type of brackets.
2. Open brackets are closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      { input: 's = "()"', output: 'True' },
      { input: 's = "()[]{}"', output: 'True' },
      { input: 's = "(]"', output: 'False' },
      { input: 's = "([)]"', output: 'False' },
      { input: 's = "{[]}"', output: 'True' },
    ],
    constraints: ['1 <= len(s) <= 10^4', 's consists of parentheses only: \'()[]{}\'.'],
    starterCode: {
      python: `def is_valid(s: str) -> bool:
    # Write your solution here
    pass`,
    },
    supportedLanguages: ['python'],
    concepts: ['stack', 'matching', 'LIFO'],
    hints: [
      'What data structure processes things in a "last in, first out" order?',
      'Use a stack. Push opening brackets, and when you see a closing bracket, check the top of the stack.',
      'If the stack is empty when you see a closing bracket, or the top doesn\'t match, it\'s invalid.',
    ],
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    difficulty: 'easy',
    topic: 'Strings',
    tags: ['strings', 'two-pointers'],
    description: `Write a function that reverses a string. The input string is given as a list of characters \`s\`.

You must do this by modifying the input list in-place with O(1) extra memory. Return the reversed list.`,
    examples: [
      { input: '["h","e","l","l","o"]', output: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' },
    ],
    constraints: ['1 <= len(s) <= 10^5', 's[i] is a printable ascii character.'],
    starterCode: {
      python: `def reverse_string(s: list[str]) -> list[str]:
    # Write your solution here
    # Modify s in-place and return it
    pass`,
    },
    supportedLanguages: ['python'],
    concepts: ['two-pointers', 'in-place', 'strings'],
    hints: [
      'Can you swap characters from both ends moving inward?',
      'Use two pointers: one at the start, one at the end. Swap and move them toward the center.',
      'left = 0, right = len(s) - 1. While left < right: swap s[left] and s[right].',
    ],
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'easy',
    topic: 'Binary Search',
    tags: ['binary-search', 'arrays', 'divide-and-conquer'],
    description: `Given a sorted array of integers \`nums\` and an integer \`target\`, write a function that searches for \`target\` in \`nums\`. If \`target\` exists, return its index. Otherwise, return \`-1\`.

You must write an algorithm with O(log n) runtime complexity.`,
    examples: [
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2', output: '-1', explanation: '2 does not exist in nums.' },
    ],
    constraints: ['1 <= len(nums) <= 10^4', '-10^4 < nums[i], target < 10^4', 'All integers in nums are unique.', 'nums is sorted in ascending order.'],
    starterCode: {
      python: `def binary_search(nums: list[int], target: int) -> int:
    # Write your solution here
    pass`,
    },
    supportedLanguages: ['python'],
    concepts: ['binary-search', 'divide-and-conquer', 'logarithmic-time'],
    hints: [
      'Since the array is sorted, do you need to check every element?',
      'What if you checked the middle element and eliminated half the array each time?',
      'Use two pointers (left, right). Check mid = (left + right) // 2. If nums[mid] == target, return mid. If less, search right half. If more, search left half.',
    ],
  },
  {
    id: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'medium',
    topic: 'Arrays',
    tags: ['arrays', 'dynamic-programming', 'kadane'],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      { input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', output: '6', explanation: 'The subarray [4, -1, 2, 1] has the largest sum = 6.' },
      { input: '[1]', output: '1', explanation: 'Single element.' },
      { input: '[5, 4, -1, 7, 8]', output: '23', explanation: 'The entire array is the subarray with the largest sum.' },
    ],
    constraints: ['1 <= len(nums) <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    starterCode: {
      python: `def max_subarray(nums: list[int]) -> int:
    # Write your solution here
    pass`,
    },
    supportedLanguages: ['python'],
    concepts: ['dynamic-programming', 'kadane-algorithm', 'subarray'],
    hints: [
      'At each position, you have a choice: extend the current subarray or start a new one.',
      'Track the current sum and the maximum sum seen so far.',
      'Kadane\'s algorithm: current_sum = max(nums[i], current_sum + nums[i]). Update max_sum if current_sum is larger.',
    ],
  },
  {
    id: 'longest-substring-no-repeat',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium',
    topic: 'Sliding Window',
    tags: ['sliding-window', 'hashing', 'strings'],
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with length 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with length 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with length 3.' },
    ],
    constraints: ['0 <= len(s) <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    starterCode: {
      python: `def length_of_longest_substring(s: str) -> int:
    # Write your solution here
    pass`,
    },
    supportedLanguages: ['python'],
    concepts: ['sliding-window', 'set', 'two-pointers'],
    hints: [
      'Can you use a window that expands and shrinks as you scan the string?',
      'Use a set to track characters in the current window. When you find a duplicate, shrink from the left.',
      'Maintain a left pointer. For each right pointer, while s[right] is in the set, remove s[left] and move left forward.',
    ],
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'medium',
    topic: 'Linked List',
    tags: ['linked-list', 'pointers', 'iteration'],
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.

For this problem, a linked list node is defined as:
\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next
\`\`\`

Your function receives and returns a list representation for simplicity: input [1,2,3,4,5] means 1->2->3->4->5, and should return [5,4,3,2,1].`,
    examples: [
      { input: '[1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' },
      { input: '[1, 2]', output: '[2, 1]' },
      { input: '[1]', output: '[1]' },
    ],
    constraints: ['0 <= number of nodes <= 5000', '-5000 <= Node.val <= 5000'],
    starterCode: {
      python: `def reverse_list(nums: list[int]) -> list[int]:
    # Simulate reversing a linked list using a list
    # Write your solution here
    pass`,
    },
    supportedLanguages: ['python'],
    concepts: ['linked-list', 'pointer-manipulation', 'iteration'],
    hints: [
      'Think about changing the direction each pointer points.',
      'You need three pointers: previous, current, and next.',
      'For each node: save next, point current to previous, move previous to current, move current to saved next.',
    ],
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'easy',
    topic: 'Two Pointers',
    tags: ['two-pointers', 'strings'],
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.

Given a string \`s\`, return \`True\` if it is a palindrome, or \`False\` otherwise.`,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'True', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'False', explanation: '"raceacar" is not a palindrome.' },
      { input: 's = " "', output: 'True', explanation: 'After removing non-alphanumeric characters, s is an empty string "".' },
    ],
    constraints: ['1 <= len(s) <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    starterCode: {
      python: `def is_palindrome(s: str) -> bool:
    # Write your solution here
    pass`,
    },
    supportedLanguages: ['python'],
    concepts: ['two-pointers', 'string-manipulation', 'palindrome'],
    hints: [
      'First, think about what characters to compare. Should you compare spaces and punctuation?',
      'Clean the string first (lowercase, alphanumeric only), then compare from both ends.',
      'Use two pointers from each end, skipping non-alphanumeric characters, comparing lowercase versions.',
    ],
  },
  {
    id: 'fibonacci',
    title: 'Fibonacci Number',
    difficulty: 'easy',
    topic: 'Recursion',
    tags: ['recursion', 'dynamic-programming', 'math'],
    description: `The Fibonacci numbers, commonly denoted F(n), form a sequence such that each number is the sum of the two preceding ones, starting from 0 and 1.

F(0) = 0, F(1) = 1
F(n) = F(n - 1) + F(n - 2), for n > 1

Given \`n\`, calculate \`F(n)\`.`,
    examples: [
      { input: 'n = 2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.' },
      { input: 'n = 3', output: '2', explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.' },
      { input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.' },
    ],
    constraints: ['0 <= n <= 30'],
    starterCode: {
      python: `def fibonacci(n: int) -> int:
    # Write your solution here
    pass`,
    },
    supportedLanguages: ['python'],
    concepts: ['recursion', 'base-case', 'memoization'],
    hints: [
      'What are the base cases? When does the recursion stop?',
      'F(0) = 0 and F(1) = 1 are your base cases. For anything else, use F(n-1) + F(n-2).',
      'Simple recursion works for small n. For efficiency, consider iterating or memoizing.',
    ],
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'easy',
    topic: 'Recursion',
    tags: ['recursion', 'dynamic-programming'],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: '1. 1 step + 1 step. 2. 2 steps.' },
      { input: 'n = 3', output: '3', explanation: '1. 1+1+1. 2. 1+2. 3. 2+1.' },
      { input: 'n = 1', output: '1' },
    ],
    constraints: ['1 <= n <= 45'],
    starterCode: {
      python: `def climb_stairs(n: int) -> int:
    # Write your solution here
    pass`,
    },
    supportedLanguages: ['python'],
    concepts: ['recursion', 'dynamic-programming', 'fibonacci-pattern'],
    hints: [
      'To reach step n, you could have come from step n-1 or step n-2.',
      'This means ways(n) = ways(n-1) + ways(n-2). Does this pattern look familiar?',
      'It\'s the Fibonacci sequence! Use iteration to avoid exponential recursion.',
    ],
  },
  {
    id: 'merge-sorted-array',
    title: 'Merge Sorted Array',
    difficulty: 'easy',
    topic: 'Two Pointers',
    tags: ['arrays', 'two-pointers', 'sorting'],
    description: `You are given two integer arrays \`nums1\` and \`nums2\`, sorted in non-decreasing order. Merge \`nums2\` into \`nums1\` as one sorted array and return the result.

The final sorted array should be returned (not stored inside one of the input arrays).`,
    examples: [
      { input: 'nums1 = [1, 2, 3], nums2 = [2, 5, 6]', output: '[1, 2, 2, 3, 5, 6]' },
      { input: 'nums1 = [1], nums2 = []', output: '[1]' },
      { input: 'nums1 = [], nums2 = [1]', output: '[1]' },
    ],
    constraints: ['0 <= len(nums1), len(nums2) <= 200', '-10^9 <= nums1[i], nums2[j] <= 10^9', 'nums1 and nums2 are sorted in non-decreasing order.'],
    starterCode: {
      python: `def merge_sorted(nums1: list[int], nums2: list[int]) -> list[int]:
    # Write your solution here
    pass`,
    },
    supportedLanguages: ['python'],
    concepts: ['two-pointers', 'merging', 'sorted-arrays'],
    hints: [
      'Since both arrays are sorted, can you compare elements from the front of each?',
      'Use two pointers, one for each array. Always pick the smaller element.',
      'Compare nums1[i] and nums2[j]. Append the smaller one to the result. Advance that pointer. Handle remaining elements.',
    ],
  },
];

export const SEED_TEST_CASES: Record<string, TestCase[]> = {
  'find-largest-element': [
    { id: 't1', problemId: 'find-largest-element', input: '[4, 2, 9, 7, 1]', expectedOutput: '9', isHidden: false, description: 'Basic test' },
    { id: 't2', problemId: 'find-largest-element', input: '[-3, -1, -7, -2]', expectedOutput: '-1', isHidden: false, description: 'All negative' },
    { id: 't3', problemId: 'find-largest-element', input: '[42]', expectedOutput: '42', isHidden: false, description: 'Single element' },
    { id: 't4', problemId: 'find-largest-element', input: '[1, 1, 1, 1]', expectedOutput: '1', isHidden: true, description: 'All same' },
    { id: 't5', problemId: 'find-largest-element', input: '[0, -1, 100, 99, -100]', expectedOutput: '100', isHidden: true, description: 'Mixed values' },
  ],
  'two-sum': [
    { id: 't1', problemId: 'two-sum', input: '[2, 7, 11, 15]\n9', expectedOutput: '[0, 1]', isHidden: false, description: 'Basic test' },
    { id: 't2', problemId: 'two-sum', input: '[3, 2, 4]\n6', expectedOutput: '[1, 2]', isHidden: false, description: 'Non-adjacent pair' },
    { id: 't3', problemId: 'two-sum', input: '[3, 3]\n6', expectedOutput: '[0, 1]', isHidden: false, description: 'Duplicate values' },
    { id: 't4', problemId: 'two-sum', input: '[1, 5, 3, 7, 2]\n9', expectedOutput: '[1, 3]', isHidden: true, description: 'Middle pair' },
    { id: 't5', problemId: 'two-sum', input: '[-1, -2, -3, -4, -5]\n-8', expectedOutput: '[2, 4]', isHidden: true, description: 'Negative numbers' },
  ],
  'valid-parentheses': [
    { id: 't1', problemId: 'valid-parentheses', input: '"()"', expectedOutput: 'True', isHidden: false },
    { id: 't2', problemId: 'valid-parentheses', input: '"()[]{}"', expectedOutput: 'True', isHidden: false },
    { id: 't3', problemId: 'valid-parentheses', input: '"(]"', expectedOutput: 'False', isHidden: false },
    { id: 't4', problemId: 'valid-parentheses', input: '"([)]"', expectedOutput: 'False', isHidden: true },
    { id: 't5', problemId: 'valid-parentheses', input: '"{[]}"', expectedOutput: 'True', isHidden: true },
    { id: 't6', problemId: 'valid-parentheses', input: '"("', expectedOutput: 'False', isHidden: true },
  ],
  'reverse-string': [
    { id: 't1', problemId: 'reverse-string', input: '["h","e","l","l","o"]', expectedOutput: "['o', 'l', 'l', 'e', 'h']", isHidden: false },
    { id: 't2', problemId: 'reverse-string', input: '["H","a","n","n","a","h"]', expectedOutput: "['h', 'a', 'n', 'n', 'a', 'H']", isHidden: false },
    { id: 't3', problemId: 'reverse-string', input: '["a"]', expectedOutput: "['a']", isHidden: true },
    { id: 't4', problemId: 'reverse-string', input: '["a","b"]', expectedOutput: "['b', 'a']", isHidden: true },
  ],
  'binary-search': [
    { id: 't1', problemId: 'binary-search', input: '[-1, 0, 3, 5, 9, 12]\n9', expectedOutput: '4', isHidden: false },
    { id: 't2', problemId: 'binary-search', input: '[-1, 0, 3, 5, 9, 12]\n2', expectedOutput: '-1', isHidden: false },
    { id: 't3', problemId: 'binary-search', input: '[5]\n5', expectedOutput: '0', isHidden: true },
    { id: 't4', problemId: 'binary-search', input: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n10', expectedOutput: '9', isHidden: true },
    { id: 't5', problemId: 'binary-search', input: '[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n1', expectedOutput: '0', isHidden: true },
  ],
  'maximum-subarray': [
    { id: 't1', problemId: 'maximum-subarray', input: '[-2, 1, -3, 4, -1, 2, 1, -5, 4]', expectedOutput: '6', isHidden: false },
    { id: 't2', problemId: 'maximum-subarray', input: '[1]', expectedOutput: '1', isHidden: false },
    { id: 't3', problemId: 'maximum-subarray', input: '[5, 4, -1, 7, 8]', expectedOutput: '23', isHidden: false },
    { id: 't4', problemId: 'maximum-subarray', input: '[-1]', expectedOutput: '-1', isHidden: true },
    { id: 't5', problemId: 'maximum-subarray', input: '[-2, -1]', expectedOutput: '-1', isHidden: true },
  ],
  'longest-substring-no-repeat': [
    { id: 't1', problemId: 'longest-substring-no-repeat', input: '"abcabcbb"', expectedOutput: '3', isHidden: false },
    { id: 't2', problemId: 'longest-substring-no-repeat', input: '"bbbbb"', expectedOutput: '1', isHidden: false },
    { id: 't3', problemId: 'longest-substring-no-repeat', input: '"pwwkew"', expectedOutput: '3', isHidden: false },
    { id: 't4', problemId: 'longest-substring-no-repeat', input: '""', expectedOutput: '0', isHidden: true },
    { id: 't5', problemId: 'longest-substring-no-repeat', input: '"abcdef"', expectedOutput: '6', isHidden: true },
  ],
  'reverse-linked-list': [
    { id: 't1', problemId: 'reverse-linked-list', input: '[1, 2, 3, 4, 5]', expectedOutput: '[5, 4, 3, 2, 1]', isHidden: false },
    { id: 't2', problemId: 'reverse-linked-list', input: '[1, 2]', expectedOutput: '[2, 1]', isHidden: false },
    { id: 't3', problemId: 'reverse-linked-list', input: '[1]', expectedOutput: '[1]', isHidden: true },
    { id: 't4', problemId: 'reverse-linked-list', input: '[]', expectedOutput: '[]', isHidden: true },
  ],
  'valid-palindrome': [
    { id: 't1', problemId: 'valid-palindrome', input: '"A man, a plan, a canal: Panama"', expectedOutput: 'True', isHidden: false },
    { id: 't2', problemId: 'valid-palindrome', input: '"race a car"', expectedOutput: 'False', isHidden: false },
    { id: 't3', problemId: 'valid-palindrome', input: '" "', expectedOutput: 'True', isHidden: false },
    { id: 't4', problemId: 'valid-palindrome', input: '"0P"', expectedOutput: 'False', isHidden: true },
    { id: 't5', problemId: 'valid-palindrome', input: '"aa"', expectedOutput: 'True', isHidden: true },
  ],
  'fibonacci': [
    { id: 't1', problemId: 'fibonacci', input: '2', expectedOutput: '1', isHidden: false },
    { id: 't2', problemId: 'fibonacci', input: '3', expectedOutput: '2', isHidden: false },
    { id: 't3', problemId: 'fibonacci', input: '4', expectedOutput: '3', isHidden: false },
    { id: 't4', problemId: 'fibonacci', input: '0', expectedOutput: '0', isHidden: true },
    { id: 't5', problemId: 'fibonacci', input: '10', expectedOutput: '55', isHidden: true },
    { id: 't6', problemId: 'fibonacci', input: '20', expectedOutput: '6765', isHidden: true },
  ],
  'climbing-stairs': [
    { id: 't1', problemId: 'climbing-stairs', input: '2', expectedOutput: '2', isHidden: false },
    { id: 't2', problemId: 'climbing-stairs', input: '3', expectedOutput: '3', isHidden: false },
    { id: 't3', problemId: 'climbing-stairs', input: '1', expectedOutput: '1', isHidden: false },
    { id: 't4', problemId: 'climbing-stairs', input: '5', expectedOutput: '8', isHidden: true },
    { id: 't5', problemId: 'climbing-stairs', input: '10', expectedOutput: '89', isHidden: true },
  ],
  'merge-sorted-array': [
    { id: 't1', problemId: 'merge-sorted-array', input: '[1, 2, 3]\n[2, 5, 6]', expectedOutput: '[1, 2, 2, 3, 5, 6]', isHidden: false },
    { id: 't2', problemId: 'merge-sorted-array', input: '[1]\n[]', expectedOutput: '[1]', isHidden: false },
    { id: 't3', problemId: 'merge-sorted-array', input: '[]\n[1]', expectedOutput: '[1]', isHidden: false },
    { id: 't4', problemId: 'merge-sorted-array', input: '[1, 3, 5]\n[2, 4, 6]', expectedOutput: '[1, 2, 3, 4, 5, 6]', isHidden: true },
  ],
};

export function getProblemById(id: string): Problem | undefined {
  return SEED_PROBLEMS.find(p => p.id === id);
}

export function getTestCases(problemId: string, includeHidden: boolean = false): TestCase[] {
  const tests = SEED_TEST_CASES[problemId] || [];
  if (includeHidden) return tests;
  return tests.filter(t => !t.isHidden);
}

export function getTopics(): string[] {
  const topics = new Set(SEED_PROBLEMS.map(p => p.topic));
  return Array.from(topics).sort();
}

export function getDifficulties(): string[] {
  return ['easy', 'medium', 'hard'];
}
