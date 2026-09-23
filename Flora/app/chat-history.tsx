import { Button, Card, Icon, Page, Text, s } from '@/components/agro/ui';
import { useChatHistory } from '@/contexts/chat-history-context';
import { useTheme } from '@/contexts/theme-context';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatHistoryScreen() {
  const { sessions } = useChatHistory();
  const { colors } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <Page>
        <Text style={s.title}>Chat History</Text>
        <Text style={s.small}>Conversations saved during this app session.</Text>
        {!sessions.length && <Card><Text style={s.text}>No chats yet. Send your symptoms from Farm AI to start.</Text></Card>}
        {sessions.map((session) => (
          <Pressable key={session.id} accessibilityRole="button" accessibilityLabel={`Open ${session.title}`} onPress={() => router.push({ pathname: '/chat-conversation', params: { sessionId: session.id } })}>
            <Card>
              <View style={s.row}><Icon name="chatbubbles-outline" /><Text style={[s.sectionTitle, { flex: 1 }]}>{session.title}</Text></View>
              <Text style={s.small}>{session.agent === 'animal' ? 'Animals' : 'Plants'} · {new Date(session.updatedAt).toLocaleString()}</Text>
            </Card>
          </Pressable>
        ))}
        <Button title="Back to Farm AI" secondary onPress={() => router.navigate('/(tabs)/home')} />
      </Page>
    </SafeAreaView>
  );
}
