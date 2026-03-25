# App Store & Google Play — release checklist (Chemistry Index)

Project identifiers:

| Field | Value |
|--------|--------|
| iOS Bundle ID | `com.chemistryindex.app` |
| Android applicationId | `com.chemistryindex.app` |
| Display name | Chemistry Index |
| Capacitor | 7.x |

## Before each release

1. `npm run build && npx cap sync`
2. Bump versions together:
   - **iOS:** Xcode → target → General → Version / Build (`MARKETING_VERSION` / `CURRENT_PROJECT_VERSION` in `project.pbxproj`)
   - **Android:** `versionName` / `versionCode` in `android/app/build.gradle`
3. **Privacy policy URL (stores):** Apple and Google still typically require a **public URL** in the console, even if the app also shows the policy offline. Options: GitHub Pages, a static page mirroring `PRIVACY.md`, or your site. The in-app panel (`PrivacyPolicyPanel`) covers offline users; the URL satisfies store forms.

## Apple App Store

- [ ] Apple Developer Program active
- [ ] App ID matches `com.chemistryindex.app`
- [ ] App Store Connect record created; screenshots and description uploaded
- [ ] **App Privacy** questionnaire matches `PRIVACY.md` and actual behavior
- [ ] Archive **Release** in Xcode; upload via Organizer
- [ ] TestFlight (optional) then **Submit for review**

## Google Play

- [ ] Play Console developer account
- [ ] Create `android/keystore.properties` from `android/keystore.properties.example` (files are gitignored)
- [ ] Generate signed **AAB** (Release)
- [ ] **Data safety** form aligned with `PRIVACY.md`
- [ ] Internal testing track, then production rollout

## Repository hygiene

- Do not commit `keystore.properties`, `.jks`, or API secrets.
- iOS uses **UIScene** (`SceneDelegate.swift`) for current lifecycle requirements.
