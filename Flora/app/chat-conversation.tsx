import { useChatHistory } from '@/contexts/chat-history-context';
import { useLanguage } from '@/contexts/language-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { buildCareReply, careGuidance } from '@/services/care-guidance';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

export default function ChatConversationScreen() {
  const { tr } = useLanguage();
  const { getSession, addExchange } = useChatHistory();
  const params = useLocalSearchParams<{ sessionId?: string }>();
  const session = params.sessionId ? getSession(params.sessionId) : undefined;
  const mode = session?.agent === 'animal' ? 'animal' : 'crop';
  const [input, setInput] = useState('');
  const scroll = useRef<ScrollView>(null);

  const ask = () => {
    const question = input.trim();
    if (!question || !session?.id) return;
    addExchange(session.id, question, buildCareReply(mode));
    setInput('');
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons color="#FFFFFF" name="chevron-back" size={20} />
        </Pressable>
        <Text style={styles.title}>{tr('Chat with Agent')}</Text>
      </View>

      <ScrollView ref={scroll} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: true })} contentContainerStyle={styles.chatContent} style={styles.chatScroll}>
        {(session?.messages ?? []).map((msg) => (
          <View key={msg.id} style={[styles.bubble, msg.role === 'user' ? styles.questionBubble : styles.responseBubble]}>
            <Text style={styles.bubbleText}>{msg.text}</Text>
            {msg.role === 'assistant' && (
              <Pressable accessibilityRole="button" onPress={() => router.push({ pathname: '/nearby-care', params: { category: careGuidance[mode].search } })} style={{ paddingVertical: 12 }}>
                <Text style={[styles.bubbleText, { textDecorationLine: 'underline' }]}>Find nearby {mode === 'animal' ? 'vets & animal facilities' : 'plant doctors & crop facilities'}</Text>
              </Pressable>
            )}
          </View>
        ))}
        {!session ? <Text style={styles.emptyText}>{tr('Chat not found. Start from Home to create a new conversation.')}</Text> : null}
      </ScrollView>

      <View style={styles.inputPanel}>
        <TextInput
          onChangeText={setInput}
          onSubmitEditing={ask}
          placeholder={tr('Ask anything...')}
          placeholderTextColor="#B6C8EA"
          style={styles.input}
          value={input}
        />
        <Pressable onPress={ask} style={styles.sendBtn}>
          <Ionicons color="#0E3CA7" name="arrow-up" size={14} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#010B24',
    flex: 1,
    paddingTop: 48,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 8,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  backButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 30,
    justifyContent: 'center',
    marginRight: 8,
    width: 30,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  chatScroll: {
    flex: 1,
  },
  chatContent: {
    paddingHorizontal: 10,
    paddingBottom: 90,
    rowGap: 10,
  },
  bubble: {
    borderRadius: 12,
    maxWidth: '82%',
    padding: 10,
  },
  questionBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2A4EA3',
    marginBottom: 6,
  },
  responseBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#16326A',
    borderColor: '#2A4F96',
    borderWidth: 1,
  },
  bubbleText: {
    color: '#EFF5FF',
    fontSize: 13,
    lineHeight: 18,
  },
  emptyText: {
    color: '#AFC4E8',
    fontSize: 13,
    marginTop: 6,
  },
  inputPanel: {
    alignItems: 'center',
    backgroundColor: '#16326A',
    borderColor: '#24498F',
    borderRadius: 26,
    borderWidth: 1,
    bottom: 16,
    flexDirection: 'row',
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    position: 'absolute',
    right: 12,
  },
  input: {
    color: '#EAF2FF',
    flex: 1,
    fontSize: 14,
    paddingVertical: 0,
  },
  sendBtn: {
    alignItems: 'center',
    backgroundColor: '#D7E8FF',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
});
