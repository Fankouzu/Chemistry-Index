# App icon & splash sources (Capacitor)

Place **master artwork** here, then generate native iOS/Android assets with:

```bash
npm run assets:generate
```

After that, sync native projects:

```bash
npm run build && npx cap sync
```

Official guide: [Splash Screens and Icons](https://capacitorjs.com/docs/guides/splash-screens-and-icons)

## Easy mode (recommended)

Add a square logo (PNG or SVG), **at least ~1024×1024** safe artwork:

```
assets/
├── logo.png           # required (or use icon.png)
└── logo-dark.png      # optional — dark-mode variant
```

Then run `npm run assets:generate`. The script passes background colors for **adaptive Android icons** and **splash** layers (edit `package.json` → `assets:generate` if your brand colors differ).

## Full control (adaptive icon + custom splash)

Use separate layers and full-size splash masters:

```
assets/
├── icon-only.png              # ≥ 1024×1024
├── icon-foreground.png        # ≥ 1024×1024
├── icon-background.png        # ≥ 1024×1024
├── splash.png                 # ≥ 2732×2732
└── splash-dark.png            # optional
```

Then:

```bash
npx @capacitor/assets generate --ios --android
```

## Manual alternative (no tool)

- **iOS:** Replace images under `ios/App/App/Assets.xcassets/AppIcon.appiconset/` and keep `Contents.json` consistent (Xcode → Assets → App Icon).
- **Android:** Replace `mipmap-*` launcher PNGs and `ic_launcher_foreground` assets under `android/app/src/main/res/`; adjust `values/ic_launcher_background.xml` if the backdrop color changes.
