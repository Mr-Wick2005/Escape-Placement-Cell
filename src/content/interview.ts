export type Panelist = 'recruiter' | 'architect' | 'skeptic';

export type InterviewQuestion = {
  id: string;
  slot: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  panelist: Panelist;
  category: string;
  prompt: string;
  keywordGroups: { label: string; words: string[]; weight: number }[];
  starExpected: boolean;
  idealWords: [number, number];
  tip: string;
  rune: string;
};

export const INTERVIEW_QUESTION_BANK: InterviewQuestion[] = [
  // --- SLOT 1: WARM-UP (3 VARIANTS) ---
  {
    id: 'intro',
    slot: 1,
    panelist: 'recruiter',
    category: 'Warm-up',
    prompt: 'Tell me about yourself.',
    keywordGroups: [
      { label: 'background', words: ['student', 'engineering', 'branch', 'college', 'computer'], weight: 1 },
      { label: 'direction', words: ['project', 'skill', 'goal', 'internship', 'developer'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [45, 110],
    tip: 'Lead with your current path, then connect one relevant project to the role.',
    rune: '△',
  },
  {
    id: 'intro-journey',
    slot: 1,
    panelist: 'recruiter',
    category: 'Warm-up',
    prompt: 'Walk me through your journey into software engineering and what excites you most about tech.',
    keywordGroups: [
      { label: 'origin', words: ['started', 'journey', 'curiosity', 'first', 'learned'], weight: 1 },
      { label: 'passion', words: ['building', 'problem', 'solve', 'systems', 'impact'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [45, 115],
    tip: 'Highlight an early spark followed by deliberate skill development.',
    rune: '△',
  },
  {
    id: 'intro-headline',
    slot: 1,
    panelist: 'recruiter',
    category: 'Warm-up',
    prompt: 'Give me your two-minute elevator pitch: who are you as an engineer, and what value do you bring?',
    keywordGroups: [
      { label: 'identity', words: ['developer', 'engineer', 'focus', 'full-stack', 'backend'], weight: 1 },
      { label: 'value', words: ['deliver', 'fast learner', 'scalable', 'team', 'results'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [40, 110],
    tip: 'Keep it punchy: technical specialty, evidence of impact, and readiness to contribute.',
    rune: '△',
  },

  // --- SLOT 2: SELF-AWARENESS & STRENGTHS (3 VARIANTS) ---
  {
    id: 'strength',
    slot: 2,
    panelist: 'recruiter',
    category: 'Self-awareness',
    prompt: 'What is a strength you rely on, and one skill you are improving?',
    keywordGroups: [
      { label: 'strength', words: ['strength', 'problem', 'learn', 'team', 'persistent'], weight: 1 },
      { label: 'growth', words: ['improve', 'feedback', 'working', 'practice', 'reading'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [35, 90],
    tip: 'Pair a real strength with a concrete improvement habit.',
    rune: '○',
  },
  {
    id: 'handling-critique',
    slot: 2,
    panelist: 'recruiter',
    category: 'Self-awareness',
    prompt: 'Describe a piece of constructive feedback you received on code or team work, and how you acted on it.',
    keywordGroups: [
      { label: 'feedback', words: ['code review', 'feedback', 'mentor', 'senior', 'tested'], weight: 1 },
      { label: 'adaptation', words: ['implemented', 'refactored', 'improved', 'learned', 'documentation'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [40, 100],
    tip: 'Show non-defensiveness and proactive behavior to close the gap.',
    rune: '○',
  },
  {
    id: 'learning-curve',
    slot: 2,
    panelist: 'recruiter',
    category: 'Self-awareness',
    prompt: 'When you are stuck on a difficult technical problem for hours, what is your systematic process to resolve it?',
    keywordGroups: [
      { label: 'diagnosis', words: ['debug', 'logs', 'isolate', 'reproduce', 'docs'], weight: 2 },
      { label: 'collaboration', words: ['ask', 'mentor', 'stackoverflow', 'pair', 'solution'], weight: 1 },
    ],
    starExpected: false,
    idealWords: [40, 95],
    tip: 'Describe a structured debugging protocol before asking for senior assistance.',
    rune: '○',
  },

  // --- SLOT 3: PROJECT DEPTH (3 VARIANTS, ARCHITECT) ---
  {
    id: 'project',
    slot: 3,
    panelist: 'architect',
    category: 'Project depth',
    prompt: 'Tell me about a project you built and your specific contribution.',
    keywordGroups: [
      { label: 'ownership', words: ['i built', 'my role', 'implemented', 'designed', 'developed'], weight: 2 },
      { label: 'impact', words: ['result', 'users', 'improved', 'deployed', 'database', 'api'], weight: 2 },
    ],
    starExpected: true,
    idealWords: [55, 130],
    tip: 'Name the problem, your contribution, stack choice, and an observable result.',
    rune: '◇',
  },
  {
    id: 'arch-tradeoff',
    slot: 3,
    panelist: 'architect',
    category: 'Project depth',
    prompt: 'In your favorite technical project, what was an architectural trade-off or technical decision you debated?',
    keywordGroups: [
      { label: 'options', words: ['choice', 'sql', 'nosql', 'library', 'performance', 'framework'], weight: 2 },
      { label: 'rationale', words: ['trade-off', 'latency', 'simplicity', 'scale', 'maintenance'], weight: 2 },
    ],
    starExpected: true,
    idealWords: [50, 125],
    tip: 'Explain why Option A was picked over Option B with measurable criteria.',
    rune: '◇',
  },
  {
    id: 'arch-scale',
    slot: 3,
    panelist: 'architect',
    category: 'Project depth',
    prompt: 'If your main project suddenly experienced 100x traffic tomorrow, where would the bottleneck occur and how would you fix it?',
    keywordGroups: [
      { label: 'bottleneck', words: ['database', 'queries', 'memory', 'server', 'network', 'io'], weight: 2 },
      { label: 'mitigation', words: ['caching', 'redis', 'indexing', 'horizontal', 'load balancer'], weight: 2 },
    ],
    starExpected: true,
    idealWords: [50, 125],
    tip: 'Identify single points of failure: database connection limits, uncached queries, or synchronous tasks.',
    rune: '◇',
  },

  // --- SLOT 4: BEHAVIORAL STAR (3 VARIANTS, RECRUITER) ---
  {
    id: 'conflict',
    slot: 4,
    panelist: 'recruiter',
    category: 'STAR behavior',
    prompt: 'Describe a time you handled conflict in a team.',
    keywordGroups: [
      { label: 'collaboration', words: ['team', 'listen', 'discussed', 'resolve', 'disagreement'], weight: 2 },
      { label: 'outcome', words: ['result', 'agreed', 'improved', 'delivered', 'consensus'], weight: 2 },
    ],
    starExpected: true,
    idealWords: [55, 140],
    tip: 'Use STAR: situation, your responsibility, action, and result.',
    rune: '✦',
  },
  {
    id: 'failure-star',
    slot: 4,
    panelist: 'recruiter',
    category: 'STAR behavior',
    prompt: 'Tell me about a time a deadline was missed or a milestone failed. How did you handle the aftermath?',
    keywordGroups: [
      { label: 'ownership', words: ['responsible', 'communicated', 'delay', 'retrospective', 'fixed'], weight: 2 },
      { label: 'learning', words: ['prevented', 'timeline', 'buffer', 'shipped', 'result'], weight: 2 },
    ],
    starExpected: true,
    idealWords: [55, 140],
    tip: 'Own the shortfall without blaming teammates; detail process fixes.',
    rune: '✦',
  },
  {
    id: 'initiative-star',
    slot: 4,
    panelist: 'recruiter',
    category: 'STAR behavior',
    prompt: 'Give an example of an occasion where you took the initiative beyond what was formally assigned to you.',
    keywordGroups: [
      { label: 'proactive', words: ['noticed', 'gap', 'initiative', 'automate', 'refactor', 'test'], weight: 2 },
      { label: 'impact', words: ['saved', 'helped team', 'delivered', 'improved', 'speed'], weight: 2 },
    ],
    starExpected: true,
    idealWords: [55, 135],
    tip: 'Show proactive agency: finding a bottleneck, writing documentation, or adding tests.',
    rune: '✦',
  },

  // --- SLOT 5: SITUATIONAL & JUDGMENT (3 VARIANTS, ARCHITECT) ---
  {
    id: 'situation',
    slot: 5,
    panelist: 'architect',
    category: 'Judgment',
    prompt: 'A feature is slipping near release. What would you do?',
    keywordGroups: [
      { label: 'prioritize', words: ['prioritize', 'scope', 'risk', 'deadline', 'triage'], weight: 2 },
      { label: 'communicate', words: ['communicate', 'team', 'stakeholder', 'update', 'lead'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [40, 105],
    tip: 'Explain how you assess risk, reduce scope, and communicate early.',
    rune: '□',
  },
  {
    id: 'tech-debt',
    slot: 5,
    panelist: 'architect',
    category: 'Judgment',
    prompt: 'Product management wants a quick hack shipped today, but it introduces significant technical debt. How do you respond?',
    keywordGroups: [
      { label: 'balance', words: ['understand', 'business', 'urgency', 'compromise', 'risk'], weight: 2 },
      { label: 'remediation', words: ['ticket', 'refactor', 'schedule', 'document', 'boundary'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [40, 110],
    tip: 'Demonstrate pragmatic balance: deliver urgent value while registering tech debt remediation.',
    rune: '□',
  },
  {
    id: 'unclear-spec',
    slot: 5,
    panelist: 'architect',
    category: 'Judgment',
    prompt: 'You are assigned a critical ticket with vague or conflicting requirements. What is your immediate course of action?',
    keywordGroups: [
      { label: 'clarify', words: ['ask', 'product', 'clarification', 'assumptions', 'questions'], weight: 2 },
      { label: 'prototype', words: ['document', 'options', 'confirm', 'align', 'mockup'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [40, 100],
    tip: 'Formulate hypotheses and document assumptions before seeking prompt alignment.',
    rune: '□',
  },

  // --- SLOT 6: PRESSURE & CURVEBALL (3 VARIANTS, SKEPTIC) ---
  {
    id: 'curveball',
    slot: 6,
    panelist: 'skeptic',
    category: 'Pressure',
    prompt: 'Why should we not hire you?',
    keywordGroups: [
      { label: 'honesty', words: ['honest', 'learning', 'improve', 'growth', 'specialized'], weight: 2 },
      { label: 'proof', words: ['example', 'working', 'practice', 'feedback', 'adapt'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [35, 90],
    tip: 'Reframe honestly: name a growth area and the proof you act on it.',
    rune: '✧',
  },
  {
    id: 'skeptic-gap',
    slot: 6,
    panelist: 'skeptic',
    category: 'Pressure',
    prompt: 'You have only academic and personal projects on your resume. Why should we trust you with production code?',
    keywordGroups: [
      { label: 'rigor', words: ['tested', 'git', 'ci/cd', 'architecture', 'clean code', 'documentation'], weight: 2 },
      { label: 'mindset', words: ['ownership', 'fast learner', 'coachable', 'resilience', 'production'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [40, 100],
    tip: 'Point to production-grade engineering habits: testing, edge-case vigilance, and fast ramp-up speed.',
    rune: '✧',
  },
  {
    id: 'skeptic-disagree',
    slot: 6,
    panelist: 'skeptic',
    category: 'Pressure',
    prompt: 'What if your tech lead tells you to implement an approach you know is technically inferior?',
    keywordGroups: [
      { label: 'professionalism', words: ['data', 'benchmarks', 'respect', 'discuss', 'alternatives'], weight: 2 },
      { label: 'alignment', words: ['commit', 'align', 'support', 'team goal', 'execute'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [40, 100],
    tip: 'Disagree with data and prototypes; commit fully once the team decides.',
    rune: '✧',
  },

  // --- SLOT 7: CLOSING & FIT (3 VARIANTS, RECRUITER) ---
  {
    id: 'close',
    slot: 7,
    panelist: 'skeptic', // note: Skeptic asks closing in slot 7 before recruiter twist takes over
    category: 'Closing',
    prompt: 'Why should we hire you?',
    keywordGroups: [
      { label: 'value', words: ['value', 'skills', 'contribute', 'results', 'fit'], weight: 2 },
      { label: 'fit', words: ['team', 'learn fast', 'passion', 'project', 'grow'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [40, 100],
    tip: 'Link your strengths directly to the team’s needs and your evidence.',
    rune: '⬡',
  },
  {
    id: 'closing-vision',
    slot: 7,
    panelist: 'recruiter',
    category: 'Closing',
    prompt: 'Where do you see your engineering growth in the next two to three years?',
    keywordGroups: [
      { label: 'trajectory', words: ['depth', 'system design', 'senior', 'mentor', 'mastery'], weight: 2 },
      { label: 'commitment', words: ['contribute', 'ownership', 'company', 'ship', 'impact'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [35, 95],
    tip: 'Express ambition grounded in practical technical depth and team mentorship.',
    rune: '⬡',
  },
  {
    id: 'closing-questions',
    slot: 7,
    panelist: 'recruiter',
    category: 'Closing',
    prompt: 'Do you have any questions for us about our engineering culture or tech roadmap?',
    keywordGroups: [
      { label: 'curiosity', words: ['architecture', 'deployment', 'culture', 'mentorship', 'challenges'], weight: 2 },
      { label: 'engagement', words: ['team', 'scale', 'learning', 'onboarding', 'goals'], weight: 2 },
    ],
    starExpected: false,
    idealWords: [30, 90],
    tip: 'Ask thoughtful questions on CI/CD cadence, mentorship structures, or next-quarter tech priorities.',
    rune: '⬡',
  },
];

// Active 7 questions for the run (1 from each slot)
export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  INTERVIEW_QUESTION_BANK[0], // Slot 1: intro
  INTERVIEW_QUESTION_BANK[3], // Slot 2: strength
  INTERVIEW_QUESTION_BANK[6], // Slot 3: project
  INTERVIEW_QUESTION_BANK[9], // Slot 4: conflict
  INTERVIEW_QUESTION_BANK[12], // Slot 5: situation
  INTERVIEW_QUESTION_BANK[15], // Slot 6: curveball
  INTERVIEW_QUESTION_BANK[18], // Slot 7: close
];
