import React, { useState, useEffect, useRef } from 'react';
import ScreenBackground from '../components/ScreenBackground';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, SafeAreaView, Animated, Easing, ActivityIndicator, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PropertyCard, { PropertyData } from '../components/PropertyCard';
import { supabase } from '../services/supabase';

const { width } = Dimensions.get('window');

function mapRoom(room: any): PropertyData {
  return {
    id: room.id,
    title: room.title,
    price: room.rent_monthly || 0,
    location: room.address || '',
    imageUrl: (room.images && room.images.length > 0)
      ? room.images[0]
      : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
    beds: 1, baths: 1,
    type: room.room_type || 'Room',
    verified: !!room.owner_id,
    amenities: room.amenities || [],
    latitude: room.latitude,
    longitude: room.longitude,
    nearby_places: room.nearby_places || [],
  };
}

const SERVICES = [
  {
    title: 'Find Rooms',
    subtitle: 'Student & family rooms near your college',
    icon: 'home',
    colors: ['#FF4500', '#FF3B30'] as [string, string],
    screen: 'Explore',
    count_table: 'rooms',
  },
  {
    title: 'Explore Shops',
    subtitle: 'Groceries, tiffins, cafes & more',
    icon: 'storefront',
    colors: ['#FF512F', '#F09819'] as [string, string],
    screen: 'Shops',
    count_table: 'shops',
  },
  {
    title: 'Study Libraries',
    subtitle: 'AC-cooled, quiet libraries near you',
    icon: 'library',
    colors: ['#3282B8', '#0F4C75'] as [string, string],
    screen: 'Libraries',
    count_table: 'libraries',
  },
  {
    title: 'Find Jobs',
    subtitle: 'Part-time, internships & tutoring gigs',
    icon: 'briefcase',
    colors: ['#10B981', '#059669'] as [string, string],
    screen: 'Jobs',
    count_table: 'jobs',
  },
];

