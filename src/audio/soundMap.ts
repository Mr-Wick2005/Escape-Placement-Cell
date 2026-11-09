export type SoundName =
  | 'uiClick'
  | 'uiHover'
  | 'uiBack'
  | 'doorOpen'
  | 'doorLocked'
  | 'wallShift'
  | 'answerCorrect'
  | 'answerWrong'
  | 'hintUse'
  | 'fragmentGain'
  | 'alarmLockdown'
  | 'keyType'
  | 'terminalRun'
  | 'testPass'
  | 'testFail'
  | 'powerUp'
  | 'rankReveal'
  | 'confetti'
  | 'timerTickLow';

export const SOUND_MAP: Record<SoundName, string | null> = {
  uiClick: null,
  uiHover: null,
  uiBack: null,
  doorOpen: null,
  doorLocked: null,
  wallShift: null,
  answerCorrect: null,
  answerWrong: null,
  hintUse: null,
  fragmentGain: null,
  alarmLockdown: null,
  keyType: null,
  terminalRun: null,
  testPass: null,
  testFail: null,
  powerUp: null,
  rankReveal: null,
  confetti: null,
  timerTickLow: null,
};
