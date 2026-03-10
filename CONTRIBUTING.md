# Contributing to TonIQ

Thank you for your interest in contributing! This document covers everything you need to get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)

---

## Code of Conduct

Be respectful and constructive. Contributions of all kinds are welcome — bug fixes, new features, documentation improvements, and test coverage.

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- Git

### Setup

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/your-username/toniq.git
cd toniq

# Install dependencies
npm install

# Rebuild native modules for Electron
npx electron-rebuild -f -w better-sqlite3

# Start the development server
npm run dev
```

---

## Project Structure

Before contributing, familiarize yourself with the key areas:

| Path | Description |
|---|---|
| `electron/` | Main process — window creation, IPC handlers, SQLite |
| `electron/preload.ts` | contextBridge API — the only communication channel between renderer and main |
| `src/audio/` | Audio engine and music theory logic |
| `src/hooks/` | React hooks for exercise state and persistence |
| `src/pages/` | Application screens |
| `src/types/` | Shared TypeScript types |
| `tests/unit/` | Unit tests for pure logic |

---

## Development Workflow

### Branches

Use descriptive branch names:

```bash
git checkout -b fix/interval-transposition-negative-semitones
git checkout -b feature/piano-keyboard-component
git checkout -b docs/update-readme
```

Prefixes:
- `feature/` — new feature
- `fix/` — bug fix
- `docs/` — documentation only
- `test/` — adding or improving tests
- `refactor/` — code changes with no behavior change

### Running the app

```bash
npm run dev       # development mode with HMR
npm test          # run unit tests
npm run lint      # check for linting errors
npm run build     # production build
```

---

## Submitting Changes

1. **Open an issue first** for significant changes — discuss the approach before writing code
2. **Keep PRs focused** — one feature or fix per pull request
3. **Write tests** for any new logic in `src/audio/` or `src/hooks/`
4. **Run the full test suite** before submitting — ALL tests must pass
5. **Update the README** if your change affects setup, architecture, or public APIs

### Pull Request checklist

- [ ] `npm test` passes with no failures
- [ ] `npm run lint` reports no errors
- [ ] `npm run build` completes successfully
- [ ] New logic has corresponding unit tests
- [ ] Commit messages are clear and descriptive

---

## Coding Standards

### TypeScript

- Strict mode is enabled — no implicit `any`
- Prefer explicit return types on exported functions
- Use `interface` for object shapes, `type` for unions and aliases

### Electron security

- Never set `nodeIntegration: true`
- Never expose the raw `ipcRenderer` object through `contextBridge`
- All new IPC channels must be explicitly declared in `electron/preload.ts` and typed in `src/types/api.d.ts`

### Audio

- All audio synthesis must happen in the renderer process via Tone.js
- New instrument types or synth configurations go in `src/audio/AudioEngine.ts`
- Music theory data (intervals, chords, scales) goes in `src/audio/musicTheory.ts`
- Always call `stop()` before starting a new audio sequence

### React

- Prefer hooks over class components
- Keep pages thin. Business logic belongs in hooks
- Avoid calling `window.api` directly from components. Use `useProgress` or create a new hook

---

## Testing Guidelines

Tests live in `tests/unit/` and use Vitest. The test suite covers pure logic only. No audio playback, no Electron APIs, no DOM.

### What to test

- Any new function in `src/audio/musicTheory.ts`
- Any new question generation logic in `src/audio/generateQuestion.ts`
- Any changes to `src/audio/adaptiveDifficulty.ts`
- Edge cases (empty arrays, boundary values, negative numbers)

### What not to test

- Tone.js playback (requires a real audio context)
- Electron IPC handlers (integration concern)
- React component rendering (out of scope for this project's test suite)

### Running tests

```bash
npm test            # run once
npm run test:watch  # watch mode during development
```

All tests must pass before a PR can be merged.

---

## Reporting Bugs

Open a GitHub issue with:

1. **Description** — what happened vs. what you expected
2. **Steps to reproduce** — minimal steps to trigger the bug
3. **Environment** — OS, Node version, app version
4. **Logs** — any relevant error messages from the terminal or DevTools (`Ctrl+Shift+I`)

---

## Suggesting Features

Open a GitHub issue with the `enhancement` label. Include:

1. **Problem** — what gap or friction does this address?
2. **Proposed solution** — how would it work from the user's perspective?
3. **Alternatives considered** — other approaches you thought about

Feature requests related to music theory content (new intervals, chord types, progressions) are especially welcome.

---

## Questions

If you're unsure about anything, open a GitHub Discussion or leave a comment on the relevant issue. Happy to help.