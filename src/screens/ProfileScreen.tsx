import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabase';

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ saved: 0, listed: 0, total_listings: 0 });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) return;
    setUser(data.user);
    fetchStats(data.user.id);
  };

  const fetchStats = async (userId: string) => {
    try {
      const [savedRes, roomsRes, shopsRes, libsRes, jobsRes] = await Promise.all([
        supabase.from('saved_rooms').select('id', { count: 'exact' }).eq('user_id', userId),
        supabase.from('rooms').select('id', { count: 'exact' }).eq('owner_id', userId),
        supabase.from('shops').select('id', { count: 'exact' }).eq('owner_id', userId),
        supabase.from('libraries').select('id', { count: 'exact' }).eq('owner_id', userId),
        supabase.from('jobs').select('id', { count: 'exact' }).eq('poster_id', userId),
      ]);

      const savedCount = savedRes.count || 0;
      const totalListed = (roomsRes.count || 0) + (shopsRes.count || 0) + (libsRes.count || 0) + (jobsRes.count || 0);

      setStats({ saved: savedCount, listed: totalListed, total_listings: totalListed });
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const name = user?.user_metadata?.full_name || user?.user_metadata?.name || 'User';
  const email = user?.email || '';
  const roleString = user?.user_metadata?.role || 'member';
  const displayRole = roleString.charAt(0).toUpperCase() + roleString.slice(1);
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topHeader}>
        <Text style={styles.headerTitleKanelijo}>Kanelijo</Text>
      </View>
      <ScrollView contentContainerStyle={styles.container}>

        <View style={styles.headerCard}>
          <LinearGradient colors={['#FF4500', '#FF3B30']} style={styles.avatarGradient}>
            <Text style={styles.initials}>{initials || '👤'}</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
            </View>
          </LinearGradient>

          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userRole}>{displayRole} · Kanelijo</Text>
          <Text style={styles.userEmail}>{email}</Text>

          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statBox} onPress={() => navigation.navigate('Saved')}>
              <Text style={styles.statNumber}>{stats.saved}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statBox} onPress={() => navigation.navigate('MyListings')}>
              <Text style={styles.statNumber}>{stats.listed}</Text>
              <Text style={styles.statLabel}>Listed</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>🔥</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
          </View>
        </View>

        {/* List New */}
        <Text style={styles.sectionTitle}>LIST SOMETHING</Text>
        <View style={styles.listGrid}>
          {[
            { label: 'Room', screen: 'AddRoom', icon: 'home-outline', colors: ['#FF4500', '#FF3B30'] as [string,string] },
            { label: 'Shop', screen: 'AddShop', icon: 'storefront-outline', colors: ['#FF512F', '#F09819'] as [string,string] },
            { label: 'Library', screen: 'AddLibrary', icon: 'library-outline', colors: ['#3282B8', '#0F4C75'] as [string,string] },
            { label: 'Job', screen: 'AddJob', icon: 'briefcase-outline', colors: ['#10B981', '#059669'] as [string,string] },
          ].map(item => (
            <TouchableOpacity key={item.label} style={styles.listCard} onPress={() => navigation.navigate(item.screen)}>
              <LinearGradient colors={item.colors} style={styles.listCardGradient}>
                <Ionicons name={item.icon as any} size={22} color="#fff" />
                <Text style={styles.listCardLabel}>{item.label}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>MY ACTIVITY</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="heart-outline" label="Saved Rooms" onPress={() => navigation.navigate('Favourite')} />
          <MenuItem icon="home-outline" label="My Listings" onPress={() => navigation.navigate('MyListings')} />
        </View>

        <Text style={styles.sectionTitle}>ACCOUNT</Text>
        <View style={styles.menuCard}>
          <MenuItem icon="person-outline" label="Edit Profile" onPress={() => navigation.navigate('EditProfile')} />
          <MenuItem icon="notifications-outline" label="Notifications" onPress={() => navigation.navigate('Notifications')} />
          <MenuItem icon="shield-checkmark-outline" label="Privacy & Security" onPress={() => navigation.navigate('PrivacySecurity')} />
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
      <View style={styles.menuIconContainer}><Ionicons name={icon} size={20} color="#e4e4e7" /></View>
      <Text style={styles.menuLabel}>{label}</Text>
      <Ionicons name="chevron-forward" size={20} color="#3f3f46" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  topHeader: { paddingHorizontal: 24, paddingVertical: 12 },
  headerTitleKanelijo: { fontSize: 24, fontWeight: '800', color: '#FF3B30', letterSpacing: 1 },
  container: { paddingHorizontal: 16, paddingBottom: 60, paddingTop: 8 },
  headerCard: { backgroundColor: '#131316', borderRadius: 24, paddingVertical: 32, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#27272a' },
  avatarGradient: { width: 88, height: 88, borderRadius: 44, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  initials: { fontSize: 28, fontWeight: '800', color: '#fff' },
  verifiedBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#131316', borderRadius: 14, padding: 2 },
  userName: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 2 },
  userRole: { fontSize: 13, color: '#FF4500', fontWeight: '600', marginBottom: 4 },
  userEmail: { fontSize: 13, color: '#a1a1aa', marginBottom: 24 },
  statsContainer: { flexDirection: 'row', justifyContent: 'center', width: '100%' },
  statBox: { alignItems: 'center', paddingHorizontal: 24 },
  statDivider: { width: 1, height: 40, backgroundColor: '#27272a' },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#fff', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#a1a1aa' },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#71717a', marginLeft: 4, marginBottom: 10, marginTop: 8, letterSpacing: 1 },
  listGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  listCard: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  listCardGradient: { paddingVertical: 16, alignItems: 'center', gap: 6 },
  listCardLabel: { color: '#fff', fontSize: 11, fontWeight: '700' },
  menuCard: { backgroundColor: '#131316', borderRadius: 16, paddingVertical: 8, marginBottom: 20, borderWidth: 1, borderColor: '#27272a' },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  menuIconContainer: { marginRight: 16 },
  menuLabel: { flex: 1, fontSize: 15, color: '#e4e4e7', fontWeight: '500' },
});
