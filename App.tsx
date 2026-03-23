import 'react-native-url-polyfill/auto';
import React, { useEffect } from 'react';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import * as NavigationBar from 'expo-navigation-bar';

export default function App() {
  useEffect(() => {
    if (Platform.OS === 'android') {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
      <StatusBar style="light" />
    </SafeAreaProvider>
  );
}
