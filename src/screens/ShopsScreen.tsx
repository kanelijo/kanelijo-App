import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ShopCard, { ShopData } from '../components/ShopCard';
import { supabase } from '../services/supabase';

export default function ShopsScreen({ navigation }: any) {
  const [shops, setShops] = useState<ShopData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mapped = data.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        price_range: item.price_range,
        location: item.address,
        imageUrl: item.images && item.images.length > 0 ? item.images[0] : 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=800',
        verified: true,
      }));
      
      setShops(mapped);
    } catch (error) {
      console.error('Error fetching shops:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Explore Shops</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#a1a1aa" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search groceries, tiffins, cafes..."
            placeholderTextColor="#a1a1aa"
          />
        </View>

        <Text style={styles.resultsCount}>{shops.length} shops found</Text>

        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#F09819" style={{ marginTop: 40 }} />
          ) : (
            shops.map(item => (
              <ShopCard key={item.id} data={item} />
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
