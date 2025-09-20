# ICE‑CODE.mobile (MVP)

MVP React Native app to read, edit and write NFC tags using the ICE‑CODE NDEF schema (Text, Text, URI) and export a NFC Writer JSON (ntgui_version=18).

## App identifiers
- Display name: `ICE‑CODE.help`
- Android applicationId: `com.icecode.app`
- iOS bundle id: `com.icecode.app`

## Repo contents
- NFC service: `src/services/ndef.ts`
- MVP screen: `src/screens/EncodeScreen.tsx`
- App entry: `App.tsx`
- Branding SVG: `branding/ice-code-logo.svg`
- Icon helper: `tools/generate-icons.js`

## Getting started

### Option A — Add to an existing RN app
1. Copy `src/` and `App.tsx`, or import the screen into your navigator.
2. Install deps:
   ```bash
   npm i react-native-nfc-manager
   ```
3. Android (`android/app/src/main/AndroidManifest.xml`):
   ```xml
   <uses-permission android:name="android.permission.NFC" />
   <uses-feature android:name="android.hardware.nfc" android:required="true" />
   ```
4. iOS (Xcode):
   - Bundle ID: `com.icecode.app`
   - Info.plist keys:
     - `NFCReaderUsageDescription`
     - `com.apple.developer.nfc.readersession.formats` = `NDEF`
5. Run on a real device (NFC requires hardware).

### Option B — Start fresh
```bash
npx react-native init ICECODE --template react-native-template-typescript
# then copy files from this repo, and:
npm i react-native-nfc-manager
```

## JSON export
The UI exports a JSON compatible with NFC Writer (ntgui_version=18) and suggests a filename `username_YYYYMMDD_NFCntguiv18.json`.

## Branding
- Primary color: `#e30613`
- Vector logo: `branding/ice-code-logo.svg`
- Generate icons: `node tools/generate-icons.js`

## Roadmap
- Magic link auth + CB sync (GET/PUT profile)
- Diff resolution Tag ↔ Online
- Store builds (Play / App Store)