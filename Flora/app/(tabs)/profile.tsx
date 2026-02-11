import AppTopBar from '@/components/app-top-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function ProfileTab() {
  return (
    <View style={styles.screen}>
      <AppTopBar />
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.name}>Flora Agent User</Text>
        <Text style={styles.meta}>Role: Farm Operations Agent</Text>
        <Text style={styles.meta}>Region: Demo Farm Block A</Text>
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
    backgroundColor: '#fff',
    borderRadius: 14,
    elevation: 2,
    padding: 16,
  },
  name: {
    color: '#123524',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  meta: {
    color: '#2E4A3A',
    fontSize: 15,
    marginBottom: 4,
  },
});
