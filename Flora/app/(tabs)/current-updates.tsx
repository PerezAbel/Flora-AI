import { useAgentData } from '@/contexts/agent-data-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/language-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function CurrentUpdatesTab() {
  const { tr } = useLanguage();
  const { alerts } = useAgentData();

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{tr('Overall Risk Level')}</Text>
        <View style={styles.riskRow}>
          <View style={styles.riskIcon}>
            <Ionicons color="#FFFFFF" name="warning-outline" size={28} />
          </View>
          <View>
            <View style={styles.levelBadge}>
              <Text style={styles.levelBadgeText}>{tr('Medium')}</Text>
            </View>
            <Text style={styles.updatedText}>{tr('Last updated: Today')}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.recentHeader}>{tr('Recent Alerts')}</Text>

      {alerts.map((alert) => (
        <View key={alert.id} style={[styles.alertCard, { borderLeftColor: alert.color }]}>
          <View style={styles.alertTop}>
            <View style={styles.alertTitleRow}>
              <View style={styles.alertIconWrap}>
                <Ionicons color="#576074" name="warning-outline" size={16} />
              </View>
              <Text style={styles.alertTitle}>{tr(alert.title)}</Text>
              <View style={[styles.alertLevelBadge, { backgroundColor: alert.badgeBg, borderColor: alert.color }]}>
                <Text style={[styles.alertLevelText, { color: alert.badgeText }]}>{tr(alert.level)}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.alertDetail}>{tr(alert.detail)}</Text>
          <View style={styles.timeRow}>
            <Ionicons color="#8A92A6" name="time-outline" size={14} />
            <Text style={styles.alertTime}>{tr(alert.time)}</Text>
          </View>
          <Pressable onPress={() => router.push({ pathname: '/alert-details', params: { id: alert.id } })} style={styles.viewDetailsBtn}>
            <Text style={styles.viewDetailsText}>{tr('View Details')}</Text>
          </Pressable>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#ffffff',
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
    rowGap: 14,
  },
  card: {
    backgroundColor: '#112C5D',
    borderColor: '#2A4F96',
    borderRadius: 14,
    borderWidth: 1,
    padding: 18,
  },
  sectionTitle: {
    color: '#EAF2FF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  riskRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
  },
  riskIcon: {
    alignItems: 'center',
    backgroundColor: '#F5A400',
    borderRadius: 34,
    height: 68,
    justifyContent: 'center',
    width: 68,
  },
  levelBadge: {
    alignItems: 'center',
    backgroundColor: '#213F7A',
    borderColor: '#F5A400',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  levelBadgeText: {
    color: '#9A6300',
    fontSize: 16,
    fontWeight: '700',
  },
  updatedText: {
    color: '#B1C4E7',
    fontSize: 12,
    marginTop: 6,
  },
  recentHeader: {
    color: '#000000',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  alertCard: {
    backgroundColor: '#112C5D',
    borderColor: '#2A4F96',
    borderLeftWidth: 4,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  alertTop: {
    marginBottom: 4,
  },
  alertTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  alertIconWrap: {
    alignItems: 'center',
    backgroundColor: '#1A3A73',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  alertTitle: {
    color: '#EAF2FF',
    fontSize: 18,
    fontWeight: '700',
  },
  alertLevelBadge: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  alertLevelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  alertDetail: {
    color: '#B5C9EB',
    fontSize: 14,
    marginBottom: 8,
  },
  timeRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    marginBottom: 12,
  },
  alertTime: {
    color: '#9EB2D6',
    fontSize: 12,
  },
  viewDetailsBtn: {
    alignItems: 'center',
    borderColor: '#11A34E',
    borderRadius: 8,
    borderWidth: 1.5,
    paddingVertical: 8,
  },
  viewDetailsText: {
    color: '#8CE9B0',
    fontSize: 13,
    fontWeight: '700',
  },
});
