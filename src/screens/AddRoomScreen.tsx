import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput, ScrollView, KeyboardAvoidingView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '../services/supabase';
import { notifyServer } from '../utils/notifyServer';

const AMENITIES_LIST = [
  { id: 'wifi', icon: 'wifi-outline', label: 'WiFi' },
  { id: 'ac', icon: 'snow-outline', label: 'AC' },
  { id: 'water', icon: 'water-outline', label: 'Water' },
  { id: 'parking', icon: 'car-outline', label: 'Parking' },
  { id: 'laundry', icon: 'shirt-outline', label: 'Laundry' },
  { id: 'meals', icon: 'restaurant-outline', label: 'Meals' },
  { id: 'fan', icon: 'aperture-outline', label: 'Fan' }, // Phase 1 Addition
];

export default function AddRoomScreen({ navigation }: any) {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState(''); // Phase 1: Now Optional
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  
  // Phase 1: Native Mapbox Integration (Defaulting to Sehore)
  const [coordinates, setCoordinates] = useState({
    latitude: 23.2032,
    longitude: 77.0844,
  });
  
  // Phase 1: Nearby Ecosystems State
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);
  const [newNearbyName, setNewNearbyName] = useState('');
  const [newNearbyCategory, setNewNearbyCategory] = useState('College');
  const [newNearbyCoords, setNewNearbyCoords] = useState({
    latitude: 23.2032,
    longitude: 77.0844,
  });

  const [isPublishing, setIsPublishing] = useState(false);

  // Haversine Distance Formula
  const getDistanceInMeters = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return Math.round(R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))) * 1000);
  };

  const addNearbyPlace = () => {
    if (!newNearbyName.trim()) {
      Alert.alert('Error', 'Please enter a name for the nearby place.');
      return;
    }
    const distanceMeter = getDistanceInMeters(coordinates.latitude, coordinates.longitude, newNearbyCoords.latitude, newNearbyCoords.longitude);
    
    setNearbyPlaces(prev => [...prev, {
      place_name: newNearbyName,
      category: newNearbyCategory,
      distance_meters: distanceMeter,
      latitude: newNearbyCoords.latitude,
      longitude: newNearbyCoords.longitude
    }]);
    setNewNearbyName('');
  };

  const removeNearbyPlace = (index: number) => {
    setNearbyPlaces(prev => prev.filter((_, i) => i !== index));
  };

  const toggleAmenity = (id: string) => {
    setSelectedAmenities(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setImages((prev) => [...prev, ...result.assets.map(a => a.uri)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handlePublish = async () => {
    if (!title || !price || !location) {
      Alert.alert('Missing Fields', 'Title, Monthly Rent, and Location are required!');
      return;
    }

    setIsPublishing(true);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error("Must be logged in to publish a room!");

      const uploadPromises = images.map(async (uri) => {
        // Native Cloudinary Upload handled directly inside the app bypassing Android WebView bugs
        const formData = new FormData();
        formData.append('file', { uri, name: 'upload.jpg', type: 'image/jpeg' } as any);
        formData.append('upload_preset', 'kanelijo_preset'); // Replace with actual preset if needed
        formData.append('folder', 'kanelijo/rooms'); // Fixed dynamic routing requirement

        const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dbfhzoeid'; 
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        return data.secure_url;
      });

      const uploadedImages = await Promise.all(uploadPromises);

      // Insert into Supabase Rooms table directly using the exact coordinates
      const { error } = await supabase.from('rooms').insert({
        owner_id: userData.user.id,
        title,
        description: description || null, // Description is fully optional now
        rent_monthly: parseInt(price),
        address: location,
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
        amenities: selectedAmenities,
        nearby_places: nearbyPlaces,
        images: uploadedImages.filter(Boolean),
        vacancy: 1,
        room_type: 'Single Room',
      });

      if (error) throw error;
      
      // Phase 4: Fire listing email via secure API bridge
      const { data: userData2 } = await supabase.auth.getUser();
      if (userData2.user?.email) {
        notifyServer({
          type: 'listing',
          email: userData2.user.email,
          name: userData2.user.user_metadata?.full_name || 'Host',
          listingTitle: title,
          listingType: 'room',
          listingUrl: `https://team.kanelijo.com/rooms`,
        });
      }
      
      Alert.alert('Success', 'Your room has been published!');
      navigation.goBack();

    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to publish room.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled={Platform.OS !== 'web'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>List a Room</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>PHOTOS ({images.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
            {images.map((uri, idx) => (
              <View key={idx} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.roomImage} />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(idx)}>
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
              <Ionicons name="camera-outline" size={32} color="#FF4500" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </ScrollView>

          <Text style={styles.sectionTitle}>DETAILS</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Title *</Text>
            <TextInput style={styles.input} placeholder="e.g. Sunny Studio in Civil Lines" placeholderTextColor="#71717a" value={title} onChangeText={setTitle} />
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Monthly Rent (₹) *</Text>
              <TextInput style={styles.input} placeholder="0" placeholderTextColor="#71717a" keyboardType="numeric" value={price} onChangeText={setPrice} />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Location / City *</Text>
              <TextInput style={styles.input} placeholder="e.g. Sehore" placeholderTextColor="#71717a" value={location} onChangeText={setLocation} />
            </View>
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Describe the rules, vibes, etc..."
              placeholderTextColor="#71717a"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
          </View>

          <Text style={styles.sectionTitle}>AMENITIES</Text>
          <View style={styles.amenitiesGrid}>
            {AMENITIES_LIST.map((item) => {
              const isSelected = selectedAmenities.includes(item.id);
              return (
                <TouchableOpacity key={item.id} style={[styles.amenityChip, isSelected && styles.amenityChipActive]} onPress={() => toggleAmenity(item.id)}>
                  <Ionicons name={item.icon as any} size={18} color={isSelected ? '#FF4500' : '#a1a1aa'} />
                  <Text style={[styles.amenityLabel, isSelected && styles.amenityLabelActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>PRECISE ROOM LOCATION (DRAG PIN)</Text>
          <View style={styles.mapContainer}>
             <MapView style={styles.map} initialRegion={{ latitude: 23.2032, longitude: 77.0844, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
               <Marker draggable coordinate={coordinates} onDragEnd={(e) => setCoordinates(e.nativeEvent.coordinate)}>
                 <View style={styles.markerContainer}><Ionicons name="home" size={36} color="#FF3B30" /></View>
               </Marker>
             </MapView>
             <View style={styles.mapHint}><Text style={styles.mapHintText}>Drag the red pin directly onto your front door.</Text></View>
          </View>

          <Text style={styles.sectionTitle}>ADD NEARBY PLACES (COLLEGES, LIBRARIES)</Text>
          <View style={styles.nearbySection}>
            <View style={styles.row}>
              <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
                 <Text style={styles.label}>Place Name</Text>
                 <TextInput style={styles.input} placeholder="e.g. MS College" placeholderTextColor="#71717a" value={newNearbyName} onChangeText={setNewNearbyName} />
              </View>
              <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
                 <Text style={styles.label}>Category</Text>
                 <TouchableOpacity style={styles.input} onPress={() => setNewNearbyCategory(newNearbyCategory === 'College' ? 'Library' : 'College')}>
                    <Text style={{color: '#fff', fontSize: 16}}>{newNearbyCategory} (Tap to change)</Text>
                 </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.mapContainer, { height: 160, marginBottom: 16 }]}>
               <MapView style={styles.map} initialRegion={{ latitude: 23.2032, longitude: 77.0844, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
                 <Marker draggable coordinate={newNearbyCoords} onDragEnd={(e) => setNewNearbyCoords(e.nativeEvent.coordinate)}>
                   <View style={styles.markerContainer}><Ionicons name="school" size={32} color="#3b82f6" /></View>
                 </Marker>
               </MapView>
               <View style={styles.mapHint}><Text style={styles.mapHintText}>Drag blue pin to the {newNearbyCategory}</Text></View>
            </View>

            <TouchableOpacity style={styles.addNearbyBtn} onPress={addNearbyPlace}>
               <Ionicons name="add-circle-outline" size={20} color="#fff" />
               <Text style={styles.addNearbyText}>Add Place & Calculate Distance</Text>
            </TouchableOpacity>

            {nearbyPlaces.length > 0 && (
              <View style={styles.nearbyList}>
                 {nearbyPlaces.map((p, idx) => (
                   <View key={idx} style={styles.nearbyItem}>
                      <View>
                        <Text style={styles.nearbyItemTitle}>{p.place_name} ({p.category})</Text>
                        <Text style={styles.nearbyItemDistance}>{p.distance_meters} meters away</Text>
                      </View>
                      <TouchableOpacity onPress={() => removeNearbyPlace(idx)}>
                        <Ionicons name="trash-outline" size={20} color="#EF4444" />
                      </TouchableOpacity>
                   </View>
                 ))}
              </View>
            )}
          </View>

          <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} disabled={isPublishing}>
             <LinearGradient colors={['#FF4500', '#FF3B30']} style={styles.publishGradient}>
                {isPublishing ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishText}>Publish Listing</Text>}
             </LinearGradient>
          </TouchableOpacity>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { padding: 24, paddingBottom: 60 },
  sectionTitle: { color: '#71717a', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12, marginTop: 12 },
  imageScroll: { flexDirection: 'row', marginBottom: 24 },
  imageContainer: { width: 100, height: 100, marginRight: 12, borderRadius: 12, overflow: 'visible' },
  roomImage: { width: 100, height: 100, borderRadius: 12 },
  removeImageBtn: { position: 'absolute', top: -8, right: -8, backgroundColor: 'transparent', borderRadius: 12 },
  addPhotoBtn: { width: 100, height: 100, borderRadius: 12, borderWidth: 2, borderColor: '#27272a', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: '#131316', marginRight: 16 },
  addPhotoText: { color: '#FF4500', fontSize: 12, fontWeight: '600', marginTop: 8 },
  formGroup: { marginBottom: 20 },
  row: { flexDirection: 'row' },
  label: { color: '#a1a1aa', fontSize: 13, marginBottom: 8, fontWeight: '500', marginLeft: 4 },
  input: { backgroundColor: '#131316', borderWidth: 1, borderColor: '#27272a', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, color: '#fff', fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  amenitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20, gap: 10 },
  amenityChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#131316', borderWidth: 1, borderColor: '#27272a', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, gap: 6 },
  amenityChipActive: { borderColor: '#FF4500', backgroundColor: 'rgba(255,69,0,0.1)' },
  amenityLabel: { color: '#a1a1aa', fontSize: 13, fontWeight: '600' },
  amenityLabelActive: { color: '#FF4500' },
  mapContainer: { width: '100%', height: 220, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#27272a', marginBottom: 24 },
  map: { width: '100%', height: '100%' },
  markerContainer: { alignItems: 'center', justifyContent: 'center' },
  mapHint: { position: 'absolute', bottom: 12, alignSelf: 'center', backgroundColor: '#131316', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#27272a' },
  mapHintText: { color: '#e4e4e7', fontSize: 11, fontWeight: '600' },
  nearbySection: { backgroundColor: '#131316', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#27272a', marginBottom: 32 },
  addNearbyBtn: { backgroundColor: '#3b82f6', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 8 },
  addNearbyText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  nearbyList: { marginTop: 16, gap: 8 },
  nearbyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18181b', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: '#27272a' },
  nearbyItemTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  nearbyItemDistance: { color: '#a1a1aa', fontSize: 12, marginTop: 4 },
  publishBtn: { marginTop: 8, borderRadius: 24, overflow: 'hidden' },
  publishGradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  publishText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

