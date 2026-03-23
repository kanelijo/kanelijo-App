import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, SafeAreaView, Platform, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import MapView, { Marker, Callout } from 'react-native-maps';
import { supabase } from '../services/supabase';

export default function RoomDetailScreen({ route, navigation }: any) {
  const { property } = route.params;
  const [isSaved, setIsSaved] = useState(false);
  const [ownerPhone, setOwnerPhone] = useState<string | null>(null);

  useEffect(() => {
    checkIfSaved();
    fetchOwnerContact();
  }, []);

  const checkIfSaved = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    const { data } = await supabase.from('saved_rooms').select('id').eq('user_id', userData.user.id).eq('room_id', property.id).single();
    setIsSaved(!!data);
  };

  const toggleSave = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    if (isSaved) {
      await supabase.from('saved_rooms').delete().eq('user_id', userData.user.id).eq('room_id', property.id);
      setIsSaved(false);
    } else {
      await supabase.from('saved_rooms').insert({ user_id: userData.user.id, room_id: property.id });
      setIsSaved(true);
    }
  };

  const fetchOwnerContact = async () => {
    if (!property.owner_id) return;
    const { data } = await supabase.from('profiles').select('phone').eq('id', property.owner_id).single();
    if (data?.phone) setOwnerPhone(data.phone);
  };

  const handleCall = () => {
    if (!ownerPhone) { Alert.alert('Contact', 'No phone number available for this listing.'); return; }
    Linking.openURL(`tel:${ownerPhone}`);
  };

  const handleWhatsApp = () => {
    if (!ownerPhone) { Alert.alert('Contact', 'No phone number available for this listing.'); return; }
    Linking.openURL(`https://wa.me/91${ownerPhone}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: property.imageUrl || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200' }} style={styles.image} />
          <SafeAreaView style={styles.overlayHeader}>
             <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
               <Ionicons name="arrow-back" size={24} color="#fff" />
             </TouchableOpacity>
             <TouchableOpacity style={styles.iconButton} onPress={toggleSave}>
               <Ionicons name={isSaved ? 'heart' : 'heart-outline'} size={24} color={isSaved ? '#EF4444' : '#fff'} />
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
            {property.description || `A ${property.type || 'room'} located in ${property.location}. Contact the owner for more details.`}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Amenities</Text>
          <View style={styles.amenitiesGrid}>
            {(property.amenities && property.amenities.length > 0 ? property.amenities : ['WiFi', 'AC', 'Attached Bathroom', 'Furnished']).map((am: string, idx: number) => (
               <View key={idx} style={styles.amenityPill}>
                 <Ionicons name="checkmark" size={14} color="#a1a1aa" style={{marginRight: 6}} />
                 <Text style={styles.amenityText}>{am.charAt(0).toUpperCase() + am.slice(1)}</Text>
               </View>
            ))}
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Location & Nearby Ecosystems</Text>
          <View style={styles.mapContainer}>
             {(property.latitude && property.longitude) ? (
                <MapView 
                  style={styles.map} 
                  initialRegion={{
                    latitude: property.latitude,
                    longitude: property.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker coordinate={{ latitude: property.latitude, longitude: property.longitude }}>
                    <View style={styles.markerContainer}>
                       <Ionicons name="location" size={40} color="#FF3B30" />
                    </View>
                  </Marker>
                  {property.nearby_places && property.nearby_places.map((place: any, idx: number) => (
                     <Marker 
                       key={idx} 
                       coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                     >
                        <View style={styles.nearbyMarker}>
                           <Ionicons name={place.category === 'College' ? 'school' : 'library'} size={24} color="#3b82f6" />
                        </View>
                        <Callout tooltip>
                           <View style={styles.calloutBox}>
                              <Text style={styles.calloutTitle}>{place.place_name}</Text>
                              <Text style={styles.calloutDistance}>{place.distance_meters}m away</Text>
                           </View>
                        </Callout>
                     </Marker>
                  ))}
                </MapView>
             ) : (
                <View style={styles.noMapPlaceholder}>
                   <Ionicons name="map-outline" size={40} color="#3f3f46" />
                   <Text style={{color: '#71717a', marginTop: 8}}>Location coordinates hidden</Text>
                </View>
             )}
          </View>
          
          {property.nearby_places && property.nearby_places.length > 0 && (
             <View style={styles.nearbyList}>
                {property.nearby_places.map((p: any, idx: number) => (
                   <View key={idx} style={styles.nearbyListItem}>
                      <Ionicons name={p.category === 'College' ? 'school-outline' : 'library-outline'} size={20} color="#3b82f6" />
                      <View style={{flex: 1, marginLeft: 12}}>
                         <Text style={styles.nearbyListTitle}>{p.place_name}</Text>
                         <Text style={styles.nearbyListCat}>{p.category}</Text>
                      </View>
                      <Text style={styles.nearbyListDist}>{p.distance_meters}m</Text>
                   </View>
                ))}
             </View>
          )}

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>About the Owner</Text>
          <View style={styles.ownerCard}>
            <LinearGradient colors={['#FF4B2B', '#FF416C']} style={styles.ownerAvatar}>
               <Ionicons name="person-outline" size={24} color="#fff" />
            </LinearGradient>
             <View style={{flex: 1, marginLeft: 16}}>
                <Text style={styles.ownerName}>{property.owner_name || 'Verified Owner'}</Text>
                <Text style={styles.ownerSubtitle}>Property Owner · {ownerPhone ? ownerPhone : 'Contact via WhatsApp'}</Text>
             </View>
            <Ionicons name="checkmark-circle" size={20} color="#22c55e" />
          </View>

          <View style={{height: 100}} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.callButton} onPress={handleCall}>
           <Ionicons name="call-outline" size={20} color="#fff" />
           <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.whatsappContainer} onPress={handleWhatsApp}>
           <LinearGradient colors={['#25D366', '#128C7E']} style={styles.whatsappButton}>
              <Ionicons name="logo-whatsapp" size={20} color="#fff" />
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
  ownerSubtitle: { color: '#a1a1aa', fontSize: 13, marginTop: 2 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#0a0a0a', borderTopWidth: 1, borderTopColor: '#27272a', flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 16, paddingBottom: Platform.OS === 'ios' ? 32 : 16, gap: 12 },
  callButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#27272a', borderRadius: 16, paddingVertical: 16, gap: 8 },
  callButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  whatsappContainer: { flex: 2, borderRadius: 16, overflow: 'hidden' },
  whatsappButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  whatsappText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  mapContainer: { width: '100%', height: 250, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#27272a', marginBottom: 16 },
  map: { width: '100%', height: '100%' },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  nearbyMarker: { backgroundColor: '#18181b', padding: 6, borderRadius: 20, borderWidth: 2, borderColor: '#3b82f6' },
  noMapPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#131316' },
  calloutBox: { backgroundColor: '#18181b', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#27272a', minWidth: 120, alignItems: 'center' },
  calloutTitle: { color: '#fff', fontSize: 13, fontWeight: '700', marginBottom: 4 },
  calloutDistance: { color: '#3b82f6', fontSize: 11, fontWeight: '600' },
  nearbyList: { gap: 12 },
  nearbyListItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#18181b', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#27272a' },
  nearbyListTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  nearbyListCat: { color: '#71717a', fontSize: 12, marginTop: 2 },
  nearbyListDist: { color: '#3b82f6', fontSize: 14, fontWeight: '700' },
});
