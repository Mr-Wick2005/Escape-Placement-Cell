# ALWAYS-ON GAME DEVELOPMENT RULES (Part 15.4)

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
