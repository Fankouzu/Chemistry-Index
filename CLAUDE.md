# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Chinese middle school chemistry equation learning app (初中化学方程式). It provides two modes:
- **LearningMode**: Browse, search, and filter chemical equations by reaction type and element
- **PracticeMode**: Interactive quiz for balancing chemical equations

## Development Commands

```bash
npm install        # Install dependencies
npm run dev        # Start dev server on port 3000
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # TypeScript type check (tsc --noEmit)
npm run cap:sync   # Build web app and copy dist into ios/ + android/
npm run cap:open:ios      # Open Xcode (requires CocoaPods: brew install cocoapods)
npm run cap:open:android  # Open Android Studio (requires Android SDK / ANDROID_HOME)
```

## Mobile (Capacitor)

- **App ID**: `com.chemistryindex.app` (see `capacitor.config.ts`).
- **Workflow**: After UI changes, run `npm run cap:sync`, then build/run from Xcode or Android Studio.
- **Tooling**: macOS needs **Xcode** (iOS) and **Android Studio** with SDK; **CocoaPods** for iOS (`brew install cocoapods`). Set `ANDROID_HOME` to your SDK path (e.g. `~/Library/Android/sdk`) and add `platform-tools` to `PATH` for `adb`.
- **iOS release**: In Xcode, set **Signing & Capabilities** → Team, then **Product → Archive** for TestFlight / App Store.
- **Android release**: Copy `android/keystore.properties.example` to `android/keystore.properties`, add `android/release.keystore` (gitignored), then **Build → Generate Signed Bundle** in Android Studio, or `./gradlew bundleRelease` from `android/`.
- **Git / Vercel**: Branch **`web`** holds the deployable web app; **Vercel production** should track **`web`**. **`main`** carries Capacitor (`ios/`, `android/`) and mobile-related changes. Configure the production branch in the Vercel project (Settings → Git).

## Architecture

### Entry Points
- `src/main.tsx` - React app entry point
- `src/App.tsx` - Main container with tab navigation and dark mode toggle

### Core Components
- `LearningMode` - Equation browser with search, type/element filters, favorites
- `PracticeMode` - Balancing quiz with scoring and streak tracking
- `EquationDisplay` - Renders chemical equations with reactants/products and reaction arrow
- `Formula` - Renders chemical formulas with subscript styling and element-based colors
- `BalancingDemo` - Step-by-step animation showing the balancing process

### Data Layer
- `src/data/equations.ts` - Chemical equation definitions (52 equations) with types, difficulty, conditions, and phenomena
- `src/data/elements.ts` - Periodic table data including element info, category styles, and grid positions

### Utilities
- `src/utils/chemistry.ts`:
  - `parseFormula()` - Parse chemical formula into atom counts (handles parentheses)
  - `countTotalAtoms()` - Count atoms across molecules with coefficients
  - `getPhenomenonEmoji()` - Map phenomenon text to emoji
  - `formatEquationConditionsWithEmojis()` - Add emoji prefixes to reaction conditions

## Key Patterns

### Equation Data Structure
```typescript
interface Equation {
  id: string;
  reactants: Molecule[];  // { formula: string, coef: number }
  products: Molecule[];
  conditions: string;     // Reaction conditions (加热, 点燃, etc.)
  phenomenon: string;     // Experimental phenomenon description
  type: ReactionType;     // 化合反应 | 分解反应 | 置换反应 | 复分解反应 | 其他
  description: string;    // Human-readable description
  difficulty: Difficulty; // 初级 | 中级 | 高级
}
```

### Element Coloring
Elements are colored by category using `CATEGORY_STYLES` and `CATEGORY_FORMULA_TEXT` in `elements.ts`. The `Formula` component applies these colors to element symbols within formulas.

### State Persistence
- Theme preference: `localStorage` key `chem_theme`
- Favorites: `localStorage` key `chem_favorites`

## Styling

- Tailwind CSS 4 with `@tailwindcss/vite` plugin
- Custom fonts: Inter (sans), Noto Serif SC (serif for formulas)
- Dark mode via `.dark` class on `document.documentElement`
- Use `font-serif` for chemical formulas, `font-sans` for UI text