import { Icon, type IconName } from '@/components/agro/ui';
import { useTheme } from '@/contexts/theme-context';
import { router, type Href } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const navigation: { label: string; route: Href; icon: IconName }[] = [
  { label: 'Scan History', route: '/history', icon: 'scan-outline' },
  { label: 'Chat History', route: '/chat-history', icon: 'chatbubbles-outline' },
];

export default function AppTopBar({ dark = false }: { dark?: boolean }) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const foreground = dark ? '#C4F9D3' : colors.text;
  return (
    <View style={styles.bar}>
      <Pressable accessibilityRole="button" accessibilityLabel="Open side navigation" onPress={() => setOpen(true)} style={styles.button}>
        <Icon name="menu-outline" color={foreground} size={25} />
      </Pressable>
      <Text style={[styles.brand, { color: foreground }]}>FLORA AI</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="My profile" onPress={() => router.push('/profile')} style={styles.button}>
        <Icon name="person-circle-outline" color={foreground} size={26} />
      </Pressable>
      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <View style={styles.overlay}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close side navigation" onPress={() => setOpen(false)} style={StyleSheet.absoluteFill} />
          <SafeAreaView style={[styles.drawer, { backgroundColor: colors.bg }]}>
            <View style={styles.bar}>
              <Text style={[styles.brand, { color: colors.mint }]}>FLORA AI</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Close menu" onPress={() => setOpen(false)} style={styles.button}>
                <Icon name="close" />
              </Pressable>
            </View>
            <ScrollView>
              {navigation.map((item) => (
                <Pressable key={item.label} accessibilityRole="button" onPress={() => { setOpen(false); router.push(item.route); }} style={styles.link}>
                  <Icon name={item.icon} size={21} />
                  <Text style={[styles.linkText, { color: colors.text }]}>{item.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', minHeight: 48 },
  button: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  brand: { fontSize: 12, fontWeight: '700', letterSpacing: 3 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  drawer: { width: '86%', maxWidth: 340, height: '100%', paddingHorizontal: 20, gap: 12 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 14, minHeight: 54 },
  linkText: { fontSize: 14, fontWeight: '600', flex: 1 },
});
