export type AptitudeFormat = 'mcq' | 'number' | 'pattern' | 'sequence' | 'oddone' | 'cipher';
export type AptitudeCategory = 'quant' | 'logic' | 'verbal' | 'data';

export type AptitudeQuestion = {
  id: string;
  category: AptitudeCategory;
  format: AptitudeFormat;
  prompt: string;
  options?: string[];
  answer: string;
  explanation: string;
  hints: [string, string];
  digit: number;
};

export const APTITUDE_QUESTIONS: AptitudeQuestion[] = [
  // Question 1: Quant - Number
  {
    id: 'train',
    category: 'quant',
    format: 'number',
    prompt: 'A 150 m train passes a pole in 15 s. Speed in km/h?',
    answer: '36',
    explanation: '150 ÷ 15 = 10 m/s; multiply by 3.6 to get km/h.',
    hints: ['Find metres per second first.', '10 m/s × 3.6.'],
    digit: 7,
  },
  // Question 2: Quant - Number
  {
    id: 'workers',
    category: 'quant',
    format: 'number',
    prompt: '12 workers finish a job in 10 days. How many days for 8 workers?',
    answer: '15',
    explanation: 'Work is fixed: 12 × 10 = 8 × days; 120 ÷ 8 = 15.',
    hints: ['Workers × days stays constant.', '120 ÷ 8.'],
    digit: 3,
  },
  // Question 3: Logic - MCQ
  {
    id: 'sequence',
    category: 'logic',
    format: 'mcq',
    prompt: 'Complete: 2, 6, 12, 20, 30, ?',
    options: ['36', '40', '42', '48'],
    answer: '42',
    explanation: 'Add consecutive even numbers: +4, +6, +8, +10, +12.',
    hints: ['Look at the gaps.', 'The next gap is 12.'],
    digit: 1,
  },
  // Question 4: Logic - MCQ
  {
    id: 'syllogism',
    category: 'logic',
    format: 'mcq',
    prompt: 'All bloops are razzies. All razzies are lazzies. Are all bloops lazzies?',
    options: ['Yes', 'No', 'Only some', 'Cannot say'],
    answer: 'Yes',
    explanation: 'Transitive property: bloops are subset of razzies, razzies subset of lazzies.',
    hints: ['Draw containment circles.', 'Bloops sit inside razzies inside lazzies.'],
    digit: 9,
  },
  // Question 5: Verbal - Odd One Out
  {
    id: 'language',
    category: 'verbal',
    format: 'oddone',
    prompt: 'Choose the odd one out.',
    options: ['Python', 'Java', 'Cobra', 'Ruby'],
    answer: 'Cobra',
    explanation: 'Python, Java, and Ruby are mainstream programming languages; Cobra is not.',
    hints: ['Think programming languages.', 'Cobra is an animal, not a commonly used language.'],
    digit: 4,
  },
  // Question 6: Verbal - Cipher
  {
    id: 'cipher',
    category: 'verbal',
    format: 'cipher',
    prompt: 'Caesar shift 3: decode “HVFDSH”.',
    answer: 'ESCAPE',
    explanation: 'Shift every character backward by 3: H->E, V->S, F->C, D->A, S->P, H->E.',
    hints: ['Undo the shift by 3 positions.', 'H becomes E.'],
    digit: 6,
  },
  // Question 7: Data - MCQ
  {
    id: 'growth',
    category: 'data',
    format: 'mcq',
    prompt: 'Growth rates: Q1 12%, Q2 18%, Q3 15%, Q4 11%. Which quarter leads?',
    options: ['Q1', 'Q2', 'Q3', 'Q4'],
    answer: 'Q2',
    explanation: '18% is the largest growth rate.',
    hints: ['Compare the quarterly percentages.', '18 is the maximum.'],
    digit: 8,
  },
  // Question 8: Quant - Number
  {
    id: 'ratio',
    category: 'quant',
    format: 'number',
    prompt: 'A ratio is 3:5 and the total is 64. What is the smaller share?',
    answer: '24',
    explanation: '8 total parts = 64; 1 part = 8; smaller share = 3 × 8 = 24.',
    hints: ['Add the ratio parts (3 + 5 = 8).', '3 × 8.'],
    digit: 2,
  },
  // Question 9: Logic - Pattern
  {
    id: 'pattern-matrix',
    category: 'logic',
    format: 'pattern',
    prompt: 'Matrix Pattern: Row 1 [▲, ▲▲, ▲▲▲], Row 2 [●, ●●, ●●●], Row 3 [■, ■■, ?]. What completes it?',
    options: ['■■■', '■', '●●●', '▲▲▲'],
    answer: '■■■',
    explanation: 'Each row adds one more symbol of the same kind; row 3 has squares.',
    hints: ['Follow the increment rule per row.', 'Row 3 features squares.'],
    digit: 5,
  },
  // Question 10: Logic - Sequence
  {
    id: 'sequence-drag',
    category: 'logic',
    format: 'sequence',
    prompt: 'Identify the next value in the Fibonacci progression: 1, 1, 2, 3, 5, 8, ?',
    options: ['11', '12', '13', '15'],
    answer: '13',
    explanation: 'Each term is the sum of the two preceding ones: 5 + 8 = 13.',
    hints: ['Add the last two numbers together.', '5 + 8.'],
    digit: 3,
  },
  // Question 11: Verbal - Odd One Out
  {
    id: 'anagram',
    category: 'verbal',
    format: 'oddone',
    prompt: 'Choose the word that cannot be rearranged into a valid programming term.',
    options: ['GOL', 'EDOC', 'BATEY', 'NODE'],
    answer: 'GOL',
    explanation: 'EDOC=CODE, BATEY=BYTE, NODE=NODE; GOL has no valid technical term.',
    hints: ['Try reordering letters.', 'EDOC is CODE, BATEY is BYTE.'],
    digit: 0,
  },
  // Question 12: Quant - Number
  {
    id: 'average',
    category: 'quant',
    format: 'number',
    prompt: 'The average of 8, 12, and 16 is?',
    answer: '12',
    explanation: '(8 + 12 + 16) ÷ 3 = 36 ÷ 3 = 12.',
    hints: ['Add all 3 values, then divide by 3.', '36 ÷ 3.'],
    digit: 1,
  },
  // Question 13: Logic - MCQ
  {
    id: 'logicdoor',
    category: 'logic',
    format: 'mcq',
    prompt: 'If every secured door needs a key and Door A is secured, what follows?',
    options: ['Door A needs a key', 'Door A is unlocked', 'All keys fit Door A', 'No conclusion'],
    answer: 'Door A needs a key',
    explanation: 'Direct modus ponens: Door A is secured, therefore it needs a key.',
    hints: ['Apply the rule directly.', 'Secured implies key needed.'],
    digit: 7,
  },
  // Question 14: Verbal - Odd One Out
  {
    id: 'vocab',
    category: 'verbal',
    format: 'oddone',
    prompt: 'Choose the odd one out among software development actions.',
    options: ['Compile', 'Debug', 'Deploy', 'Dormant'],
    answer: 'Dormant',
    explanation: 'Compile, Debug, and Deploy are active lifecycle verbs; Dormant is a state/adjective.',
    hints: ['Think software engineering workflow.', 'One word is an adjective, not an action.'],
    digit: 3,
  },
  // Question 15: Data - MCQ
  {
    id: 'chart',
    category: 'data',
    format: 'mcq',
    prompt: 'Bugs resolved: Mon 9, Tue 14, Wed 11, Thu 13. Which day had the peak resolution?',
    options: ['Mon', 'Tue', 'Wed', 'Thu'],
    answer: 'Tue',
    explanation: 'Tuesday had 14 bugs resolved, the highest in the dataset.',
    hints: ['Locate the highest count.', '14 on Tuesday.'],
    digit: 9,
  },
  // Question 16: Quant - Number
  {
    id: 'percent',
    category: 'quant',
    format: 'number',
    prompt: 'What is 25% of 240?',
    answer: '60',
    explanation: '240 ÷ 4 = 60.',
    hints: ['25% is one-fourth.', '240 divided by 4.'],
    digit: 6,
  },
  // Question 17: Verbal - Cipher
  {
    id: 'cipher-rot1',
    category: 'verbal',
    format: 'cipher',
    prompt: 'Decode Caesar shift 1: “TFSWFS”.',
    answer: 'SERVER',
    explanation: 'Shift backwards by 1: T->S, F->E, S->R, W->V, F->E, S->R.',
    hints: ['Shift each letter one step back in the alphabet.', 'T becomes S.'],
    digit: 2,
  },
  // Question 18: Data - MCQ
  {
    id: 'latency-data',
    category: 'data',
    format: 'mcq',
    prompt: 'Server latencies: Node A 45ms, Node B 120ms, Node C 30ms. Which node responds fastest?',
    options: ['Node A', 'Node B', 'Node C', 'Equal'],
    answer: 'Node C',
    explanation: 'Lowest latency represents the fastest response time: 30ms.',
    hints: ['Lower millisecond count equals faster speed.', '30ms is the minimum.'],
    digit: 8,
  },
  // Question 19: Logic - Pattern
  {
    id: 'pattern-binary',
    category: 'logic',
    format: 'pattern',
    prompt: 'Symbol sequence: [001, 010, 011, 100, ?]. What is the next 3-bit binary term?',
    options: ['101', '110', '111', '000'],
    answer: '101',
    explanation: 'Counting in binary: 1, 2, 3, 4, 5 (which is 101).',
    hints: ['Look at binary increments.', '5 in binary is 101.'],
    digit: 5,
  },
  // Question 20: Quant - Number
  {
    id: 'clock-math',
    category: 'quant',
    format: 'number',
    prompt: 'At 3:00, what is the angle in degrees between the hour and minute hands?',
    answer: '90',
    explanation: 'The hour hand is at 3 and minute hand is at 12; each hour is 30°, 3 × 30° = 90°.',
    hints: ['Each hour mark represents 30 degrees.', '3 × 30.'],
    digit: 4,
  },
];
