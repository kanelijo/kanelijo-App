import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput, ScrollView, KeyboardAvoidingView, Image, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import MapView, { Marker } from 'react-native-maps';
import { supabase } from '../services/supabase';
import { notifyServer } from '../utils/notifyServer';

const SHOP_CATEGORIES = ['Grocery', 'Tiffin Service', 'Café', 'Stationery', 'Laundry', 'Medical', 'Electronics', 'Other'];

export default function AddShopScreen({ navigation }: any) {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priceRange, setPriceRange] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [coordinates, setCoordinates] = useState({ latitude: 23.2032, longitude: 77.0844 });
  const [isPublishing, setIsPublishing] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true, quality: 0.8 });
    if (!result.canceled) setImages(prev => [...prev, ...result.assets.map(a => a.uri)]);
  };

  const handlePublish = async () => {
    if (!title || !category || !address) {
      Alert.alert('Missing Fields', 'Title, Category, and Address are required!');
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
        formData.append('folder', 'kanelijo/shops');
        const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dbfhzoeid';
        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
        const data = await res.json();
        if (data.secure_url) uploadedImages.push(data.secure_url);
      }

      const { error } = await supabase.from('shops').insert({
        owner_id: userData.user.id,
        title, description: description || null,
        category, price_range: priceRange,
        address, phone,
        latitude: coordinates.latitude, longitude: coordinates.longitude,
        images: uploadedImages,
      });
      if (error) throw error;
      if (userData.user.email) {
        notifyServer({ type: 'listing', email: userData.user.email, name: userData.user.user_metadata?.full_name || 'Owner', listingTitle: title, listingType: 'shop', listingUrl: 'https://team.kanelijo.com/shops' });
      }
      Alert.alert('Success! 🎉', 'Your shop is now live on Kanelijo!');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to publish shop.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
          <Text style={styles.headerTitle}>List a Shop</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>PHOTOS ({images.length})</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
            {images.map((uri, idx) => (
              <View key={idx} style={styles.imageContainer}>
                <Image source={{ uri }} style={styles.roomImage} />
                <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImages(images.filter((_, i) => i !== idx))}>
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={styles.addPhotoBtn} onPress={pickImage}>
              <Ionicons name="camera-outline" size={32} color="#F09819" />
              <Text style={[styles.addPhotoText, { color: '#F09819' }]}>Add Photo</Text>
            </TouchableOpacity>
          </ScrollView>

          <Text style={styles.sectionTitle}>DETAILS</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Shop Name *</Text>
            <TextInput style={styles.input} placeholder="e.g. Sharma Ji Ki Dukaan" placeholderTextColor="#71717a" value={title} onChangeText={setTitle} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Category *</Text>
            <View style={styles.categoryGrid}>
              {SHOP_CATEGORIES.map(cat => (
                <TouchableOpacity key={cat} style={[styles.catChip, category === cat && styles.catChipActive]} onPress={() => setCategory(cat)}>
                  <Text style={[styles.catLabel, category === cat && styles.catLabelActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <View style={styles.row}>
            <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Price Range</Text>
              <TextInput style={styles.input} placeholder="e.g. ₹50–₹200" placeholderTextColor="#71717a" value={priceRange} onChangeText={setPriceRange} />
            </View>
            <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Contact Phone</Text>
              <TextInput style={styles.input} placeholder="e.g. 9876543210" placeholderTextColor="#71717a" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            </View>
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Address *</Text>
            <TextInput style={styles.input} placeholder="Full address of your shop" placeholderTextColor="#71717a" value={address} onChangeText={setAddress} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="What you offer, timings, etc." placeholderTextColor="#71717a" multiline numberOfLines={4} value={description} onChangeText={setDescription} />
          </View>

          <Text style={styles.sectionTitle}>PIN YOUR LOCATION</Text>
          <View style={styles.mapContainer}>
            <MapView style={styles.map} initialRegion={{ latitude: 23.2032, longitude: 77.0844, latitudeDelta: 0.05, longitudeDelta: 0.05 }}>
              <Marker draggable coordinate={coordinates} onDragEnd={(e) => setCoordinates(e.nativeEvent.coordinate)}>
                <View style={{ alignItems: 'center' }}><Ionicons name="storefront" size={36} color="#F09819" /></View>
              </Marker>
            </MapView>
            <View style={styles.mapHint}><Text style={styles.mapHintText}>Drag to your shop's exact location</Text></View>
          </View>

          <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} disabled={isPublishing}>
            <LinearGradient colors={['#FF512F', '#F09819']} style={styles.publishGradient}>
              {isPublishing ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishText}>Publish Shop</Text>}
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { padding: 24, paddingBottom: 60 },
  sectionTitle: { color: '#71717a', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 12, marginTop: 12 },
  imageContainer: { width: 100, height: 100, marginRight: 12, borderRadius: 12, overflow: 'visible' },
  roomImage: { width: 100, height: 100, borderRadius: 12 },
  removeImageBtn: { position: 'absolute', top: -8, right: -8, backgroundColor: '#0a0a0a', borderRadius: 12 },
  addPhotoBtn: { width: 100, height: 100, borderRadius: 12, borderWidth: 2, borderColor: '#27272a', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', backgroundColor: '#131316' },
  addPhotoText: { fontSize: 12, fontWeight: '600', marginTop: 8 },
  formGroup: { marginBottom: 20 },
  row: { flexDirection: 'row' },
  label: { color: '#a1a1aa', fontSize: 13, marginBottom: 8, fontWeight: '500', marginLeft: 4 },
  input: { backgroundColor: '#131316', borderWidth: 1, borderColor: '#27272a', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, color: '#fff', fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  catChip: { paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#131316', borderWidth: 1, borderColor: '#27272a', borderRadius: 20 },
  catChipActive: { borderColor: '#F09819', backgroundColor: 'rgba(240,152,25,0.1)' },
  catLabel: { color: '#a1a1aa', fontSize: 13, fontWeight: '600' },
  catLabelActive: { color: '#F09819' },
  mapContainer: { width: '100%', height: 220, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#27272a', marginBottom: 32 },
  map: { width: '100%', height: '100%' },
  mapHint: { position: 'absolute', bottom: 12, alignSelf: 'center', backgroundColor: '#131316', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#27272a' },
  mapHintText: { color: '#e4e4e7', fontSize: 11, fontWeight: '600' },
  publishBtn: { marginTop: 8, borderRadius: 24, overflow: 'hidden' },
  publishGradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  publishText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
