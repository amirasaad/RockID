# **Android Dev Build Notes (Local)**

This doc records the current “known-good” path to run Android locally for Rock ID, plus the known blockers when a device/emulator is not available.

## **Goal**

- Make `pnpm android` a predictable step with explicit prerequisites and failure modes.
- Avoid accidentally committing generated native artifacts unless the repo explicitly adopts them.

## **Quick Path**

- Ensure Android Studio is installed (includes SDK + platform tools).
- Ensure `adb` is available and works:
  - `adb devices`
- From repo root:
  - `pnpm android`

## **What `pnpm android` Does**

- Runs Expo’s Android dev-build lane (`expo run:android`) via the `android` script in `package.json`.
- This may generate or update native Android artifacts locally (`android/`), even if those artifacts are not intended to be committed.

## **Package Identity**

- Android package is configured in `app.json`:
  - `expo.android.package = "com.anonymous.rockid"`

## **Common Blockers**

- No Android device or emulator available:
  - `adb devices` shows no attached devices.
  - Fix: start an emulator in Android Studio or attach a device with USB debugging enabled.
- Android SDK / platform-tools missing:
  - `adb` not found or cannot connect.
  - Fix: install “Android SDK Platform-Tools” in Android Studio.

## **Artifact Policy**

- Treat generated native artifacts as local-only unless a sprint explicitly adopts them.
- If Android files must be preserved for investigation, record their state in ignored local notes rather than committing them by default.
