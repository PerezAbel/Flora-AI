import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { useLanguage } from '@/contexts/language-context';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const groupOne = [
  { id: 'farm-profile', label: 'Farm Profile', icon: 'leaf-outline' as const, route: '/farm-profile' as const },
  { id: 'field-zones', label: 'Field Zones', icon: 'map-outline' as const, route: '/field-zones' as const },
  {
    id: 'crop-monitoring',
    label: 'Crop Monitoring Schedule',
    icon: 'calendar-outline' as const,
    route: '/crop-monitoring-schedule' as const,
  },
  {
    id: 'alert-preferences',
    label: 'Disease Alert Preferences',
    icon: 'notifications-outline' as const,
    route: '/disease-alert-preferences' as const,
  },
  { id: 'weather-units', label: 'Weather Units', icon: 'partly-sunny-outline' as const, route: '/weather-units' as const },
  { id: 'language-settings', label: 'Language Settings', icon: 'language-outline' as const, route: '/language-settings' as const },
];

const groupTwo = [
  { id: 'scan-history', label: 'Scan History', icon: 'time-outline' as const, route: '/history' as const },
  { id: 'data-sync', label: 'Data Sync', icon: 'cloud-upload-outline' as const, route: '/data-sync' as const },
  { id: 'privacy', label: 'Privacy and Data', icon: 'shield-checkmark-outline' as const, route: '/privacy-and-data' as const },
  { id: 'help', label: 'Farmer Help and Support', icon: 'help-circle-outline' as const, route: '/farmer-help-support' as const },
  { id: 'logout', label: 'Logout', icon: 'log-out-outline' as const, route: '/login' as const },
];

function MenuGroup({
  items,
}: {
  items: { id: string; label: string; icon: keyof typeof Ionicons.glyphMap; route: Href }[];
}) {
  const { tr } = useLanguage();

  return (
      <View style={styles.menuGroup}>
      {items.map((item, index) => (
        <Pressable
          key={item.id}
          onPress={() => router.push(item.route)}
          style={[styles.menuItem, index !== items.length - 1 ? styles.menuItemDivider : null]}
        >
          <View style={styles.menuLeft}>
            <Ionicons color="#8A8D96" name={item.icon} size={16} />
            <Text style={styles.menuText}>{tr(item.label)}</Text>
          </View>
          <Ionicons color="#B6BAC3" name="chevron-forward" size={14} />
        </Pressable>
      ))}
    </View>
  );
}

export default function ProfileTab() {
  const { tr } = useLanguage();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.topArea}>
          <View style={styles.headerRow}>
            <View style={styles.headerSpacer} />
            <Text style={styles.headerTitle}>{tr('Farmer Profile')}</Text>
            <View style={styles.headerSpacer} />
          </View>

          <Image source={require('@/assets/images/icon.png')} style={styles.avatar} />
          <Text style={styles.name}>Perez Kazungu</Text>
          <Text style={styles.email}>@marieyogamed</Text>
        </View>

        <View style={styles.bottomArea}>
          <MenuGroup items={groupOne} />
          <MenuGroup items={groupTwo} />
          <Text style={styles.versionText}>{tr('App Version 1.0.0')}</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#e4e5e4',
    flex: 1,
  },
  content: {
    paddingBottom: 100,
  },
  topArea: {
    alignItems: 'center',
    backgroundColor: '#011a55',
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
    paddingBottom: 18,
    paddingHorizontal: 16,
    paddingTop: 52,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
    width: '100%',
  },
  headerTitle: {
    color: '#F5F7FC',
    fontSize: 14,
    fontWeight: '700',
  },
  headerSpacer: {
    width: 20,
  },
  avatar: {
    borderRadius: 28,
    height: 56,
    marginBottom: 8,
    width: 56,
  },
  name: {
    color: '#F6F7FB',
    fontSize: 16,
    fontWeight: '700',
  },
  email: {
    color: '#8F95A4',
    fontSize: 11,
    marginTop: 2,
  },
  bottomArea: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  menuGroup: {
    backgroundColor: '#F9F9FA',
    borderRadius: 12,
    marginBottom: 12,
    paddingHorizontal: 12,
  },
  menuItem: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 42,
  },
  menuItemDivider: {
    borderBottomColor: '#ECEDEF',
    borderBottomWidth: 1,
  },
  menuLeft: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  menuText: {
    color: '#282B33',
    fontSize: 12,
    marginLeft: 10,
  },
  versionText: {
    color: '#191919',
    fontSize: 10,
    marginTop: 14,
    textAlign: 'center',
  },
});
