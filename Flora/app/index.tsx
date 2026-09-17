import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function LogoScreen() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) return;
    const timer = setTimeout(() => router.replace('./welcome'), 1600);
    return () => clearTimeout(timer);
  }, [ready]);

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <Image
        source={require('@/assets/images/1.png')}
        style={styles.artwork}
        contentFit="contain"
        accessibilityLabel="Agro Farm Kenya"
        accessible
        onLoad={() => setReady(true)}
        onError={() => setReady(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#1A2911', alignItems: 'center', justifyContent: 'center' },
  artwork: { width: '100%', height: '100%', maxWidth: 480 },
});
