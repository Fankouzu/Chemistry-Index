# Mobile CI (GitHub Actions)

Workflow: [`.github/workflows/mobile-release.yml`](../.github/workflows/mobile-release.yml)

## Triggers

- **Manual:** Actions → *Mobile release* → *Run workflow*
- **Tags:** Push a tag matching `v*` (e.g. `v1.0.0`)

## Artifacts vs GitHub Releases

Every successful run uploads **workflow artifacts** (Actions → open the run → **Artifacts** at the bottom). Those are **not** the same as the **Releases** tab.

- **Tag push (`v*`):** After Android and iOS jobs finish, a **Publish GitHub Release** job creates a [GitHub Release](https://docs.github.com/en/repositories/releasing-projects-on-github/about-releases) for that tag and attaches the same files (AAB or debug APK + iOS simulator zip). The workflow creates a **draft** release first, uploads assets, then marks it **published** so uploads are never blocked by GitHub’s “immutable published release” rule.
- **Manual run:** Only artifacts are produced; no Release is created (the run is not tied to a version tag).

### Do not pre-publish the same tag

GitHub **does not allow adding release assets after a release is published**. If you run `gh release create v1.x.x --title … --notes …` (or create a published release in the UI) **before** the *Mobile release* workflow finishes, the final step will fail with *Cannot upload asset … to an immutable release*.

**Recommended:** Push only the tag (`git push origin v1.x.x`) and let CI create the release and files. If you already published an empty release, **delete that release** (keep the tag), then **Re-run all jobs** on the workflow run, or push a new tag.

**Recovery for `v1.1.0` (example):** Releases → open `v1.1.0` → Delete release (tag stays). Actions → failed *Mobile release* run → *Re-run all jobs*.

## Android — Play-ready AAB

To produce a **signed** `.aab` for Google Play (or other stores accepting AAB):

| Secret | Description |
|--------|-------------|
| `ANDROID_KEYSTORE_BASE64` | Base64-encoded `.jks` or `.keystore` file |
| `ANDROID_KEYSTORE_PASSWORD` | Keystore password |
| `ANDROID_KEY_ALIAS` | Key alias |
| `ANDROID_KEY_PASSWORD` | Key password |

**Encode keystore locally:**

```bash
base64 -i release.keystore | pbcopy   # macOS — paste into secret
# or
base64 -w0 release.keystore           # Linux
```

The workflow writes `android/release.keystore` and `android/keystore.properties` (not committed).

**Note:** Step `if:` conditions cannot reference the `secrets` context on GitHub Actions. The workflow sets `env.HAS_ANDROID_KEYSTORE` at the job level from `secrets.ANDROID_KEYSTORE_BASE64 != ''`, then steps use `env.HAS_ANDROID_KEYSTORE == 'true'`.

If these secrets are **missing**, CI still runs **`assembleDebug`** and uploads a **debug APK** so you can verify the pipeline without sharing signing keys.

## iOS — what CI produces today

The workflow builds **Release** for **iOS Simulator** (no Apple Distribution certificate required). The artifact is a **zip of `App.app`** — suitable for **CI verification only**, not for TestFlight or the App Store.

### Store-ready IPA (not automated here)

Shipping to the App Store needs:

- Apple Distribution certificate + provisioning profile  
- Usually **Xcode Archive** on a Mac, or **Fastlane match**, or a third-party CI with signing secrets  

You can extend this repo later with:

- Importing a `.p12` + profile from GitHub Secrets  
- `xcodebuild archive` + `xcodebuild -exportArchive` with an `ExportOptions.plist`  

Apple’s and your org’s security policies should guide how those secrets are stored.

## Shared Xcode scheme

The shared scheme [`ios/App/App.xcodeproj/xcshareddata/xcschemes/App.xcscheme`](../ios/App/App.xcodeproj/xcshareddata/xcschemes/App.xcscheme) is committed so `xcodebuild -scheme App` works on CI and for teammates.

## Runner images

- **Android:** `ubuntu-latest` (SDK via `android-actions/setup-android`)  
- **iOS:** `macos-14` (Xcode + CocoaPods)  

Image updates can change simulator destinations; adjust the workflow if `xcodebuild` reports an invalid destination.
