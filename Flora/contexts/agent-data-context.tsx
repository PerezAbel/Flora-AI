import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { runInference } from '@/services/inference';

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
  description?: string;
  treatment?: string[];
  prevention?: string[];
  alternatives?: Array<{ label: string; confidence: string; description?: string }>;
};

type AgentDataContextValue = {
  alerts: AlertItem[];
  scanHistory: ScanEntry[];
  addUploadedSnapshot: (mode: AgentMode, imageUri?: string) => Promise<ScanEntry>;
  addQuickScan: (mode: AgentMode) => Promise<ScanEntry>;
  addLiveMonitoringUpdate: (mode: AgentMode) => Promise<ScanEntry>;
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

// Start with an empty history so no prediction appears until the user uploads or runs a scan.
const seedHistory: ScanEntry[] = [];

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

  const createGeneratedScan = async (mode: AgentMode, source: 'upload' | 'scan' | 'live', imageUri?: string): Promise<ScanEntry> => {
    const newIdNum = counter + 1;
    setCounter(newIdNum);
    const scanId = `SCAN-${mode === 'crop' ? 'CP' : 'AN'}-${newIdNum}`;

    try {
      const inference = await runInference(mode, imageUri);
      const confidencePct = `${Math.round(inference.confidence * 100)}%`;
      const historyEntry: ScanEntry = {
        id: `h-${newIdNum}`,
        mode,
        item: inference.label,
        result: inference.label,
        confidence: confidencePct,
        time: nowLabel(),
        imageUri,
        description: inference.description,
        treatment: inference.treatment,
        prevention: inference.prevention,
        alternatives: inference.alternatives?.map((alt) => ({
          label: alt.label,
          confidence: `${Math.round(alt.confidence * 100)}%`,
          description: alt.description,
        })),
      };
      setScanHistory((prev) => [historyEntry, ...prev]);

      const level = inference.risk ?? (inference.confidence > 0.8 ? 'High' : inference.confidence > 0.6 ? 'Medium' : 'Low');
      if (level !== 'Low') {
        const alert: AlertItem = {
          id: `alert-${newIdNum}`,
          title: inference.label,
          level,
          detail: inference.description ?? `${level} risk detected from ${source} analysis`,
          time: nowLabel(),
          color: level === 'High' ? '#FF4D4F' : '#F5A400',
          badgeBg: level === 'High' ? '#FFE7E8' : '#FFF5DE',
          badgeText: level === 'High' ? '#CC1F24' : '#B77700',
          summary: inference.description ?? `${level} risk detected from ${source} analysis`,
          scanId,
          zone: mode === 'crop' ? 'Field Zone' : 'Livestock Pen',
          confidence: confidencePct,
          recommendation:
            inference.recommendation ??
            (mode === 'crop'
              ? 'Inspect affected plants and apply recommended treatment.'
              : 'Isolate affected animals and run follow-up checks.'),
          nextCheck: mode === 'crop' ? 'Re-scan after 48 hours' : 'Re-check after 24 hours',
          mode,
        };
        setAlerts((prev) => [alert, ...prev].slice(0, 12));
      }
      return historyEntry;
    } catch (err) {
      console.warn('Inference failed, falling back to simulated data', err);
      // fallback to existing seeded behavior
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
      return historyEntry;
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
