import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export interface PropertyData {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  beds: number;
  baths: number;
  rating?: number;
  reviews?: number;
  type?: string;
  amenities?: string[];
  verified?: boolean;
}

interface Props {
  data: PropertyData;
  onPress?: () => void;
  variant?: 'horizontal' | 'vertical';
}

export default function PropertyCard({ data, onPress, variant = 'vertical' }: Props) {
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
              {data.type && (
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{data.type}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={styles.heartButton}>
              <Ionicons name="heart-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoContainer}>
          {!isHorizontal && data.rating && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color="#FBBF24" />
              <Text style={styles.ratingText}>{data.rating} <Text style={styles.reviewText}>({data.reviews} reviews)</Text></Text>
            </View>
          )}

          <Text style={[styles.title, isHorizontal && {fontSize: 16}]} numberOfLines={2}>{data.title}</Text>
          
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color="#a1a1aa" />
            <Text style={styles.locationText} numberOfLines={1}>{data.location}</Text>
          </View>

          {!isHorizontal && data.amenities && (
            <View style={styles.amenitiesRow}>
              {data.amenities.slice(0, 3).map((am, idx) => (
                <View key={idx} style={styles.amenityPill}>
                  <Text style={styles.amenityText}>{am}</Text>
                </View>
              ))}
              {data.amenities.length > 3 && (
                <Text style={styles.moreAmenitiesText}>+{data.amenities.length - 3} more</Text>
              )}
            </View>
          )}
          
          <View style={styles.bottomRow}>
            <View style={[styles.priceContainer, isHorizontal && {flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
               <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                 <Text style={styles.price}>₹{data.price.toLocaleString()}</Text>
                 <Text style={styles.perMonth}>/mo</Text>
               </View>
               {isHorizontal && data.verified ? (
                  <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
               ) : null}
            </View>

            {!isHorizontal && (
              <LinearGradient colors={['#FF4500', '#FF3B30']} style={styles.viewButton}>
                <Text style={styles.viewButtonText}>View</Text>
              </LinearGradient>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#131316',
    borderRadius: 20,
    marginBottom: 24,
    overflow: 'hidden',
    borderWidth: 0,
  },
  cardHorizontal: { width: 280, marginBottom: 0 },
  cardVertical: { width: '100%' },
  imageContainer: { position: 'relative' },
  image: { width: '100%', resizeMode: 'cover' },
  imageHorizontal: { height: 160 },
  imageVertical: { height: 200 },
  imageTopOverlay: {
    position: 'absolute', top: 12, left: 12, right: 12,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'
  },
  badgeRow: { flexDirection: 'row', gap: 8 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#22c55e', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16 },
  verifiedText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  typeBadge: { backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  typeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  heartButton: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 8, borderRadius: 20 },
  infoContainer: { padding: 16 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  ratingText: { color: '#fff', fontSize: 13, fontWeight: '700', marginLeft: 4 },
  reviewText: { color: '#71717a', fontWeight: '400' },
  title: { fontSize: 16, fontWeight: '700', color: '#ffffff', marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  locationText: { fontSize: 12, color: '#a1a1aa', marginLeft: 4 },
  amenitiesRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 6 },
  amenityPill: { borderWidth: 1, borderColor: '#3f3f46', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  amenityText: { color: '#d4d4d8', fontSize: 11, fontWeight: '500' },
  moreAmenitiesText: { color: '#71717a', fontSize: 11 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' },
  priceContainer: { flexDirection: 'row', alignItems: 'baseline' },
  price: { fontSize: 22, fontWeight: '800', color: '#FF4500' },
  perMonth: { fontSize: 13, color: '#71717a', marginLeft: 2, fontWeight: '500' },
  viewButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 16 },
  viewButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});
