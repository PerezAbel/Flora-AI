import { useAgentData } from '@/contexts/agent-data-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useLanguage } from '@/contexts/language-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function AlertDetailsScreen() {
  const { tr } = useLanguage();
  const { alerts } = useAgentData();
  const params = useLocalSearchParams<{ id?: string }>();
  const item = alerts.find((a) => a.id === params.id) ?? alerts[0];
  if (!item) return null;

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#0F172A" name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.title}>{tr('Alert Details')}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.titleRow}>
          <Text style={styles.alertName}>{tr(item.title)}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{tr(item.level)}</Text>
          </View>
        </View>
        <Text style={styles.summary}>{tr(item.summary)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>{tr('Scan Information')}</Text>
        <Text style={styles.row}>{tr('Scan ID: ')}{item.scanId}</Text>
        <Text style={styles.row}>{tr('Crop Type: ')}{tr(item.mode === 'crop' ? 'Crop Agent' : 'Animal Agent')}</Text>
        <Text style={styles.row}>{tr('Affected Zone: ')}{tr(item.zone)}</Text>
        <Text style={styles.row}>{tr('Model Confidence: ')}{item.confidence}</Text>
        <View style={styles.timeRow}>
          <Ionicons color="#64748B" name="time-outline" size={14} />
          <Text style={styles.timeText}>{tr('Detected: ')}{tr(item.detectedAt)}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>{tr('Recommended Action')}</Text>
        <Text style={styles.row}>{tr(item.recommendation)}</Text>
        <Text style={styles.nextCheck}>{tr('Next check: ')}{tr(item.nextCheck)}</Text>
      </View>
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
    paddingBottom: 30,
    rowGap: 10,
  },
  title: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: '800',
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 4,
  },
  backButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 28,
    justifyContent: 'center',
    marginRight: 6,
    width: 28,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  titleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  alertName: {
    color: '#111827',
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 8,
  },
  levelBadge: {
    backgroundColor: '#FFE7E8',
    borderColor: '#FF4D4F',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  levelText: {
    color: '#CC1F24',
    fontSize: 12,
    fontWeight: '700',
  },
  summary: {
    color: '#334155',
    fontSize: 14,
  },
  section: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  row: {
    color: '#334155',
    fontSize: 14,
    marginBottom: 4,
  },
  timeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 2,
  },
  timeText: {
    color: '#64748B',
    fontSize: 12,
    marginLeft: 5,
  },
  nextCheck: {
    color: '#0E7490',
    fontSize: 13,
    fontWeight: '700',
    marginTop: 6,
  },
});
