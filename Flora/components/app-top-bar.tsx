import { FontAwesome } from '@expo/vector-icons';
import { useLanguage } from '@/contexts/language-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const NAV_ITEMS = [
  { label: 'Agent History', route: '/history' },
  { label: 'Agent Settings', route: '/settings' },
  { label: 'Agent Profile', route: '/profile' },
  { label: 'Agent Alerts', route: '/current-updates' },
  { label: 'Agent Feedback', route: '/recommendations' },
  { label: 'Agent Animal Well Being', route: '/animal-well-being' },
];

export default function AppTopBar() {
  const { tr } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <Pressable onPress={() => setOpen((v) => !v)} style={styles.iconButton}>
          <View style={styles.menuIcon}>
            <View style={[styles.menuLine, styles.lineOne]} />
            <View style={[styles.menuLine, styles.lineTwo]} />
            <View style={[styles.menuLine, styles.lineThree]} />
          </View>
        </Pressable>

        <Pressable onPress={() => router.push('/profile')} style={styles.iconButton}>
          <View style={styles.profileWrap}>
            <FontAwesome name="user" size={18} color="#123524" />
            <View style={styles.plusBadge}>
              <FontAwesome name="plus" size={10} color="#fff" />
            </View>
          </View>
        </Pressable>
      </View>

      {open ? <Pressable onPress={() => setOpen(false)} style={styles.backdrop} /> : null}

      <View style={[styles.drawer, open ? styles.drawerOpen : null]}>
        <Pressable onPress={() => setOpen(false)} style={styles.closeButton}>
          <FontAwesome name="close" size={18} color="#123524" />
        </Pressable>

        {NAV_ITEMS.map((item) => (
          <Pressable
            key={item.label}
            onPress={() => {
              setOpen(false);
              router.push(item.route as never);
            }}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>{tr(item.label)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
    position: 'relative',
    zIndex: 20,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  iconButton: {
    alignItems: 'center',
    backgroundColor: '#E5F4E8',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  menuIcon: {
    gap: 3,
    width: 22,
  },
  menuLine: {
    backgroundColor: '#123524',
    borderRadius: 999,
    height: 2,
  },
  lineOne: { width: 22 },
  lineTwo: { width: 16 },
  lineThree: { width: 10 },
  profileWrap: { alignItems: 'center', justifyContent: 'center' },
  plusBadge: {
    alignItems: 'center',
    backgroundColor: '#2A6A4A',
    borderRadius: 999,
    bottom: -2,
    height: 14,
    justifyContent: 'center',
    position: 'absolute',
    right: -9,
    width: 14,
  },
  backdrop: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    bottom: -1000,
    left: -20,
    position: 'absolute',
    right: -20,
    top: -20,
    zIndex: 24,
  },
  drawer: {
    backgroundColor: '#F5FBF6',
    borderColor: '#D0E8D6',
    borderRightWidth: 1,
    bottom: -1000,
    left: -280,
    paddingHorizontal: 10,
    paddingTop: 56,
    position: 'absolute',
    top: -20,
    width: 260,
    zIndex: 25,
  },
  closeButton: {
    alignItems: 'center',
    height: 36,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 12,
    width: 36,
  },
  drawerOpen: { left: -20 },
  menuItem: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  menuText: {
    color: '#123524',
    fontSize: 14,
    fontWeight: '600',
  },
});
