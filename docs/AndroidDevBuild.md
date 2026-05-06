# **Android Dev Build Notes (Local)**

This doc records the current “known-good” path to run Android locally for Rock ID, plus the known blockers when a device/emulator is not available.

## **Goal**

- Make `pnpm android` a predictable step with explicit prerequisites and failure modes.
- Avoid accidentally committing generated native artifacts unless the repo explicitly adopts them.

## **Quick Path**

- Ensure Android Studio is installed (includes SDK + platform tools).
- Ensure JDK 17 is installed. `pnpm android` will prefer JDK 17 automatically on macOS when available.
- Ensure `adb` is available and works:
  - `adb devices`
- From repo root:
  - `pnpm android`

## **What `pnpm android` Does**

- Runs Expo’s Android dev-build lane through `scripts/run-android-with-jdk.mjs`, which sets `JAVA_HOME` to JDK 17 before invoking `expo run:android`.
- This may generate or update native Android artifacts locally (`android/`), even if those artifacts are not intended to be committed.

## **Package Identity**

- Android package is configured in `app.json`:
  - `expo.android.package = "com.anonymous.rockid"`

## **Common Blockers**

- No Android device or emulator available:
  - `adb devices` shows no attached devices.
  - Fix: start an emulator in Android Studio or attach a device with USB debugging enabled.
- Java/Gradle mismatch:
  - Error includes `Unsupported class file major version 69`.
  - Cause: Android build ran with Java 25.
  - Fix: install JDK 17 or set `ROCKID_ANDROID_JAVA_HOME`/`JAVA_HOME` to JDK 17 before `pnpm android`.
- Metro cannot resolve `promise/setimmediate/es6-extensions`:
  - Cause: React Native imports the `promise` package through a path that pnpm may not expose from nested package directories.
  - Fix: keep `promise` as a direct dependency and preserve the Metro alias in `metro.config.js`.
- Android SDK / platform-tools missing:
  - `adb` not found or cannot connect.
  - Fix: install “Android SDK Platform-Tools” in Android Studio.

## **Artifact Policy**

- Treat generated native artifacts as local-only unless a sprint explicitly adopts them.
- If Android files must be preserved for investigation, record their state in ignored local notes rather than committing them by default.

## **Release Gate**

- Run `pnpm run verify:release-builds` before any release bump.
- The gate includes Android JS bundle export and Android native build, plus matching iOS checks.
- A successful Android native build alone is not enough; Metro bundle export must pass too.
