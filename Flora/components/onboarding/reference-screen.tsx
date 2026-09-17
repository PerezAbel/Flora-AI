import { Image, type ImageSource } from 'expo-image';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { useState, type PropsWithChildren } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// The supplied designs use a 414 × 896 canvas. Scale the artwork and native
// controls together so they stay aligned on phones and narrower web windows.
export function ReferenceScreen({ source, children }: PropsWithChildren<{ source: ImageSource }>) {
  const [width, setWidth] = useState(414);
  useFonts({
    Poppins: require('@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf'),
    PoppinsBold: require('@expo-google-fonts/poppins/700Bold/Poppins_700Bold.ttf'),
  });
  const canvasWidth = Math.min(width, 480);
  const scale = canvasWidth / 414;

  return (
    <SafeAreaView style={styles.screen} onLayout={({ nativeEvent }) => {
      if (nativeEvent.layout.width > 0) setWidth(nativeEvent.layout.width);
    }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ width: canvasWidth, height: 896 * scale }}>
            <View style={[styles.canvas, { transform: [{ scale }] }]}>
              <Image source={source} style={StyleSheet.absoluteFill} contentFit="fill" accessible={false} />
              {children}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#1A2911' },
  fill: { flex: 1 },
  scroll: { alignItems: 'center', flexGrow: 1 },
  canvas: { width: 414, height: 896, transformOrigin: 'top left' },
});
