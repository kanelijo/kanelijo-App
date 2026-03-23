import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput, ScrollView, KeyboardAvoidingView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '../services/supabase';
import { notifyServer } from '../utils/notifyServer';

export default function AddLibraryScreen({ navigation }: any) {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [monthlyFee, setMonthlyFee] = useState('');
  const [seatingCapacity, setSeatingCapacity] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [openTime, setOpenTime] = useState('');
  const [closeTime, setCloseTime] = useState('');
  const [coordinates, setCoordinates] = useState({ latitude: 23.2032, longitude: 77.0844 });
  const [isPublishing, setIsPublishing] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, quality: 0.8 });
    if (!result.canceled) setImages(prev => [...prev, ...result.assets.map(a => a.uri)]);
  };

  const handlePublish = async () => {
    if (!title || !address || !monthlyFee) {
      Alert.alert('Missing Fields', 'Title, Monthly Fee, and Address are required!');
      return;
    }
    setIsPublishing(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Must be logged in!');

      const uploadedImages: string[] = [];
      for (const uri of images) {
        const formData = new FormData();
        formData.append('file', { uri, name: 'upload.jpg', type: 'image/jpeg' } as any);
        formData.append('upload_preset', 'kanelijo_preset');
        formData.append('folder', 'kanelijo/libraries');
        const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dbfhzoeid';
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.secure_url) uploadedImages.push(data.secure_url);
      }

      const { error } = await supabase.from('libraries').insert({
        owner_id: userData.user.id,
        title, description: description || null,
        monthly_fee: parseInt(monthlyFee),
        seating_capacity: parseInt(seatingCapacity) || 0,
        address, phone,
        open_time: openTime, close_time: closeTime,
        latitude: coordinates.latitude, longitude: coordinates.longitude,
        images: uploadedImages,
      });
      if (error) throw error;
      if (userData.user.email) {
        notifyServer({ type: 'listing', email: userData.user.email, name: userData.user.user_metadata?.full_name || 'Owner', listingTitle: title, listingType: 'library', listingUrl: 'https://team.kanelijo.com/libraries' });
      }
      Alert.alert('Success! 📚', 'Your library is now listed on Kanelijo!');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to publish library.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
          <Text style={styles.headerTitle}>List a Library</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>PHOTOS ({images.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
            {images.map((uri, idx) => (
              <View key={idx} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.thumb} />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImages(images.filter((_, i) => i !== idx))}>
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
              <Ionicons name="camera-outline" size={32} color="#3282B8" />
              <Text style={styles.addPhotoText}>Add Photo</Text>
            </TouchableOpacity>
          </ScrollView>

          <Text style={styles.sectionTitle}>DETAILS</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Library Name *</Text>
            <TextInput style={styles.input} placeholder="e.g. City Study Hub" placeholderTextColor="#71717a" value={title} onChangeText={setTitle} />
          </View>
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Monthly Fee (₹) *</Text>
              <TextInput style={styles.input} placeholder="0" placeholderTextColor="#71717a" keyboardType="numeric" value={monthlyFee} onChangeText={setMonthlyFee} />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Seating Capacity</Text>
              <TextInput style={styles.input} placeholder="e.g. 50" placeholderTextColor="#71717a" keyboardType="numeric" value={seatingCapacity} onChangeText={setSeatingCapacity} />
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Opens At</Text>
              <TextInput style={styles.input} placeholder="e.g. 7:00 AM" placeholderTextColor="#71717a" value={openTime} onChangeText={setOpenTime} />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Closes At</Text>
              <TextInput style={styles.input} placeholder="e.g. 10:00 PM" placeholderTextColor="#71717a" value={closeTime} onChangeText={setCloseTime} />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput style={styles.input} placeholder="Full address" placeholderTextColor="#71717a" value={address} onChangeText={setAddress} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Contact Phone</Text>
            <TextInput style={styles.input} placeholder="e.g. 9876543210" placeholderTextColor="#71717a" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Facilities, AC/Non-AC, WiFi, etc." placeholderTextColor="#71717a" multiline value={description} onChangeText={setDescription} />
          </View>

          <Text style={styles.sectionTitle}>PIN YOUR LOCATION</Text>
          <View style={styles.mapContainer}>
            <MapView style={styles.map} initialRegion={{ latitude: 23.2032, longitude: 77.0844, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
              <Marker draggable coordinate={coordinates} onDragEnd={(e) => setCoordinates(e.nativeEvent.coordinate)}>
                <View style={{ alignItems: 'center' }}><Ionicons name="library" size={36} color="#3282B8" /></View>
              </Marker>
            </MapView>
            <View style={styles.mapHint}><Text style={styles.mapHintText}>Drag to your library's exact location</Text></View>
          </View>

          <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} disabled={isPublishing}>
            <LinearGradient colors={['#3282B8', '#0F4C75']} style={styles.publishGradient}>
              {isPublishing ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishText}>Publish Library</Text>}
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
  imageContainer: { width: 100, height: 100, marginRight: 12, borderRadius: 12, overflow: 'visible' },
  thumb: { width: 100, height: 100, borderRadius: 12 },
  removeImageBtn: { position: 'absolute', top: -8, right: -8, backgroundColor: 'transparent', borderRadius: 12 },
  addPhotoBtn: { width: 100, height: 100, borderRadius: 12, borderWidth: 2, borderColor: '#27272a', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: '#131316' },
  addPhotoText: { color: '#3282B8', fontSize: 12, fontWeight: '600', marginTop: 8 },
  formGroup: { marginBottom: 20 },
  row: { flexDirection: 'row' },
  label: { color: '#a1a1aa', fontSize: 13, marginBottom: 8, fontWeight: '500', marginLeft: 4 },
  input: { backgroundColor: '#131316', borderWidth: 1, borderColor: '#27272a', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, color: '#fff', fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  mapContainer: { width: '100%', height: 220, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#27272a', marginBottom: 32 },
  map: { width: '100%', height: '100%' },
  mapHint: { position: 'absolute', bottom: 12, alignSelf: 'center', backgroundColor: '#131316', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#27272a' },
  mapHintText: { color: '#e4e4e7', fontSize: 11, fontWeight: '600' },
  publishBtn: { marginTop: 8, borderRadius: 24, overflow: 'hidden' },
  publishGradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  publishText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});

