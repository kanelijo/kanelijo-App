import React, { useState, useEffect } from 'react';
import ScreenBackground from '../components/ScreenBackground';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PropertyCard, { PropertyData } from '../components/PropertyCard';
import { supabase } from '../services/supabase';

function mapRoom(room: any): PropertyData {
  return {
    id: room.id,
    title: room.title,
    price: room.rent_monthly || 0,
    location: room.address || '',
    imageUrl: (room.images && room.images.length > 0)
      ? room.images[0]
      : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    beds: 1,
    baths: 1,
    type: room.room_type || 'Room',
    verified: !!room.owner_id,
    amenities: room.amenities || [],
    latitude: room.latitude,
    longitude: room.longitude,
    nearby_places: room.nearby_places || [],
  };
}

const VERTICALS = [
  { name: 'Shops', screen: 'Shops', icon: 'storefront-outline', colors: ['#FF512F', '#F09819'] as [string, string] },
  { name: 'Libraries', screen: 'Libraries', icon: 'library-outline', colors: ['#3282B8', '#0F4C75'] as [string, string] },
  { name: 'Jobs', screen: 'Jobs', icon: 'briefcase-outline', colors: ['#10B981', '#059669'] as [string, string] },
];

export default function ExploreScreen({ navigation }: any) {
  const [rooms, setRooms] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRoomType, setActiveRoomType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRooms((data || []).map(mapRoom));
    } catch (e) {
      console.error('Error fetching rooms for explore:', e);
    } finally {
      setLoading(false);
    }
  };

  const filtered = rooms.filter(r => {
    const matchType = activeRoomType === 'All' || r.type === activeRoomType;
    const matchSearch = searchQuery === '' || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

  return (
    <ScreenBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Ecosystem Switcher Tiles */}
        <Text style={styles.switcherTitle}>EXPLORE ECOSYSTEM</Text>
        <View style={styles.switcherRow}>
          {VERTICALS.map(v => (
            <TouchableOpacity key={v.name} style={styles.switcherCard} onPress={() => navigation.navigate(v.screen)} activeOpacity={0.8}>
              <LinearGradient colors={v.colors} style={styles.switcherGradient}>
                <Ionicons name={v.icon as any} size={26} color="#fff" />
                <Text style={styles.switcherLabel}>{v.name}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#a1a1aa" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search rooms, locations..."
            placeholderTextColor="#a1a1aa"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Room Type Filter */}
        <View style={styles.filterCard}>
          <Text style={styles.filterLabel}>ROOM TYPE</Text>
          <View style={styles.pillRow}>
            {['All', 'Single Room', 'Double Room', 'Studio', '1BHK', '2BHK'].map(type => (
              <FilterPill key={type} label={type} active={activeRoomType === type} onPress={() => setActiveRoomType(type)} />
            ))}
          </View>
        </View>

        <Text style={styles.resultsCount}>{filtered.length} rooms found</Text>

        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#FF4500" style={{ marginTop: 40 }} />
          ) : filtered.length === 0 ? (
            <Text style={styles.emptyText}>No rooms match your search yet.</Text>
          ) : (
            filtered.map(item => (
              <PropertyCard
                key={item.id}
                data={item}
                variant="vertical"
                onPress={() => navigation.navigate('RoomDetail', { property: item })}
              />
            ))
          )}
        </View>

      </ScrollView>
    </ScreenBackground>
  );
}

function FilterPill({ label, active, onPress }: any) {
  if (active) {
    return (
      <TouchableOpacity onPress={onPress}>
        <LinearGradient colors={['#FF4500', '#FF3B30']} style={styles.pillActive}>
          <Text style={styles.pillTextActive}>{label}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={styles.pillInactive} onPress={onPress}>
      <Text style={styles.pillTextInactive}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  switcherTitle: { color: '#71717a', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  switcherRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  switcherCard: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  switcherGradient: { paddingVertical: 18, alignItems: 'center', gap: 8 },
  switcherLabel: { color: '#fff', fontSize: 12, fontWeight: '700' },
  searchContainer: { flexDirection: 'row', backgroundColor: '#131316', borderRadius: 20, padding: 16, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#27272a' },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#fff' },
  filterCard: { backgroundColor: '#131316', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#27272a', marginBottom: 24 },
  filterLabel: { color: '#a1a1aa', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pillActive: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  pillTextActive: { color: '#fff', fontSize: 13, fontWeight: '700' },
  pillInactive: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#18181b', borderWidth: 1, borderColor: '#3f3f46' },
  pillTextInactive: { color: '#e4e4e7', fontSize: 13, fontWeight: '500' },
  resultsCount: { color: '#a1a1aa', fontSize: 14, fontWeight: '500', marginBottom: 16, marginLeft: 4 },
  listContainer: { paddingBottom: 40 },
  emptyText: { color: '#71717a', fontSize: 15, textAlign: 'center', marginTop: 40 },
});



