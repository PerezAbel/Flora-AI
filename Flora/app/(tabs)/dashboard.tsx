import { useAgentData } from '@/contexts/agent-data-context';
import { useLanguage } from '@/contexts/language-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const cropData = {
  title: 'Crop Disease Analysis',
  mainTitle: 'Total crop samples analyzed this week',
  mainValue: '1,247',
  mainSub: '+12% more scans than last week',
  trendBars: [42, 68, 55, 80, 50, 73, 62],
  stats: [
    { icon: 'scan-outline', color: '#F97316', value: '347', label: 'Crop scans today' },
    { icon: 'alert-circle-outline', color: '#EF4444', value: '63', label: 'High-risk detections' },
    { icon: 'checkmark-done-outline', color: '#10B981', value: '81%', label: 'Healthy classifications' },
    { icon: 'analytics-outline', color: '#3B82F6', value: '89%', label: 'Model confidence avg.' },
  ],
  classTitle: 'Detected Disease Classes',
  classBars: [56, 88, 64, 79, 61],
  classLabels: ['Rust', 'Blight', 'Virus', 'Pest', 'Healthy'],
  actions: [
    '1. Prioritize treatment for blocks with Rust and Blight detections.',
    '2. Re-scan flagged crops after 48 hours to confirm improvement.',
    '3. Upload clear close-up leaf photos for better classification accuracy.',
  ],
};

const animalData = {
  title: 'Animal Health Analysis',
  mainTitle: 'Total animal checks analyzed this week',
  mainValue: '934',
  mainSub: '+9% more checks than last week',
  trendBars: [36, 62, 52, 71, 48, 66, 58],
  stats: [
    { icon: 'pulse-outline', color: '#F97316', value: '211', label: 'Animal checks today' },
    { icon: 'warning-outline', color: '#EF4444', value: '27', label: 'High-risk symptoms' },
    { icon: 'medkit-outline', color: '#10B981', value: '76%', label: 'Healthy classifications' },
    { icon: 'analytics-outline', color: '#3B82F6', value: '87%', label: 'Model confidence avg.' },
  ],
  classTitle: 'Detected Condition Classes',
  classBars: [62, 49, 70, 44, 81],
  classLabels: ['Fever', 'Skin', 'Resp.', 'Injury', 'Healthy'],
  actions: [
    '1. Isolate animals flagged with fever-like symptoms.',
    '2. Re-check breathing-related cases in the evening.',
    '3. Upload clearer close-up photos of visible symptoms.',
  ],
};

