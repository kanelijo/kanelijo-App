import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function RoomDetailScreen({ route, navigation }: any) {
  const { property } = route.params;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200" }} style={styles.image} />
          <SafeAreaView style={styles.overlayHeader}>
             <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="#fff" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.iconButton}>
               <Ionicons name="heart-outline" size={24} color="#fff" />
             </TouchableOpacity>
          </SafeAreaView>
        </View>

        
        <View style={styles.detailsCard}>
          <View style={styles.badgeRow}>
             {property.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={14} color="#fff" style={{marginRight: 4}} />
                  <Text style={styles.verifiedText}>Verified</Text>
                </View>
             )}
             {property.type && (
                <View style={styles.typeBadge}>
                  <Text style={styles.typeText}>{property.type}</Text>
                </View>
             )}
             <View style={styles.typeBadge}><Text style={styles.typeText}>Any</Text></View>
          </View>

          <Text style={styles.title}>{property.title}</Text>
          
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#FBBF24" />
            <Text style={styles.ratingText}>{property.rating || 4.8} <Text style={styles.reviewText}>({property.reviews || 24} reviews)</Text></Text>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={16} color="#FF3B30" />
            <Text style={styles.locationText}>{property.location}</Text>
          </View>

          <View style={styles.statsGrid}>
             <View style={styles.statCol}>
               <Text style={styles.statLabel}>MONTHLY RENT</Text>
               <Text style={styles.statValue}>₹{property.price.toLocaleString()}<Text style={styles.statSub}>/month</Text></Text>
             </View>
             <View style={styles.statCol}>
               <Text style={styles.statLabel}>AVAILABLE FROM</Text>
               <Text style={styles.statValueWhite}>15 Jan 2024</Text>
             </View>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About This Room</Text>
          <Text style={styles.descriptionText}>
            A beautifully furnished {property.type || 'studio'} apartment with modern amenities, ideal for students. Located conveniently in {property.location}. Fully air-conditioned with high-speed WiFi and attached bathroom.
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {(property.amenities || ['WiFi', 'AC', 'Attached Bathroom', 'Furnished']).map((am: string, idx: number) => (
               <View key={idx} style={styles.amenityPill}>
                 <Ionicons name="checkmark" size={14} color="#a1a1aa" style={{marginRight: 6}} />
                 <Text style={styles.amenityText}>{am}</Text>
               </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About the Owner</Text>
          <View style={styles.ownerCard}>
            <LinearGradient colors={['#FF4B2B', '#FF416C']} style={styles.ownerAvatar}>
               <Ionicons name="person-outline" size={24} color="#fff" />
            </LinearGradient>
            <View style={{flex: 1, marginLeft: 16}}>
               <Text style={styles.ownerName}>Rajesh Kumar</Text>
               <Text style={styles.ownerSubtitle}>Property Owner</Text>
            </View>
            <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
          </View>

          <View style={{height: 100}} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.callButton}>
           <Ionicons name="call-outline" size={20} color="#fff" />
           <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappContainer}>
           <LinearGradient colors={['#FF512F', '#F09819']} style={styles.whatsappButton}>
              <Ionicons name="chatbubbles-outline" size={20} color="#fff" />
              <Text style={styles.whatsappText}>WhatsApp</Text>
           </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  imageContainer: { height: 350, position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  overlayHeader: { position: 'absolute', top: Platform.OS === 'android' ? 40 : 20, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' },
  iconButton: { backgroundColor: 'rgba(0,0,0,0.4)', padding: 10, borderRadius: 24 },
  detailsCard: { marginTop: -32, backgroundColor: '#131316', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, minHeight: 600 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  verifiedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#22c55e', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  verifiedText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  typeBadge: { backgroundColor: '#27272a', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 16 },
  typeText: { color: '#e4e4e7', fontSize: 13, fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '800', color: '#ffffff', marginBottom: 8, lineHeight: 32 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  ratingText: { color: '#fff', fontSize: 14, fontWeight: '700', marginLeft: 6 },
  reviewText: { color: '#a1a1aa', fontWeight: '400' },
  locationContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#18181b', padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#27272a' },
  locationText: { fontSize: 15, color: '#e4e4e7', marginLeft: 10, fontWeight: '500' },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  statCol: { flex: 1 },
  statLabel: { fontSize: 11, color: '#71717a', fontWeight: '700', letterSpacing: 1, marginBottom: 8 },
  statValue: { fontSize: 24, fontWeight: '800', color: '#FF3B30' },
  statSub: { fontSize: 14, color: '#71717a', fontWeight: '500' },
  statValueWhite: { fontSize: 18, fontWeight: '700', color: '#fff' },
  divider: { height: 1, backgroundColor: '#27272a', marginVertical: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16 },
  descriptionText: { fontSize: 15, color: '#a1a1aa', lineHeight: 24 },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  amenityPill: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#3f3f46', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  amenityText: { color: '#d4d4d8', fontSize: 13, fontWeight: '500' },
  ownerCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#18181b', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#27272a' },
  ownerAvatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  ownerName: { fontSize: 16, fontWeight: '700', color: '#fff', marginBottom: 4 },
  ownerSubtitle: { fontSize: 13, color: '#a1a1aa' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#131316', paddingHorizontal: 24, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, borderTopWidth: 1, borderTopColor: '#27272a', flexDirection: 'row', gap: 16 },
  callButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#18181b', borderRadius: 16, borderWidth: 1, borderColor: '#3f3f46', height: 56 },
  callButtonText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 8 },
  whatsappContainer: { flex: 2 },
  whatsappButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 16, height: 56 },
  whatsappText: { color: '#fff', fontSize: 16, fontWeight: '700', marginLeft: 8 },
});
