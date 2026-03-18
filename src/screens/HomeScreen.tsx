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
    type: 'Studio',
    rating: 4.9,
    reviews: 128,
    verified: true,
    amenities: ['WiFi', 'AC', 'Attached Bathroom']
  },
  {
    id: '2',
    title: 'Spacious 1BHK with View',
    price: 12000,
    location: 'Civil Lines',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1e52b154ce?auto=format&fit=crop&q=80&w=800',
    beds: 1,
    baths: 1,
    type: '1BHK',
    rating: 4.8,
    reviews: 24,
    verified: false,
    amenities: ['WiFi', 'Washing Machine']
  },
];

export default function HomeScreen({ navigation }: any) {
  const [activeLocation, setActiveLocation] = useState('Sehore');
  const [activeType, setActiveType] = useState('All');

  const filteredProperties = activeType === 'All' ? MOCK_PROPERTIES : MOCK_PROPERTIES.filter(p => p.type === activeType);

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
              <Ionicons name="add" size={16} color="#FF4500" />
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
            <View style={styles.filterIconBg}>
               <Ionicons name="options" size={18} color="#FF4500" />
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.locationScroll} contentContainerStyle={styles.locationContainer}>
            {['Sehore', 'Bhopal', 'Indore', 'Ichhawar', 'Ashta', 'Kothri'].map(loc => (
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
          {filteredProperties.map(item => (
            <View key={item.id} style={styles.horizontalCardContainer}>
              <PropertyCard data={item} onPress={() => navigation.navigate('RoomDetail', { property: item })} variant="horizontal" />
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
          {filteredProperties.map(item => (
             <PropertyCard key={`v-${item.id}`} data={item} onPress={() => navigation.navigate('RoomDetail', { property: item })} />
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
  listRoomButton: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  listRoomText: { color: '#FF4500', fontWeight: '700', marginLeft: 4, fontSize: 13 },
  searchContainer: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 24, borderRadius: 24, padding: 8, paddingLeft: 16, alignItems: 'center', marginBottom: 24 },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 15, color: '#000', height: 40 },
  filterIconBg: { backgroundColor: '#FFECE5', padding: 8, borderRadius: 12 },
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
