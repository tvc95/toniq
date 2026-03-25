<div align="center">

# 🎵 TonIQ 🎵

### Ear Training App for Musicians (and music lovers...)

**Train your musical ear through interactive exercises powered by real-time audio synthesis**

![Version](https://img.shields.io/badge/version-1.2.0-6C63FF?style=flat-square)
![Electron](https://img.shields.io/badge/Electron-30-47848F?style=flat-square&logo=electron)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)
![Tests](https://img.shields.io/badge/tests-78%20passing-2EC4B6?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-FFB703?style=flat-square)

Status: Published (v. 1.2.0)

</div>

---

## 📖 About

TonIQ is a desktop ear training application that helps musicians develop their auditory perception through gamified exercises. All audio is generated programmatically using the Web Audio API — no external sound files required.

The app covers three core areas of musical ear training:

- **Intervals** — identify the distance between two notes (ascending, descending, or harmonic)
- **Chords** — recognize triads and seventh chords (major, minor, diminished, augmented, dominant 7th...)
- **Progressions** — identify common harmonic sequences (I–IV–V–I, ii–V–I, and more)

---

## ✨ Features

- 🎹 **Real-time audio synthesis** via Tone.js — no audio files needed
- 🧠 **Adaptive difficulty** — automatically adjusts based on your performance
- 📊 **Progress tracking** — full session history stored locally with SQLite
- 🎯 **Three exercise modes** with beginner, intermediate, and advanced levels
- ⚡ **Instant feedback** — visual and timing feedback on every answer
- 🖥️ **Cross-platform** — runs on Windows, macOS, and Linux

---

## 🛠️ Tech Stack

| Technology          | Role                                            |
| ------------------- | ----------------------------------------------- |
| **Electron 30**     | Desktop app framework                           |
| **React 18**        | UI with hooks and Context API                   |
| **TypeScript 5**    | Static typing across the entire codebase        |
| **Tone.js**         | Real-time audio synthesis and scheduling        |
| **better-sqlite3**  | Local database for session history              |
| **Vite 5**          | Bundler with HMR for the renderer process       |
| **Tailwind CSS v4** | Utility-first styling with custom design system |
| **Vitest 4**        | Unit testing for music theory logic             |
| **Playwright**      | End-to-end testing                              |

---

## 🏗️ Architecture

The app follows Electron's recommended security architecture with strict process separation:

```
┌──────────────────────────────────────────────────────┐
│                   Renderer Process                   │
│  React UI  →  useExercise  →  AudioEngine (Tone.js)  │
│                    ↕ contextBridge                   │
│                   Preload Script                     │
│                    ↕ IPC (invoke)                    │
│                    Main Process                      │
│           ipcMain handlers  →  SQLite DB             │
└──────────────────────────────────────────────────────┘
```

**Key architectural decisions:**

- `contextBridge` + `contextIsolation: true` — renderer never accesses Node.js directly
- `better-sqlite3` loaded via `createRequire` to handle ESM + native module compatibility
- Tone.js runs entirely in the renderer — audio synthesis requires no IPC round-trips
- Adaptive difficulty evaluated client-side on every answer using a sliding window of results

---

## 📁 Project Structure (simplified)

Updated for v 1.1.1

```
toniq/
├── electron/
│   ├── main.ts           # Main process — window, IPC handlers
│   ├── preload.ts        # contextBridge API exposure
│   └── database.ts       # SQLite schema and connection
├── src/
│   ├── assets/
│   ├── audio/
│   │   ├── AudioEngine.ts            # Tone.js synthesis engine
│   │   ├── musicTheoryData.ts        # Intervals, chords, progressions and transposition
│   │   ├── generateQuestion.ts       # TonIQ exercises generation
│   │   └── adaptiveDifficulty.ts     # Difficulty adjustment logic
│   ├── components/
│   │   ├── Waveform/Waveform.tsx         # Audio Waveform Canvas
│   │   ├── StreakBadge/StreakBadge.tsx   # Player Streak Badge
│   │   ├── XPBar.tsx                     # Level progress bar
│   │   └── ...
│   ├── hooks/
│   │   ├── useExercise.ts        # Exercise session state machine
│   │   ├── useProgress.ts        # Session persistence abstraction
│   │   └── ...
│   ├── pages/
│   │   ├── HomePage/HomePage.tsx         # Mode selection
│   │   ├── Exercise/Exercise.tsx         # Active exercise screen
│   │   ├── Results/Results.tsx           # Session summary
│   │   ├── HistoryPage/HistoryPage.tsx   # Progress history
│   │   └── ...
│   ├── types/
│   │   ├── db.ts         # Session, Answer, ExerciseConfig types
│   │   └── api.d.ts      # window.api type declarations
│   └── utils/
│       ├── xpCalculator.ts      # Player XP calculation
│       ├── streakCalculator.ts  # Player streak calculation
│       └── ...
└── tests/
    ├── e2e/
    │   └── app.test.ts
    └── unit/
        ├── xpCalculator.test.ts
        ├── musicTheoryData.test.ts
        ├── generateQuestion.test.ts
        ├── adaptiveDifficulty.test.ts
        └── ...
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/tvc95/toniq.git
cd toniq

# Install dependencies
npm install

# Rebuild native modules for Electron
npx electron-rebuild -f -w better-sqlite3
```

### Development

```bash
npm run dev
```

### Tests

```bash
npm test
```

### Production Build

```bash
npm run build
```

Installers are generated in `release/{version}/`:

- Windows: `Toniq-Windows-{version}-Setup.exe`
- macOS: `Toniq-Mac-{version}-Installer.dmg`
- Linux: `Toniq-Linux-{version}.AppImage`

---

## 🧪 Testing

The test suite covers the core music theory logic and exercise generation:

```
✓ tests/unit/adaptiveDifficulty.test.ts   (6 tests)
✓ tests/unit/musicTheoryData.test.ts      (17 tests)
✓ tests/unit/generateQuestion.test.ts     (11 tests)
✓ tests/unit/xpCalculator.test.ts         (9 tests) 
✓ tests/unit/streakCalculator.test.ts     (6 tests)
✓ tests/unit/achievementChecker.test.ts   (29 tests) [NEW v.1.2.0]

Test Files  6 passed (6)
     Tests  78 passed (78)
```

Unit tests are intentionally scoped to pure logic — no audio playback, no Electron APIs, no DOM required.

---

## 🎵 How It Works

### Audio Engine

All sound is synthesized in real-time using a `PolySynth` with a triangle oscillator and a natural ADSR envelope:

```typescript
const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: 'triangle' },
  envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 1.2 },
}).toDestination()
```

Notes use scientific pitch notation (`C4`, `D#3`, `Gb5`) and are scheduled with `Tone.Transport` for precise timing.

### Adaptive Difficulty

After every 5 answers, the system evaluates the hit rate of the last 5 questions:

- **≥ 80% correct** → difficulty increases
- **≤ 40% correct** → difficulty decreases
- **Between 40–80%** → difficulty stays the same

Each difficulty level unlocks a larger pool of intervals, chords, and progressions.

### Data Persistence

Session data is stored locally in a SQLite database via `better-sqlite3`. No account or internet connection required. The database is located in the OS user data directory:

- Windows: `%APPDATA%\toniq\toniq.db`
- macOS: `~/Library/Application Support/toniq/toniq.db`
- Linux: `~/.config/toniq/toniq.db`

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

### How to contribute

1. Fork the project.
2. Create a new branch with your changes: `git checkout -b my-feature`
3. Save your changes and create a commit message telling you what you did: `git commit -m" feature: My new feature "`
4. Submit your changes: `git push origin my-feature`
   > If you have any questions check this [guide on how to contribute](./CONTRIBUTING.md)

---

## 📄 License

This project was developed by [Thiago Viana](https://www.linkedin.com/in/thiagovcarvalho/) and is under the [MIT](https://choosealicense.com/licenses/mit/) license.

MIT © 2026 — built as a portfolio project.

### Contact me

<p align="left">
	<a href="https://www.linkedin.com/in/thiagovcarvalho/"><img src="https://img.shields.io/static/v1?label=linkedin&message=thiagovcarvalho&color=blue&style=flat-square&logo=linkedin" /></a>
	<a href="https://github.com/tvc95/"><img src="https://img.shields.io/static/v1?label=github&message=tvc95&color=blueviolet&style=flat-square&logo=github" /></a>
</p>
