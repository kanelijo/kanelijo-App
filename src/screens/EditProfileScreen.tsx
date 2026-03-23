import React, { useState } from 'react';
import ScreenBackground from '../components/ScreenBackground';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function EditProfileScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');

  return (
    <ScreenBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled={Platform.OS !== 'web'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.avatarSection}>
            <LinearGradient colors={['#FF4500', '#FF3B30']} style={styles.avatarGradient}>
              <Ionicons name="camera-outline" size={32} color="#fff" />
            </LinearGradient>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. John Doe"
              placeholderTextColor="#71717a"
              value={name}
              onChangeText={setName}
              cursorColor="#FF4500"
              selectionColor="#FF4500"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              placeholder="+91 00000 00000"
              placeholderTextColor="#71717a"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              cursorColor="#FF4500"
              selectionColor="#FF4500"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Tell us a little about yourself"
              placeholderTextColor="#71717a"
              multiline
              numberOfLines={4}
              value={bio}
              onChangeText={setBio}
              cursorColor="#FF4500"
              selectionColor="#FF4500"
            />
          </View>

          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { paddingHorizontal: 24, paddingBottom: 40 },
  avatarSection: { alignItems: 'center', marginVertical: 32 },
  avatarGradient: { width: 100, height: 100, borderRadius: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  changePhotoText: { color: '#FF4500', fontWeight: '600', fontSize: 14 },
  formGroup: { marginBottom: 24 },
  label: { color: '#a1a1aa', fontSize: 13, marginBottom: 8, fontWeight: '500', marginLeft: 4 },
  input: { backgroundColor: '#131316', borderWidth: 1, borderColor: '#27272a', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, color: '#fff', fontSize: 16 },
  textArea: { height: 120, textAlignVertical: 'top' },
  saveButton: { backgroundColor: '#FF4500', borderRadius: 24, paddingVertical: 16, alignItems: 'center', marginTop: 16 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});



