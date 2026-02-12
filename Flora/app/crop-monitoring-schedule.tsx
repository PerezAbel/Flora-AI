import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/language-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CropMonitoringScheduleScreen() {
  const { tr } = useLanguage();
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#0F172A" name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.title}>{tr('Crop Monitoring Schedule')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>{tr('Active Schedules')}</Text>
        <Text style={styles.row}>{tr('Maize Zones: Every 2 days at 7:00 AM')}</Text>
        <Text style={styles.row}>{tr('Tomato Zones: Daily at 6:30 AM')}</Text>
        <Text style={styles.row}>{tr('Cassava Zones: Twice per week at 8:00 AM')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>{tr('Reminder Channels')}</Text>
        <Text style={styles.row}>{tr('In-app notifications: Enabled')}</Text>
        <Text style={styles.row}>{tr('SMS reminders: Enabled')}</Text>
        <Text style={styles.row}>{tr('Email digest: Weekly summary')}</Text>
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
