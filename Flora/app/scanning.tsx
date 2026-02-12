import { useAgentData } from '@/contexts/agent-data-context';
import { useLanguage } from '@/contexts/language-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function ScanningScreen() {
  const { tr } = useLanguage();
  const { addQuickScan } = useAgentData();
  const params = useLocalSearchParams<{ mode?: string }>();
  const mode = params.mode === 'animal' ? 'animal' : 'crop';
  const [scanDone, setScanDone] = useState(false);

  const runScan = () => {
    addQuickScan(mode);
    setScanDone(true);
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#EAF2FF" name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.title}>{tr('Scanning')}</Text>
      </View>

      <View style={styles.scanFrame}>
        <View style={styles.corner} />
        <View style={[styles.corner, styles.cornerTopRight]} />
        <View style={[styles.corner, styles.cornerBottomLeft]} />
        <View style={[styles.corner, styles.cornerBottomRight]} />
      </View>

      <Text style={styles.hint}>
        {mode === 'crop'
          ? tr('Point camera at crop leaves/stem and keep it steady.')
          : tr('Point camera at the animal and keep it steady for health cues.')}
      </Text>

      <Pressable onPress={runScan} style={styles.scanBtn}>
        <Text style={styles.scanBtnText}>{tr('Analyze Current Frame')}</Text>
      </Pressable>

      {scanDone ? <Text style={styles.doneText}>{tr('Scan complete. Dashboard and Alerts have been updated.')}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: 'center', backgroundColor: '#010B24', flex: 1, paddingHorizontal: 16, paddingTop: 56 },
  headerRow: { alignItems: 'center', flexDirection: 'row', marginBottom: 18, width: '100%' },
  backButton: { alignItems: 'center', height: 28, justifyContent: 'center', marginRight: 6, width: 28 },
  title: { color: '#EAF2FF', fontSize: 26, fontWeight: '800' },
  scanFrame: {
    borderColor: '#2E5AA8',
    borderRadius: 16,
    borderWidth: 1,
    height: 340,
    marginTop: 8,
    position: 'relative',
    width: '100%',
  },
  corner: {
    borderColor: '#51A2FF',
    borderLeftWidth: 3,
    borderTopWidth: 3,
    height: 38,
    left: 10,
    position: 'absolute',
    top: 10,
    width: 38,
  },
  cornerTopRight: { borderLeftWidth: 0, borderRightWidth: 3, left: undefined, right: 10 },
  cornerBottomLeft: { borderTopWidth: 0, borderBottomWidth: 3, top: undefined, bottom: 10 },
  cornerBottomRight: {
    borderBottomWidth: 3,
    borderLeftWidth: 0,
    borderRightWidth: 3,
    borderTopWidth: 0,
    bottom: 10,
    left: undefined,
    right: 10,
    top: undefined,
  },
  hint: { color: '#B9C9E8', fontSize: 13, marginTop: 16, textAlign: 'center' },
  scanBtn: {
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
    marginTop: 16,
    paddingHorizontal: 18,
    paddingVertical: 11,
  },
  scanBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  doneText: { color: '#8CE9B0', fontSize: 13, marginTop: 10, textAlign: 'center' },
});
