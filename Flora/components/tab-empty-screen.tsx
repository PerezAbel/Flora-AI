import { FontAwesome } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  title: string;
  subtitle: string;
  icon: 'users' | 'shopping-bag';
  emptyTitle: string;
  emptyDescription: string;
};

export function TabEmptyScreen({ title, subtitle, icon, emptyTitle, emptyDescription }: Props) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
        <View style={styles.card}>
          <View style={styles.icon}>
            <FontAwesome name={icon} size={32} color="#8BB8FF" accessible={false} />
          </View>
          <Text style={styles.emptyTitle}>{emptyTitle}</Text>
          <Text style={styles.description}>{emptyDescription}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#061735' },
  content: { flexGrow: 1, padding: 20, paddingBottom: 32 },
  title: { color: '#EAF2FF', fontSize: 30, fontWeight: '800', marginTop: 12 },
  subtitle: { color: '#B5C9EB', fontSize: 15, lineHeight: 23, marginTop: 8 },
  card: { alignItems: 'center', backgroundColor: '#112C5D', borderColor: '#2A4F96', borderWidth: 1, borderRadius: 18, padding: 28, marginTop: 32 },
  icon: { alignItems: 'center', justifyContent: 'center', width: 72, height: 72, borderRadius: 36, backgroundColor: '#1A3A73', marginBottom: 20 },
  emptyTitle: { color: '#EAF2FF', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  description: { color: '#B5C9EB', fontSize: 14, lineHeight: 22, textAlign: 'center', marginTop: 10, maxWidth: 360 },
});
