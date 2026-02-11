import AppTopBar from '@/components/app-top-bar';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginPage() {
  return (
    <View style={styles.screen}>
      <AppTopBar />
      <View style={styles.card}>
        <Text style={styles.title}>Welcome back</Text>
        <TextInput placeholder="Email" style={styles.input} />
        <TextInput placeholder="Password" secureTextEntry style={styles.input} />
        <Pressable onPress={() => router.replace('/home')} style={styles.button}>
          <Text style={styles.buttonText}>Log In</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/signup')}>
          <Text style={styles.link}>Need an account? Sign Up</Text>
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 2,
    marginTop: 18,
    padding: 16,
  },
  title: {
    color: '#123524',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 14,
  },
  input: {
    backgroundColor: '#EFF7F1',
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2A6A4A',
    borderRadius: 12,
    marginTop: 4,
    paddingVertical: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  link: {
    color: '#2A6A4A',
    fontWeight: '700',
    marginTop: 14,
    textAlign: 'center',
  },
});
