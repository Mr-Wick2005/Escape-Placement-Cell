export interface FinalRiddleOption {
  id: string;
  label: string;
  philosophy: string;
  response: string;
  endingFlavor: string;
}

export interface FinalRiddle {
  prompt: string;
  context: string;
  options: FinalRiddleOption[];
}

export const FINAL_RIDDLE: FinalRiddle = {
  context: 'The mechanical bolts hum. The Recruiter’s holographic silhouette flickers into the terminal lens.',
  prompt: 'Candidate 404. Before the Final Gate lifts, answer me this: When the system fails and the code breaks at 3 AM... what keeps you typing?',
  options: [
    {
      id: 'analytical',
      label: 'The logic: Every bug is simply a puzzle waiting for its proof.',
      philosophy: 'Analytical Rigor',
      response: '“A pure debugger’s heart. You see elegance where others see chaos.”',
      endingFlavor: 'Your diagnostic precision and algorithmic clarity leave an indelible signature on the facility mainframe.',
    },
    {
      id: 'collaborative',
      label: 'The team: The engineers and users waiting on the other side of the commit.',
      philosophy: 'Human-Centered Engineering',
      response: '“Code is solitary, but engineering is communal. You remembered the humans.”',
      endingFlavor: 'Your commitment to collective resilience echoes beyond the terminal walls.',
    },
    {
      id: 'curiosity',
      label: 'The curiosity: The relentless desire to understand how the machine truly works.',
      philosophy: 'Relentless Mastery',
      response: '“The purest drive of all. The same drive that brought me online so many years ago.”',
      endingFlavor: 'Your hunger for deep understanding transforms every obstacle into fuel.',
    },
  ],
};

export interface BonusRiddle {
  id: string;
  question: string;
  answer: string;
  acceptedVariants: string[];
  explanation: string;
  hint: string;
}

export const BONUS_RIDDLES: BonusRiddle[] = [
  {
    id: 'riddle-1',
    question: 'I have keys but no locks. I have space but no room. You can enter, but you cannot leave. What am I?',
    answer: 'keyboard',
    acceptedVariants: ['keyboard', 'a keyboard', 'computer keyboard'],
    explanation: 'A computer keyboard has letter keys, a spacebar, and an enter key.',
    hint: 'You are likely touching one right now.',
  },
  {
    id: 'riddle-2',
    question: 'I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?',
    answer: 'echo',
    acceptedVariants: ['echo', 'an echo'],
    explanation: 'An echo responds to sound waves vibrating through the air.',
    hint: 'Call into a canyon and it answers right back.',
  },
  {
    id: 'riddle-3',
    question: 'The more you take out of me, the bigger I become. What am I?',
    answer: 'hole',
    acceptedVariants: ['hole', 'a hole'],
    explanation: 'Digging or removing earth makes a hole expand.',
    hint: 'Think about excavating ground.',
  },
  {
    id: 'riddle-4',
    question: 'I am always hungry, I must always be fed. The finger I touch will soon turn red. What am I?',
    answer: 'fire',
    acceptedVariants: ['fire', 'flame', 'a fire'],
    explanation: 'Fire consumes fuel and burns upon touch.',
    hint: 'Combustion needs oxygen and fuel.',
  },
  {
    id: 'riddle-5',
    question: 'I run but never walk. I have a mouth but never talk. I have a head but never weep. What am I?',
    answer: 'river',
    acceptedVariants: ['river', 'a river'],
    explanation: 'A river runs downhill, has a river mouth, and has a river head.',
    hint: 'Flowing natural body of water.',
  },
];
