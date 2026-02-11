import { FontAwesome } from '@expo/vector-icons';
import AppTopBar from '@/components/app-top-bar';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function LandingPage() {
  return (
    <View style={styles.screen}>
      <AppTopBar />
      <View style={styles.center}>
        <FontAwesome color="#2A6A4A" name="leaf" size={58} />
        <Text style={styles.brand}>Flora AI</Text>
        <Text style={styles.subtitle}>Your Reliable AI Farm Assistant</Text>
        <Text style={styles.helper}>Get started with me</Text>
        <Pressable onPress={() => router.push('/signup')} style={styles.primaryBtn}>
          <Text style={styles.primaryText}>Sign Up</Text>
        </Pressable>
        <Text style={styles.small}>Don&apos;t have an account yet?</Text>
        <Pressable onPress={() => router.push('/login')}>
          <Text style={styles.link}>Log In</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F8FFF9',
    flex: 1,
    padding: 18,
  },
  center: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  brand: {
    color: '#123524',
    fontSize: 32,
    fontWeight: '900',
    marginTop: 8,
  },
  subtitle: {
    color: '#244433',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 18,
    textAlign: 'center',
  },
  helper: {
    color: '#577161',
    fontSize: 15,
    marginTop: 6,
  },
  primaryBtn: {
    backgroundColor: '#2A6A4A',
    borderRadius: 12,
    marginTop: 24,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  small: {
    color: '#486252',
    marginTop: 18,
  },
  link: {
    color: '#2A6A4A',
    fontSize: 15,
    fontWeight: '700',
    marginTop: 8,
  },
});
