import AppTopBar from '@/components/app-top-bar';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string;
  body: string;
};

export default function SectionScreen({ title, body }: Props) {
  return (
    <View style={styles.screen}>
      <AppTopBar />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
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
  body: {
    color: '#2E4A3A',
    fontSize: 16,
    lineHeight: 24,
  },
});
