import AppTopBar from '@/components/app-top-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <AppTopBar />
      <Text style={styles.title}>Home</Text>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Flora Agent Assistant</Text>
        <Text style={styles.cardBody}>
          Ask crop-health questions, track alerts, and review recommendations from one place.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F8FFF9',
    flex: 1,
    padding: 18,
  },
  title: {
    color: '#123524',
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#EAF6ED',
    borderRadius: 14,
    padding: 16,
  },
  cardTitle: {
    color: '#123524',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  cardBody: {
    color: '#2E4A3A',
    fontSize: 15,
    lineHeight: 22,
  },
});
