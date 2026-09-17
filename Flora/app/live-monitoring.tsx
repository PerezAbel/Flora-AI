import { useAgentData } from '@/contexts/agent-data-context';
import { useLanguage } from '@/contexts/language-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function LiveMonitoringScreen() {
  const { tr } = useLanguage();
  const { addLiveMonitoringUpdate } = useAgentData();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = params.mode === 'animal' ? 'animal' : 'crop';
  const [running, setRunning] = useState(false);
  const [updates, setUpdates] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      void addLiveMonitoringUpdate(mode);
      setUpdates((c) => c + 1);
    }, 4000);
    return () => clearInterval(id);
  }, [running, mode, addLiveMonitoringUpdate]);

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#EAF2FF" name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.title}>{tr('Live Agent Monitoring')}</Text>
      </View>

      <View style={styles.liveView}>
        <View style={styles.liveBadge}>
          <Text style={styles.liveBadgeText}>{running ? tr('LIVE') : tr('PAUSED')}</Text>
        </View>
        <Text style={styles.liveText}>
          {running
            ? tr('Monitoring in progress. New analytics are being sent to Dashboard and Alerts.')
            : tr('Start monitoring to stream live field analysis updates.')}
        </Text>
        <Text style={styles.countText}>{tr('Updates sent:')} {updates}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={() => setRunning((v) => !v)} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>{running ? tr('Stop Monitoring') : tr('Start Monitoring')}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/dashboard')} style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>{tr('Open Dashboard')}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/current-updates')} style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>{tr('Open Alerts')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#010B24', flex: 1, paddingHorizontal: 16, paddingTop: 56 },
  headerRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 18 },
  backButton: { alignItems: 'center', height: 28, justifyContent: 'center', marginRight: 6, width: 28 },
  title: { color: '#EAF2FF', fontSize: 24, fontWeight: '800' },
  liveView: {
    backgroundColor: '#112C5D',
    borderColor: '#2E5AA8',
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  liveBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EF4444',
    borderRadius: 999,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  liveBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  liveText: { color: '#D1E2FF', fontSize: 14, lineHeight: 21 },
  countText: { color: '#8DB0E8', fontSize: 13, marginTop: 10 },
  actions: { marginTop: 12, paddingBottom: 20, rowGap: 8 },
  primaryBtn: { alignItems: 'center', backgroundColor: '#2563EB', borderRadius: 10, paddingVertical: 12 },
  primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  secondaryBtn: { alignItems: 'center', borderColor: '#2E5AA8', borderRadius: 10, borderWidth: 1, paddingVertical: 10 },
  secondaryText: { color: '#CDE0FF', fontSize: 13, fontWeight: '700' },
});
