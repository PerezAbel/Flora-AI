import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import type { AgentMode, ScanEntry } from './agent-data-context';

export type MonitorStatus = 'Monitoring' | 'Needs attention' | 'Recovered';
export type MonitorEntry = { id: string; date: string; note: string; scan?: ScanEntry };
export type MonitoredProfile = {
  id: string; name: string; kind: AgentMode; species: string; location: string;
  identity: string; status: MonitorStatus; nextCheck: string; entries: MonitorEntry[];
};
export type ProfileDraft = Omit<MonitoredProfile, 'id' | 'entries'>;
const key = 'flora-monitoring-v1';
const file = `${FileSystem.documentDirectory ?? ''}${key}.json`;
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

async function retainScan(scan: ScanEntry): Promise<ScanEntry> {
  if (!scan.imageUri) return { ...scan };
  if (Platform.OS === 'web') {
    if (!scan.imageUri.startsWith('blob:')) return { ...scan };
    const blob = await (await fetch(scan.imageUri)).blob();
    const imageUri = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Could not save photo'));
      reader.readAsDataURL(blob);
    });
    return { ...scan, imageUri };
  }
  const destination = `${FileSystem.documentDirectory}monitor-${uid()}.jpg`;
  await FileSystem.copyAsync({ from: scan.imageUri, to: destination });
  return { ...scan, imageUri: destination };
}

function useMonitoringState() {
  const [profiles, setProfiles] = useState<MonitoredProfile[]>([]);
  const current = useRef(profiles);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const writes = useRef(Promise.resolve());
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const raw = Platform.OS === 'web' ? localStorage.getItem(key) : (await FileSystem.getInfoAsync(file)).exists ? await FileSystem.readAsStringAsync(file) : null;
        const data = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(data) || data.some(p => !p.id || !p.name || !Array.isArray(p.entries))) throw new Error('Invalid saved profiles');
        if (mounted) { current.current = data; setProfiles(data); setReady(true); }
      } catch { if (mounted) setError('Saved profiles could not be loaded. Reopen the app to try again.'); }
    })();
    return () => { mounted = false; };
  }, []);

  const commit = (update: (old: MonitoredProfile[]) => MonitoredProfile[]) => {
    const operation = writes.current.catch(() => {}).then(async () => {
      if (!ready) throw new Error('Profiles are still loading.');
      const next = update(current.current);
      const raw = JSON.stringify(next);
      if (Platform.OS === 'web') localStorage.setItem(key, raw);
      else await FileSystem.writeAsStringAsync(file, raw);
      current.current = next;
      setProfiles(next);
    });
    writes.current = operation;
    return operation;
  };
  const createProfile = async (draft: ProfileDraft, scan?: ScanEntry) => {
    if (!draft.name.trim() || !draft.species.trim()) throw new Error('Enter a name and species or crop.');
    if (scan && scan.mode !== draft.kind) throw new Error('The scan must match the profile type.');
    const id = uid();
    const savedScan = scan ? await retainScan(scan) : undefined;
    await commit(old => [{ ...draft, name: draft.name.trim(), species: draft.species.trim(), id, entries: savedScan ? [{ id: uid(), date: new Date().toISOString(), note: savedScan.description ?? '', scan: savedScan }] : [] }, ...old]);
    return id;
  };
  const linkScan = async (id: string, scan: ScanEntry) => {
    const profile = current.current.find(p => p.id === id);
    if (!profile || profile.kind !== scan.mode) throw new Error('Choose a matching plant or animal profile.');
    if (profile.entries.some(e => e.scan?.id === scan.id)) return;
    const saved = await retainScan(scan);
    await commit(old => old.map(p => p.id !== id || p.entries.some(e => e.scan?.id === scan.id) ? p : { ...p, entries: [{ id: uid(), date: new Date().toISOString(), note: scan.description ?? '', scan: saved }, ...p.entries] }));
  };
  const updateProfile = (id: string, changes: Pick<MonitoredProfile, 'status' | 'nextCheck'>, note: string) => commit(old => old.map(p => p.id !== id ? p : { ...p, ...changes, entries: [{ id: uid(), date: new Date().toISOString(), note: note.trim() || `Status: ${changes.status}. Next check: ${changes.nextCheck || 'Not scheduled'}.` }, ...p.entries] }));
  return { profiles, ready, error, createProfile, linkScan, updateProfile };
}
const Context = createContext<ReturnType<typeof useMonitoringState> | null>(null);
export function MonitoringProvider({ children }: PropsWithChildren) { return <Context.Provider value={useMonitoringState()}>{children}</Context.Provider>; }
export function useMonitoring() { const value = useContext(Context); if (!value) throw new Error('MonitoringProvider required'); return value; }
