import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function MyListingsScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>My Listings</Text>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#FF4500" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="home-outline" size={48} color="#FF4500" />
        </View>
        <Text style={styles.emptyTitle}>No Listings Yet</Text>
        <Text style={styles.emptyDesc}>You haven't listed any rooms. Start earning by renting out your beautiful space to students today.</Text>
        
        <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('AddRoom')}>
          <LinearGradient colors={['#FF4500', '#FF3B30']} style={styles.createGradient}>
            <Text style={styles.createText}>Create a Listing</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  addButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: 'rgba(255, 69, 0, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: 'rgba(255, 69, 0, 0.2)' },
  emptyTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 12 },
  emptyDesc: { fontSize: 15, color: '#a1a1aa', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  createButton: { width: '100%' },
  createGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 24 },
  createText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
