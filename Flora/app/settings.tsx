import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon, Page, s } from '@/components/agro/ui';
import { useTheme } from '@/contexts/theme-context';

export default function SettingsScreen() {
  const router = useRouter();
  const { mode, colors, setMode } = useTheme();
  return <Page>
    <Text style={[s.title, { color: colors.text }]}>Settings</Text>
    <Text style={[s.small, { color: colors.muted }]}>Make AGRO AI comfortable to use day or night.</Text>
    <View style={[styles.group, { backgroundColor: colors.card }]}>
      <View style={styles.row}><View style={styles.rowLeft}><Icon name="moon-outline" color={colors.mint} /><View><Text style={[s.sectionTitle, { color: colors.text }]}>Dark mode</Text><Text style={[s.small, { color: colors.muted }]}>Dark gray surfaces with green accents</Text></View></View><Switch accessibilityLabel="Dark mode" value={mode === 'dark'} onValueChange={value => setMode(value ? 'dark' : 'light')} trackColor={{ false: colors.line, true: colors.raised }} thumbColor={colors.mint} /></View>
      <View style={[styles.divider, { backgroundColor: colors.line }]} />
      <View style={styles.row}><View style={styles.rowLeft}><Icon name="sunny-outline" color={colors.mint} /><View><Text style={[s.sectionTitle, { color: colors.text }]}>Light mode</Text><Text style={[s.small, { color: colors.muted }]}>White screens with green accents</Text></View></View><Switch accessibilityLabel="Light mode" value={mode === 'light'} onValueChange={value => setMode(value ? 'light' : 'dark')} trackColor={{ false: colors.line, true: colors.raised }} thumbColor={colors.mint} /></View>
    </View>
    <Pressable accessibilityRole="button" onPress={() => router.push('/language-settings')} style={[styles.link, { backgroundColor: colors.card }]}><Icon name="language-outline" color={colors.mint} /><Text style={[s.text, { color: colors.text, flex: 1 }]}>Language & region</Text><Icon name="chevron-forward" color={colors.muted} /></Pressable>
    <Pressable accessibilityRole="button" onPress={() => router.back()} style={[styles.link, { backgroundColor: colors.card }]}><Icon name="arrow-back" color={colors.mint} /><Text style={[s.text, { color: colors.text, flex: 1 }]}>Back to AGRO AI</Text><Icon name="chevron-forward" color={colors.muted} /></Pressable>
  </Page>;
}

const styles = StyleSheet.create({ group: { borderRadius: 17, padding: 16, gap: 14 }, row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 }, rowLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 }, divider: { height: 1 }, link: { minHeight: 54, paddingHorizontal: 16, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 12 } });
