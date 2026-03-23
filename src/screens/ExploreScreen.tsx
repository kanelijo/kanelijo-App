import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PropertyCard, { PropertyData } from '../components/PropertyCard';

const MOCK_PROPERTIES: PropertyData[] = [
  {
    id: '1',
    title: 'Premium Studio Near BITS Pilani',
    price: 8500,
    location: 'Vidya Vihar Colony, Pilani',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    beds: 0, baths: 1, rating: 4.8, reviews: 24, type: 'Studio', verified: true,
    amenities: ['WiFi', 'AC', 'Attached Bathroom']
  },
  {
    id: '2',
    title: 'Spacious 1BHK with View',
    price: 12000,
    location: 'Civil Lines',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1e52b154ce?auto=format&fit=crop&q=80&w=800',
    beds: 1, baths: 1, rating: 4.9, reviews: 15, type: '1BHK', verified: true,
    amenities: ['Private Balcony', 'Furnished', 'Security']
  },
];

const VERTICALS = [
  { name: 'Shops', screen: 'Shops', icon: 'storefront-outline', colors: ['#FF512F', '#F09819'] as [string, string] },
  { name: 'Libraries', screen: 'Libraries', icon: 'library-outline', colors: ['#3282B8', '#0F4C75'] as [string, string] },
  { name: 'Jobs', screen: 'Jobs', icon: 'briefcase-outline', colors: ['#10B981', '#059669'] as [string, string] },
];

export default function ExploreScreen({ navigation }: any) {
  const [activeRoomType, setActiveRoomType] = useState('All');
  const [activeGender, setActiveGender] = useState('All');
  const [activeRent, setActiveRent] = useState('Any');

  return (
    <SafeAreaView style={styles.safeArea}>
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
          />
          <Ionicons name="options" size={20} color="#fff" style={styles.filterIcon} />
        </View>

        <View style={styles.filterCard}>
          <Text style={styles.filterLabel}>ROOM TYPE</Text>
          <View style={styles.pillRow}>
            {['All', 'Single', 'Double', 'Studio', '1BHK', '2BHK'].map(type => (
              <FilterPill key={type} label={type} active={activeRoomType === type} onPress={() => setActiveRoomType(type)} />
            ))}
          </View>

          <Text style={styles.filterLabel}>GENDER</Text>
          <View style={styles.pillRow}>
            {['All', 'Male', 'Female', 'Any'].map(g => (
              <FilterPill key={g} label={g} active={activeGender === g} onPress={() => setActiveGender(g)} />
            ))}
          </View>

          <Text style={styles.filterLabel}>MAX RENT</Text>
          <View style={styles.pillRow}>
            {['Any', '< ₹5k', '₹5k-10k', '₹10k-15k', '₹15k+'].map(r => (
              <FilterPill key={r} label={r} active={activeRent === r} onPress={() => setActiveRent(r)} />
            ))}
          </View>
        </View>

        <Text style={styles.resultsCount}>{MOCK_PROPERTIES.length} rooms found</Text>

        <View style={styles.listContainer}>
          {MOCK_PROPERTIES.map(item => (
            <PropertyCard key={item.id} data={item} variant="vertical" onPress={() => navigation.navigate('RoomDetail', { property: item })} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
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
  safeArea: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  switcherTitle: { color: '#71717a', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  switcherRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  switcherCard: { flex: 1, borderRadius: 16, overflow: 'hidden' },
  switcherGradient: { paddingVertical: 18, alignItems: 'center', gap: 8 },
  switcherLabel: { color: '#fff', fontSize: 12, fontWeight: '700' },
  searchContainer: { flexDirection: 'row', backgroundColor: '#131316', borderRadius: 20, padding: 16, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#27272a' },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#fff' },
  filterIcon: { marginLeft: 12 },
  filterCard: { backgroundColor: '#131316', padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#27272a', marginBottom: 24 },
  filterLabel: { color: '#a1a1aa', fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 12, marginTop: 4 },
  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  pillActive: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  pillTextActive: { color: '#fff', fontSize: 13, fontWeight: '700' },
  pillInactive: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#18181b', borderWidth: 1, borderColor: '#3f3f46' },
  pillTextInactive: { color: '#e4e4e7', fontSize: 13, fontWeight: '500' },
  resultsCount: { color: '#a1a1aa', fontSize: 14, fontWeight: '500', marginBottom: 16, marginLeft: 4 },
  listContainer: { paddingBottom: 40 },
});
