import { useAgentData } from '@/contexts/agent-data-context';
import { useLanguage } from '@/contexts/language-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function UploadSnapshotScreen() {
  const { tr } = useLanguage();
  const { addUploadedSnapshot, scanHistory } = useAgentData();
  const params = useLocalSearchParams<{ mode?: string; capture?: string }>();
  const mode = params.mode === 'animal' ? 'animal' : 'crop';
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const autoCaptureDone = useRef(false);

  const latestResult = useMemo(
    () => scanHistory.find((entry) => entry.mode === mode),
    [scanHistory, mode]
  );

  const pickImage = async () => {
    setMessage('');
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setMessage(tr('Media permission denied. Please allow photo access.'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });
    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;
    setLoading(true);
    setImageUri(uri);
    try {
      await addUploadedSnapshot(mode, uri);
      setMessage(tr('Snapshot uploaded and analyzed. Dashboard and Alerts updated.'));
      setShowResult(true);
    } catch (err) {
      setMessage(tr('Upload failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    setMessage('');
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      setMessage(tr('Camera permission denied. Please allow camera access.'));
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.85,
      base64: false,
    });
    if (result.canceled) return;
    const uri = result.assets?.[0]?.uri;
    if (!uri) return;
    setLoading(true);
    setImageUri(uri);
    try {
      await addUploadedSnapshot(mode, uri);
      setMessage(tr('Photo captured and analyzed. Dashboard and Alerts updated.'));
      setShowResult(true);
    } catch (err) {
      setMessage(tr('Capture failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.capture === '1' && !autoCaptureDone.current) {
      autoCaptureDone.current = true;
      void takePhoto();
    }
  }, [params.capture]);

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#0F172A" name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.title}>{tr('Upload Snapshot')}</Text>
      </View>

      <Text style={styles.subTitle}>{tr('Select an image from your device for disease analysis.')}</Text>

      <View style={styles.buttonRow}>
        <Pressable onPress={pickImage} style={styles.uploadBtn}>
          <Ionicons color="#FFFFFF" name="image-outline" size={18} />
          <Text style={styles.uploadText}>{tr('Choose Image')}</Text>
        </Pressable>
        <Pressable onPress={takePhoto} style={[styles.uploadBtn, styles.secondaryBtn]}>
          <Ionicons color="#FFFFFF" name="camera-outline" size={18} />
          <Text style={styles.uploadText}>{tr('Take Photo')}</Text>
        </Pressable>
      </View>

      {imageUri ? (
        <View style={styles.previewCard}>
          <Image contentFit="cover" source={{ uri: imageUri }} style={styles.previewImage} />
          <Text style={styles.previewText}>{tr('Image ready and synced to analytics')}</Text>
        </View>
      ) : null}

      {showResult && latestResult ? (
        <View style={styles.resultCard}>
          <View style={styles.resultHeader}>
            <Text style={styles.resultTitle}>{tr('Latest model result')}</Text>
            <Ionicons color="#10B981" name="checkmark-circle-outline" size={18} />
          </View>
          <Text style={styles.resultItem}>{latestResult.item}</Text>
          <Text style={styles.resultLabel}>{latestResult.result}</Text>
          <View style={styles.resultMeta}>
            <View style={[styles.metaBadge, styles.metaPrimary]}>
              <Ionicons color="#0F766E" name="shield-checkmark-outline" size={14} />
              <Text style={styles.metaText}>{latestResult.confidence}</Text>
            </View>
            <View style={styles.metaBadge}>
              <Ionicons color="#1D4ED8" name="time-outline" size={14} />
              <Text style={styles.metaText}>{latestResult.time}</Text>
            </View>
          </View>
        </View>
      ) : null}

      {loading ? <ActivityIndicator color="#0EA5E9" style={{ marginTop: 10 }} /> : null}
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: '#F3F4F6', flex: 1 },
  content: { padding: 16, paddingBottom: 40 },
  headerRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 8 },
  backButton: { alignItems: 'center', height: 28, justifyContent: 'center', marginRight: 6, width: 28 },
  title: { color: '#0F172A', fontSize: 26, fontWeight: '800' },
  subTitle: { color: '#64748B', fontSize: 14, marginBottom: 12 },
  uploadBtn: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 11,
  },
  uploadText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginLeft: 7 },
  buttonRow: { flexDirection: 'row', gap: 10 },
  secondaryBtn: { backgroundColor: '#0EA5E9' },
  previewCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 14,
    padding: 12,
  },
  previewImage: { borderRadius: 10, height: 220, width: '100%' },
  previewText: { color: '#334155', fontSize: 13, marginTop: 8 },
  message: { color: '#0E7490', fontSize: 13, marginTop: 10 },
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D9E2F2',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 12,
    padding: 12,
  },
  resultHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  resultTitle: { color: '#0F172A', fontSize: 14, fontWeight: '800' },
  resultItem: { color: '#1F2937', fontSize: 13, fontWeight: '700' },
  resultLabel: { color: '#0B6B39', fontSize: 14, fontWeight: '800', marginTop: 2 },
  resultMeta: { flexDirection: 'row', gap: 8, marginTop: 8 },
  metaBadge: {
    alignItems: 'center',
    backgroundColor: '#E5EDFF',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaPrimary: { backgroundColor: '#D1FAE5' },
  metaText: { color: '#0F172A', fontSize: 12, fontWeight: '700' },
});
