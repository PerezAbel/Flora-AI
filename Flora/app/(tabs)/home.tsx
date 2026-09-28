import { imageSource, photos } from "@/contexts/agro-context";
import { useTheme } from '@/contexts/theme-context';
import AppTopBar from '@/components/app-top-bar';
import { Icon } from '@/components/agro/ui';
import { buildCareReply, type CareMode } from '@/services/care-guidance';
import { useChatHistory } from '@/contexts/chat-history-context';
import { useAgentData } from '@/contexts/agent-data-context';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useMemo, useRef, useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const modes = [{ id: 'crop', label: 'Plants' }, { id: 'animal', label: 'Animals' }] as const;

export default function HomeScreen() {
  const { mode: themeMode } = useTheme();
  const dark = themeMode === 'dark';
  const styles = useMemo(() => createStyles(dark), [dark]);
  const { startConversation } = useChatHistory();
  const { recordCareScan } = useAgentData();
  const [mode, setMode] = useState<CareMode>('crop');
  const [symptoms, setSymptoms] = useState('');
  const [image, setImage] = useState<string>();
  const [notice, setNotice] = useState('');
  const [picking, setPicking] = useState(false);
  const input = useRef<TextInput>(null);
  const scroll = useRef<ScrollView>(null);
  const openChat = (photo?: string) => {
    const question = symptoms.trim() || `Help me check this ${mode === 'animal' ? 'animal' : 'plant'}.`;
    const sessionId = startConversation(mode, question, async () => {
      const scan = photo ? recordCareScan(mode, photo, symptoms.trim()) : undefined;
      return { text: buildCareReply(mode), scan };
    }, photo);
    input.current?.blur();
    router.push({ pathname: '/chat-conversation', params: { sessionId } });
  };

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
        openChat(result.assets[0].uri);
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
      <StatusBar style={dark ? "light" : "dark"} />
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page} showsVerticalScrollIndicator={false}>
          <AppTopBar dark={dark} />
          <View style={styles.hero}>
            <Text style={styles.eyebrow}>A little clarity. A healthier tomorrow.</Text>
            <Text style={styles.heading}>What Can I Do for{'\n'}You Today?</Text>
            <View style={styles.modes}>
              {modes.map((option) => (
                <Pressable key={option.id} accessibilityRole="radio" aria-checked={mode === option.id} accessibilityState={{ checked: mode === option.id }} onPress={() => { setMode(option.id); setImage(undefined); setNotice(''); }} style={[styles.mode, mode === option.id && styles.modeActive]}>
                  <Text style={[styles.modeText, mode === option.id && styles.modeTextActive]}>{option.label}</Text>
                </Pressable>
              ))}
            </View>
            <View style={styles.collage} accessibilityLabel="Farm fields, livestock and plants">
              <View style={[styles.collagePhoto, styles.collageMain]}><Image source={imageSource(mode === 'animal' ? photos.livestock : photos.farm)} style={StyleSheet.absoluteFill} resizeMode="cover" /><View style={styles.photoShade} /><View style={styles.photoCaption}><Text style={styles.photoEyebrow}>GROWING TOGETHER</Text><Text style={styles.photoTitle}>{mode === 'animal' ? 'Every animal.\nA story worth caring for.' : 'A healthier farm,\none plant at a time.'}</Text></View></View>
              <View style={styles.collageSide}><View style={[styles.collagePhoto, { flex: 1 }]}><Image source={imageSource(mode === 'animal' ? photos.farm : photos.livestock)} style={StyleSheet.absoluteFill} resizeMode="cover" /></View><View style={[styles.collagePhoto, { flex: 1 }]}><Image source={imageSource(photos.tools)} style={StyleSheet.absoluteFill} resizeMode="cover" /><View style={styles.photoShade} /><Text style={styles.smallCaption}>Nurture • Observe • Thrive</Text></View></View>
            </View>
            <Pressable accessibilityRole="button" onPress={() => input.current?.focus()} style={styles.keyboardButton}>
              <Icon name="keypad-outline" size={15} color={dark ? "#89AD96" : "#536B59"} />
              <Text style={styles.muted}>Type symptoms or scan a photo</Text>
            </Pressable>
          </View>
          <View style={styles.composer}>
            <Text style={styles.sectionTitle}>What have you noticed?</Text>
            <TextInput ref={input} accessibilityLabel="Describe symptoms" multiline maxLength={3000} value={symptoms} onChangeText={(value) => { setSymptoms(value); }} placeholder={mode === 'crop' ? 'e.g. My tomato leaves are yellow with brown spots. It started 3 days ago…' : 'Species, age, symptoms, when they started, appetite and any treatment already given…'} placeholderTextColor={dark ? "#72917E" : "#637466"} style={styles.input} />
            {image && (
              <View style={styles.attachment}>
                <Image source={{ uri: image }} style={styles.thumbnail} />
                <View style={{ flex: 1 }}><Text style={styles.body}>Photo attached</Text><Text style={styles.muted}>Saved in this form · not analyzed</Text></View>
                <Pressable accessibilityRole="button" accessibilityLabel="Remove photo" onPress={() => { setImage(undefined); }} style={styles.iconButton}><Icon name="close" color={dark ? "#BAE7C8" : "#286542"} /></Pressable>
              </View>
            )}
            <View style={styles.actions}>
              <Pressable accessibilityRole="button" disabled={picking} onPress={() => void pick(true)} style={styles.smallButton}><Icon name="scan-outline" size={19} color={dark ? "#BFF8CF" : "#286542"} /><Text style={styles.actionText}>Scan</Text></Pressable>
              <Pressable accessibilityRole="button" disabled={picking} onPress={() => void pick(false)} style={styles.smallButton}><Icon name="image-outline" size={19} color={dark ? "#BFF8CF" : "#286542"} /><Text style={styles.actionText}>Upload</Text></Pressable>
              <Pressable accessibilityRole="button" accessibilityLabel="Review symptoms and care guidance" disabled={picking || (!symptoms.trim() && !image)} onPress={() => openChat(image)} style={[styles.send, !symptoms.trim() && !image && { opacity: 0.4 }]}><Icon name="arrow-forward" color={dark ? "#03210E" : "#FFFFFF"} /></Pressable>
            </View>
          </View>
          <Text style={styles.footnote}>Care guidance preview · Clinical diagnosis is not connected.</Text>
          {!!notice && <Text accessibilityRole="alert" style={styles.warning}>{notice}</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (dark: boolean) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: (dark ? '#030C07' : '#F7F5F0') },
  page: { flexGrow: 1, width: '100%', maxWidth: 680, alignSelf: 'center', paddingHorizontal: 22, paddingBottom: 24, gap: 16 },
  hero: { alignItems: 'center', paddingTop: 20 },
  eyebrow: { color: (dark ? '#8ABC9A' : '#536B59'), fontSize: 11, letterSpacing: 0.5, textAlign: 'center' },
  heading: { color: (dark ? '#CAFFDA' : '#1C4930'), fontSize: 34, lineHeight: 39, letterSpacing: -1.6, fontWeight: '500', textAlign: 'center', marginTop: 12 },
  modes: { flexDirection: 'row', gap: 7, marginTop: 22 },
  mode: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 24, borderWidth: 1, borderColor: (dark ? '#183120' : '#D5DDD1') },
  modeActive: { backgroundColor: (dark ? '#143C23' : '#DCEADB'), borderColor: (dark ? '#358D50' : '#3D7E51') },
  modeText: { color: (dark ? '#86AA90' : '#536B59'), fontSize: 12 },
  modeTextActive: { color: (dark ? '#D0FFDD' : '#1C4930') },
  collage: { width: '100%', height: 255, flexDirection: 'row', gap: 10, marginTop: 26, marginBottom: 12 },
  collagePhoto: { overflow: 'hidden', borderRadius: 22, backgroundColor: dark ? '#163421' : '#E7EDE1' },
  collageMain: { flex: 1.65, marginTop: 8, marginBottom: 8, borderTopLeftRadius: 48, borderBottomRightRadius: 42 },
  collageSide: { flex: 1, gap: 10 },
  photoShade: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(7,27,15,0.24)' },
  photoCaption: { position: 'absolute', bottom: 18, left: 15, right: 10 },
  photoEyebrow: { color: '#FFFFFF', fontSize: 8, letterSpacing: 1.5, marginBottom: 7, fontWeight: '700' },
  photoTitle: { color: '#FFFFFF', fontSize: 19, lineHeight: 24, fontWeight: '600' },
  smallCaption: { position: 'absolute', bottom: 12, left: 10, right: 8, fontSize: 10, color: '#FFFFFF', fontWeight: '600' },
  keyboardButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, minHeight: 44 },
  muted: { color: (dark ? '#8EAD98' : '#536B59'), fontSize: 12, lineHeight: 19 },
  composer: { padding: 17, borderRadius: 23, borderWidth: 1, borderColor: (dark ? '#23492E' : '#D5DDD1'), backgroundColor: (dark ? '#0B1C11' : '#FFFFFF'), gap: 10 },
  sectionTitle: { color: (dark ? '#C9F4D5' : '#244C32'), fontWeight: '600', fontSize: 15, marginTop: 3 },
  input: { color: (dark ? '#E1F9E8' : '#1C3022'), fontSize: 14, lineHeight: 22, minHeight: 82, maxHeight: 180, textAlignVertical: 'top', paddingVertical: 8 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  smallButton: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, minHeight: 44, backgroundColor: (dark ? '#163421' : '#E7EDE1'), borderRadius: 24 },
  actionText: { color: (dark ? '#BCE9C9' : '#286542'), fontSize: 12 },
  send: { marginLeft: 'auto', width: 44, height: 44, borderRadius: 22, backgroundColor: (dark ? '#70ED97' : '#286542'), alignItems: 'center', justifyContent: 'center' },
  attachment: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  thumbnail: { width: 52, height: 52, borderRadius: 10 },
  iconButton: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  footnote: { color: (dark ? '#83A28D' : '#637466'), fontSize: 11, textAlign: 'center' },
  warning: { color: (dark ? '#FFD194' : '#925B1F'), fontSize: 13, lineHeight: 20 },
  results: { padding: 20, borderRadius: 24, backgroundColor: (dark ? '#0C2114' : '#FFFFFF'), borderWidth: 1, borderColor: (dark ? '#235334' : '#D5DDD1'), gap: 15 },
  resultTitle: { color: (dark ? '#D4FADF' : '#1C4930'), fontSize: 25, fontWeight: '500' },
  body: { color: (dark ? '#BFDBC8' : '#344D3A'), fontSize: 14, lineHeight: 23 },
  divider: { height: 1, backgroundColor: (dark ? '#25432E' : '#D5DDD1') },
  primary: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: (dark ? '#70ED97' : '#286542'), borderRadius: 24, padding: 14 },
  primaryText: { color: (dark ? '#05240E' : '#FFFFFF'), fontWeight: '700' },
  source: { color: (dark ? '#A4EAB8' : '#286542'), fontSize: 12, textDecorationLine: 'underline', paddingVertical: 8 },
});
