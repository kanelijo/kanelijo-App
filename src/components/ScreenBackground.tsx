import React from 'react';
import { ImageBackground, StyleSheet, View, StatusBar } from 'react-native';

// Shared wallpaper background used across all screens.
// Mimics the WhatsApp-style light patterned background.
const wallpaper = require('../../assets/wallpaper.png');

interface Props {
  children: React.ReactNode;
  style?: object;
}

export default function ScreenBackground({ children, style }: Props) {
  return (
    <ImageBackground
      source={wallpaper}
      style={[styles.root, style]}
      resizeMode="repeat"
      imageStyle={styles.image}
    >
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#f5f4f2' },
  image: { opacity: 0.45 },
});
