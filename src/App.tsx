import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
// import { StyleSheet } from 'react-native';
import { BottomTabsNavigator } from './screens/BottomTabs.navigator';
import { AppProvider } from './App.provider';
import { Platform, UIManager } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

// LayoutAnimation is enabled by default on iOS, but it's still experimental on Android. In order to enable LayoutAnimation on Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export const App: FC = () => {
  React.useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <AppProvider>
      <NavigationContainer>
        <BottomTabsNavigator />
      </NavigationContainer>
    </AppProvider>
  );
};

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: 'teal',
//   },
// });

export default App;
