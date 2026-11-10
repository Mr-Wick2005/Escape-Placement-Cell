# 🚪 Escape: Placement Cell — Master Simulation

[![Live Demo](https://img.shields.io/badge/Live%20Demo-escape--placement--cell.vercel.app-00f0ff?style=for-the-badge&logo=vercel)](https://escape-placement-cell.vercel.app/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict%205.9-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-7.3-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E%20Passed-2e8555?style=for-the-badge&logo=playwright)](https://playwright.dev/)

> **"Three rounds. One door. Zero second chances."**  
> An immersive, story-driven cyberpunk escape room game simulating the high-stakes engineering campus placement process. No accounts. No friction. All state persists directly in your browser.

---

## 🎮 The Premise & World

You wake up as **Candidate 404** trapped inside the automated **Nexus Campus Facility**. The recruiter's automated system has sealed all exits. To escape with your career and sanity intact, you must infiltrate and clear three security wings, recover three cryptographic code fragments (`A`, `B`, `C`), and breach **The Final Gate** before campus lockdown triggers.

---

## 🌟 Game Architecture & Levels

```
                     ┌────────────────────────────────┐
                     │     LEVEL 0: HUB & BLUEPRINT   │
                     └───────────────┬────────────────┘
                                     │
         ┌───────────────────────────┼───────────────────────────┐
         ▼                           ▼                           ▼
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│  WING A: VAULT   │       │ WING B: CODE CORE│       │ WING C: INTERVIEW│
│ Aptitude + Maze  │       │ Monaco + Workers │       │ Web Speech + STAR│
└────────┬─────────┘       └────────┬─────────┘       └────────┬─────────┘
         │ (Fragment A)              │ (Fragment B)              │ (Fragment C)
         └───────────────────────────┼───────────────────────────┘
                                     ▼
                     ┌────────────────────────────────┐
                     │    LEVEL 4: THE FINAL GATE     │
                     │  3-Lock Cryptographic Breach   │
                     └───────────────┬────────────────┘
                                     ▼
                     ┌────────────────────────────────┐
                     │    ENDINGS & DOSSIER REPORT    │
                     │  Offer / Blacklist / Whistle   │
                     └────────────────────────────────┘
```

### 🧠 Level 1: Aptitude Vault (Wing A)
- **Interactive 7×7 Grid Navigation**: Solve dynamic pathfinding obstacles while unlocking blast doors.
- **6 Diverse Puzzle Formats**:
  1. Standard Multiple Choice (Speed math, logical deductions)
  2. Themed Digit/Number Lock inputs
  3. Drag-and-Drop Sequence Reordering
  4. Logic Matrices & Grid Deductions
  5. Multi-Select Checkbox combinations
  6. Data Sufficiency reasoning
- **Time Penalty Mechanics**: Lockdown countdown with integrity-based time penalties on incorrect answers.

### ⚡ Level 2: Code Core (Wing B)
- **Monaco Code Editor Integration**: Full syntax highlighting, error squiggles, and code completion in JavaScript and Python.
- **Web Worker Sandboxed Execution**: Client-side execution sandbox with a strict 2-second timeout guard to neutralize infinite loops (`while(true) {}`) without freezing the UI.
- **Memory Leak & Overload Terminal**: Trace simulated memory leaks, diagnose logarithmic complexities, and restore power through the overload console.

### 🎙️ Level 3: Interview Chamber (Wing C)
- **Web Speech API Recognition**: Real-time microphone audio input with dynamic waveform indicators.
- **Seamless Text Fallback**: Automatically activates on unsupported browsers, blocked permissions, or mic failure without disrupting gameplay.
- **STAR Method Rubric Engine**: Answers are evaluated across Situation, Task, Action, and Result indicators with sentiment and confidence tracking.
- **Dynamic Recruiter Twist**: Questions adapt based on previous choices, culminating in ethical dilemma queries (Q6/Q7).

### 🚪 Level 4: The Final Gate & Endings
- **Cryptographic Lock Assembly**: Derive three numeric and alphabetical keys from the collected fragments.
- **3 Narrative Endings**:
  - 🏆 **The Platinum Offer**: Flawless completion, top integrity score, and compliance.
  - ⚠️ **The Blacklist**: System lockout due to depleted candidate integrity or timeout.
  - 🔓 **The Whistleblower**: Exposing the facility's predatory simulation algorithm.
- **Comprehensive Candidate Dossier**: Printable and exportable report with radar skill distributions, behavioral metrics, and round-by-round analytics.

---

## 🔊 Procedural Audio & Visual Polish

- **100% Procedural Web Audio**: Zero external audio downloads. Sound effects and ambient music drones are synthesized on-the-fly via the Web Audio API and Howler.js for instantaneous playback and zero network overhead.
- **Audio Controls**: Global volume sliders for Music and SFX, dedicated hotkey (`M`), and optional Text-to-Speech recruiter voiceover toggle.
- **Motion & Accessibility**:
  - Ambient particle system (scaled for desktop vs. mobile, automatically paused when the tab is hidden).
  - Screen glitch burst overlays, fragment fly-in animations, and scramble-decode typography.
  - Full support for `prefers-reduced-motion` with animated effects cleanly bypassed.

---

## 🛠️ Tech Stack & Engineering Standards

| Technology | Purpose |
| :--- | :--- |
| **Vite 7.3** | Lightning-fast build tooling and HMR |
| **React 19** | Component-driven UI architecture |
| **TypeScript 5.9 (Strict)** | End-to-end type safety with zero `any` allowance |
| **Tailwind CSS 3.4** | Cyberpunk theme system with CSS grid shell |
| **Zustand 5** | Lightweight game state with localStorage auto-sync |
| **Monaco Editor** | Desktop-grade in-browser code editing |
| **Web Workers** | Sandboxed JavaScript code execution with timeout protection |
| **Playwright** | Multi-browser end-to-end test automation |
| **Vitest** | Blazing-fast unit and regression testing |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Mr-Wick2005/Escape-Placement-Cell.git
cd Escape-Placement-Cell

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Testing & Verification

The project is protected by automated unit, integration, and E2E suites:

```bash
# Run code quality linting
npm run lint

# Run TypeScript type check
npm run typecheck

# Run Vitest unit & game engine tests (38 tests)
npm test

# Run Playwright End-to-End tests (Chromium & Mobile Chrome)
npm run test:e2e

# Run production build & verify asset output
npm run build
```

---

## 🌐 Vercel Deployment

This project is configured for **zero-config, 100% seamless deployment on Vercel**:

- **Build Command**: `npm run build`
- **Output Directory**: `dist` (automatically synced to `build` for backward compatibility)
- **Framework Preset**: `Vite`

### Deploy via Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### Deploy via GitHub Integration
Any push to the `main` branch will automatically trigger a production build on Vercel. `vercel.json` ensures client-side routing rewrites, security headers, and asset caching are applied automatically.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
