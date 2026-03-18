import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function HelpSupportScreen({ navigation }: any) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "How do I list my property?",
      a: "Simply click on 'My Listings' in your Profile or use the + List Room button on the Home screen to fill out your property details, pricing, and amenities."
    },
    {
      q: "Is Kanelijo free to use?",
      a: "Yes! Kanelijo is completely free for students to browse and contact owners. For owners, you can list your first 2 properties directly on the platform for free."
    },
    {
      q: "How do I contact an owner?",
      a: "When viewing a room's details, you'll see a Call or WhatsApp button at the very bottom. Clicking these will connect you directly."
    },
    {
      q: "What does 'Verified Listing' mean?",
      a: "A verified listing means our team has manually checked the property details and the owner's identity to ensure the listing is legitimate, reducing the risk of scams."
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
           <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.missionCard}>
          <View style={styles.missionTag}>
            <Ionicons name="heart" size={14} color="#FF3B30" style={{marginRight: 6}} />
            <Text style={styles.missionTagText}>Support Our Mission</Text>
          </View>
          <Text style={styles.missionTitle}>Help Us Keep Kanelijo Free.</Text>
          <Text style={styles.missionDesc}>Kanelijo is built by a small team dedicated to making student housing easy and transparent. If our platform helped you, consider supporting us to keep the servers running!</Text>
          
          <TouchableOpacity>
            <LinearGradient colors={['#FF4B2B', '#FF416C']} style={styles.donateButton}>
               <Ionicons name="cafe" size={20} color="#fff" />
               <Text style={styles.donateText}>Donate / Pay as you like</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        <View style={styles.faqContainer}>
          {faqs.map((faq, idx) => (
             <TouchableOpacity key={idx} style={[styles.faqItem, openFaq === idx && styles.faqItemOpen]} onPress={() => setOpenFaq(openFaq === idx ? null : idx)}>
                <View style={styles.faqHeader}>
                   <Text style={[styles.faqQ, openFaq === idx && styles.faqQOpen]}>{faq.q}</Text>
                   <Ionicons name={openFaq === idx ? "chevron-up" : "chevron-down"} size={20} color={openFaq === idx ? "#FF3B30" : "#71717a"} />
                </View>
                {openFaq === idx && (
                   <Text style={styles.faqA}>{faq.a}</Text>
                )}
             </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#0a0a0a', paddingTop: Platform.OS === 'android' ? 40 : 0 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  container: { paddingHorizontal: 16, paddingBottom: 40, paddingTop: 12 },
  missionCard: { backgroundColor: '#131316', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#27272a', marginBottom: 32 },
  missionTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3f0f0f', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, marginBottom: 16 },
  missionTagText: { color: '#FF3B30', fontSize: 13, fontWeight: '700' },
  missionTitle: { fontSize: 24, fontWeight: '800', color: '#fff', marginBottom: 12, lineHeight: 30 },
  missionDesc: { fontSize: 14, color: '#a1a1aa', lineHeight: 22, marginBottom: 24 },
  donateButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 16, gap: 10 },
  donateText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#fff', marginBottom: 16, marginLeft: 8 },
  faqContainer: { gap: 12 },
  faqItem: { backgroundColor: '#131316', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#27272a' },
  faqItemOpen: { borderColor: '#451a1a' },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQ: { flex: 1, fontSize: 15, fontWeight: '700', color: '#e4e4e7', paddingRight: 16 },
  faqQOpen: { color: '#FF3B30' },
  faqA: { fontSize: 14, color: '#a1a1aa', marginTop: 12, lineHeight: 22, borderTopWidth: 1, borderTopColor: '#27272a', paddingTop: 12 },
});
