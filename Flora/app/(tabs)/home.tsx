import AppTopBar from '@/components/app-top-bar';
import { Icon } from '@/components/agro/ui';
import { buildCareReply, careGuidance, type CareMode } from '@/services/care-guidance';
import { useChatHistory } from '@/contexts/chat-history-context';
import { useAgentData } from '@/contexts/agent-data-context';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const modes = [{ id: 'crop', label: 'Plants' }, { id: 'animal', label: 'Animals' }] as const;

export default function HomeScreen() {
  const { createSession } = useChatHistory();
  const { recordCareScan } = useAgentData();
  const [mode, setMode] = useState<CareMode>('crop');
  const [symptoms, setSymptoms] = useState('');
  const [image, setImage] = useState<string>();
  const [notice, setNotice] = useState('');
  const [picking, setPicking] = useState(false);
  const [review, setReview] = useState(false);
  const input = useRef<TextInput>(null);
  const scroll = useRef<ScrollView>(null);
  const guidance = careGuidance[mode];

  const pick = async (camera: boolean) => {
    if (picking) return;
    setPicking(true);
    setNotice('');
    try {
      const permission = camera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setNotice('Allow camera or photo library access, or type the symptoms below.');
        return;
      }
      const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.85 };
      const result = camera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
      if (!result.canceled && result.assets[0]) {
        setImage(result.assets[0].uri);
        recordCareScan(mode, result.assets[0].uri, symptoms.trim());
        setReview(true);
        input.current?.blur();
      }
    } catch {
      setNotice('Unable to open photos. Try another option or type your symptoms.');
    } finally {
      setPicking(false);
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.screen}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
          <AppTopBar dark />
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>A little clarity. A healthier tomorrow.</Text>
            <Text style={styles.heading}>What Can I Do for{'\n'}You Today?</Text>
            <View style={styles.modes}>
              {modes.map((option) => (
                <Pressable key={option.id} accessibilityRole="radio" aria-checked={mode === option.id} accessibilityState={{ checked: mode === option.id }} onPress={() => { setMode(option.id); setReview(false); setNotice(''); }} style={[styles.mode, mode === option.id && styles.modeActive]}>
                  <Text style={[styles.modeText, mode === option.id && styles.modeTextActive]}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.orbSpace} accessible={false} pointerEvents="none">
              <View style={styles.halo} />
              {[0, 1, 2, 3, 4, 5].map((ring) => (
                <View key={ring} style={[styles.ring, {
                  width: 205 + ring * 5,
                  height: 215 - ring * 6,
                  borderColor: ring % 2 ? '#17F779' : '#078842',
                  opacity: 0.85 - ring * 0.09,
                  transform: [{ rotate: (ring * 31) + 'deg' }, { translateX: ring % 2 ? 6 : -6 }],
                }]} />
              ))}
              <View style={styles.orbCore} />
            </View>
            <Pressable accessibilityRole="button" onPress={() => input.current?.focus()} style={styles.keyboardButton}>
              <Icon name="keypad-outline" size={15} color="#89AD96" />
              <Text style={styles.muted}>Type symptoms or scan a photo</Text>
            </Pressable>
          </View>
          <View style={styles.composer}>
            <Text style={styles.sectionTitle}>What have you noticed?</Text>
            <TextInput ref={input} accessibilityLabel="Describe symptoms" multiline maxLength={3000} value={symptoms} onChangeText={(value) => { setSymptoms(value); setReview(false); }} placeholder={mode === 'crop' ? 'e.g. My tomato leaves are yellow with brown spots. It started 3 days ago…' : 'Species, age, symptoms, when they started, appetite and any treatment already given…'} placeholderTextColor="#72917E" style={styles.input} />
            {image && (
              <View style={styles.attachment}>
                <Image source={{ uri: image }} style={styles.thumbnail} />
                <View style={{ flex: 1 }}><Text style={styles.body}>Photo attached</Text><Text style={styles.muted}>Saved in this form · not analyzed</Text></View>
                <Pressable accessibilityRole="button" accessibilityLabel="Remove photo" onPress={() => { setImage(undefined); setReview(false); }} style={styles.iconButton}><Icon name="close" color="#BAE7C8" /></Pressable>
              </View>
            )}
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" disabled={picking} onPress={() => void pick(true)} style={styles.smallButton}><Icon name="scan-outline" size={19} color="#BFF8CF" /><Text style={styles.actionText}>Scan</Text></Pressable>
              <Pressable accessibilityRole="button" disabled={picking} onPress={() => void pick(false)} style={styles.smallButton}><Icon name="image-outline" size={19} color="#BFF8CF" /><Text style={styles.actionText}>Upload</Text></Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Review symptoms and care guidance" disabled={picking || (!symptoms.trim() && !image)} onPress={() => { if (symptoms.trim()) createSession(mode, symptoms.trim(), buildCareReply(mode)); setReview(true); setNotice(''); input.current?.blur(); }} style={[styles.send, !symptoms.trim() && !image && { opacity: 0.4 }]}><Icon name="arrow-forward" color="#03210E" /></Pressable>
            </View>
          </View>
          <Text style={styles.footnote}>Care guidance preview · Clinical diagnosis is not connected.</Text>
          {!!notice && <Text accessibilityRole="alert" style={styles.warning}>{notice}</Text>}
          {review && (
            <View style={styles.results} onLayout={(event) => scroll.current?.scrollTo({ y: event.nativeEvent.layout.y, animated: true })}>
              <Text style={styles.eyebrow}>YOUR CARE SUMMARY</Text>
              <Text style={styles.resultTitle}>Start with the right next step.</Text>
              <Text style={styles.body}>{symptoms.trim() || 'Photo attached without a symptom description.'}</Text>
              <Text style={styles.muted}>This is general guidance, not an AI diagnosis. Your photo has not been analyzed. Share these details with a {guidance.professional.toLowerCase()}.</Text>
              <View style={styles.divider} />
              <Text style={styles.sectionTitle}>Care & remedies</Text>
              {guidance.steps.map((step, index) => <Text key={step} style={styles.body}>{index + 1}. {step}</Text>)}
              <Text style={styles.sectionTitle}>Medicines & treatment options</Text>
              <Text style={styles.body}>{guidance.medicines}</Text>
              <Text style={styles.sectionTitle}>When to act & treatment duration</Text>
              <Text style={styles.body}>{guidance.timing}</Text>
              <Text style={styles.sectionTitle}>Recommended professional</Text>
              <Text style={styles.body}>{guidance.professional}</Text>
              <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/nearby-care', params: { category: guidance.search } })} style={styles.primary}><Icon name="location-outline" color="#05240E" /><Text style={styles.primaryText}>Find nearby care</Text></Pressable>
              <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(guidance.url).catch(() => setNotice('Could not open the guidance source. Please try again.'))}><Text style={styles.source}>{guidance.source} ↗</Text></Pressable>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#030C07' },
  page: { flexGrow: 1, width: '100%', maxWidth: 680, alignSelf: 'center', paddingHorizontal: 22, paddingBottom: 24, gap: 16 },
  hero: { alignItems: 'center', paddingTop: 20 },
  eyebrow: { color: '#8ABC9A', fontSize: 11, letterSpacing: 0.5, textAlign: 'center' },
  heading: { color: '#CAFFDA', fontSize: 34, lineHeight: 39, letterSpacing: -1.6, fontWeight: '500', textAlign: 'center', marginTop: 12 },
  modes: { flexDirection: 'row', gap: 7, marginTop: 22 },
  mode: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: '#183120' },
  modeActive: { backgroundColor: '#143C23', borderColor: '#358D50' },
  modeText: { color: '#86AA90', fontSize: 12 },
  modeTextActive: { color: '#D0FFDD' },
  orbSpace: { height: 275, width: 280, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 232, height: 232, borderRadius: 116, backgroundColor: '#073C1C', boxShadow: '0 0 44px rgba(20,246,106,0.65)' },
  ring: { position: 'absolute', borderRadius: 130, borderWidth: 2, boxShadow: '0 0 12px #28FF78' },
  orbCore: { width: 165, height: 165, backgroundColor: '#02190B', borderRadius: 90, shadowColor: '#010B04', shadowOpacity: 1, shadowRadius: 12, shadowOffset: { width: 0, height: 0 } },
  keyboardButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44 },
  muted: { color: '#8EAD98', fontSize: 12, lineHeight: 19 },
  composer: { padding: 17, borderRadius: 23, borderWidth: 1, borderColor: '#23492E', backgroundColor: '#0B1C11', gap: 10 },
  sectionTitle: { color: '#C9F4D5', fontWeight: '600', fontSize: 15, marginTop: 3 },
  input: { color: '#E1F9E8', fontSize: 14, lineHeight: 22, minHeight: 82, maxHeight: 180, textAlignVertical: 'top', paddingVertical: 8 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  smallButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, minHeight: 44, backgroundColor: '#163421', borderRadius: 24 },
  actionText: { color: '#BCE9C9', fontSize: 12 },
  send: { marginLeft: 'auto', width: 44, height: 44, borderRadius: 22, backgroundColor: '#70ED97', alignItems: 'center', justifyContent: 'center' },
  attachment: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumbnail: { width: 52, height: 52, borderRadius: 10 },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  footnote: { color: '#83A28D', fontSize: 11, textAlign: 'center' },
  warning: { color: '#FFD194', fontSize: 13, lineHeight: 20 },
  results: { padding: 20, borderRadius: 24, backgroundColor: '#0C2114', borderWidth: 1, borderColor: '#235334', gap: 15 },
  resultTitle: { color: '#D4FADF', fontSize: 25, fontWeight: '500' },
  body: { color: '#BFDBC8', fontSize: 14, lineHeight: 23 },
  divider: { height: 1, backgroundColor: '#25432E' },
  primary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#70ED97', borderRadius: 24, padding: 14 },
  primaryText: { color: '#05240E', fontWeight: '700' },
  source: { color: '#A4EAB8', fontSize: 12, textDecorationLine: 'underline', paddingVertical: 8 },
});
