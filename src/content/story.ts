export const STORY = {
  title: { name: 'Escape: Placement Cell', tagline: 'Three rounds. One door. Zero second chances.' },
  intro: [
    'NEXUS Technologies Campus Drive. 11:47 PM.',
    'The final candidate steps into a silent building. The doors seal behind you.',
    'Candidate 404. Every offer letter in this building is locked behind three trials.',
    'Pass them, and the exit opens. Fail them, and you get a very polite rejection email.',
  ],
  latestRecruiterLine: 'Candidate 404. The first wing is listening.',
  wings: { aptitude: { title: 'Aptitude Vault', detail: 'Maze of logic doors', difficulty: '01 / CALIBRATED' }, coding: { title: 'Code Core', detail: 'Server room repair', difficulty: '02 / ELEVATED' }, interview: { title: 'Interview Chamber', detail: 'Panel assessment', difficulty: '03 / PRESSURE' }, final: { title: 'Final Gate', detail: 'Three fragments required', difficulty: 'EXIT / SEALED' } },
} as const;
