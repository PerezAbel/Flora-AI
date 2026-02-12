import { useLanguage } from '@/contexts/language-context';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function LandingPage() {
  const { tr } = useLanguage();

  return (
    <View style={styles.screen}>
      <View style={styles.bgTop} />
      <View style={styles.bgBottom} />
      <View style={styles.center}>
        <View style={styles.avatarWrap}>
          <FontAwesome color="#EAF2FF" name="user" size={34} />
        </View>
        <Text style={styles.brand}>{tr('Flora AI')}</Text>
        <Text style={styles.subtitle}>{tr('Your Smart AI farm Assistant')}</Text>
        <Pressable onPress={() => router.push('/signup')} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>{tr('Get Started')}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.link}>{tr('Already have an account? Log In')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#04112B',
    flex: 1,
  },
  bgTop: {
    backgroundColor: '#061A43',
    bottom: '45%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  bgBottom: {
    backgroundColor: '#071026',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: '55%',
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  avatarWrap: {
    alignItems: 'center',
    backgroundColor: '#DCE7FB',
    borderRadius: 42,
    height: 84,
    justifyContent: 'center',
    marginBottom: 18,
    width: 84,
  },
  brand: {
    color: '#F2F7FF',
    fontSize: 29,
    fontWeight: '800',
  },
  subtitle: {
    color: '#AFC4E8',
    fontSize: 13,
    marginTop: 5,
    textAlign: 'center',
  },
  primaryBtn: {
    backgroundColor: '#1D4ED8',
    borderRadius: 999,
    marginTop: 22,
    minWidth: 190,
    paddingVertical: 12,
  },
  primaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
  link: {
    color: '#B8CCE9',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 12,
  },
});
