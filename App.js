import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './src/navigation/RootNavigator';
import {VideosProvider} from './src/context/VideosContext';
import {SettingsProvider} from './src/context/SettingsContext';
import {
  registerAppWithCodePush,
  syncOtaOnLaunch,
} from './src/services/ota';

function App() {
  useEffect(() => {
    syncOtaOnLaunch();
  }, []);

  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <VideosProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <RootNavigator />
        </VideosProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

export default registerAppWithCodePush(App);
