import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export interface JobData {
  id: string;
  title: string;
  job_type: string;
  salary_info: string;
  contact_phone: string;
  employer_name: string;
  created_at: string;
}

interface Props {
  data: JobData;
  onPress?: () => void;
}

export default function JobCard({ data, onPress }: Props) {
  // Format Date (Assume a basic slice for now)
  const dateStr = data.created_at ? data.created_at.split('T')[0] : 'Recently';

  const typeConfig: any = {
    'part-time': { bg: 'rgba(234, 179, 8, 0.1)', color: '#EAB308', label: 'Part Time' },
    'internship': { bg: 'rgba(168, 85, 247, 0.1)', color: '#A855F7', label: 'Internship' },
    'freelance': { bg: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', label: 'Freelance' },
    'tutoring': { bg: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', label: 'Tutoring' },
  };

  const currentType = typeConfig[data.job_type] || typeConfig['part-time'];

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={onPress}>
      <View style={styles.cardHeader}>
         <View style={[styles.typeBadge, { backgroundColor: currentType.bg }]}>
            <Text style={[styles.typeText, { color: currentType.color }]}>{currentType.label}</Text>
         </View>
         <Text style={styles.dateText}>{dateStr}</Text>
      </View>

      <Text style={styles.title} numberOfLines={2}>{data.title}</Text>
      
      <View style={styles.employerRow}>
        <Ionicons name="business-outline" size={14} color="#a1a1aa" />
        <Text style={styles.employerText} numberOfLines={1}>{data.employer_name}</Text>
      </View>
      
      <View style={styles.divider} />

      <View style={styles.bottomRow}>
        <View style={styles.salaryContainer}>
           <Ionicons name="cash-outline" size={16} color="#10B981" style={{marginRight: 6}} />
           <Text style={styles.salaryText}>{data.salary_info}</Text>
        </View>

        <LinearGradient colors={['#10B981', '#059669']} style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#131316', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: '#27272a' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  typeBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  typeText: { fontSize: 12, fontWeight: '700' },
  dateText: { color: '#71717a', fontSize: 12, fontWeight: '500' },
  title: { fontSize: 18, fontWeight: '700', color: '#ffffff', marginBottom: 8 },
  employerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  employerText: { fontSize: 13, color: '#a1a1aa', marginLeft: 6 },
  divider: { height: 1, backgroundColor: '#27272a', marginBottom: 16 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  salaryContainer: { flexDirection: 'row', alignItems: 'center' },
  salaryText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  applyButton: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 12 },
  applyButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 }
});
