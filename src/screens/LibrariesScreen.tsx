import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import LibraryCard, { LibraryData } from '../components/LibraryCard';
import { supabase } from '../services/supabase';

export default function LibrariesScreen({ navigation }: any) {
  const [libraries, setLibraries] = useState<LibraryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLibraries();
  }, []);

  const fetchLibraries = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('libraries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mapped = data.map(item => ({
        id: item.id,
        title: item.title,
        monthly_fee: item.monthly_fee,
        seating_capacity: item.seating_capacity,
        location: item.address,
        imageUrl: item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1522211988038-6fcbb8c12c7e?auto=format&fit=crop&q=80&w=800',
        verified: true,
      }));
      
      setLibraries(mapped);
    } catch (error) {
      console.error('Error fetching libraries:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Explore Libraries</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#a1a1aa" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search by area or name..."
            placeholderTextColor="#a1a1aa"
          />
        </View>

        <Text style={styles.resultsCount}>{libraries.length} libraries found</Text>

        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#3282B8" style={{ marginTop: 40 }} />
          ) : (
            libraries.map(item => (
              <LibraryCard key={item.id} data={item} />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  headerRow: { marginBottom: 20 },
  screenTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },
  searchContainer: { flexDirection: 'row', backgroundColor: '#131316', borderRadius: 20, padding: 16, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#27272a' },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#fff' },
  resultsCount: { color: '#a1a1aa', fontSize: 14, fontWeight: '500', marginBottom: 16, marginLeft: 4 },
  listContainer: { paddingBottom: 40 },
});
