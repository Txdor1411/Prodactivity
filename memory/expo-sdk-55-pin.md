---
name: expo-sdk-55-pin
description: Why the Prodactivity app is pinned to Expo SDK 55 (not 56)
metadata:
  type: project
---

The app is intentionally pinned to **Expo SDK 55**, not the latest SDK 56. It was scaffolded on SDK 56, but the Expo Go app in the Google Play Store only supports SDK 55, so SDK 56 produced "Project is incompatible with this version of Expo Go." Downgraded to SDK 55 (2026-06-13) so the user can run it in Expo Go.

**Why:** The user develops/tests on Expo Go (not a dev build).
**How to apply:** Do NOT bump to SDK 56+ unless the user moves to a development build or store Expo Go gains SDK 56 support. `@expo/ui` and `expo-glass-effect` are in package.json but unused — they're native and won't work in Expo Go anyway.
