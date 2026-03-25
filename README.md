<div align="center">

# Chemistry Index

### *Interactive junior-high chemistry equations — browse, filter, practice, and go mobile.*

[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Capacitor](https://img.shields.io/badge/Capacitor-7-119EFF?style=for-the-badge&logo=capacitor&logoColor=white)](https://capacitorjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

<br />

[Features](#-features) · [Quick start](#-quick-start) · [Mobile](#-mobile-capacitor) · [Docs](#-documentation) · [Structure](#-project-structure)

<br />

<img src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="Chemistry Index banner" width="92%" style="max-width: 960px; border-radius: 12px;" />

</div>

---

## Why this project?

**Chemistry Index** is a focused learning tool for **middle school (junior high) chemistry equations** — the reactions students meet in class and exams. It combines a **searchable equation library**, a **periodic-table filter**, **favorites**, **reaction phenomena** hints, and a **balancing practice** mode with streak scoring — all in one fast, bilingual-friendly UI (Chinese labels for learners, English codebase & docs).

---

## Features

| | |
|:---|:---|
| **Equation library** | Search by description, formula, or keywords; filter by reaction type (synthesis, decomposition, single/double replacement, etc.) and difficulty. |
| **Periodic table** | Tap an element to filter equations that involve it — with atomic number, Chinese name, and relative atomic mass on each cell. |
| **Favorites** | Persisted locally — your starred equations sync across sessions (same device). |
| **Phenomena** | Many entries include experimental observations, surfaced with contextual emoji hints. |
| **Practice mode** | Interactive coefficient balancing with feedback, score, and streak tracking. |
| **Dark mode** | System-aware theme toggle, remembered on device. |
| **Privacy** | Full privacy policy **bundled offline** in the app (no network required to read it). |
| **Mobile** | **Capacitor 7** wrappers for **iOS** and **Android** from the same Vite build. |

---

## Tech stack

- **UI:** React 19, Tailwind CSS 4, Motion, Lucide icons  
- **Build:** Vite 6, TypeScript  
- **Typography:** Inter + Noto Serif SC (beautiful formula rendering)  
- **Native shell:** Capacitor 7 (`com.chemistryindex.app`)

---

## Quick start

**Requirements:** [Node.js](https://nodejs.org/) 18+ (20+ recommended)

```bash
git clone https://github.com/YOUR_ORG/Chemistry-Index.git
cd Chemistry-Index
npm install
npm run dev
```

Then open the URL shown in the terminal (default dev server uses port **3000**).

| Command | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Typecheck (`tsc --noEmit`) |

---

## Mobile (Capacitor)

```bash
npm run build
npx cap sync
npm run cap:open:ios      # Xcode (use App.xcworkspace + CocoaPods)
npm run cap:open:android  # Android Studio
```

- **Bundle ID:** `com.chemistryindex.app` — see `capacitor.config.ts`  
- **Release signing:** Android `android/keystore.properties.example` → `keystore.properties` (gitignored)  
- **Store checklist:** [`docs/STORE_RELEASE.md`](docs/STORE_RELEASE.md)  
- **Privacy template (English):** [`PRIVACY.md`](PRIVACY.md) — host a public URL for store consoles; in-app copy stays in sync via `PrivacyPolicyPanel`

### CI — automated mobile builds

GitHub Actions workflow **[Mobile release](.github/workflows/mobile-release.yml)** runs on **`workflow_dispatch`** and on **`v*`** tags:

- **Android:** signed **`.aab`** when keystore secrets are configured; otherwise a **debug `.apk`** for pipeline smoke tests.  
- **iOS:** **Simulator Release** build artifact (not an App Store IPA).  

Setup and secret names: **[`docs/MOBILE_CI.md`](docs/MOBILE_CI.md)**.

---

## Documentation

| Doc | Purpose |
|-----|---------|
| [`CLAUDE.md`](CLAUDE.md) | Architecture & workflow notes for contributors / AI assistants |
| [`docs/STORE_RELEASE.md`](docs/STORE_RELEASE.md) | App Store & Google Play preparation |
| [`docs/MOBILE_CI.md`](docs/MOBILE_CI.md) | GitHub Actions: Android AAB / iOS simulator CI & secrets |
| [`PRIVACY.md`](PRIVACY.md) | English privacy policy (keep aligned with in-app text) |

---

## Project structure

```
Chemistry-Index/
├── src/
│   ├── App.tsx                 # Tabs, theme, privacy entry, layout
│   ├── components/             # LearningMode, PracticeMode, EquationDisplay, …
│   ├── data/                   # equations.ts, elements metadata
│   └── utils/                  # chemistry parsing, phenomenon emoji helpers
├── android/                    # Capacitor Android project
├── ios/App/                    # Capacitor iOS workspace (Pods)
├── docs/
├── capacitor.config.ts
├── vite.config.ts
└── package.json
```

---

## Data snapshot

- **58** curated equations with conditions, types, difficulty, and many with **phenomenon** text  
- Reaction types cover the standard junior-high taxonomy (e.g. 化合 / 分解 / 置换 / 复分解)

---

## Contributing

Issues and pull requests are welcome. Please run `npm run lint` and `npm run build` before submitting.

---

## Acknowledgments

- Built with [Vite](https://vitejs.dev/), [React](https://react.dev/), and [Capacitor](https://capacitorjs.com/).  
- Original AI Studio app reference: [Google AI Studio](https://ai.studio/apps/658093d4-8a27-4133-a8a9-e9a976eeba42) *(optional link if you still use it)*.

---

<div align="center">

**Made with learning in mind.**

If this repo helps your class or self-study, a star is appreciated.

</div>
