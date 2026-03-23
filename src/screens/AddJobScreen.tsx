import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, TextInput, ScrollView, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../services/supabase';
import { notifyServer } from '../utils/notifyServer';

const JOB_TYPES = [
  { id: 'part-time', label: 'Part Time', color: '#EAB308' },
  { id: 'internship', label: 'Internship', color: '#A855F7' },
  { id: 'freelance', label: 'Freelance', color: '#3B82F6' },
  { id: 'tutoring', label: 'Tutoring', color: '#EF4444' },
];

export default function AddJobScreen({ navigation }: any) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [jobType, setJobType] = useState('');
  const [salaryInfo, setSalaryInfo] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async () => {
    if (!title || !jobType || !employerName) {
      Alert.alert('Missing Fields', 'Job title, type, and employer name are required!');
      return;
    }
    setIsPublishing(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Must be logged in!');

      const { error } = await supabase.from('jobs').insert({
        poster_id: userData.user.id,
        title,
        description: description || null,
        job_type: jobType,
        salary_info: salaryInfo,
        employer_name: employerName,
        contact_phone: contactPhone,
        contact_email: contactEmail,
      });
      if (error) throw error;
      if (userData.user.email) {
        notifyServer({ type: 'listing', email: userData.user.email, name: userData.user.user_metadata?.full_name || 'Employer', listingTitle: title, listingType: 'job', listingUrl: 'https://team.kanelijo.com/jobs' });
      }
      Alert.alert('Posted! 🚀', 'Your job offer is now live on Kanelijo!');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Failed to post job.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}><Ionicons name="arrow-back" size={24} color="#fff" /></TouchableOpacity>
          <Text style={styles.headerTitle}>Post a Job</Text>
          <View style={{ width: 40 }} />
        </View>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.sectionTitle}>JOB TYPE *</Text>
          <View style={styles.typeGrid}>
            {JOB_TYPES.map(type => (
              <TouchableOpacity
                key={type.id}
                style={[styles.typeChip, jobType === type.id && { borderColor: type.color, backgroundColor: `${type.color}15` }]}
                onPress={() => setJobType(type.id)}
              >
                <Text style={[styles.typeLabel, jobType === type.id && { color: type.color }]}>{type.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>JOB DETAILS</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Job Title *</Text>
            <TextInput style={styles.input} placeholder="e.g. Physics Tutor for Class 12" placeholderTextColor="#71717a" value={title} onChangeText={setTitle} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Employer / Company Name *</Text>
            <TextInput style={styles.input} placeholder="e.g. Self / Sharma Coaching" placeholderTextColor="#71717a" value={employerName} onChangeText={setEmployerName} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Salary / Pay Info</Text>
            <TextInput style={styles.input} placeholder="e.g. ₹500/hr or ₹8000/month" placeholderTextColor="#71717a" value={salaryInfo} onChangeText={setSalaryInfo} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput style={[styles.input, styles.textArea]} placeholder="Describe duties, schedule, requirements..." placeholderTextColor="#71717a" multiline numberOfLines={5} value={description} onChangeText={setDescription} />
          </View>

          <Text style={styles.sectionTitle}>CONTACT DETAILS</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput style={styles.input} placeholder="e.g. 9876543210" placeholderTextColor="#71717a" keyboardType="phone-pad" value={contactPhone} onChangeText={setContactPhone} />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput style={styles.input} placeholder="e.g. hr@company.com" placeholderTextColor="#71717a" keyboardType="email-address" value={contactEmail} onChangeText={setContactEmail} />
          </View>

          <TouchableOpacity style={styles.publishBtn} onPress={handlePublish} disabled={isPublishing}>
            <LinearGradient colors={['#10B981', '#059669']} style={styles.publishGradient}>
              {isPublishing ? <ActivityIndicator color="#fff" /> : <Text style={styles.publishText}>Post Job Offer</Text>}
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
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  typeChip: { paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#131316', borderWidth: 1.5, borderColor: '#27272a', borderRadius: 20 },
  typeLabel: { color: '#a1a1aa', fontSize: 14, fontWeight: '700' },
  formGroup: { marginBottom: 20 },
  label: { color: '#a1a1aa', fontSize: 13, marginBottom: 8, fontWeight: '500', marginLeft: 4 },
  input: { backgroundColor: '#131316', borderWidth: 1, borderColor: '#27272a', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 16, color: '#fff', fontSize: 16 },
  textArea: { height: 120, textAlignVertical: 'top' },
  publishBtn: { marginTop: 8, borderRadius: 24, overflow: 'hidden' },
  publishGradient: { paddingVertical: 16, alignItems: 'center', justifyContent: 'center' },
  publishText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
