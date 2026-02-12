import { useChatHistory } from '@/contexts/chat-history-context';
import { useLanguage } from '@/contexts/language-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useRef, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

function buildSampleReply(message: string) {
  const normalized = message.toLowerCase();
  if (normalized.includes('animal')) {
    return 'Animal health risk is currently low. Keep hydration levels stable and monitor appetite changes over the next 24 hours.';
  }
  if (normalized.includes('disease')) {
    return 'Disease pressure is moderate based on recent weather. Prioritize scouting in high-moisture zones and apply preventive treatment if symptoms appear.';
  }
  return 'I reviewed your request. Continue routine monitoring and share a scan if you want a more precise recommendation.';
}

export default function HomeScreen() {
  const tabBarHeight = useBottomTabBarHeight();
  const { tr } = useLanguage();
  const { sessions, createSession } = useChatHistory();
  const [agent, setAgent] = useState<'crop' | 'animal'>('crop');
  const [openAgentMenu, setOpenAgentMenu] = useState(false);
  const [openQuickActions, setOpenQuickActions] = useState(false);
  const [openTutorial, setOpenTutorial] = useState(false);
  const [openHistoryDrawer, setOpenHistoryDrawer] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [chatInput, setChatInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const voiceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tutorialSteps = [
    {
      title: tr('Welcome to Flora AI'),
      body: tr('Use the top-left selector to switch between Crop Agent and Animal Agent.'),
    },
    {
      title: tr('Use Quick Actions'),
      body: tr('Tap the plus button in the input area to scan, upload snapshots, or start live monitoring.'),
    },
    {
      title: tr('Check Dashboard'),
      body: tr('Open Dashboard to view crop and animal analytics, risk levels, and recommended actions.'),
    },
    {
      title: tr('Review Alerts'),
      body: tr('Go to Alerts to track current risks and tap View Details for scan-based recommendations.'),
    },
    {
      title: tr('Manage Profile Settings'),
      body: tr('Use Profile to manage farm settings, language, privacy, and support options.'),
    },
  ];
  const sendMessage = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    const response = buildSampleReply(trimmed);
    const sessionId = createSession(agent, trimmed, response);
    router.push({ pathname: '/chat-conversation', params: { sessionId } });
    setChatInput('');
  };

  const onVoicePress = () => {
    if (isRecording) return;
    setIsRecording(true);
    voiceTimer.current = setTimeout(() => {
      const transcript =
        agent === 'crop'
          ? tr('How is disease risk in my maize field today?')
          : tr('Show me animal health risk in my herd today');
      setIsRecording(false);
      sendMessage(transcript);
    }, 1500);
  };

  return (
    <Pressable
      onPress={() => {
        if (openAgentMenu) setOpenAgentMenu(false);
      }}
      style={styles.screen}
    >
      <View style={styles.bgGlowTop} />
      <View style={styles.bgGlowCenter} />

      <View style={styles.headerRow}>
        <View>
          <Pressable
            onPress={() => {
              setOpenAgentMenu((prev) => !prev);
            }}
            onPressOut={(e) => e.stopPropagation()}
            style={styles.agentSelector}
          >
            <Ionicons color="#C5D8FF" name="sparkles-outline" size={17} />
            <Text style={styles.agentText}>{agent === 'crop' ? tr('Crop Agent') : tr('Animal Agent')}</Text>
            <Ionicons color="#C5D8FF" name="chevron-down" size={15} />
          </Pressable>

          {openAgentMenu ? (
            <View style={styles.agentMenu}>
              <Pressable
                onPress={() => {
                  setAgent('crop');
                  setOpenAgentMenu(false);
                }}
                style={styles.agentItem}
              >
                <Ionicons color="#D9E7FF" name="leaf-outline" size={15} />
                <Text style={styles.agentItemText}>{tr('Crop Agent')}</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setAgent('animal');
                  setOpenAgentMenu(false);
                }}
                style={styles.agentItem}
              >
                <Ionicons color="#D9E7FF" name="paw-outline" size={15} />
                <Text style={styles.agentItemText}>{tr('Animal Agent')}</Text>
              </Pressable>
              <View style={styles.agentMenuDivider} />
              <Pressable
                onPress={() => {
                  setOpenAgentMenu(false);
                  setOpenHistoryDrawer(true);
                }}
                style={styles.agentItem}
              >
                <Ionicons color="#D9E7FF" name="time-outline" size={15} />
                <Text style={styles.agentItemText}>{tr('Agent History')}</Text>
              </Pressable>
            </View>
          ) : null}
        </View>

        <Pressable
          onPress={() => {
            setOpenTutorial(true);
            setTutorialStep(0);
            setOpenAgentMenu(false);
          }}
          style={styles.tutorialButton}
        >
          <Ionicons color="#C5D8FF" name="school-outline" size={20} />
        </Pressable>
      </View>

      <View style={styles.centerContent}>
        <View style={styles.orb}>
          <Ionicons color="#D7E9FF" name="flash" size={34} />
        </View>
        <Text style={styles.title}>{tr('Hi William!')}</Text>
        <Text style={styles.subtitle}>{tr('How can I help you today?')}</Text>
      </View>

      <View style={styles.chatInfoCard}>
        <Text style={styles.chatInfoText}>{tr('Ask a question and you will be taken to a full conversation page.')}</Text>
      </View>

      <View style={[styles.inputPanel, { bottom: tabBarHeight + 12 }]}>
        <TextInput
          onChangeText={setChatInput}
          placeholder={tr('Ask anything...')}
          placeholderTextColor="#C3D2F3"
          style={styles.inputField}
          value={chatInput}
        />
        <View style={styles.inputActions}>
          <Pressable onPress={() => setOpenQuickActions(true)} style={styles.circleButton}>
            <Ionicons color="#BBD2FF" name="add" size={16} />
          </Pressable>
          <View style={styles.rightActions}>
            <Pressable onPress={onVoicePress} style={[styles.circleButton, isRecording ? styles.recordingButton : null]}>
              <Ionicons color={isRecording ? '#FFB3B3' : '#BBD2FF'} name="mic-outline" size={14} />
            </Pressable>
            <Pressable onPress={() => sendMessage(chatInput)} style={styles.sendButton}>
              <Ionicons color="#0E3CA7" name="arrow-up" size={14} />
            </Pressable>
          </View>
        </View>
        {isRecording ? <Text style={styles.recordingText}>{tr('Recording voice...')}</Text> : null}
      </View>

      <Modal animationType="slide" onRequestClose={() => setOpenQuickActions(false)} transparent visible={openQuickActions}>
        <Pressable onPress={() => setOpenQuickActions(false)} style={styles.sheetBackdrop}>
          <Pressable onPress={(e) => e.stopPropagation()} style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{tr('Quick Actions')}</Text>
              <Pressable onPress={() => setOpenQuickActions(false)}>
                <Ionicons color="#DCE9FF" name="close" size={20} />
              </Pressable>
            </View>

            <Pressable
              onPress={() => {
                setOpenQuickActions(false);
                router.push({ pathname: '/scanning', params: { mode: agent } });
              }}
              style={styles.sheetOptionPrimary}
            >
              <View>
                <Text style={styles.sheetOptionPrimaryTitle}>{tr('Scanning')}</Text>
                <Text style={styles.sheetOptionPrimarySub}>{tr('Scan crop or animal for early warning signs')}</Text>
              </View>
              <Ionicons color="#DCE9FF" name="scan" size={20} />
            </Pressable>

            <Pressable
              onPress={() => {
                setOpenQuickActions(false);
                router.push({ pathname: '/upload-snapshot', params: { mode: agent } });
              }}
              style={styles.sheetOption}
            >
              <Ionicons color="#BFD6FF" name="image-outline" size={20} />
              <View style={styles.sheetOptionTextWrap}>
                <Text style={styles.sheetOptionTitle}>{tr('Upload Snapshot')}</Text>
                <Text style={styles.sheetOptionSub}>{tr('Upload photo for disease analysis')}</Text>
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                setOpenQuickActions(false);
                router.push({ pathname: '/live-monitoring', params: { mode: agent } });
              }}
              style={styles.sheetOption}
            >
              <Ionicons color="#BFD6FF" name="pulse-outline" size={20} />
              <View style={styles.sheetOptionTextWrap}>
                <Text style={styles.sheetOptionTitle}>{tr('Live Agent Monitoring')}</Text>
                <Text style={styles.sheetOptionSub}>{tr('Track active field checks in real-time')}</Text>
              </View>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal animationType="fade" onRequestClose={() => setOpenTutorial(false)} transparent visible={openTutorial}>
        <View style={styles.tutorialBackdrop}>
          <View style={styles.tutorialCard}>
            <View style={styles.tutorialHeader}>
              <Text style={styles.tutorialTitle}>{tutorialSteps[tutorialStep]?.title}</Text>
              <Pressable onPress={() => setOpenTutorial(false)}>
                <Ionicons color="#DCE9FF" name="close" size={20} />
              </Pressable>
            </View>
            <Text style={styles.tutorialBody}>{tutorialSteps[tutorialStep]?.body}</Text>
            <Text style={styles.tutorialStep}>
              {tr('Step')} {tutorialStep + 1} {tr('of')} {tutorialSteps.length}
            </Text>

            <View style={styles.tutorialActions}>
              {tutorialStep > 0 ? (
                <Pressable onPress={() => setTutorialStep((s) => s - 1)} style={styles.tutorialSecondaryBtn}>
                  <Text style={styles.tutorialSecondaryText}>{tr('Back')}</Text>
                </Pressable>
              ) : (
                <Pressable onPress={() => setOpenTutorial(false)} style={styles.tutorialSecondaryBtn}>
                  <Text style={styles.tutorialSecondaryText}>{tr('Skip')}</Text>
                </Pressable>
              )}

              <Pressable
                onPress={() => {
                  if (tutorialStep >= tutorialSteps.length - 1) {
                    setOpenTutorial(false);
                    return;
                  }
                  setTutorialStep((s) => s + 1);
                }}
                style={styles.tutorialPrimaryBtn}
              >
                <Text style={styles.tutorialPrimaryText}>
                  {tutorialStep >= tutorialSteps.length - 1 ? tr('Done') : tr('Next')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" onRequestClose={() => setOpenHistoryDrawer(false)} transparent visible={openHistoryDrawer}>
        <Pressable onPress={() => setOpenHistoryDrawer(false)} style={styles.historyBackdrop}>
          <Pressable onPress={(e) => e.stopPropagation()} style={styles.historyDrawer}>
            <View style={styles.historyHeader}>
              <Text style={styles.historyTitle}>{tr('Agent History')}</Text>
              <Pressable onPress={() => setOpenHistoryDrawer(false)}>
                <Ionicons color="#DCE9FF" name="close" size={20} />
              </Pressable>
            </View>
            <ScrollView>
              {sessions.filter((s) => s.agent === agent).map((session) => (
                <Pressable
                  key={session.id}
                  onPress={() => {
                    setOpenHistoryDrawer(false);
                    router.push({ pathname: '/chat-conversation', params: { sessionId: session.id } });
                  }}
                  style={styles.historyItem}
                >
                  <Text numberOfLines={1} style={styles.historyItemTitle}>
                    {session.title}
                  </Text>
                  <Text style={styles.historyItemMeta}>
                    {new Date(session.updatedAt).toLocaleTimeString()}
                  </Text>
                </Pressable>
              ))}
              {sessions.filter((s) => s.agent === agent).length === 0 ? (
                <Text style={styles.historyEmpty}>{tr('No chat history yet for this agent.')}</Text>
              ) : null}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#010B24',
    flex: 1,
    overflow: 'hidden',
    paddingBottom: 16,
    paddingHorizontal: 18,
    paddingTop: 50,
  },
  bgGlowTop: {
    backgroundColor: '#2B79FF',
    borderRadius: 180,
    height: 260,
    left: 52,
    opacity: 0.34,
    position: 'absolute',
    top: -90,
    width: 260,
  },
  bgGlowCenter: {
    backgroundColor: '#1952D7',
    borderRadius: 140,
    height: 220,
    left: 78,
    opacity: 0.15,
    position: 'absolute',
    top: 180,
    width: 220,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
    zIndex: 2,
  },
  agentSelector: {
    alignItems: 'center',
    backgroundColor: '#173976',
    borderColor: '#2E5AA8',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  agentText: {
    color: '#D8E6FF',
    fontSize: 12,
    fontWeight: '700',
    marginHorizontal: 6,
  },
  agentMenu: {
    backgroundColor: '#112C5D',
    borderColor: '#2E5AA8',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 6,
    paddingVertical: 4,
    position: 'absolute',
    top: 34,
    width: 138,
    zIndex: 4,
  },
  agentItem: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  agentItemText: {
    color: '#D9E7FF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  agentMenuDivider: {
    backgroundColor: '#2E5AA8',
    height: 1,
    marginVertical: 2,
  },
  tutorialButton: {
    alignItems: 'center',
    backgroundColor: '#173976',
    borderColor: '#2E5AA8',
    borderRadius: 14,
    borderWidth: 1,
    height: 28,
    justifyContent: 'center',
    width: 34,
  },
  centerContent: {
    alignItems: 'center',
    marginTop: 110,
    zIndex: 2,
  },
  chatInfoCard: {
    backgroundColor: '#132E62',
    borderColor: '#2A4F96',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 18,
    padding: 10,
    zIndex: 2,
  },
  chatInfoText: {
    color: '#BBD0EF',
    fontSize: 12,
  },
  messageBubble: {
    borderRadius: 10,
    maxWidth: '86%',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#2B4A86',
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#173976',
  },
  messageText: {
    color: '#EAF2FF',
    fontSize: 13,
    lineHeight: 18,
  },
  orb: {
    alignItems: 'center',
    backgroundColor: '#1C6DFF',
    borderRadius: 52,
    height: 104,
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#3B86FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 28,
    width: 104,
  },
  title: {
    color: '#EFF5FF',
    fontSize: 34,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#C0CBE4',
    fontSize: 14,
    fontWeight: '500',
  },
  inputPanel: {
    backgroundColor: '#16326A',
    borderColor: '#24498F',
    borderRadius: 18,
    borderWidth: 1,
    left: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    position: 'absolute',
    right: 18,
    zIndex: 2,
  },
  inputField: {
    color: '#E7EEFF',
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 12,
    paddingVertical: 0,
  },
  inputActions: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  circleButton: {
    alignItems: 'center',
    backgroundColor: '#2B4A86',
    borderRadius: 16,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  rightActions: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sendButton: {
    alignItems: 'center',
    backgroundColor: '#D7E8FF',
    borderRadius: 14,
    height: 28,
    justifyContent: 'center',
    marginLeft: 8,
    width: 28,
  },
  recordingButton: {
    backgroundColor: '#5A2032',
  },
  recordingText: {
    color: '#FFCAD3',
    fontSize: 11,
    marginTop: 8,
  },
  sheetBackdrop: {
    backgroundColor: 'rgba(1, 11, 36, 0.65)',
    flex: 1,
    justifyContent: 'flex-end',
    padding: 12,
  },
  sheet: {
    backgroundColor: '#121F3D',
    borderColor: '#2E5AA8',
    borderRadius: 18,
    borderWidth: 1,
    padding: 14,
  },
  sheetHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sheetTitle: {
    color: '#EAF2FF',
    fontSize: 22,
    fontWeight: '700',
  },
  sheetOptionPrimary: {
    alignItems: 'center',
    backgroundColor: '#2A4EA3',
    borderColor: '#4C78DF',
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 12,
  },
  sheetOptionPrimaryTitle: {
    color: '#F0F5FF',
    fontSize: 18,
    fontWeight: '700',
  },
  sheetOptionPrimarySub: {
    color: '#D6E5FF',
    fontSize: 13,
    marginTop: 4,
  },
  sheetOption: {
    alignItems: 'center',
    borderColor: '#26497E',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: 8,
    padding: 11,
  },
  sheetOptionTextWrap: {
    flex: 1,
    marginLeft: 10,
  },
  sheetOptionTitle: {
    color: '#EAF2FF',
    fontSize: 16,
    fontWeight: '700',
  },
  sheetOptionSub: {
    color: '#B9C9E8',
    fontSize: 12,
    marginTop: 2,
  },
  tutorialBackdrop: {
    backgroundColor: 'rgba(1, 11, 36, 0.78)',
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  tutorialCard: {
    backgroundColor: '#12234A',
    borderColor: '#2E5AA8',
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  tutorialHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tutorialTitle: {
    color: '#EAF2FF',
    flex: 1,
    fontSize: 18,
    fontWeight: '800',
    marginRight: 8,
  },
  tutorialBody: {
    color: '#C5D8FF',
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 10,
  },
  tutorialStep: {
    color: '#8DB0E8',
    fontSize: 12,
    marginBottom: 12,
  },
  tutorialActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tutorialSecondaryBtn: {
    alignItems: 'center',
    borderColor: '#2E5AA8',
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 90,
    paddingVertical: 9,
  },
  tutorialSecondaryText: {
    color: '#D2E3FF',
    fontSize: 13,
    fontWeight: '700',
  },
  tutorialPrimaryBtn: {
    alignItems: 'center',
    backgroundColor: '#2D6BFF',
    borderRadius: 10,
    minWidth: 90,
    paddingVertical: 9,
  },
  tutorialPrimaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  historyBackdrop: {
    backgroundColor: 'rgba(1, 11, 36, 0.68)',
    flex: 1,
  },
  historyDrawer: {
    backgroundColor: '#12234A',
    borderRightColor: '#2E5AA8',
    borderRightWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 12,
    paddingTop: 52,
    position: 'absolute',
    top: 0,
    width: 280,
  },
  historyHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  historyTitle: {
    color: '#EAF2FF',
    fontSize: 17,
    fontWeight: '800',
  },
  historyItem: {
    backgroundColor: '#173976',
    borderColor: '#2E5AA8',
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
    padding: 9,
  },
  historyItemTitle: {
    color: '#EAF2FF',
    fontSize: 12,
    fontWeight: '700',
  },
  historyItemMeta: {
    color: '#A7BFEB',
    fontSize: 11,
    marginTop: 4,
  },
  historyEmpty: {
    color: '#95AFDE',
    fontSize: 12,
    marginTop: 10,
  },
});
