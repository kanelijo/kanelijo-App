import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface ShopData {
  id: string;
  title: string;
  category: string;
  price_range: string;
  location: string;
  imageUrl: string;
  verified?: boolean;
}

interface Props {
  data: ShopData;
  onPress?: () => void;
  variant?: 'horizontal' | 'vertical';
}

export default function ShopCard({ data, onPress, variant = 'vertical' }: Props) {
  const isHorizontal = variant === 'horizontal';

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity 
        style={[styles.card, isHorizontal ? styles.cardHorizontal : styles.cardVertical]} 
        activeOpacity={0.8} 
        onPress={onPress}
      >
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
            <View style={styles.typeBadge}>
               <Text style={styles.typeText}>{data.category}</Text>
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
            <View style={[styles.priceContainer, isHorizontal && {flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
               <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                 <Text style={styles.price}>{data.price_range}</Text>
                 <Text style={styles.perMonth}> avg price</Text>
               </View>
            </View>

            {!isHorizontal && (
              <LinearGradient colors={['#FF512F', '#F09819']} style={styles.viewButton}>
                <Text style={styles.viewButtonText}>Visit</Text>
              </LinearGradient>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#131316', borderRadius: 20, marginBottom: 24, overflow: 'hidden', borderWidth: 0 },
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
  typeBadge: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  typeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  infoContainer: { padding: 16 },
  title: { fontSize: 16, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  locationText: { fontSize: 12, color: '#a1a1aa', marginLeft: 4 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 18, fontWeight: '800', color: '#F09819' },
  perMonth: { fontSize: 13, color: '#71717a', marginLeft: 2, fontWeight: '500' },
  viewButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 16 },
  viewButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});
