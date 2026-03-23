import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface LibraryData {
  id: string;
  title: string;
  monthly_fee: number;
  seating_capacity: number;
  location: string;
  imageUrl: string;
  verified?: boolean;
}

interface Props {
  data: LibraryData;
  onPress?: () => void;
  variant?: 'horizontal' | 'vertical';
}

export default function LibraryCard({ data, onPress, variant = 'vertical' }: Props) {
  const isHorizontal = variant === 'horizontal';

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity style={[styles.card, isHorizontal ? styles.cardHorizontal : styles.cardVertical]} activeOpacity={0.8} onPress={onPress}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: data.imageUrl }} style={[styles.image, isHorizontal ? styles.imageHorizontal : styles.imageVertical]} />
          <View style={styles.imageTopOverlay}>
            <View style={styles.badgeRow}>
              {data.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#fff" style={{marginRight: 4}} />
                  <Text style={styles.verifiedText}>Verified</Text>
               </View>
              )}
            </View>
            <View style={styles.capacityBadge}>
               <Ionicons name="people-outline" size={12} color="#fff" style={{marginRight: 4}} />
               <Text style={styles.typeText}>{data.seating_capacity} Seats</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={[styles.title, isHorizontal && {fontSize: 16}]} numberOfLines={2}>{data.title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#a1a1aa" />
            <Text style={styles.locationText} numberOfLines={1}>{data.location}</Text>
          </View>
          
          <View style={styles.bottomRow}>
            <View style={styles.priceContainer}>
               <Text style={styles.price}>₹{data.monthly_fee}</Text>
               <Text style={styles.perMonth}>/mo</Text>
            </View>
            {!isHorizontal && (
              <LinearGradient colors={['#3282B8', '#0F4C75']} style={styles.viewButton}>
                <Text style={styles.viewButtonText}>Reserve</Text>
              </LinearGradient>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#131316', borderRadius: 20, marginBottom: 24, overflow: 'hidden' },
  cardHorizontal: { width: 280, marginBottom: 0 },
  cardVertical: { width: '100%' },
  imageContainer: { position: 'relative' },
  image: { width: '100%', resizeMode: 'cover' },
  imageHorizontal: { height: 160 },
  imageVertical: { height: 200 },
  imageTopOverlay: { position: 'absolute', top: 12, left: 12, right: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  badgeRow: { flexDirection: 'row', gap: 8 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#22c55e', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  verifiedText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  capacityBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(50, 130, 184, 0.9)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  typeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  infoContainer: { padding: 16 },
  title: { fontSize: 16, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  locationText: { fontSize: 12, color: '#a1a1aa', marginLeft: 4 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 22, fontWeight: '800', color: '#3282B8' },
  perMonth: { fontSize: 13, color: '#71717a', marginLeft: 2, fontWeight: '500' },
  viewButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 16 },
  viewButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});
