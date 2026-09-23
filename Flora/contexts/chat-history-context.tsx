import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { AgentMode } from '@/contexts/agent-data-context';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  ts: number;
};

export type ChatSession = {
  id: string;
  agent: AgentMode;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
};

type ChatHistoryContextValue = {
  sessions: ChatSession[];
  createSession: (agent: AgentMode, firstQuestion: string, firstResponse: string) => string;
  addExchange: (sessionId: string, question: string, response: string) => void;
  getSession: (sessionId: string) => ChatSession | undefined;
};

const ChatHistoryContext = createContext<ChatHistoryContextValue | undefined>(undefined);

export function ChatHistoryProvider({ children }: { children: ReactNode }) {
  const [sessions, setSessions] = useState<ChatSession[]>([]);

  const createSession = (agent: AgentMode, firstQuestion: string, firstResponse: string) => {
    const now = Date.now();
    const sessionId = `s-${now}`;
    const newSession: ChatSession = {
      id: sessionId,
      agent,
      title: firstQuestion.slice(0, 44) || 'New Chat',
      updatedAt: now,
      messages: [
        { id: `m-${now}-u`, role: 'user', text: firstQuestion, ts: now },
        { id: `m-${now}-a`, role: 'assistant', text: firstResponse, ts: now + 1 },
      ],
    };
    setSessions((prev) => [newSession, ...prev]);
    return sessionId;
  };

  const addExchange = (sessionId: string, question: string, response: string) => {
    const now = Date.now();
    setSessions((prev) =>
      prev
        .map((session): ChatSession =>
          session.id !== sessionId
            ? session
            : {
                ...session,
                updatedAt: now,
                messages: [
                  ...session.messages,
                  { id: `m-${now}-u`, role: 'user', text: question, ts: now },
                  { id: `m-${now}-a`, role: 'assistant', text: response, ts: now + 1 },
                ],
              }
        )
        .sort((a, b) => b.updatedAt - a.updatedAt)
    );
  };

  const getSession = (sessionId: string) => sessions.find((session) => session.id === sessionId);

  const value = useMemo(
    () => ({
      sessions,
      createSession,
      addExchange,
      getSession,
    }),
    [sessions]
  );

  return <ChatHistoryContext.Provider value={value}>{children}</ChatHistoryContext.Provider>;
}

export function useChatHistory() {
  const context = useContext(ChatHistoryContext);
  if (!context) throw new Error('useChatHistory must be used within ChatHistoryProvider');
  return context;
}
