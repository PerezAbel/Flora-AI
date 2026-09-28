import { useChatHistory } from '@/contexts/chat-history-context';
import { useTheme } from '@/contexts/theme-context';
import { ScanProfilePrompt } from '@/components/agro/monitoring';
import { Icon, IconButton, Text } from '@/components/agro/ui';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { careGuidance } from '@/services/care-guidance';
import { ActivityIndicator, Image, KeyboardAvoidingView, Linking, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function MessageImage({ uri, caption }: { uri: string; caption: string }) {
  const [failed, setFailed] = useState(false);
  const { colors } = useTheme();
  return <View style={{ gap: 6 }}>{failed ? <Text style={{ color: colors.muted }}>Photo unavailable. Please attach it again.</Text> : <Image source={{ uri }} accessibilityLabel={caption} onError={() => setFailed(true)} resizeMode="contain" style={{ width: '100%', height: 220, borderRadius: 14, backgroundColor: colors.raised }} />}<Text style={{ fontSize: 11, color: colors.muted }}>{caption}</Text></View>;
}
export default function ChatConversationScreen() {
  const { colors } = useTheme();
  const { getSession, sendMessage, retryMessage } = useChatHistory();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const session = sessionId ? getSession(sessionId) : undefined;
  const guidance = careGuidance[session?.agent ?? 'crop'];
  const [input, setInput] = useState('');
  const [notice, setNotice] = useState('');
  const scroll = useRef<ScrollView>(null);
  const nearBottom = useRef(true);
  const thinking = session?.messages.some(m => m.status === 'thinking') ?? false;
  const ask = () => {
    if (!input.trim() || !session || thinking) return;
    nearBottom.current = true;
    sendMessage(session.id, input.trim()); setInput('');
  };
  return <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.bg }}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    <View style={[styles.header, { borderBottomColor: colors.line }]}><IconButton name="arrow-back" label="Back" onPress={() => router.canGoBack() ? router.back() : router.replace('/home')} /><View style={{ flex: 1 }}><Text style={{ fontSize: 18, fontWeight: '700' }}>Flora AI</Text><Text style={{ fontSize: 11, color: colors.muted }}>{session?.agent === 'animal' ? 'Animal care' : 'Plant care'} · Preview assistant</Text></View><Icon name="sparkles-outline" /></View>
    <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.messages} onScroll={event => { const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent; nearBottom.current = contentOffset.y + layoutMeasurement.height >= contentSize.height - 100; }} scrollEventThrottle={100} onContentSizeChange={() => { if (nearBottom.current) scroll.current?.scrollToEnd({ animated: true }); }}>
      {session?.messages.map(msg => <View key={msg.id} style={[styles.message, { alignSelf: msg.role === 'user' ? 'flex-end' : 'stretch', backgroundColor: msg.role === 'user' ? colors.raised : colors.card, borderColor: colors.line, maxWidth: msg.role === 'user' ? '88%' : '100%' }]}>
        <Text style={{ color: colors.mint, fontWeight: '700', fontSize: 12 }}>{msg.role === 'user' ? 'You' : 'Flora AI'}</Text>
        {msg.status === 'thinking' ? <View accessibilityRole="progressbar" accessibilityLabel="AI is thinking" accessibilityLiveRegion="polite" style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 }}><ActivityIndicator color={colors.mint} /><View><Text>AI is thinking…</Text><Text style={{ color: colors.muted, fontSize: 11 }}>Preparing your preview response</Text></View></View> : <>
          {!!msg.text && <Text selectable style={{ fontSize: 14, lineHeight: 23 }}>{msg.text}</Text>}
          {(msg.scan?.imageUri || msg.imageUri) && <MessageImage uri={(msg.scan?.imageUri || msg.imageUri)!} caption={msg.role === 'user' ? 'Your attached photo' : 'Photo from this check — not a diagnostic reference image'} />}
          {msg.status === 'error' && <Pressable accessibilityRole="button" disabled={thinking} onPress={() => session && retryMessage(session.id, msg.id)} style={styles.action}><Icon name="refresh" size={17} /><Text style={{ color: colors.mint }}>Try again</Text></Pressable>}
          {msg.role === 'assistant' && msg.status !== 'error' && <>
            {msg.scan && <ScanProfilePrompt scan={msg.scan} />}
            <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/nearby-care', params: { category: guidance.search } })} style={styles.action}><Icon name="location-outline" size={17} /><Text style={{ color: colors.mint }}>Find nearby care</Text></Pressable>
            <Pressable accessibilityRole="link" onPress={() => void Linking.openURL(guidance.url).catch(() => setNotice('Could not open the guidance source.'))}><Text style={{ fontSize: 12, color: colors.mint, textDecorationLine: 'underline' }}>{guidance.source} ↗</Text></Pressable>
          </>}
        </>}
      </View>)}
      {!session && <Text>Chat not found. Start a conversation from the Scan tab.</Text>}
      {!!notice && <Text accessibilityRole="alert">{notice}</Text>}
    </ScrollView>
    <View style={[styles.composer, { backgroundColor: colors.card, borderColor: colors.line }]}><TextInput accessibilityLabel="Message Flora AI" multiline maxLength={3000} value={input} onChangeText={setInput} placeholder="Ask a follow-up…" placeholderTextColor={colors.muted} style={{ flex: 1, color: colors.text, minHeight: 42, maxHeight: 120, padding: 10 }} /><Pressable accessibilityRole="button" accessibilityLabel="Send message" disabled={thinking || !session || !input.trim()} onPress={ask} style={[styles.send, { backgroundColor: colors.mint, opacity: thinking || !input.trim() ? 0.4 : 1 }]}><Icon name="arrow-up" color="#FFFFFF" size={21} /></Pressable></View>
  </KeyboardAvoidingView></SafeAreaView>;
}
const styles = StyleSheet.create({ header: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 8, borderBottomWidth: 1 }, messages: { padding: 16, gap: 16, maxWidth: 760, width: '100%', alignSelf: 'center', paddingBottom: 24 }, message: { padding: 16, borderRadius: 20, borderWidth: 1, gap: 12 }, action: { flexDirection: 'row', alignItems: 'center', gap: 7, minHeight: 44 }, composer: { margin: 12, padding: 8, borderWidth: 1, borderRadius: 24, flexDirection: 'row', alignItems: 'flex-end', maxWidth: 736, width: '94%', alignSelf: 'center' }, send: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' } });
