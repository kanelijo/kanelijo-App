import React, { useState } from 'react';
import ScreenBackground from '../components/ScreenBackground';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen({ navigation }: any) {
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(false);
  const [sms, setSms] = useState(true);
  const [promos, setPromos] = useState(false);

  const renderToggle = (title: string, description: string, value: boolean, onValueChange: (val: boolean) => void) => (
    <View style={styles.toggleRow}>
      <View style={styles.textContainer}>
        <Text style={styles.toggleTitle}>{title}</Text>
        <Text style={styles.toggleDesc}>{description}</Text>
      </View>
      <Switch 
        trackColor={{ false: '#27272a', true: '#FF4500' }}
        thumbColor={'#fff'}
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );

  return (
    <ScreenBackground>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 40 }} />
      </View>
      <View style={styles.content}>
        <Text style={styles.sectionHeader}>ALERTS</Text>
        <View style={styles.card}>
          {renderToggle("Push Notifications", "Receive alerts on your device.", push, setPush)}
          <View style={styles.divider} />
          {renderToggle("Email Updates", "Receive important updates via email.", email, setEmail)}
          <View style={styles.divider} />
          {renderToggle("SMS Alerts", "Get text messages for bookings.", sms, setSms)}
        </View>

        <Text style={styles.sectionHeader}>MARKETING</Text>
        <View style={styles.card}>
          {renderToggle("Promotional Offers", "Hear about new features and deals.", promos, setPromos)}
        </View>
      </View>
    </ScreenBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16 },
  backButton: { width: 40, height: 40, justifyContent: 'center', alignItems: 'flex-start' },
  title: { fontSize: 18, fontWeight: '700', color: '#fff' },
  content: { padding: 24, flex: 1 },
  sectionHeader: { color: '#71717a', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 8, marginLeft: 16, marginTop: 16 },
  card: { backgroundColor: '#131316', borderRadius: 16, borderWidth: 1, borderColor: '#27272a', paddingVertical: 8 },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  textContainer: { flex: 1, paddingRight: 16 },
  toggleTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 4 },
  toggleDesc: { color: '#a1a1aa', fontSize: 13 },
  divider: { height: 1, backgroundColor: '#27272a', marginLeft: 16 },
});



