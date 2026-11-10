export type CodingPuzzle = {
  id: string;
  terminal: 1 | 2 | 3;
  title: string;
  brief: string;
  starterCode: string;
  starterCodes: { js: string; py: string };
  fnName: string;
  tests: { input: unknown[]; expected: unknown; hidden?: boolean }[];
  hints: [string, string];
  letter: string;
};

export const CODING_PUZZLE_BANK: CodingPuzzle[] = [
  // --- TERMINAL 1: FIX THE BUG (3 VARIANTS) ---
  {
    id: 'sum-bug',
    terminal: 1,
    title: 'Fix the Bug: Off-by-One',
    brief: 'Repair the array-sum loop before the rack overloads.',
    starterCode: 'function sumArray(arr) {\n  let total = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}',
    starterCodes: {
      js: 'function sumArray(arr) {\n  let total = 0;\n  for (let i = 0; i <= arr.length; i++) {\n    total += arr[i];\n  }\n  return total;\n}',
      py: 'def sum_array(arr):\n    total = 0\n    for i in range(len(arr) + 1):\n        total += arr[i]\n    return total',
    },
    fnName: 'sumArray',
    tests: [
      { input: [[1, 2, 3]], expected: 6 },
      { input: [[5, -2, 9]], expected: 12 },
      { input: [[]], expected: 0, hidden: true },
    ],
    hints: ['Check the last valid array index.', 'Use i < arr.length, not <=.'],
    letter: 'C',
  },
  {
    id: 'max-bug',
    terminal: 1,
    title: 'Fix the Bug: Negative Numbers',
    brief: 'The max finder crashes when all inputs are negative numbers.',
    starterCode: 'function findMax(arr) {\n  if (!arr.length) return 0;\n  let max = 0;\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}',
    starterCodes: {
      js: 'function findMax(arr) {\n  if (!arr.length) return 0;\n  let max = 0;\n  for (let i = 0; i < arr.length; i++) {\n    if (arr[i] > max) max = arr[i];\n  }\n  return max;\n}',
      py: 'def find_max(arr):\n    if not arr:\n        return 0\n    m = 0\n    for x in arr:\n        if x > m:\n            m = x\n    return m',
    },
    fnName: 'findMax',
    tests: [
      { input: [[1, 5, 3]], expected: 5 },
      { input: [[-10, -5, -20]], expected: -5 },
      { input: [[-100]], expected: -100, hidden: true },
    ],
    hints: ['Initializing max to 0 fails when all values are negative.', 'Initialize max = arr[0].'],
    letter: 'C',
  },
  {
    id: 'palindrome-bug',
    terminal: 1,
    title: 'Fix the Bug: Case Sensitivity',
    brief: 'The palindrome check is failing on mixed casing and spaces.',
    starterCode: 'function isPalindrome(str) {\n  const clean = str.replace(/[^a-zA-Z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}',
    starterCodes: {
      js: 'function isPalindrome(str) {\n  const clean = str.replace(/[^a-zA-Z0-9]/g, "");\n  return clean === clean.split("").reverse().join("");\n}',
      py: 'def is_palindrome(s):\n    import re\n    clean = re.sub(r"[^a-zA-Z0-9]", "", s)\n    return clean == clean[::-1]',
    },
    fnName: 'isPalindrome',
    tests: [
      { input: ['Racecar'], expected: true },
      { input: ['hello'], expected: false },
      { input: ['A man a plan a canal Panama'], expected: true, hidden: true },
    ],
    hints: ['Case sensitivity breaks equality.', 'Convert clean string to lower case.'],
    letter: 'C',
  },

  // --- TERMINAL 2: FILL THE CORE (3 VARIANTS) ---
  {
    id: 'factorial',
    terminal: 2,
    title: 'Fill the Core: Factorial',
    brief: 'Write the missing factorial function. Handle zero safely.',
    starterCode: 'function factorial(n) {\n  // Write your solution here\n}',
    starterCodes: {
      js: 'function factorial(n) {\n  // Write your solution here\n}',
      py: 'def factorial(n):\n    # Write your solution here\n    pass',
    },
    fnName: 'factorial',
    tests: [
      { input: [0], expected: 1 },
      { input: [5], expected: 120 },
      { input: [10], expected: 3628800 },
      { input: [12], expected: 479001600, hidden: true },
    ],
    hints: ['Zero factorial equals 1.', 'Start with result = 1 and multiply from 2 to n.'],
    letter: 'O',
  },
  {
    id: 'count-vowels',
    terminal: 2,
    title: 'Fill the Core: Count Vowels',
    brief: 'Count the number of vowels (a, e, i, o, u) regardless of case.',
    starterCode: 'function countVowels(str) {\n  // Write your solution here\n}',
    starterCodes: {
      js: 'function countVowels(str) {\n  // Write your solution here\n}',
      py: 'def count_vowels(s):\n    # Write your solution here\n    pass',
    },
    fnName: 'countVowels',
    tests: [
      { input: ['hello'], expected: 2 },
      { input: ['PLACEMENT'], expected: 3 },
      { input: ['xyz'], expected: 0 },
      { input: ['AeIoU and sometimes Y'], expected: 8, hidden: true },
    ],
    hints: ['Check vowels in lowercase.', 'Use a set or regex like /[aeiou]/gi.'],
    letter: 'O',
  },
  {
    id: 'fizzbuzz',
    terminal: 2,
    title: 'Fill the Core: FizzBuzz Tokenizer',
    brief: 'Return "Fizz" for multiples of 3, "Buzz" for 5, "FizzBuzz" for both, or the number as a string.',
    starterCode: 'function fizzBuzz(n) {\n  // Write your solution here\n}',
    starterCodes: {
      js: 'function fizzBuzz(n) {\n  // Write your solution here\n}',
      py: 'def fizz_buzz(n):\n    # Write your solution here\n    pass',
    },
    fnName: 'fizzBuzz',
    tests: [
      { input: [3], expected: 'Fizz' },
      { input: [5], expected: 'Buzz' },
      { input: [15], expected: 'FizzBuzz' },
      { input: [7], expected: '7', hidden: true },
    ],
    hints: ['Check divisibility by 15 first.', 'Convert integers to string if not divisible.'],
    letter: 'O',
  },

  // --- TERMINAL 3: PREDICT THE LOG (3 VARIANTS) ---
  {
    id: 'predict-log',
    terminal: 3,
    title: 'Predict the Log: Loop Accumulator',
    brief: 'Write a function that returns the exact output of this loop.',
    starterCode: 'function predictLog() {\n  const values = [];\n  for (let i = 0; i < 3; i++) values.push(i);\n  return values.join(",");\n}',
    starterCodes: {
      js: 'function predictLog() {\n  const values = [];\n  for (let i = 0; i < 3; i++) values.push(i);\n  return values.join(",");\n}',
      py: 'def predict_log():\n    return ",".join(str(i) for i in range(3))',
    },
    fnName: 'predictLog',
    tests: [
      { input: [], expected: '0,1,2' },
      { input: [], expected: '0,1,2', hidden: true },
    ],
    hints: ['The loop starts at zero.', 'It runs while i is strictly less than three.'],
    letter: 'D',
  },
  {
    id: 'closure-scope',
    terminal: 3,
    title: 'Predict the Log: Scope Resolution',
    brief: 'Predict the exact return value of this mapped array operation.',
    starterCode: 'function predictScope() {\n  const nums = [1, 2, 3];\n  const doubled = nums.map(x => x * 2);\n  return doubled.join("-");\n}',
    starterCodes: {
      js: 'function predictScope() {\n  const nums = [1, 2, 3];\n  const doubled = nums.map(x => x * 2);\n  return doubled.join("-");\n}',
      py: 'def predict_scope():\n    return "-".join(str(x * 2) for x in [1, 2, 3])',
    },
    fnName: 'predictScope',
    tests: [
      { input: [], expected: '2-4-6' },
      { input: [], expected: '2-4-6', hidden: true },
    ],
    hints: ['Each number is doubled.', 'Joined with a dash character.'],
    letter: 'D',
  },
  {
    id: 'filter-reduce',
    terminal: 3,
    title: 'Predict the Log: Filter and Sum',
    brief: 'Calculate the output of filtering evens and computing their sum.',
    starterCode: 'function predictFilter() {\n  const list = [1, 2, 3, 4, 5, 6];\n  const evens = list.filter(n => n % 2 === 0);\n  return evens.reduce((a, b) => a + b, 0);\n}',
    starterCodes: {
      js: 'function predictFilter() {\n  const list = [1, 2, 3, 4, 5, 6];\n  const evens = list.filter(n => n % 2 === 0);\n  return evens.reduce((a, b) => a + b, 0);\n}',
      py: 'def predict_filter():\n    return sum(n for n in [1, 2, 3, 4, 5, 6] if n % 2 == 0)',
    },
    fnName: 'predictFilter',
    tests: [
      { input: [], expected: 12 },
      { input: [], expected: 12, hidden: true },
    ],
    hints: ['Even numbers are 2, 4, 6.', '2 + 4 + 6 = 12.'],
    letter: 'D',
  },
];

// Active 3 puzzles for the linear playthrough (1 from each terminal)
export const CODING_PUZZLES: CodingPuzzle[] = [
  CODING_PUZZLE_BANK[0], // T1: sum-bug
  CODING_PUZZLE_BANK[3], // T2: factorial
  CODING_PUZZLE_BANK[6], // T3: predict-log
];

export const OVERLOAD_WORD = 'CODE';
