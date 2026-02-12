import { useLanguage } from '@/contexts/language-context';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginPage() {
  const { tr } = useLanguage();

  return (
    <View style={styles.screen}>
      <View style={styles.topArea}>
        <Text style={styles.title}>{tr('Get Started')}</Text>
        <Text style={styles.subtitle}>{tr('Your AI-companion awaits')}</Text>
      </View>

      <View style={styles.card}>
        <TextInput placeholder={tr('Email')} placeholderTextColor="#9CA3AF" style={styles.input} />
        <TextInput placeholder={tr('Password')} placeholderTextColor="#9CA3AF" secureTextEntry style={styles.input} />
        <Pressable onPress={() => router.replace('/home')} style={styles.button}>
          <Text style={styles.buttonText}>{tr('LOGIN')}</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/signup')}>
          <Text style={styles.link}>{tr('Need an account? Sign Up')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#071026',
    flex: 1,
  },
  topArea: {
    backgroundColor: '#04112B',
    paddingHorizontal: 20,
    paddingTop: 58,
  },
  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    flex: 1,
    marginTop: 18,
    paddingHorizontal: 18,
    paddingTop: 18,
  },
  title: {
    color: '#EAF2FF',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#9FB6DA',
    fontSize: 13,
    marginBottom: 16,
    marginTop: 4,
  },
  input: {
    borderBottomColor: '#E5E7EB',
    borderBottomWidth: 1,
    fontSize: 14,
    marginBottom: 18,
    paddingVertical: 10,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1D4ED8',
    borderRadius: 999,
    marginTop: 8,
    paddingVertical: 11,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  link: {
    color: '#4169B6',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 14,
    textAlign: 'center',
  },
});
