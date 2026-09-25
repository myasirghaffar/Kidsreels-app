import {InteractionManager, NativeModules} from 'react-native';
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

/**
 * Silent background sync on launch. Update installs on next restart.
 */
export function syncOtaOnLaunch() {
  if (__DEV__ || !isCodePushAvailable()) {
    return;
  }

  InteractionManager.runAfterInteractions(() => {
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
  });
}
