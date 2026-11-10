# AGENTS.md

Project: Escape Placement Cell
Stack: Vite, React, TS strict, Tailwind, Zustand, Framer Motion, Howler, Monaco.
Commands: npm run dev, npm run lint, npm run typecheck, npm test, npm run test:e2e.
Definition of done: PART 16.5.

## Always-On Rules (Part 15.4)
- TypeScript strict, no `any`, no unused code.
- Game logic must be pure functions in /engine with unit tests.
- No hard-coded numbers or story text inside components.
- Never put API keys in frontend code.
- Never use eval on the main thread.
- Every async operation has error handling and a user-visible fallback.
- Respect prefers-reduced-motion everywhere.
- Run lint + typecheck + tests before declaring any task done.
- Do not add libraries not listed in PART 13 without asking.
- One phase at a time; summarize changes and list what was verified.
