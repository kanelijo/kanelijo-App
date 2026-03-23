import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, SafeAreaView, Animated, Easing, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PropertyCard, { PropertyData } from '../components/PropertyCard';
import { supabase } from '../services/supabase';

// Maps Supabase room rows to the PropertyData shape our cards expect
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
    rating: undefined,
    reviews: undefined,
    verified: !!room.owner_id,
    amenities: room.amenities || [],
    // Pass map coordinates through so RoomDetailScreen can render map
    latitude: room.latitude,
    longitude: room.longitude,
    nearby_places: room.nearby_places || [],
  };
}

export default function HomeScreen({ navigation }: any) {
  const [rooms, setRooms] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLocation, setActiveLocation] = useState('All');
  const [activeType, setActiveType] = useState('All');
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
      console.error('Error fetching rooms:', e);
    } finally {
      setLoading(false);
    }
  };

  // Filter logic
  const filtered = rooms.filter(r => {
    const matchType = activeType === 'All' || r.type === activeType;
    const matchLocation = activeLocation === 'All' || r.location.toLowerCase().includes(activeLocation.toLowerCase());
    const matchSearch = searchQuery === '' || r.title.toLowerCase().includes(searchQuery.toLowerCase()) || r.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchLocation && matchSearch;
  });

  const featured = rooms.slice(0, 6);
  const duplicatedFeatured = featured.length > 0 ? [...featured, ...featured, ...featured] : [];

  // Typewriter Effect
  const typingWords = ['Student Rooms', 'Libraries', 'Coachings', 'Schools', 'Family Rooms'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const currentWord = typingWords[currentWordIndex];
    let timeout: NodeJS.Timeout;
    if (!isDeleting) {
      if (displayText.length < currentWord.length) {
        timeout = setTimeout(() => setDisplayedText(currentWord.slice(0, displayText.length + 1)), 120);
      } else {
        timeout = setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => setDisplayedText(displayText.slice(0, -1)), 60);
      } else {
        setIsDeleting(false);
        setCurrentWordIndex(prev => (prev + 1) % typingWords.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWordIndex]);

  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(c => !c), 500);
    return () => clearInterval(cursorInterval);
  }, []);

  // Marquee
  const translateX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, {
        toValue: -888,
        duration: 7500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [translateX]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>
      
      <LinearGradient colors={['#FF4500', '#FF3B30']} style={styles.headerGradient}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <View style={styles.typewriterContainer}>
              <Text style={styles.greetingText}>Find your perfect</Text>
              <Text style={styles.titleText} numberOfLines={1} adjustsFontSizeToFit>
                {displayText}<Text style={{ opacity: showCursor ? 1 : 0 }}>|</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.listRoomButton} onPress={() => navigation.navigate('AddRoom')}>
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
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <View style={styles.filterIconBg}>
              <Ionicons name="options" size={18} color="#FF4500" />
            </View>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.locationScroll} contentContainerStyle={styles.locationContainer}>
            {['All', 'Sehore', 'Bhopal', 'Indore', 'Ichhawar', 'Ashta'].map(loc => (
              <TouchableOpacity key={loc} style={[styles.locationPill, activeLocation === loc && styles.locationPillActive]} onPress={() => setActiveLocation(loc)}>
                <Ionicons name="location-outline" size={14} color="#fff" style={styles.locationPillIcon} />
                <Text style={styles.locationPillText}>{loc}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.body}>

        {/* Featured Rooms Marquee */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Rooms</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FF4500" style={{ marginVertical: 40 }} />
        ) : featured.length === 0 ? (
          <Text style={styles.emptyText}>No rooms listed yet. Be the first! 🏠</Text>
        ) : (
          <View style={{ overflow: 'hidden', paddingVertical: 10 }}>
            <Animated.View style={[styles.horizontalList, { width: 3000, flexDirection: 'row', transform: [{ translateX }] }]}>
              {duplicatedFeatured.map((item, index) => (
                <View key={`${item.id}-${index}`} style={styles.horizontalCardContainer}>
                  <PropertyCard data={item} onPress={() => navigation.navigate('RoomDetail', { property: item })} variant="horizontal" />
                </View>
              ))}
            </Animated.View>
          </View>
        )}

        {/* Type Filter + Vertical List */}
        <View style={styles.filterRow}>
          <Text style={styles.sectionTitle}>{filtered.length} Rooms Available</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.typeFilters}>
          {['All', 'Studio', '1BHK', '2BHK', 'Single Room', 'Double Room'].map(type => (
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
          {filtered.length === 0 && !loading ? (
            <Text style={styles.emptyText}>No rooms match your filter yet.</Text>
          ) : (
            filtered.map(item => (
              <PropertyCard key={`v-${item.id}`} data={item} onPress={() => navigation.navigate('RoomDetail', { property: item })} />
            ))
          )}
        </View>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  headerGradient: { paddingTop: 60, paddingBottom: 24 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 24, marginBottom: 24 },
  typewriterContainer: { flex: 1, paddingRight: 10, minHeight: 65 },
  greetingText: { fontSize: 16, color: '#fff', fontWeight: '500', opacity: 0.9 },
  titleText: { fontSize: 32, color: '#fff', fontWeight: '800', marginTop: 4 },
  listRoomButton: { flexDirection: 'row', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 24, alignItems: 'center' },
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
  emptyText: { color: '#71717a', fontSize: 15, textAlign: 'center', marginTop: 40, marginBottom: 40 },
});
