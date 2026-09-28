import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { router } from 'expo-router';
import { Button, Card, Field, Icon, Pill, Sheet, Text, s } from './ui';
import { useMonitoring, type ProfileDraft } from '@/contexts/monitoring-context';
import type { ScanEntry } from '@/contexts/agent-data-context';
import { useTheme } from '@/contexts/theme-context';

export function validCheckDate(value: string) {
  return !value || (/^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value);
}
export function ProfileForm({ scan, onClose }: { scan?: ScanEntry; onClose: () => void }) {
  const { createProfile, ready } = useMonitoring();
  const [draft, setDraft] = useState<ProfileDraft>({ name: '', kind: scan?.mode ?? 'animal', species: '', location: '', identity: '', status: 'Monitoring', nextCheck: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const save = async () => {
    if (busy) return;
    if (!validCheckDate(draft.nextCheck)) { setError('Use a valid date in YYYY-MM-DD format.'); return; }
    setBusy(true); setError('');
    try { const id = await createProfile(draft, scan); onClose(); router.push({ pathname: '/monitor-profile', params: { id } }); }
    catch { setError('Could not save the profile. Check the fields and available device storage, then try again.'); }
    finally { setBusy(false); }
  };
  return <Sheet visible title="Create a monitoring profile" onClose={onClose}>
    <Text style={s.small}>Give this plant or animal an identity to track its progress over time.</Text>
    {!scan && <View style={s.row}><Pill text="Animal" active={draft.kind === 'animal'} onPress={() => setDraft({ ...draft, kind: 'animal' })} /><Pill text="Plant" active={draft.kind === 'crop'} onPress={() => setDraft({ ...draft, kind: 'crop' })} /></View>}
    <Field label="Name *" placeholder={draft.kind === 'animal' ? 'e.g. Daisy' : 'e.g. Tomato plant 12'} value={draft.name} onChangeText={name => setDraft({ ...draft, name })} />
    <Field label={draft.kind === 'animal' ? 'Species / breed *' : 'Crop / variety *'} value={draft.species} onChangeText={species => setDraft({ ...draft, species })} />
    <Field label={draft.kind === 'animal' ? 'Tag number / age' : 'Plant ID / planting date'} value={draft.identity} onChangeText={identity => setDraft({ ...draft, identity })} />
    <Field label="Location / pen / field" value={draft.location} onChangeText={location => setDraft({ ...draft, location })} />
    <Field label="Next check (YYYY-MM-DD, optional)" value={draft.nextCheck} onChangeText={nextCheck => setDraft({ ...draft, nextCheck })} />
    {!!error && <Text accessibilityRole="alert" style={s.small}>{error}</Text>}
    <Button title={busy ? 'Saving…' : 'Create profile'} disabled={!ready || busy || !draft.name.trim() || !draft.species.trim()} onPress={() => void save()} />
  </Sheet>;
}
export function ScanProfilePrompt({ scan }: { scan: ScanEntry }) {
  const { profiles, linkScan, ready } = useMonitoring();
  const [create, setCreate] = useState(false);
  const [choose, setChoose] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const linked = profiles.find(p => p.entries.some(e => e.scan?.id === scan.id));
  const matches = profiles.filter(p => p.kind === scan.mode);
  const attach = async (id: string) => {
    setBusy(true); setError('');
    try { await linkScan(id, scan); setChoose(false); }
    catch { setError('Could not save this check. Please try again.'); }
    finally { setBusy(false); }
  };
  return <Card><Text style={s.sectionTitle}>{linked ? `Saved to ${linked.name}` : `Keep an eye on this ${scan.mode === 'animal' ? 'animal' : 'plant'}`}</Text>
    <Text style={s.small}>{linked ? 'This check is part of its monitoring history.' : 'Create a profile to keep photos, observations and follow-up checks together. You can also add this check to an existing profile.'}</Text>
    {linked ? <Button title="View profile" secondary onPress={() => router.push({ pathname: '/monitor-profile', params: { id: linked.id } })} /> : <><Button title="Create profile" icon="add" disabled={!ready} onPress={() => setCreate(true)} />{!!matches.length && <Button title="Add to existing profile" secondary disabled={!ready} onPress={() => setChoose(true)} />}</>}
    {create && <ProfileForm scan={scan} onClose={() => setCreate(false)} />}
    <Sheet visible={choose} title="Choose a profile" onClose={() => setChoose(false)}>{matches.map(p => <Button key={p.id} title={`${p.name} · ${p.species}`} secondary disabled={busy} onPress={() => void attach(p.id)} />)}{!!error && <Text accessibilityRole="alert">{error}</Text>}</Sheet>
  </Card>;
}
export function MonitoringDashboard() {
  const { profiles, ready, error } = useMonitoring();
  const { colors } = useTheme();
  const [create, setCreate] = useState(false);
  return <View style={{ gap: 12 }}><View style={s.between}><View><Text style={s.sectionTitle}>Plants & animals</Text><Text style={s.small}>Individual care, one check at a time</Text></View><Pressable accessibilityRole="button" accessibilityLabel="Create plant or animal profile" disabled={!ready} onPress={() => setCreate(true)} style={{ padding: 10, borderRadius: 14, backgroundColor: colors.raised }}><Icon name="add" /></Pressable></View>
    {!!error && <Text accessibilityRole="alert">{error}</Text>}
    {!ready && !error && <Text style={s.small}>Loading profiles…</Text>}
    {ready && !profiles.length && <Card><Icon name="leaf-outline" size={28} /><Text style={s.text}>Get to know every plant and animal.</Text><Text style={s.small}>Create your first profile or save a check from the Scan tab.</Text><Button title="Create a profile" onPress={() => setCreate(true)} /></Card>}
    {profiles.map(p => <Pressable key={p.id} accessibilityRole="button" accessibilityLabel={`Monitor ${p.name}`} onPress={() => router.push({ pathname: '/monitor-profile', params: { id: p.id } })}><Card><View style={s.between}><View style={s.row}><Icon name={p.kind === 'animal' ? 'paw-outline' : 'leaf-outline'} /><View><Text style={s.sectionTitle}>{p.name}</Text><Text style={s.small}>{p.species} · {p.location || 'No location'}</Text></View></View><Icon name="chevron-forward" size={18} /></View><View style={s.between}><Text style={{ color: p.status === 'Needs attention' ? colors.orange : colors.mint, fontSize: 12 }}>{p.status}</Text><Text style={s.small}>{p.entries.length} checks</Text></View><Text style={s.small}>{p.nextCheck ? `${p.nextCheck < new Date().toISOString().slice(0, 10) ? 'Overdue' : 'Next check'}: ${p.nextCheck}` : 'No check scheduled'}</Text></Card></Pressable>)}
    {create && <ProfileForm onClose={() => setCreate(false)} />}
  </View>;
}
