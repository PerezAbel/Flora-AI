import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '@/contexts/language-context';

export default function LanguageSettingsScreen() {
  const { language, setLanguage, tr } = useLanguage();

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#0F172A" name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.title}>{tr('Language Settings')}</Text>
      </View>

      <Text style={styles.subtitle}>
        {tr('Select your preferred app language. Changes apply immediately.')}
      </Text>

      <Pressable onPress={() => setLanguage('en')} style={styles.optionCard}>
        <View>
          <Text style={styles.optionTitle}>{tr('English')}</Text>
          <Text style={styles.optionMeta}>English</Text>
        </View>
        {language === 'en' ? <Text style={styles.selected}>{tr('Selected')}</Text> : null}
      </Pressable>

      <Pressable onPress={() => setLanguage('sw')} style={styles.optionCard}>
        <View>
          <Text style={styles.optionTitle}>{tr('Swahili')}</Text>
          <Text style={styles.optionMeta}>Kiswahili</Text>
        </View>
        {language === 'sw' ? <Text style={styles.selected}>{tr('Selected')}</Text> : null}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F3F4F6', flex: 1 },
  content: { padding: 16, paddingBottom: 30 },
  headerRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 8 },
  backButton: { alignItems: 'center', height: 28, justifyContent: 'center', marginRight: 6, width: 28 },
  title: { color: '#0F172A', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#64748B', fontSize: 14, marginBottom: 14 },
  optionCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 12,
  },
  optionTitle: { color: '#111827', fontSize: 16, fontWeight: '700' },
  optionMeta: { color: '#6B7280', fontSize: 12, marginTop: 2 },
  selected: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
});
