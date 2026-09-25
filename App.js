import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {RootNavigator} from './src/navigation/RootNavigator';
import {VideosProvider} from './src/context/VideosContext';
import {SettingsProvider} from './src/context/SettingsContext';
import {colors} from './src/theme';

function App() {
  return (
    <SafeAreaProvider>
      <SettingsProvider>
        <VideosProvider>
          <StatusBar
            barStyle="light-content"
            backgroundColor={colors.background}
          />
          <RootNavigator />
        </VideosProvider>
      </SettingsProvider>
    </SafeAreaProvider>
  );
}

export default App;
