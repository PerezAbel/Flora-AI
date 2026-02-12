import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/language-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FarmerHelpSupportScreen() {
  const { tr } = useLanguage();
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#0F172A" name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.title}>{tr('Farmer Help and Support')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>{tr('Support Contacts')}</Text>
        <Text style={styles.row}>{tr('Agronomy Hotline: +1 (800) 555-0184')}</Text>
        <Text style={styles.row}>{tr('Field Officer Desk: +1 (800) 555-0162')}</Text>
        <Text style={styles.row}>{tr('Support Email: help@flora-ai.app')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>{tr('Quick Guides')}</Text>
        <Text style={styles.row}>{tr('How to take high-quality crop photos')}</Text>
        <Text style={styles.row}>{tr('How to interpret risk levels')}</Text>
        <Text style={styles.row}>{tr('How to submit disease feedback')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>{tr('Response Time')}</Text>
        <Text style={styles.row}>{tr('Urgent disease alerts: Within 30 minutes')}</Text>
        <Text style={styles.row}>{tr('General support tickets: Within 24 hours')}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F3F4F6', flex: 1 },
  content: { padding: 16, paddingBottom: 30 },
  title: { color: '#0F172A', fontSize: 28, fontWeight: '800', marginBottom: 12 },
  headerRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 12 },
  backButton: { alignItems: 'center', height: 28, justifyContent: 'center', marginRight: 6, width: 28 },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
  },
  section: { color: '#1E293B', fontSize: 16, fontWeight: '700', marginBottom: 8 },
  row: { color: '#334155', fontSize: 14, marginBottom: 4 },
});
