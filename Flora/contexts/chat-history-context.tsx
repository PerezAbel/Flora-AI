import { createContext, type ReactNode, useContext, useRef, useState } from 'react';
import type { AgentMode, ScanEntry } from '@/contexts/agent-data-context';
import { buildCareReply } from '@/services/care-guidance';

export type ChatReply = { text: string; scan?: ScanEntry; imageUri?: string };
export type ChatMessage = ChatReply & {
  id: string; role: 'user' | 'assistant'; ts: number;
  status?: 'thinking' | 'complete' | 'error';
};
export type ChatSession = { id: string; agent: AgentMode; title: string; updatedAt: number; messages: ChatMessage[] };
type Work = () => Promise<ChatReply>;
type ChatHistoryContextValue = {
  sessions: ChatSession[];
  createSession: (agent: AgentMode, question: string, response: string) => string;
  startConversation: (agent: AgentMode, question: string, work: Work, imageUri?: string) => string;
  addExchange: (id: string, question: string, response: string) => void;
  sendMessage: (id: string, question: string) => void;
  retryMessage: (sessionId: string, messageId: string) => void;
  getSession: (id: string) => ChatSession | undefined;
};
const Context = createContext<ChatHistoryContextValue | undefined>(undefined);
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
export function ChatHistoryProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const jobs = useRef(new Map<string, Work>());
  const pending = useRef(new Set<string>());
  const run = (sessionId: string, messageId: string, work: Work) => {
    pending.current.add(sessionId);
    jobs.current.set(messageId, work);
    // Yield so the pending message can render before local preview work starts.
    setTimeout(() => {
      void (async () => {
        try {
          const reply = await work();
          setSessions(old => old.map(s => s.id !== sessionId ? s : { ...s, updatedAt: Date.now(), messages: s.messages.map(m => m.id === messageId ? { ...m, ...reply, status: 'complete' } : m) }));
          jobs.current.delete(messageId);
        } catch {
          setSessions(old => old.map(s => s.id !== sessionId ? s : { ...s, messages: s.messages.map(m => m.id === messageId ? { ...m, text: 'I could not prepare this response. Please try again.', status: 'error' } : m) }));
        } finally { pending.current.delete(sessionId); }
      })();
    }, 0);
  };
  const startConversation = (agent: AgentMode, question: string, work: Work, imageUri?: string) => {
    const id = uid(); const messageId = uid(); const now = Date.now();
    setSessions(old => [{ id, agent, title: question.slice(0, 44) || 'Photo check', updatedAt: now, messages: [{ id: uid(), role: 'user', text: question, imageUri, ts: now }, { id: messageId, role: 'assistant', text: '', status: 'thinking', ts: now }] }, ...old]);
    run(id, messageId, work);
    return id;
  };
  const createSession = (agent: AgentMode, question: string, response: string) => startConversation(agent, question, async () => ({ text: response }));
  const addExchange = (id: string, question: string, response: string) => {
    if (pending.current.has(id) || !question.trim()) return;
    const messageId = uid(); const now = Date.now();
    setSessions(old => old.map((s): ChatSession => s.id !== id ? s : { ...s, updatedAt: now, messages: [...s.messages, { id: uid(), role: 'user', text: question, ts: now }, { id: messageId, role: 'assistant', text: '', ts: now, status: 'thinking' }] }).sort((a, b) => b.updatedAt - a.updatedAt));
    run(id, messageId, async () => ({ text: response }));
  };
  const sendMessage = (id: string, question: string) => {
    const session = sessions.find(s => s.id === id);
    if (session) addExchange(id, question, buildCareReply(session.agent));
  };
  const retryMessage = (sessionId: string, messageId: string) => {
    const work = jobs.current.get(messageId);
    if (!work || pending.current.has(sessionId)) return;
    setSessions(old => old.map(s => s.id !== sessionId ? s : { ...s, messages: s.messages.map(m => m.id === messageId ? { ...m, text: '', status: 'thinking' } : m) }));
    run(sessionId, messageId, work);
  };
  const value = { sessions, createSession, startConversation, addExchange, sendMessage, retryMessage, getSession: (id: string) => sessions.find(s => s.id === id) };
  return <Context.Provider value={value}>{children}</Context.Provider>;
}
export function useChatHistory() { const context = useContext(Context); if (!context) throw new Error('ChatHistoryProvider required'); return context; }
