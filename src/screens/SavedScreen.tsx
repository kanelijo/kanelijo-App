import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function SavedScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Rooms</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart-outline" size={40} color="#FF6B6B" />
        </View>

        <Text style={styles.title}>No saved rooms yet</Text>
        <Text style={styles.subtitle}>
          Tap the heart icon on any room to save it here for easy access
        </Text>

        <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
          <LinearGradient colors={['#FF4500', '#FF3B30']} start={{x:0,y:0}} end={{x:1,y:0}} style={styles.button}>
            <Ionicons name="search" size={20} color="#fff" style={{marginRight: 8}} />
            <Text style={styles.buttonText}>Browse Rooms</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#18181b', justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#27272a' },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#a1a1aa', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  button: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' }
});
