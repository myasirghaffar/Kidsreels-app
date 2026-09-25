import codePush from '@revopush/react-native-code-push';

const CODE_PUSH_HOC_OPTIONS = {
  checkFrequency: codePush.CheckFrequency.MANUAL,
  installMode: codePush.InstallMode.ON_NEXT_RESTART,
  mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESTART,
};

/**
 * Wraps root App with Revopush CodePush HOC when the native module is linked.
 */
export function registerAppWithCodePush(AppComponent) {
  if (typeof codePush === 'function') {
    return codePush(CODE_PUSH_HOC_OPTIONS)(AppComponent);
  }
  return AppComponent;
}
