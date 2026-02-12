import { useAgentData } from '@/contexts/agent-data-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '@/contexts/language-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HistoryScreen() {
  const { tr } = useLanguage();
  const { scanHistory } = useAgentData();
  const params = useLocalSearchParams<{ type?: string }>();
  const mode = params.type === 'animal' ? 'animal' : 'crop';
  const entries = scanHistory.filter((entry) => entry.mode === mode);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#0F172A" name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.title}>{mode === 'animal' ? tr('Animal Scan History') : tr('Crop Scan History')}</Text>
      </View>
      <Text style={styles.subTitle}>{tr('All recent scans and classification results')}</Text>

      {entries.map((entry) => (
        <View key={entry.id} style={styles.card}>
          <View style={styles.rowTop}>
            <Text style={styles.item}>{tr(entry.item)}</Text>
            <View style={styles.confidenceBadge}>
              <Text style={styles.confidenceText}>{entry.confidence}</Text>
            </View>
          </View>
          <Text style={styles.result}>{tr(entry.result)}</Text>
          <View style={styles.timeRow}>
            <Ionicons color="#64748B" name="time-outline" size={14} />
            <Text style={styles.time}>{tr(entry.time)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F3F4F6',
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  backButton: {
    alignItems: 'center',
    height: 28,
    justifyContent: 'center',
    marginRight: 6,
    width: 28,
  },
  subTitle: {
    color: '#64748B',
    fontSize: 14,
    marginBottom: 12,
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    padding: 12,
  },
  rowTop: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    color: '#111827',
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    marginRight: 8,
  },
  confidenceBadge: {
    backgroundColor: '#E0E7FF',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  confidenceText: {
    color: '#1D4ED8',
    fontSize: 11,
    fontWeight: '700',
  },
  result: {
    color: '#374151',
    fontSize: 14,
    marginTop: 8,
  },
  timeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 8,
  },
  time: {
    color: '#64748B',
    fontSize: 12,
    marginLeft: 5,
  },
});
