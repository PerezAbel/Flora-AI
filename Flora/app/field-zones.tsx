import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/language-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FieldZonesScreen() {
  const { tr } = useLanguage();
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#0F172A" name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.title}>{tr('Field Zones')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>{tr('Registered Zones')}</Text>
        <Text style={styles.row}>{tr('Zone A1 - Maize - 7.5 acres')}</Text>
        <Text style={styles.row}>{tr('Zone A2 - Maize - 10.5 acres')}</Text>
        <Text style={styles.row}>{tr('Zone B1 - Tomato - 8 acres')}</Text>
        <Text style={styles.row}>{tr('Zone C1 - Cassava - 6.5 acres')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>{tr('Risk Mapping')}</Text>
        <Text style={styles.note}>{tr('High Risk: Zone A2')}</Text>
        <Text style={styles.note}>{tr('Medium Risk: Zone B1')}</Text>
        <Text style={styles.note}>{tr('Low Risk: Zone C1')}</Text>
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
  note: { color: '#64748B', fontSize: 13, marginBottom: 4 },
});
