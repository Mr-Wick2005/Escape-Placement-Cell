export const BALANCE = {
  integrity: { initial: 100, wingRestore: 10, lockdownReset: 40, min: 0, max: 100 },
  penalties: { wrongAnswer: 8, wrongCode: 10, weakInterviewAnswer: 5, hint: 5, lockdownStyle: 25 },
  scoring: {
    totalMax: 1000,
    aptitudeMax: 300,
    codingMax: 350,
    interviewMax: 300,
    styleMax: 50,
    clearPercent: 0.6,
  },
} as const;
