import { useAgentData } from '@/contexts/agent-data-context';
import { useChatHistory } from '@/contexts/chat-history-context';
import { useMonitoring } from '@/contexts/monitoring-context';
import { useTheme } from '@/contexts/theme-context';
import { Button, IconButton, Page, Text, s } from '@/components/agro/ui';
import { scanChatText } from '@/services/scan-chat';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UploadSnapshotScreen() {
  const { colors } = useTheme();
  const { addUploadedSnapshot } = useAgentData();
  const { startConversation } = useChatHistory();
  const { profiles, linkScan } = useMonitoring();
  const params = useLocalSearchParams<{ mode?: string; capture?: string; profileId?: string }>();
  const mode = params.mode === 'animal' ? 'animal' : 'crop';
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const picking = useRef(false);
  const autoCaptureDone = useRef(false);
  const pick = async (camera: boolean) => {
    if (picking.current) return;
    picking.current = true; setBusy(true); setMessage('');
    try {
      const permission = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) { setMessage('Allow camera or photo access to continue.'); return; }
      const options: ImagePicker.ImagePickerOptions = { mediaTypes: ['images'], quality: 0.85 };
      const selection = camera ? await ImagePicker.launchCameraAsync(options) : await ImagePicker.launchImageLibraryAsync(options);
      if (selection.canceled || !selection.assets[0]?.uri) return;
      const uri = selection.assets[0].uri;
      const profile = profiles.find(p => p.id === params.profileId);
      const question = profile ? `Follow-up photo for ${profile.name}.` : `Check this ${mode === 'animal' ? 'animal' : 'plant'} photo.`;
      const sessionId = startConversation(mode, question, async () => {
        const scan = await addUploadedSnapshot(mode, uri);
        let text = scanChatText(scan);
        if (params.profileId) {
          try { await linkScan(params.profileId, scan); }
          catch { text += '\n\nThis check could not be saved to the profile. Use “Add to existing profile” below to retry.'; }
        }
        return { text, scan };
      }, uri);
      router.replace({ pathname: '/chat-conversation', params: { sessionId } });
    } catch { setMessage('Could not open your photo. Please try again.'); }
    finally { picking.current = false; setBusy(false); }
  };
  const autoTakePhoto = useEffectEvent(() => { void pick(true); });
  useEffect(() => { if (params.capture === '1' && !autoCaptureDone.current) { autoCaptureDone.current = true; autoTakePhoto(); } }, [params.capture]);
  return <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.bg }}><Page><View style={s.row}><IconButton name="arrow-back" label="Back" onPress={() => router.back()} /><Text style={s.title}>Photo check</Text></View><Text style={s.text}>{params.profileId ? `Follow-up for ${profiles.find(p => p.id === params.profileId)?.name ?? 'your profile'}` : 'Choose a clear photo of the plant or animal.'}</Text><Text style={s.small}>Your photo and preview results will appear in the Flora AI chat.</Text><Button title={busy ? 'Opening photos…' : 'Choose image'} disabled={busy} icon="image-outline" onPress={() => void pick(false)} /><Button title="Take photo" disabled={busy} secondary icon="camera-outline" onPress={() => void pick(true)} />{!!message && <Text accessibilityRole="alert">{message}</Text>}</Page></SafeAreaView>;
}
