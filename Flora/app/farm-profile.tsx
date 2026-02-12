import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useLanguage } from '@/contexts/language-context';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function FarmProfileScreen() {
  const { tr } = useLanguage();
  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#0F172A" name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.title}>{tr('Farm Profile')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>{tr('Farm Details')}</Text>
        <Text style={styles.row}>{tr('Farm Name: Green Valley Cooperative')}</Text>
        <Text style={styles.row}>{tr('Owner: Sabrina Aryan')}</Text>
        <Text style={styles.row}>{tr('Region: Northern District')}</Text>
        <Text style={styles.row}>{tr('Total Acreage: 32.5 acres')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>{tr('Primary Crops')}</Text>
        <Text style={styles.row}>{tr('Maize (18 acres)')}</Text>
        <Text style={styles.row}>{tr('Tomato (8 acres)')}</Text>
        <Text style={styles.row}>{tr('Cassava (6.5 acres)')}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.section}>{tr('Profile Status')}</Text>
        <Text style={styles.note}>{tr('Last updated: Today, 8:45 AM')}</Text>
        <Text style={styles.note}>{tr('Next recommended review: In 30 days')}</Text>
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
