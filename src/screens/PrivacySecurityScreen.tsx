import React, { useState } from 'react';
import ScreenBackground from '../components/ScreenBackground';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput, ScrollView, Switch, KeyboardAvoidingView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PrivacySecurityScreen({ navigation }: any) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <ScreenBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} enabled={Platform.OS !== 'web'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Privacy & Security</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionHeader}>CHANGE PASSWORD</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Current Password"
              placeholderTextColor="#71717a"
              secureTextEntry
              value={currentPassword}
              onChangeText={setCurrentPassword}
              cursorColor="#FF4500"
              selectionColor="#FF4500"
            />
            <View style={styles.divider} />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="#71717a"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
              cursorColor="#FF4500"
              selectionColor="#FF4500"
            />
            <TouchableOpacity style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Update Password</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionHeader}>SECURITY</Text>
          <View style={styles.card}>
            <View style={styles.toggleRow}>
              <View style={styles.textContainer}>
                <Text style={styles.toggleTitle}>Two-Factor Authentication</Text>
                <Text style={styles.toggleDesc}>Add an extra layer of security to your account.</Text>
              </View>
              <Switch 
                trackColor={{ false: '#27272a', true: '#FF4500' }}
                thumbColor={'#fff'}
                onValueChange={setTwoFactor}
                value={twoFactor}
              />
            </View>
          </View>

          <Text style={styles.sectionHeader}>DANGER ZONE</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.deleteRow}>
              <Ionicons name="trash-outline" size={20} color="#EF4444" style={{ marginRight: 16 }} />
              <Text style={styles.deleteText}>Delete Account</Text>
            </TouchableOpacity>
          </View>
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
  content: { padding: 24, paddingBottom: 60 },
  sectionHeader: { color: '#71717a', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginLeft: 16, marginTop: 16 },
  card: { backgroundColor: '#131316', borderRadius: 16, borderWidth: 1, borderColor: '#27272a', overflow: 'hidden' },
  input: { paddingHorizontal: 16, paddingVertical: 16, color: '#fff', fontSize: 15 },
  divider: { height: 1, backgroundColor: '#27272a', marginLeft: 16 },
  updateButton: { paddingVertical: 16, backgroundColor: 'rgba(255, 69, 0, 0.1)', borderTopWidth: 1, borderTopColor: '#27272a', alignItems: 'center' },
  updateButtonText: { color: '#FF4500', fontWeight: '600', fontSize: 15 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  textContainer: { flex: 1, paddingRight: 16 },
  toggleTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  toggleDesc: { color: '#a1a1aa', fontSize: 13 },
  deleteRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  deleteText: { color: '#EF4444', fontSize: 16, fontWeight: '600' },
});



