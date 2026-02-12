import { useAgentData } from '@/contexts/agent-data-context';
import { useLanguage } from '@/contexts/language-context';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function UploadSnapshotScreen() {
  const { tr } = useLanguage();
  const { addUploadedSnapshot } = useAgentData();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = params.mode === 'animal' ? 'animal' : 'crop';
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const pickImage = async () => {
    try {
      const req = eval('require');
      const picker = req('expo-image-picker');
      const permission = await picker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        setMessage(tr('Media permission denied. Please allow photo access.'));
        return;
      }
      const result = await picker.launchImageLibraryAsync({
        mediaTypes: picker.MediaTypeOptions.Images,
        quality: 0.9,
      });
      if (result.canceled) return;
      const uri = result.assets?.[0]?.uri;
      if (!uri) return;
      setImageUri(uri);
      addUploadedSnapshot(mode, uri);
      setMessage(tr('Snapshot uploaded and analyzed. Dashboard and Alerts updated.'));
    } catch {
      setMessage(tr('Image picker is unavailable in this offline build. Install expo-image-picker to enable device uploads.'));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.content} style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#0F172A" name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.title}>{tr('Upload Snapshot')}</Text>
      </View>

      <Text style={styles.subTitle}>{tr('Select an image from your device for disease analysis.')}</Text>

      <Pressable onPress={pickImage} style={styles.uploadBtn}>
        <Ionicons color="#FFFFFF" name="image-outline" size={18} />
        <Text style={styles.uploadText}>{tr('Choose Image')}</Text>
      </Pressable>

      {imageUri ? (
        <View style={styles.previewCard}>
          <Image contentFit="cover" source={{ uri: imageUri }} style={styles.previewImage} />
          <Text style={styles.previewText}>{tr('Image ready and synced to analytics')}</Text>
        </View>
      ) : null}

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
});
