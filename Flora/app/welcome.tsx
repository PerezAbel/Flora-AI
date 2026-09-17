import { ReferenceScreen } from '@/components/onboarding/reference-screen';
import { useLanguage } from '@/contexts/language-context';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function LandingPage() {
  const { tr } = useLanguage();

  return (
    <ReferenceScreen source={require('@/assets/images/2.png')}>
      <View pointerEvents="none" accessible={false} style={styles.titleBackground}>
        <Image source={require('@/assets/images/landing-without-title.png')} contentFit="fill" style={styles.titleArtwork} accessible={false} />
      </View>
      <View accessible accessibilityRole="header" accessibilityLabel="Smart AI Farm Solutions" style={styles.heading}>
        <Text style={[styles.title, styles.titleAccent]}>SMART AI</Text>
        <Text style={styles.title}>FARM</Text>
        <Text style={styles.title}>SOLUTIONS</Text>
      </View>
      <Pressable accessibilityRole="button" onPress={() => router.push('/login')} style={({ pressed }) => [styles.login, pressed && styles.pressed]}>
        <Text style={styles.loginText}>{tr('LOG IN')}</Text>
      </Pressable>
      <Pressable accessibilityRole="button" accessibilityLabel={tr('Sign in with email')} onPress={() => router.push('/login')} style={styles.email} />
      <Pressable accessibilityRole="button" accessibilityLabel={tr('Sign in with phone')} onPress={() => router.push({ pathname: '/login', params: { method: 'phone' } })} style={styles.phone} />
      <Pressable accessibilityRole="link" accessibilityLabel={tr('Sign up now')} onPress={() => router.push('/signup')} style={({ pressed }) => [styles.signup, pressed && styles.pressed]} />
    </ReferenceScreen>
  );
}

const styles = StyleSheet.create({
  titleBackground: { position: 'absolute', left: 0, top: 234, width: 414, height: 206, overflow: 'hidden' },
  titleArtwork: { position: 'absolute', left: 0, top: -234, width: 414, height: 896 },
  heading: { position: 'absolute', left: 20, top: 244, width: 374, height: 186, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 38, lineHeight: 62, fontWeight: '700', color: '#FFFFFF', textAlign: 'center' },
  titleAccent: { color: '#819B28' },
  login: { position: 'absolute', left: 83, top: 463, width: 248, height: 63, borderRadius: 20, backgroundColor: '#1A2911', alignItems: 'center', justifyContent: 'center' },
  loginText: { color: '#FFFFFF', fontSize: 16, letterSpacing: 1 },
  email: { position: 'absolute', left: 144, top: 593, width: 47, height: 47, borderRadius: 24 },
  phone: { position: 'absolute', left: 202, top: 593, width: 47, height: 47, borderRadius: 24 },
  signup: { position: 'absolute', left: 103, top: 705, width: 208, height: 48 },
  pressed: { opacity: 0.75 },
});
