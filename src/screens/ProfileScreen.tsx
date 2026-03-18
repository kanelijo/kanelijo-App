import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabase';

export default function ProfileScreen({ navigation }: any) {
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitleKanelijo}>Kanelijo</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.headerCard}>
          <LinearGradient colors={['#FF4500', '#FF3B30']} style={styles.avatarGradient}>
            <Ionicons name="person-outline" size={40} color="#fff" />
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            </View>
          </LinearGradient>
          
          <Text style={styles.userName}>Student User</Text>
          <Text style={styles.userEmail}>student@university.edu</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Viewed</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Listed</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>MY ACTIVITY</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="heart-outline" label="Saved Rooms" onPress={() => navigation.navigate('Saved')} />
          <MenuItem icon="time-outline" label="Recently Viewed" onPress={() => navigation.navigate('Explore')} />
          <MenuItem icon="home-outline" label="My Listings" onPress={() => alert('Listings coming soon!')} />
        </View>

        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="person-outline" label="Edit Profile" onPress={() => alert('Edit Profile coming soon!')} />
          <MenuItem icon="notifications-outline" label="Notifications" onPress={() => alert('Notifications coming soon!')} />
          <MenuItem icon="shield-checkmark-outline" label="Privacy & Security" onPress={() => alert('Privacy & Security coming soon!')} />
          <MenuItem icon="help-circle-outline" label="Help & Support" onPress={() => navigation.navigate('HelpSupport')} />
        </View>

        <Text style={styles.sectionTitle}>MORE</Text>
        <View style={styles.menuCard}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuIconContainer}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </View>
            <Text style={[styles.menuLabel, { color: '#EF4444' }]}>Log Out</Text>
            <Ionicons name="chevron-forward" size={20} color="#3f3f46" />
          </TouchableOpacity>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, label, onPress }: { icon: any; label: string; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <Ionicons name={icon} size={20} color="#e4e4e7" />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#3f3f46" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  topHeader: { paddingHorizontal: 24, paddingVertical: 12 },
  headerTitleKanelijo: { fontSize: 24, fontWeight: '800', color: '#FF3B30', letterSpacing: 1 },
  container: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 8 },
  headerCard: {
    backgroundColor: '#131316',
    borderRadius: 24,
    paddingVertical: 32,
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  avatarGradient: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: '#131316',
    borderRadius: 14,
    padding: 2,
  },
  userName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#a1a1aa', marginBottom: 24 },
  statsContainer: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
  statBox: { alignItems: 'center', paddingHorizontal: 24 },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#a1a1aa' },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#71717a', marginLeft: 16, marginBottom: 8, letterSpacing: 1 },
  menuCard: {
    backgroundColor: '#131316',
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuIconContainer: { marginRight: 16 },
  menuLabel: { flex: 1, fontSize: 15, color: '#e4e4e7', fontWeight: '500' },
});