export default function DashboardTab() {
  const { tr } = useLanguage();
  const { alerts, scanHistory } = useAgentData();
  const [mode, setMode] = useState<'crop' | 'animal'>('crop');
  const data = mode === 'crop' ? cropData : animalData;
  const modeHistory = scanHistory.filter((entry) => entry.mode === mode);
  const modeAlerts = alerts.filter((entry) => entry.mode === mode);
  const highRiskCount = modeAlerts.filter((entry) => entry.level === 'High').length;
  const healthyCount = modeHistory.filter((entry) => entry.result.toLowerCase().includes('healthy')).length;
  const healthyPct = modeHistory.length ? Math.round((healthyCount / modeHistory.length) * 100) : 0;
  const mainValue = `${modeHistory.length}`;
  const stats = [
    { ...data.stats[0], value: `${modeHistory.length}` },
    { ...data.stats[1], value: `${highRiskCount}` },
    { ...data.stats[2], value: `${healthyPct}%` },
    { ...data.stats[3], value: `${80 + Math.min(modeHistory.length, 15)}%` },
  ];

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <Text style={styles.header}>{tr(data.title)}</Text>

      <View style={styles.switcher}>
        <Pressable
          onPress={() => setMode('crop')}
          style={[styles.switchPill, mode === 'crop' ? styles.switchPillActive : null]}
        >
          <View style={styles.switchContent}>
            <Ionicons color={mode === 'crop' ? '#FFFFFF' : '#6B7280'} name="leaf-outline" size={14} />
            <Text style={mode === 'crop' ? styles.switchTextActive : styles.switchText}>{tr('Crop')}</Text>
          </View>
        </Pressable>
        <Pressable
          onPress={() => setMode('animal')}
          style={[styles.switchPill, mode === 'animal' ? styles.switchPillActive : null]}
        >
          <View style={styles.switchContent}>
            <Ionicons color={mode === 'animal' ? '#FFFFFF' : '#6B7280'} name="paw-outline" size={14} />
            <Text style={mode === 'animal' ? styles.switchTextActive : styles.switchText}>{tr('Animal')}</Text>
          </View>
        </Pressable>
      </View>

      <View style={styles.revenueCard}>
        <Text style={styles.revenueTitle}>{tr(data.mainTitle)}</Text>
        <Text style={styles.revenueValue}>{mainValue}</Text>
        <Text style={styles.revenueSub}>{tr(data.mainSub)}</Text>
        <View style={styles.trendRow}>
          {data.trendBars.map((value, idx) => (
            <View key={`trend-${idx}`} style={styles.trendCol}>
              <View style={[styles.trendBar, { height: value }]} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.quickStats}>
        {stats.map((stat) => (
          <View key={stat.label} style={styles.statCard}>
            <Ionicons color={stat.color} name={stat.icon as never} size={18} />
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{tr(stat.label)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.sectionTitle}>{tr(data.classTitle)}</Text>
        <View style={styles.productBarsWrap}>
          {data.classBars.map((value, idx) => (
            <View key={`prod-${idx}`} style={styles.productBarCol}>
              <View style={[styles.productBarBack, { height: 90 }]}>
                <View style={[styles.productBarFront, { height: value }]} />
              </View>
              <Text style={styles.productLabel}>{tr(data.classLabels[idx])}</Text>
            </View>
          ))}
        </View>
        <Pressable onPress={() => router.push({ pathname: '/history', params: { type: mode } })} style={styles.historyBtn}>
          <Ionicons color="#FFFFFF" name="time-outline" size={15} />
          <Text style={styles.historyBtnText}>{tr('Check View Scan History')}</Text>
        </Pressable>
      </View>

      <View style={styles.actionsCard}>
        <Text style={styles.sectionTitle}>{tr('Farmer Actions')}</Text>
        {data.actions.map((item) => (
          <Text key={item} style={styles.actionItem}>
            {tr(item)}
          </Text>
        ))}
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
    paddingBottom: 120,
  },
  header: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
  },
  switcher: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 12,
    padding: 4,
  },
  switchPill: {
    alignItems: 'center',
    borderRadius: 8,
    flex: 1,
    paddingVertical: 8,
  },
  switchContent: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  switchPillActive: {
    backgroundColor: '#F97316',
  },
  switchText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '700',
  },
  switchTextActive: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  revenueCard: {
    backgroundColor: '#F97316',
    borderRadius: 16,
    marginBottom: 12,
    padding: 14,
  },
  revenueTitle: {
    color: '#FFEDD5',
    fontSize: 12,
    fontWeight: '600',
  },
  revenueValue: {
    color: '#FFFFFF',
    fontSize: 31,
    fontWeight: '800',
    marginTop: 3,
  },
  revenueSub: {
    color: '#FFEDD5',
    fontSize: 12,
    marginTop: 2,
  },
  trendRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
  },
  trendCol: {
    flex: 1,
    height: 80,
    justifyContent: 'flex-end',
  },
  trendBar: {
    backgroundColor: '#FDBA74',
    borderRadius: 5,
    width: '100%',
  },
  quickStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    minWidth: '48%',
    padding: 12,
  },
  statValue: {
    color: '#111827',
    fontSize: 21,
    fontWeight: '800',
    marginTop: 4,
  },
  statLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 3,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    padding: 14,
  },
  sectionTitle: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 10,
  },
  productBarsWrap: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  productBarBack: {
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    width: 18,
  },
  productBarFront: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    width: '100%',
  },
  productLabel: {
    color: '#6B7280',
    fontSize: 11,
    marginTop: 6,
  },
  historyBtn: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    paddingVertical: 10,
  },
  historyBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 6,
  },
  actionsCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  actionItem: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 4,
  },
});
