import { useState } from 'react';
import { Image, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Button, Card, Field, IconButton, Page, Pill, Text, s } from '@/components/agro/ui';
import { useMonitoring, type MonitoredProfile, type MonitorStatus } from '@/contexts/monitoring-context';
import { useTheme } from '@/contexts/theme-context';
import { validCheckDate } from '@/components/agro/monitoring';

function ProfileDetails({ profile }: { profile: MonitoredProfile }) {
  const { updateProfile } = useMonitoring();
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<MonitorStatus>(profile.status);
  const [nextCheck, setNextCheck] = useState(profile.nextCheck);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const save = async () => {
    if (!validCheckDate(nextCheck)) { setMessage('Enter a valid date in YYYY-MM-DD format.'); return; }
    setBusy(true);
    try { await updateProfile(profile.id, { status, nextCheck }, note); setNote(''); setMessage('Observation saved.'); }
    catch { setMessage('Could not save. Please try again.'); }
    finally { setBusy(false); }
  };
  return <><Card><Text style={s.title}>{profile.name}</Text><Text style={s.text}>{profile.species} · {profile.kind === 'animal' ? 'Animal' : 'Plant'}</Text><Text style={s.small}>{[profile.identity, profile.location].filter(Boolean).join(' · ') || 'No identifying details added'}</Text><Text style={s.small}>Next check: {profile.nextCheck || 'Not scheduled'}</Text><Button title="Add a follow-up photo" icon="camera-outline" onPress={() => router.push({ pathname: '/upload-snapshot', params: { mode: profile.kind, profileId: profile.id } })} /></Card>
    <Card><Text style={s.sectionTitle}>Record an observation</Text><Field label="Symptoms, progress or care given" multiline value={note} onChangeText={setNote} /><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>{(['Monitoring', 'Needs attention', 'Recovered'] as const).map(value => <Pill key={value} text={value} active={status === value} onPress={() => setStatus(value)} />)}</View><Field label="Next check (YYYY-MM-DD)" value={nextCheck} onChangeText={setNextCheck} /><Text style={s.small}>Dates appear on your dashboard. Push reminders are not enabled.</Text><Button title={busy ? 'Saving…' : 'Save observation'} disabled={busy} onPress={() => void save()} />{!!message && <Text accessibilityRole="alert" style={s.small}>{message}</Text>}</Card>
    <Text style={s.sectionTitle}>Monitoring history</Text>{!profile.entries.length && <Text style={s.small}>No checks yet. Add a photo or your first observation.</Text>}
    {profile.entries.map(entry => <Card key={entry.id}><Text style={s.small}>{new Date(entry.date).toLocaleString()}</Text>{entry.scan?.imageUri && <Image accessibilityLabel="Photo from this check" source={{ uri: entry.scan.imageUri }} style={{ width: '100%', height: 200, borderRadius: 14 }} />}{entry.scan && <><Text style={s.text}>{entry.scan.result}</Text><Text style={s.small}>Preview scan · not a confirmed diagnosis</Text></>}{!!entry.note && <Text style={s.text}>{entry.note}</Text>}</Card>)}
    <Text style={s.small}>Profiles are saved on this device.</Text></>;
}
export default function MonitorProfileScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profiles, ready, error } = useMonitoring();
  const { colors } = useTheme();
  const profile = profiles.find(p => p.id === id);
  return <SafeAreaView edges={['top', 'bottom']} style={{ flex: 1, backgroundColor: colors.bg }}><Page><View style={s.row}><IconButton name="arrow-back" label="Back to dashboard" onPress={() => router.navigate('/dashboard')} /><Text style={s.sectionTitle}>Care profile</Text></View>{profile ? <ProfileDetails key={profile.id} profile={profile} /> : <Text>{error || (ready ? 'Profile not found.' : 'Loading profile…')}</Text>}</Page></SafeAreaView>;
}