export default function HomeScreen({ navigation }: any) {
  const [featuredRooms, setFeaturedRooms] = useState<PropertyData[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    fetchData();
    loadUser();
  }, []);

  const loadUser = async () => {
    const { data } = await supabase.auth.getUser();
    const name = data?.user?.user_metadata?.full_name || data?.user?.user_metadata?.name || '';
    setUserName(name.split(' ')[0]); // First name only
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch top 6 featured rooms
      const { data: rooms } = await supabase
        .from('rooms')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(6);
      setFeaturedRooms((rooms || []).map(mapRoom));

      // Fetch counts for all services in parallel
      const [roomsCount, shopsCount, libsCount, jobsCount] = await Promise.all([
        supabase.from('rooms').select('id', { count: 'exact', head: true }),
        supabase.from('shops').select('id', { count: 'exact', head: true }),
        supabase.from('libraries').select('id', { count: 'exact', head: true }),
        supabase.from('jobs').select('id', { count: 'exact', head: true }),
      ]);
      setCounts({
        rooms: roomsCount.count || 0,
        shops: shopsCount.count || 0,
        libraries: libsCount.count || 0,
        jobs: jobsCount.count || 0,
      });
    } catch (e) {
      console.error('HomeScreen fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  // Typewriter
  const typingWords = ['Student Rooms', 'Libraries', 'Shops', 'Jobs', 'Family Rooms'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    const word = typingWords[currentWordIndex];
    let t: NodeJS.Timeout;
    if (!isDeleting) {
      if (displayText.length < word.length) t = setTimeout(() => setDisplayedText(word.slice(0, displayText.length + 1)), 110);
      else t = setTimeout(() => setIsDeleting(true), 2000);
    } else {
      if (displayText.length > 0) t = setTimeout(() => setDisplayedText(displayText.slice(0, -1)), 55);
      else { setIsDeleting(false); setCurrentWordIndex(p => (p + 1) % typingWords.length); }
    }
    return () => clearTimeout(t);
  }, [displayText, isDeleting, currentWordIndex]);

  useEffect(() => {
    const c = setInterval(() => setShowCursor(v => !v), 500);
    return () => clearInterval(c);
  }, []);

  // Marquee
  const translateX = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.timing(translateX, { toValue: -900, duration: 8000, easing: Easing.linear, useNativeDriver: true })
    ).start();
  }, [translateX]);

  const duplicated = featuredRooms.length > 0
    ? [...featuredRooms, ...featuredRooms, ...featuredRooms]
    : [];

  return (
    <ScreenBackground>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} bounces={false}>

      {/* ── Compact Orange Header ── */}
      <LinearGradient colors={['#FF4500', '#FF3B30', '#cc2a00']} style={styles.header}>
        <SafeAreaView>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>👋 Hello, {userName || 'there'}!</Text>
              <Text style={styles.tagline}>
                Find your {displayText}<Text style={{ opacity: showCursor ? 1 : 0 }}>|</Text>
              </Text>
            </View>
            <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
              <Ionicons name="notifications-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <TouchableOpacity style={styles.searchBar} onPress={() => navigation.navigate('Explore')} activeOpacity={0.8}>
            <Ionicons name="search" size={18} color="#a1a1aa" style={{ marginRight: 10 }} />
            <Text style={styles.searchPlaceholder}>Search rooms, shops, libraries...</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>

      {/* ── Body ── */}
      <View style={styles.body}>

        {/* Featured Rooms */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>⭐ Featured Rooms</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#FF4500" style={{ marginVertical: 32 }} />
        ) : featuredRooms.length === 0 ? (
          <View style={styles.emptyFeatured}>
            <Ionicons name="home-outline" size={36} color="#3f3f46" />
            <Text style={styles.emptyFeaturedText}>No rooms listed yet</Text>
            <TouchableOpacity onPress={() => navigation.navigate('AddRoom')}>
              <LinearGradient colors={['#FF4500', '#FF3B30']} style={styles.listBtn}>
                <Text style={styles.listBtnText}>List a Room</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ overflow: 'hidden' }}>
            <Animated.View style={{ flexDirection: 'row', width: 4000, transform: [{ translateX }] }}>
              {duplicated.map((item, i) => (
                <View key={`${item.id}-${i}`} style={styles.featuredCard}>
                  <PropertyCard
                    data={item}
                    variant="horizontal"
                    onPress={() => navigation.navigate('RoomDetail', { property: item })}
                  />
                </View>
              ))}
            </Animated.View>
          </View>
        )}

        {/* ── Services Grid ── */}
        <View style={[styles.sectionHeader, { marginTop: 32 }]}>
          <Text style={styles.sectionTitle}>🏙️ Our Services</Text>
        </View>

        <View style={styles.servicesGrid}>
          {SERVICES.map(svc => (
            <TouchableOpacity
              key={svc.title}
              style={styles.serviceCard}
              onPress={() => navigation.navigate(svc.screen)}
              activeOpacity={0.85}
            >
              <LinearGradient colors={svc.colors} style={styles.serviceGradient}>
                <View style={styles.serviceIconCircle}>
                  <Ionicons name={svc.icon as any} size={26} color="#fff" />
                </View>
                <View style={styles.serviceTextBlock}>
                  <Text style={styles.serviceTitle}>{svc.title}</Text>
                  <Text style={styles.serviceSubtitle} numberOfLines={2}>{svc.subtitle}</Text>
                </View>
                <View style={styles.serviceCountBadge}>
                  <Text style={styles.serviceCount}>{counts[svc.count_table] ?? '...'}</Text>
                  <Text style={styles.serviceCountLabel}>Listed</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Quick List CTA ── */}
        <View style={styles.ctaCard}>
          <Text style={styles.ctaTitle}>Own a space or opportunity?</Text>
          <Text style={styles.ctaSubtitle}>List your room, shop, library or job for free</Text>
          <View style={styles.ctaRow}>
            {[
              { label: 'Room', screen: 'AddRoom', icon: 'home-outline' },
              { label: 'Shop', screen: 'AddShop', icon: 'storefront-outline' },
              { label: 'Library', screen: 'AddLibrary', icon: 'library-outline' },
              { label: 'Job', screen: 'AddJob', icon: 'briefcase-outline' },
            ].map(item => (
              <TouchableOpacity key={item.label} style={styles.ctaChip} onPress={() => navigation.navigate(item.screen)}>
                <Ionicons name={item.icon as any} size={16} color="#FF4500" />
                <Text style={styles.ctaChipLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </View>
    </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },

  // Header — compact
  header: { paddingTop: 48, paddingBottom: 20, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.85)', fontWeight: '500', marginBottom: 4 },
  tagline: { fontSize: 22, color: '#fff', fontWeight: '800', maxWidth: width * 0.7 },
  notifBtn: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 13 },
  searchPlaceholder: { color: '#a1a1aa', fontSize: 14 },

  // Body
  body: { paddingHorizontal: 16, paddingTop: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#ffffff' },
  seeAll: { color: '#FF4500', fontWeight: '600', fontSize: 14 },

  // Featured
  featuredCard: { width: 288, marginRight: 16 },
  emptyFeatured: { alignItems: 'center', paddingVertical: 32, gap: 12 },
  emptyFeaturedText: { color: '#71717a', fontSize: 15 },
  listBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20 },
  listBtnText: { color: '#fff', fontWeight: '700' },

  // Services Grid
  servicesGrid: { gap: 12 },
  serviceCard: { borderRadius: 20, overflow: 'hidden' },
  serviceGradient: { flexDirection: 'row', alignItems: 'center', padding: 20, gap: 16 },
  serviceIconCircle: { width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  serviceTextBlock: { flex: 1 },
  serviceTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  serviceSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 17 },
  serviceCountBadge: { alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8 },
  serviceCount: { color: '#fff', fontSize: 18, fontWeight: '800' },
  serviceCountLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 10, fontWeight: '600' },

  // CTA
  ctaCard: { marginTop: 24, backgroundColor: '#131316', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#27272a' },
  ctaTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 4 },
  ctaSubtitle: { color: '#71717a', fontSize: 13, marginBottom: 16 },
  ctaRow: { flexDirection: 'row', gap: 10 },
  ctaChip: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(255,69,0,0.1)', borderWidth: 1, borderColor: 'rgba(255,69,0,0.25)', borderRadius: 14, paddingVertical: 10 },
  ctaChipLabel: { color: '#FF4500', fontSize: 12, fontWeight: '700' },
});


