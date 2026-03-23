import React, { useState, useEffect } from 'react';
import ScreenBackground from '../components/ScreenBackground';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, SafeAreaView, Platform, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabase';

type ListingType = 'rooms' | 'shops' | 'libraries' | 'jobs';

export default function MyListingsScreen({ navigation }: any) {
  const [activeTab, setActiveTab] = useState<ListingType>('rooms');
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, [activeTab]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return;

      const ownerField = activeTab === 'jobs' ? 'poster_id' : 'owner_id';
      const { data, error } = await supabase
        .from(activeTab)
        .select('*')
        .eq(ownerField, userData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (e) {
      console.error('Error fetching listings:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    Alert.alert('Delete Listing', 'Are you sure you want to delete this listing?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          const ownerField = activeTab === 'jobs' ? 'poster_id' : 'owner_id';
          await supabase.from(activeTab).delete().eq('id', id);
          fetchListings();
        }
      }
    ]);
  };

  const addScreenMap: Record<ListingType, string> = {
    rooms: 'AddRoom', shops: 'AddShop', libraries: 'AddLibrary', jobs: 'AddJob'
  };

  const TABS: { key: ListingType; label: string; icon: string; color: string }[] = [
    { key: 'rooms', label: 'Rooms', icon: 'home-outline', color: '#FF4500' },
    { key: 'shops', label: 'Shops', icon: 'storefront-outline', color: '#F09819' },
    { key: 'libraries', label: 'Libraries', icon: 'library-outline', color: '#3282B8' },
    { key: 'jobs', label: 'Jobs', icon: 'briefcase-outline', color: '#10B981' },
  ];

  const activeColor = TABS.find(t => t.key === activeTab)?.color || '#FF4500';

  const renderItem = ({ item }: { item: any }) => {
    const title = item.title;
    const imageUrl = item.images && item.images.length > 0 ? item.images[0] : null;
    const subtitle = activeTab === 'rooms' ? `₹${item.rent_monthly}/mo · ${item.address}`
      : activeTab === 'shops' ? `${item.category} · ${item.address}`
      : activeTab === 'libraries' ? `₹${item.monthly_fee}/mo · ${item.address}`
      : `${item.job_type} · ${item.salary_info}`;

    return (
      <View style={styles.card}>
        {imageUrl && <Image source={{ uri: imageUrl }} style={styles.cardImage} />}
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle} numberOfLines={2}>{title}</Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>{subtitle}</Text>
          <View style={styles.cardActions}>
            <View style={[styles.activeBadge, { backgroundColor: `${activeColor}20` }]}>
              <View style={[styles.activeDot, { backgroundColor: activeColor }]} />
              <Text style={[styles.activeText, { color: activeColor }]}>Active</Text>
            </View>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <ScreenBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>My Listings</Text>
        <TouchableOpacity onPress={() => navigation.navigate(addScreenMap[activeTab])} style={styles.addButton}>
          <Ionicons name="add" size={24} color={activeColor} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && { borderBottomColor: tab.color, borderBottomWidth: 2 }]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Ionicons name={tab.icon as any} size={16} color={activeTab === tab.key ? tab.color : '#71717a'} />
            <Text style={[styles.tabLabel, activeTab === tab.key && { color: tab.color }]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={activeColor} style={{ marginTop: 60 }} />
      ) : listings.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={[styles.iconCircle, { backgroundColor: `${activeColor}15`, borderColor: `${activeColor}30` }]}>
            <Ionicons name={TABS.find(t => t.key === activeTab)?.icon as any} size={40} color={activeColor} />
          </View>
          <Text style={styles.emptyTitle}>No {activeTab} listed yet</Text>
          <Text style={styles.emptyDesc}>Tap the + button to add your first listing.</Text>
          <TouchableOpacity onPress={() => navigation.navigate(addScreenMap[activeTab])}>
            <LinearGradient colors={[activeColor, activeColor]} style={styles.createButton}>
              <Text style={styles.createText}>Create Listing</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={listings}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      )}
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  addButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-end' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#27272a', marginBottom: 8 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, gap: 6, borderBottomColor: 'transparent', borderBottomWidth: 2 },
  tabLabel: { fontSize: 12, fontWeight: '700', color: '#71717a' },
  list: { padding: 16, paddingBottom: 40 },
  card: { backgroundColor: '#131316', borderRadius: 16, overflow: 'hidden', marginBottom: 16, borderWidth: 1, borderColor: '#27272a' },
  cardImage: { width: '100%', height: 140, resizeMode: 'cover' },
  cardBody: { padding: 16 },
  cardTitle: { color: '#fff', fontSize: 15, fontWeight: '700', marginBottom: 4 },
  cardSubtitle: { color: '#a1a1aa', fontSize: 12, marginBottom: 12 },
  cardActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  activeBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  activeDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  activeText: { fontSize: 12, fontWeight: '700' },
  deleteBtn: { padding: 8 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40 },
  iconCircle: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 1 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 },
  emptyDesc: { fontSize: 14, color: '#a1a1aa', textAlign: 'center', lineHeight: 22, marginBottom: 28 },
  createButton: { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 24 },
  createText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});



