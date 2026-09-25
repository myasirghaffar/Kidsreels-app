# KidsReels

Private, offline kids video player with a full-screen vertical feed. Parents add videos from the device media library; KidsReels stores **references and metadata only** — it does **not** copy video files into app storage and does **not** use a backend.

## Features

- Full-screen vertical swipe feed (one video per screen, snap paging)
- Autoplay active video, pause neighbors, loop continuously
- Tap to play/pause with a brief overlay hint
- Add one or many local videos via the native picker
- Persistent local library (survives app restart)
- Library grid with thumbnails, multi-select delete, reorder
- Favorites and lightweight settings (autoplay / mute)
- Works fully offline after install

## Tech stack

| Layer | Choice |
| --- | --- |
| App | React Native CLI `0.87` (JavaScript) |
| Navigation | React Navigation (bottom tabs) |
| Playback | `react-native-video` |
| Picker | `react-native-image-picker` |
| Thumbnails | `react-native-create-thumbnail` |
| Metadata | `@react-native-async-storage/async-storage` |
| Permissions | `react-native-permissions` |
| OTA | `@revopush/react-native-code-push` |

No Expo, Firebase, Supabase, auth, API, analytics, or cloud sync.

## Why there is no backend

KidsReels is a **local player**, not a social network. Video bytes stay on the device. The app only remembers which local URIs the parent selected, plus titles, order, favorites, and cached thumbnails.

## Local storage architecture

`src/storage/videoStorage.js` persists an array of:

```js
{
  id,
  uri,           // file:// | content:// | ph:// reference — not a copied file
  title,
  thumbnailUri,  // small generated JPEG cache path
  duration,
  addedAt,
  position,
  isFavorite
}
```

Settings live in `src/storage/settingsStorage.js`.

### Video URI handling (no file copy)

1. User picks videos in the system gallery picker.
2. App stores the returned URI as-is.
3. Android: attempts `takePersistableUriPermission` for `content://` URIs when the OS allows it (`UriPermissionModule`).
4. iOS: prefers lasting Photos asset URIs from the picker (`assetRepresentationMode: 'current'`).
5. If a source file is later deleted or the URI becomes unreadable, the feed shows **Video unavailable** with **Remove from library**. Original device files are never deleted by KidsReels.

## Thumbnail strategy

`react-native-create-thumbnail` generates a JPEG once at import time. The path is saved on the video metadata and reused — not regenerated on every launch.

## Media permissions

### Android

- API 33+: `READ_MEDIA_VIDEO`
- API ≤ 32: `READ_EXTERNAL_STORAGE` (`maxSdkVersion=32`)

### iOS

- `NSPhotoLibraryUsageDescription` in `Info.plist`
- Photo Library permission via `react-native-permissions`

Denied / limited access shows a clear alert with a Settings shortcut.

## Project structure

```
src/
  components/   VideoFeed, VideoCard, LibraryGrid, EmptyState, …
  screens/      Home, Library, Settings
  navigation/   RootNavigator, MainTabs
  services/     mediaPicker, thumbnailService, uriPermission
  storage/      videoStorage, settingsStorage
  hooks/        useVideos, useVideoPlayback, usePermissions
  theme/        colors, typography, spacing, shadows
  utils/        videoUtils, permissions
```

## Player lifecycle

- Feed uses a virtualized `FlatList` with paging and viewability.
- Only the active index autoplays.
- Players mount for active ± 1; farther rows show thumbnail placeholders.
- Reaching past the last item wraps to the first (single sentinel row — no full dataset duplication).

## Development

```bash
npm install
npm start
```

### Android

```bash
npm run android
# or
cd android && ./gradlew assembleDebug
```

Requirements: Android SDK, emulator or device.

### iOS

```bash
cd ios && bundle install && bundle exec pod install && cd ..
npm run ios
```

Requirements: Xcode, CocoaPods, Simulator or device.

### Lint

```bash
npm run lint
```

### Release builds

```bash
# Android signed release APK (uses android/app/kidsreels-release.keystore)
npm run android:apk
# Output: android/app/build/outputs/apk/release/app-release.apk

# iOS Archive via Xcode (Product → Archive)
```

Release signing matches the consumer-app pattern:

- Keystore: `android/app/kidsreels-release.keystore` (gitignored)
- Alias / passwords: `android/gradle.properties` (`MYAPP_UPLOAD_*`)
- `android/app/build.gradle` release `signingConfig` reads those properties

### OTA updates (Revopush)

KidsReels uses [@revopush/react-native-code-push](https://www.npmjs.com/package/@revopush/react-native-code-push) for JS/asset over-the-air updates (same pattern as the consumer app). Native binaries still need a store/APK rebuild for native changes.

Revopush apps (one per platform):

| Platform | Revopush app | Default channel |
| --- | --- | --- |
| Android | `kidsreels App android` | Production |
| iOS | `kidsreels App Ios` | Production |

Release a JS update (requires `revopush login` once):

```bash
npm run ota:release              # Android + iOS Production
npm run ota:release:android      # Android Production only
npm run ota:release:ios          # iOS Production only
npm run ota:release:staging      # both Staging
```

Config lives in `src/services/ota/`. Native Production keys are in `android/.../strings.xml` and `ios/KidsReels/Info.plist`.

## Privacy

- No accounts, tracking SDKs, ads, or remote analytics
- Video data stays on-device unless the OS shares it through the system picker / Photos frameworks
- Release builds may contact Revopush (`api.revopush.org`) only to check/download OTA JS updates

## Known platform limitations

- **Android gallery picks** sometimes do not grant *persistable* URI flags. Playback works in-session; after restart a URI may become unavailable until the video is re-added. Prefer keepingsource files in shared storage the app can re-resolve.
- **iOS temporary file URIs** (if the system returns one) may not survive restart. Prefer Photos-backed URIs.
- Unsupported codecs show a playback error / unavailable state instead of crashing.
- Simulator photo libraries may have few or no videos — use a device for realistic picker tests.
- KidsReels never copies full video binaries; unavailable sources must be re-selected by the parent.

## Manual test checklist

1. Fresh install empty state  
2. Add one / many videos  
3. Cancel picker / deny permission  
4. Restart app — library still present  
5. Swipe up/down, loop, play/pause  
6. Delete one / many; clear all (metadata only)  
7. Portrait + landscape sources  
8. Large libraries (50–100+) for scroll performance  
