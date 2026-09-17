import { ReferenceScreen } from '@/components/onboarding/reference-screen';
import { useLanguage } from '@/contexts/language-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginPage() {
  const { tr } = useLanguage();
  const { method } = useLocalSearchParams<{ method?: string }>();
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const phone = method === 'phone';

  return (
    <ReferenceScreen source={require('@/assets/images/4.png')}>
      <View accessible accessibilityRole="image" accessibilityLabel="Agro Farm Kenya" style={styles.brand} />
      <View style={styles.card}>
        <Text accessibilityRole="header" style={styles.title}>{tr('Login')}</Text>
        <Text style={styles.subtitle}>{tr('Sign in to continue.')}</Text>
        <View style={[styles.field, { top: 140 }]}>
          <Text style={styles.label}>{tr(phone ? 'PHONE' : 'NAME')}</Text>
          <TextInput accessibilityLabel={tr(phone ? 'Phone' : 'Name')} autoComplete={phone ? 'tel' : 'username'} keyboardType={phone ? 'phone-pad' : 'default'} autoCapitalize="none" placeholder={phone ? '+254' : 'Jiara Martins'} placeholderTextColor="#545454" value={name} onChangeText={setName} style={styles.input} />
        </View>
        <View style={[styles.field, { top: 235 }]}>
          <Text style={styles.label}>{tr('PASSWORD')}</Text>
          <TextInput accessibilityLabel={tr('Password')} autoComplete="current-password" autoCapitalize="none" secureTextEntry placeholder="******" placeholderTextColor="#545454" value={password} onChangeText={setPassword} style={styles.input} />
        </View>
        <Pressable accessibilityRole="button" onPress={() => router.replace('/home')} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
          <Text style={styles.buttonText}>{tr('Log in')}</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={() => Alert.alert(tr('Forgot Password?'), tr('Password reset is not connected yet.'))} style={styles.forgot}>
          <Text style={styles.linkText}>{tr('Forgot Password?')}</Text>
        </Pressable>
        <Pressable accessibilityRole="link" onPress={() => router.push('/signup')} style={styles.signup}>
          <Text style={styles.linkText}>{tr('Signup !')}</Text>
        </Pressable>
      </View>
    </ReferenceScreen>
  );
}

const styles = StyleSheet.create({
  brand: { position: 'absolute', left: 100, top: 40, width: 210, height: 290 },
  card: { position: 'absolute', left: 0, top: 407, width: 414, height: 489, backgroundColor: '#FFFFFF', borderTopLeftRadius: 16, borderTopRightRadius: 90 },
  title: { position: 'absolute', top: 25, width: '100%', textAlign: 'center', color: '#314916', fontSize: 48, lineHeight: 64, fontFamily: 'PoppinsBold' },
  subtitle: { fontFamily: 'Poppins', position: 'absolute', top: 96, width: '100%', textAlign: 'center', color: '#909090', fontSize: 14 },
  field: { position: 'absolute', left: 54, right: 68 },
  label: { fontFamily: 'Poppins', color: '#909090', fontSize: 12, letterSpacing: 1.7, lineHeight: 20, marginLeft: 10, marginBottom: 3 },
  input: { height: 56, borderRadius: 20, backgroundColor: '#D4D3D3', paddingHorizontal: 30, color: '#545454', fontFamily: 'Poppins', fontSize: 15 },
  button: { position: 'absolute', left: 65, top: 325, width: 267, height: 48, borderRadius: 8, backgroundColor: '#314916', alignItems: 'center', justifyContent: 'center' },
  buttonText: { color: '#FFFFFF', fontSize: 15, fontFamily: 'PoppinsBold' },
  forgot: { position: 'absolute', left: 105, top: 373, width: 204, height: 44, alignItems: 'center', justifyContent: 'center' },
  signup: { position: 'absolute', left: 137, top: 411, width: 140, height: 44, alignItems: 'center', justifyContent: 'center' },
  linkText: { fontFamily: 'Poppins', color: '#909090', fontSize: 13 },
  pressed: { opacity: 0.75 },
});
