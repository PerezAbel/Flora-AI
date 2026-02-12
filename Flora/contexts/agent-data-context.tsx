import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type AgentMode = 'crop' | 'animal';
export type AlertLevel = 'High' | 'Medium' | 'Low';

export type AlertItem = {
  id: string;
  title: string;
  level: AlertLevel;
  detail: string;
  time: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  summary: string;
  scanId: string;
  zone: string;
  confidence: string;
  recommendation: string;
  nextCheck: string;
  mode: AgentMode;
};

export type ScanEntry = {
  id: string;
  mode: AgentMode;
  item: string;
  result: string;
  confidence: string;
  time: string;
  imageUri?: string;
};

type AgentDataContextValue = {
  alerts: AlertItem[];
  scanHistory: ScanEntry[];
  addUploadedSnapshot: (mode: AgentMode, imageUri?: string) => void;
  addQuickScan: (mode: AgentMode) => void;
  addLiveMonitoringUpdate: (mode: AgentMode) => void;
};

const seedAlerts: AlertItem[] = [
  {
    id: 'a1',
    title: 'Maize Streak Virus',
    level: 'High',
    detail: 'High risk detected in next 7 days',
    time: 'Today, 9:30 AM',
    color: '#FF4D4F',
    badgeBg: '#FFE7E8',
    badgeText: '#CC1F24',
    summary: 'High risk detected in next 7 days',
    scanId: 'SCAN-MZ-1029',
    zone: 'Block A2',
    confidence: '91%',
    recommendation: 'Start preventive spray in Block A2 and monitor nearby plants daily.',
    nextCheck: 'Re-scan after 48 hours',
    mode: 'crop',
  },
  {
    id: 'a2',
    title: 'Leaf Rust',
    level: 'Medium',
    detail: 'Medium risk detected in next 10 days',
    time: 'Yesterday, 2:15 PM',
    color: '#F5A400',
    badgeBg: '#FFF5DE',
    badgeText: '#B77700',
    summary: 'Medium risk detected in next 10 days',
    scanId: 'SCAN-WH-1014',
    zone: 'Block B1',
    confidence: '86%',
    recommendation: 'Apply fungicide in affected rows and increase field inspections this week.',
    nextCheck: 'Re-scan after 72 hours',
    mode: 'crop',
  },
  {
    id: 'a3',
    title: 'Aphid Infestation',
    level: 'Low',
    detail: 'Low risk - monitoring recommended',
    time: '2 days ago',
    color: '#18B85A',
    badgeBg: '#E8F9EF',
    badgeText: '#0B8840',
    summary: 'Low risk - monitoring recommended',
    scanId: 'SCAN-CV-0988',
    zone: 'Block C1',
    confidence: '80%',
    recommendation: 'Continue monitoring and use biological control if aphid count increases.',
    nextCheck: 'Re-scan in 5 days',
    mode: 'crop',
  },
];

const seedHistory: ScanEntry[] = [
  { id: 'c1', mode: 'crop', item: 'Maize Leaf - Block A2', result: 'Leaf Rust (High)', confidence: '91%', time: 'Today, 9:30 AM' },
  { id: 'c2', mode: 'crop', item: 'Tomato Plant - Block B1', result: 'Blight (Medium)', confidence: '86%', time: 'Today, 7:12 AM' },
  { id: 'a1h', mode: 'animal', item: 'Cow 017', result: 'Respiratory Risk (Medium)', confidence: '88%', time: 'Today, 8:20 AM' },
  { id: 'a2h', mode: 'animal', item: 'Goat 032', result: 'Healthy', confidence: '93%', time: 'Today, 6:10 AM' },
];

const AgentDataContext = createContext<AgentDataContextValue | undefined>(undefined);

function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function nowLabel() {
  return 'Just now';
}

export function AgentDataProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<AlertItem[]>(seedAlerts);
  const [scanHistory, setScanHistory] = useState<ScanEntry[]>(seedHistory);
  const [counter, setCounter] = useState(2000);

  const createGeneratedScan = (mode: AgentMode, source: 'upload' | 'scan' | 'live', imageUri?: string) => {
    const crop = [
      { item: 'Maize Leaf - Block A3', result: 'Rust (Medium)', level: 'Medium' as AlertLevel, title: 'Leaf Rust' },
      { item: 'Tomato Leaf - Block B2', result: 'Blight (High)', level: 'High' as AlertLevel, title: 'Leaf Blight' },
      { item: 'Cassava Leaf - Block C1', result: 'Healthy', level: 'Low' as AlertLevel, title: 'Healthy Crop' },
    ];
    const animal = [
      { item: 'Cow 021', result: 'Fever Symptoms (High)', level: 'High' as AlertLevel, title: 'Fever Symptoms' },
      { item: 'Goat 041', result: 'Skin Condition (Low)', level: 'Low' as AlertLevel, title: 'Skin Condition' },
      { item: 'Chicken Batch E', result: 'Respiratory Risk (Medium)', level: 'Medium' as AlertLevel, title: 'Respiratory Risk' },
    ];
    const chosen = randomFrom(mode === 'crop' ? crop : animal);
    const confidence = `${80 + Math.floor(Math.random() * 18)}%`;
    const newIdNum = counter + 1;
    setCounter(newIdNum);
    const scanId = `SCAN-${mode === 'crop' ? 'CP' : 'AN'}-${newIdNum}`;

    const historyEntry: ScanEntry = {
      id: `h-${newIdNum}`,
      mode,
      item: chosen.item,
      result: chosen.result,
      confidence,
      time: nowLabel(),
      imageUri,
    };

    setScanHistory((prev) => [historyEntry, ...prev]);

    if (chosen.level !== 'Low') {
      const alert: AlertItem = {
        id: `alert-${newIdNum}`,
        title: chosen.title,
        level: chosen.level,
        detail: `${chosen.level} risk detected from ${source} analysis`,
        time: nowLabel(),
        color: chosen.level === 'High' ? '#FF4D4F' : '#F5A400',
        badgeBg: chosen.level === 'High' ? '#FFE7E8' : '#FFF5DE',
        badgeText: chosen.level === 'High' ? '#CC1F24' : '#B77700',
        summary: `${chosen.level} risk detected from ${source} analysis`,
        scanId,
        zone: mode === 'crop' ? 'Block A3' : 'Livestock Pen 2',
        confidence,
        recommendation:
          mode === 'crop'
            ? 'Inspect affected plants and apply recommended treatment.'
            : 'Isolate affected animals and run follow-up checks.',
        nextCheck: mode === 'crop' ? 'Re-scan after 48 hours' : 'Re-check after 24 hours',
        mode,
      };
      setAlerts((prev) => [alert, ...prev].slice(0, 12));
    }
  };

  const value = useMemo<AgentDataContextValue>(
    () => ({
      alerts,
      scanHistory,
      addUploadedSnapshot: (mode: AgentMode, imageUri?: string) => createGeneratedScan(mode, 'upload', imageUri),
      addQuickScan: (mode: AgentMode) => createGeneratedScan(mode, 'scan'),
      addLiveMonitoringUpdate: (mode: AgentMode) => createGeneratedScan(mode, 'live'),
    }),
    [alerts, scanHistory]
  );

  return <AgentDataContext.Provider value={value}>{children}</AgentDataContext.Provider>;
}

export function useAgentData() {
  const context = useContext(AgentDataContext);
  if (!context) throw new Error('useAgentData must be used within AgentDataProvider');
  return context;
}
