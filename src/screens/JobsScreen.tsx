import React, { useState, useEffect } from 'react';
import ScreenBackground from '../components/ScreenBackground';
import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import JobCard, { JobData } from '../components/JobCard';
import { supabase } from '../services/supabase';

export default function JobsScreen({ navigation }: any) {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const mapped = data.map(item => ({
        id: item.id,
        title: item.title,
        job_type: item.job_type,
        salary_info: item.salary_info,
        contact_phone: item.contact_phone,
        employer_name: item.employer_name,
        created_at: item.created_at,
      }));
      
      setJobs(mapped);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenBackground>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Find Student Jobs</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#a1a1aa" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search roles or companies..."
            placeholderTextColor="#a1a1aa"
          />
        </View>

        <Text style={styles.resultsCount}>{jobs.length} jobs found</Text>

        <View style={styles.listContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#10B981" style={{ marginTop: 40 }} />
          ) : (
            jobs.map(item => (
              <JobCard key={item.id} data={item} />
            ))
          )}
        </View>
      </ScrollView>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
  headerRow: { marginBottom: 20 },
  screenTitle: { fontSize: 28, fontWeight: '800', color: '#fff' },
  searchContainer: { flexDirection: 'row', backgroundColor: '#131316', borderRadius: 20, padding: 16, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: '#27272a' },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: '#fff' },
  resultsCount: { color: '#a1a1aa', fontSize: 14, fontWeight: '500', marginBottom: 16, marginLeft: 4 },
  listContainer: { paddingBottom: 40 },
});



