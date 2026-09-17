import { ReferenceScreen } from '@/components/onboarding/reference-screen';
import { useLanguage } from '@/contexts/language-context';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SignupPage() {
  const { tr } = useLanguage();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');

  return (
    <ReferenceScreen source={require('@/assets/images/3.png')}>
      <View accessible accessibilityRole="header" accessibilityLabel={tr('Create new Account')} style={styles.heading} />
      <Pressable accessibilityRole="link" accessibilityLabel={tr('Already registered? Log in here.')} onPress={() => router.push('/login')} style={styles.loginLink} />
      <View style={styles.card}>
        <View style={[styles.field, { top: 70 }]}>
          <Text style={styles.label}>{tr('NAME')}</Text>
          <TextInput accessibilityLabel={tr('Name')} autoComplete="name" placeholder="Jiara Martins" placeholderTextColor="#545454" value={name} onChangeText={setName} style={styles.input} />
        </View>
        <View style={[styles.field, { top: 166 }]}>
          <Text style={styles.label}>{tr('EMAIL')}</Text>
          <TextInput accessibilityLabel={tr('Email')} autoComplete="email" autoCapitalize="none" keyboardType="email-address" placeholder="hello@reallygreatsite.com" placeholderTextColor="#545454" value={email} onChangeText={setEmail} style={styles.input} />
        </View>
        <View style={[styles.field, { top: 260 }]}>
          <Text style={styles.label}>{tr('PASSWORD')}</Text>
          <TextInput accessibilityLabel={tr('Password')} autoComplete="new-password" autoCapitalize="none" secureTextEntry placeholder="******" placeholderTextColor="#545454" value={password} onChangeText={setPassword} style={styles.input} />
        </View>
        <View style={[styles.field, { top: 354 }]}>
          <Text style={styles.label}>{tr('DATE OF BIRTH')}</Text>
          <TextInput accessibilityLabel={tr('Date of birth')} accessibilityHint="Enter your date of birth as DD/MM/YYYY" keyboardType="numbers-and-punctuation" placeholder={tr('Select')} placeholderTextColor="#545454" value={birthDate} onChangeText={setBirthDate} style={styles.input} />
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.replace('/home')} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>{tr('Sign up')}</Text>
        </Pressable>
      </View>
    </ReferenceScreen>
  );
}

const styles = StyleSheet.create({
  heading: { position: 'absolute', top: 75, left: 60, width: 294, height: 80 },
  loginLink: { position: 'absolute', top: 151, left: 90, width: 234, height: 44 },
  card: { position: 'absolute', top: 218, left: 41, width: 331, height: 616, borderRadius: 37, backgroundColor: '#FFFFFF' },
  field: { position: 'absolute', left: 15, right: 25 },
  label: { fontFamily: 'Poppins', color: '#909090', fontSize: 13, letterSpacing: 1.7, lineHeight: 20, marginBottom: 4 },
  input: { height: 56, borderRadius: 20, backgroundColor: '#D4D3D3', paddingHorizontal: 20, color: '#545454', fontFamily: 'Poppins', fontSize: 16 },
  button: { position: 'absolute', top: 463, left: 17, right: 16, height: 52, borderRadius: 8, backgroundColor: '#1A2911', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontFamily: 'PoppinsBold' },
  pressed: { opacity: 0.75 },
});
