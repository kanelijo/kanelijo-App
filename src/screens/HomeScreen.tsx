import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, TextInput, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PropertyCard, { PropertyData } from '../components/PropertyCard';
import { supabase } from '../services/supabase';

const MOCK_PROPERTIES: PropertyData[] = [
  {
    id: '1',
    title: 'Premium Studio Near BITS Pilani',
    price: 8500,
    location: 'Vidya Vihar Colony',
    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    beds: 1,
    baths: 1,
  },
  {
    id: '2',
    title: 'Spacious 1BHK with View',
    price: 12000,
    location: 'Civil Lines',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1e52b154ce?auto=format&fit=crop&q=80&w=800',
    beds: 1,
    baths: 1,
  },
];

export default function HomeScreen() {
  const [activeLocation, setActiveLocation] = useState('Pilani');
  const [activeType, setActiveType] = useState('All');

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>
      
      <LinearGradient colors={['#FF4500', '#FF3B30']} style={styles.headerGradient}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greetingText}>Find your perfect</Text>
              <Text style={styles.titleText}>Student Room</Text>
            </View>
            <TouchableOpacity style={styles.listRoomButton}>
              <Ionicons name="add" size={18} color="#FF6B6B" />
              <Text style={styles.listRoomText}>List Room</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#a1a1aa" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder="Search rooms, locations..."
              placeholderTextColor="#a1a1aa"
            />
            <Ionicons name="options" size={20} color="#FF6B6B" style={styles.filterIcon} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.locationScroll} contentContainerStyle={styles.locationContainer}>
            {['Pilani', 'Hyderabad', 'Bangalore', 'Goa'].map(loc => (
              <TouchableOpacity key={loc} style={[styles.locationPill, activeLocation === loc && styles.locationPillActive]} onPress={() => setActiveLocation(loc)}>
                <Ionicons name="location-outline" size={14} color="#fff" style={styles.locationPillIcon} />
                <Text style={styles.locationPillText}>{loc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.body}>
        
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Rooms</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList}>
          {MOCK_PROPERTIES.map(item => (
            <View key={item.id} style={styles.horizontalCardContainer}>
              <PropertyCard data={item} />
            </View>
          ))}
        </ScrollView>

        <View style={styles.filterRow}>
          <Text style={styles.sectionTitle}>6 Rooms Available</Text>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeFilters}>
          {['All', 'Studio', '1BHK', '2BHK'].map(type => (
            <TouchableOpacity key={type} onPress={() => setActiveType(type)}>
              {activeType === type ? (
                <LinearGradient colors={['#FF4500', '#FF3B30']} style={styles.typePillActive}>
                  <Ionicons name="grid-outline" size={16} color="#fff" style={styles.typeIcon} />
                  <Text style={styles.typePillTextActive}>{type}</Text>
                </LinearGradient>
              ) : (
                <View style={styles.typePill}>
                  <Ionicons name="home-outline" size={16} color="#a1a1aa" style={styles.typeIcon} />
                  <Text style={styles.typePillText}>{type}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.verticalList}>
          {MOCK_PROPERTIES.map(item => (
             <PropertyCard key={`v-${item.id}`} data={item} />
          ))}
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  greetingText: { fontSize: 16, color: '#fff', fontWeight: '500', opacity: 0.9 },
  titleText: { fontSize: 32, color: '#fff', fontWeight: '800', marginTop: 4 },
  listRoomButton: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, alignItems: 'center' },
  listRoomText: { color: '#FF4500', fontWeight: '700', marginLeft: 4, fontSize: 13 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 24, borderRadius: 24, padding: 16, alignItems: 'center', marginBottom: 24 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  filterIcon: { marginLeft: 12 },
  locationScroll: { paddingLeft: 24 },
  locationContainer: { paddingRight: 48 },
  locationPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 12 },
  locationPillActive: { backgroundColor: 'rgba(255,255,255,0.4)', borderWidth: 1, borderColor: '#fff' },
  locationPillIcon: { marginRight: 6 },
  locationPillText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  body: { paddingVertical: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  seeAllText: { color: '#FF4500', fontWeight: '600', fontSize: 14 },
  horizontalList: { paddingLeft: 24, paddingRight: 8 },
  horizontalCardContainer: { width: 280, marginRight: 16 },
  filterRow: { paddingHorizontal: 24, marginTop: 16, marginBottom: 16 },
  typeFilters: { paddingLeft: 24, marginBottom: 24 },
  typePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#131316', borderWidth: 1, borderColor: '#27272a', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 12 },
  typePillActive: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginRight: 12 },
  typeIcon: { marginRight: 8 },
  typePillText: { color: '#a1a1aa', fontWeight: '600', fontSize: 13 },
  typePillTextActive: { color: '#fff', fontWeight: '600', fontSize: 13 },
  verticalList: { paddingHorizontal: 24 },
});
