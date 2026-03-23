import React, { useState, useEffect } from 'react';
import ScreenBackground from '../components/ScreenBackground';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import PropertyCard, { PropertyData } from '../components/PropertyCard';
import { supabase } from '../services/supabase';

export default function SavedScreen({ navigation }: any) {
  const [saved, setSaved] = useState<PropertyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      // Fetch saved room IDs from the saved_rooms table, then join with rooms
      const { data, error } = await supabase
        .from('saved_rooms')
        .select('room_id, rooms(*)')
        .eq('user_id', userData.user.id);

      if (error) throw error;

      const rooms: PropertyData[] = (data || [])
        .map((row: any) => row.rooms)
        .filter(Boolean)
        .map((room: any) => ({
          id: room.id,
          title: room.title,
          price: room.rent_monthly || 0,
          location: room.address || '',
          imageUrl: room.images && room.images.length > 0 ? room.images[0] : 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800',
          beds: 1, baths: 1,
          type: room.room_type || 'Room',
          verified: !!room.owner_id,
          amenities: room.amenities || [],
          latitude: room.latitude,
          longitude: room.longitude,
          nearby_places: room.nearby_places || [],
        }));

      setSaved(rooms);
    } catch (e) {
      console.error('Error fetching saved rooms:', e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ScreenBackground>
        <View style={styles.header}><Text style={styles.headerTitle}>Saved Rooms</Text></View>
        <ActivityIndicator size="large" color="#FF4500" style={{ marginTop: 60 }} />
      </ScreenBackground>
    );
  }

  if (saved.length === 0) {
    return (
      <ScreenBackground>
        <View style={styles.header}><Text style={styles.headerTitle}>Saved Rooms</Text></View>
        <View style={styles.emptyContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="heart-outline" size={40} color="#FF6B6B" />
          </View>
          <Text style={styles.title}>No saved rooms yet</Text>
          <Text style={styles.subtitle}>Tap the heart icon on any room to save it here for easy access</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Explore')}>
            <LinearGradient colors={['#FF4500', '#FF3B30']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
              <Ionicons name="search" size={20} color="#fff" style={{ marginRight: 8 }} />
              <Text style={styles.buttonText}>Browse Rooms</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScreenBackground>
    );
  }

  return (
    <ScreenBackground>
      <View style={styles.header}><Text style={styles.headerTitle}>Saved Rooms ({saved.length})</Text></View>
      <FlatList
        data={saved}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <PropertyCard
            data={item}
            onPress={() => navigation.navigate('RoomDetail', { property: item })}
          />
        )}
      />
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#fff' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#18181b', justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#27272a' },
  title: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 12 },
  subtitle: { fontSize: 14, color: '#a1a1aa', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
  button: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 24 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});



