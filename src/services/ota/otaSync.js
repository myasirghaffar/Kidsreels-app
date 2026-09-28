import {NativeModules} from 'react-native';
import codePush from '@revopush/react-native-code-push';
import {ACTIVE_DEPLOYMENT_KEY} from './codePushConfig';

const LAUNCH_SYNC_DEFER_MS = 1600;

function isCodePushAvailable() {
  return (
    !!NativeModules.CodePush &&
    typeof codePush?.sync === 'function' &&
    typeof codePush?.CheckFrequency === 'object'
  );
}

export const OTA_SYNC_STATUS = codePush?.SyncStatus || {};

/**
 * Silent background sync on launch. Update installs on next restart.
 * Uses setTimeout only — InteractionManager is undefined under RN bridgeless
 * (New Architecture) and crashed release builds on mount.
 */
export function syncOtaOnLaunch() {
  if (__DEV__ || !isCodePushAvailable()) {
    return;
  }

  setTimeout(() => {
    codePush
      .sync({
        deploymentKey: ACTIVE_DEPLOYMENT_KEY,
        installMode: codePush.InstallMode.ON_NEXT_RESTART,
        mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
      })
      .catch(() => {
        // Silent — network / offline failures should not disturb playback.
      });
  }, LAUNCH_SYNC_DEFER_MS);
}

/**
 * User-initiated update check. Available updates install immediately and
 * CodePush restarts the app after installation.
 */
export function syncOtaManually(onStatusChange, onDownloadProgress) {
  if (__DEV__) {
    return Promise.reject(
      new Error('OTA updates are only available in an installed release build.'),
    );
  }

  if (!isCodePushAvailable()) {
    return Promise.reject(new Error('OTA update service is unavailable.'));
  }

  return codePush.sync(
    {
      deploymentKey: ACTIVE_DEPLOYMENT_KEY,
      installMode: codePush.InstallMode.IMMEDIATE,
      mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
    },
    onStatusChange,
    onDownloadProgress,
  );
}
