import { Button, Card, Field, Icon, Page, Pill, Sheet, Text, s } from '@/components/agro/ui';
import { imageSource, photos, useAgro } from '@/contexts/agro-context';
import { useTheme } from '@/contexts/theme-context';
import { careCategories, sampleVetListings, type VetListing } from '@/services/vet-directory';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, Linking, Pressable, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';

type Draft = Omit<VetListing, 'id' | 'sample' | 'services'> & { services: string };
const emptyDraft: Draft = {
  name: '', practitioner: '', category: 'vet', town: '', address: '', phone: '',
  services: '', description: '', hours: '', fees: '', farmVisits: false,
};
const makeListingId = () => 'practice-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8);

export default function NearbyCareScreen() {
  const { colors } = useTheme();
  const { vetListings, setVetListings } = useAgro();
  const params = useLocalSearchParams<{ category?: string }>();
  const category = careCategories.some(option => option.id === params.category) ? params.category : 'all';
  const [tab, setTab] = useState<'browse' | 'mine'>('browse');
  const [query, setQuery] = useState('');
  const [area, setArea] = useState('');
  const [notice, setNotice] = useState('');
  const [formError, setFormError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string>();
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [detailId, setDetailId] = useState<string>();
  const [deleteId, setDeleteId] = useState<string>();
  const [showSamples, setShowSamples] = useState(true);
  const allListings = [...vetListings, ...sampleVetListings];
  const detail = allListings.find(listing => listing.id === detailId);
  const source = tab === 'mine' ? vetListings : showSamples ? allListings : vetListings;
  const visible = source.filter(listing =>
    (tab === 'mine' || category === 'all' || listing.category === category) &&
    (tab === 'mine' || (listing.town + ' ' + listing.address).toLowerCase().includes(area.trim().toLowerCase())) &&
    [listing.name, listing.practitioner, ...listing.services].join(' ').toLowerCase().includes(query.trim().toLowerCase())
  );

  const openLink = async (url: string) => {
    try { await Linking.openURL(url); }
    catch { setNotice('Could not open this link. Please try again or use the contact details shown.'); }
  };
  const startListing = (listing?: VetListing) => {
    setEditingId(listing?.id);
    setDraft(listing ? { ...listing, services: listing.services.join(', ') } : emptyDraft);
    setFormError('');
    setShowForm(true);
  };
  const updateDraft = <Key extends keyof Draft>(key: Key, value: Draft[Key]) => setDraft(previous => ({ ...previous, [key]: value }));
  const save = () => {
    const phone = draft.phone.replace(/[\s()-]/g, '');
    const services = [...new Set(draft.services.split(/[,\n]/).map(service => service.trim()).filter(Boolean))];
    if (!draft.name.trim() || !draft.practitioner.trim() || !draft.town.trim() || !draft.address.trim() || !services.length) {
      setFormError('Add a practice name, practitioner, town, address and at least one service.');
      return;
    }
    if (!/^\+?\d{9,15}$/.test(phone)) {
      setFormError('Enter a valid phone number, including the country code where needed.');
      return;
    }
    const listing: VetListing = {
      id: editingId ?? makeListingId(), sample: false,
      name: draft.name.trim(), practitioner: draft.practitioner.trim(), category: draft.category,
      town: draft.town.trim(), address: draft.address.trim(), phone, services,
      description: draft.description.trim(), hours: draft.hours.trim(), fees: draft.fees.trim(), farmVisits: draft.farmVisits,
    };
    setVetListings(previous => editingId ? previous.map(item => item.id === editingId ? listing : item) : [listing, ...previous]);
    setShowForm(false);
    setTab('mine');
    setQuery('');
    setNotice('Listing saved for this app session. It is not published to other farmers yet.');
  };
  const searchMaps = () => {
    const search = careCategories.find(option => option.id === category)?.query ?? 'veterinarian';
    void openLink('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(search + (area.trim() ? ' in ' + area.trim() : ' near me')));
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.bg }]}>
      <Page>
        <View style={s.row}>
          <View style={[styles.segment, { backgroundColor: colors.card }]}>
            {(['Find', 'List', 'My Vets'] as const).map(label => {
              const active = label === 'List' ? showForm : !showForm && (label === 'Find' ? tab === 'browse' : tab === 'mine');
              return (
                <Pressable key={label} accessibilityRole="button" accessibilityLabel={label} accessibilityState={{ selected: active }} onPress={() => { if (label === 'List') startListing(); else { setTab(label === 'Find' ? 'browse' : 'mine'); setQuery(''); setNotice(''); } }} style={[styles.segmentItem, { backgroundColor: active ? colors.mint : colors.card }]}>
                  <Icon name={label === 'Find' ? 'paw-outline' : label === 'List' ? 'pricetag-outline' : 'storefront-outline'} size={15} color={active ? colors.bg : colors.muted} />
                  <Text style={{ color: active ? colors.bg : colors.muted, fontSize: 12, fontWeight: '700' }}>{label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel={`My practices, ${vetListings.length} listings`} onPress={() => { setTab('mine'); setQuery(''); }} style={styles.listingCount}>
            <Icon name="medical-outline" /><Text style={s.badge}>{vetListings.length}</Text>
          </Pressable>
        </View>
        <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.line }]}>
          <Icon name="search" size={18} color={colors.muted} />
          <TextInput accessibilityLabel="Search practices or services" placeholder="Search vets, practices, services…" placeholderTextColor={colors.muted} value={query} onChangeText={setQuery} style={[styles.searchInput, { color: colors.text }]} />
        </View>
        {tab === 'browse' && (
          <>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              <Pill text="All care" active={category === 'all'} onPress={() => router.setParams({ category: 'all' })} />
              {careCategories.map(option => <Pill key={option.id} text={option.label} active={category === option.id} onPress={() => router.setParams({ category: option.id })} />)}
            </ScrollView>
            <ImageBackground source={imageSource(photos.livestock)} style={[styles.banner, { backgroundColor: colors.card }]} imageStyle={{ borderRadius: 16 }}>
              <View style={styles.bannerShade}>
                <Text style={[s.label, { color: '#B8E8C7' }]}>CARE FOR YOUR FARM</Text>
                <Text style={[s.title, { fontSize: 23, maxWidth: 230, color: '#FFFFFF' }]}>Healthy farms start{'\n'}with trusted care.</Text>
                <Text style={[s.small, { color: '#D8EADF' }]}>Explore practices and their services</Text>
              </View>
            </ImageBackground>
            <View style={[styles.search, { backgroundColor: colors.card }]}>
              <Icon name="location-outline" size={18} color={colors.muted} />
              <TextInput accessibilityLabel="Town or area" value={area} onChangeText={setArea} placeholder="Filter by town or area…" placeholderTextColor={colors.muted} style={[styles.searchInput, { color: colors.text }]} />
            </View>
            <View style={s.between}>
              <Text style={s.small}>Show example cards</Text>
              <Switch accessibilityLabel="Show example practice cards" value={showSamples} onValueChange={setShowSamples} trackColor={{ false: colors.line, true: colors.raised }} thumbColor={colors.mint} />
            </View>
            <Text style={s.small}>Listings are filtered by the town you enter. Live location and a shared provider directory are not connected.</Text>
          </>
        )}
        {!!notice && <Text accessibilityRole="alert" style={s.small}>{notice}</Text>}
        <Text style={s.sectionTitle}>{tab === 'mine' ? 'Your practices' : 'Care directory'} · {visible.length}</Text>
        <View style={styles.grid}>
        {visible.map(listing => {
          const type = careCategories.find(option => option.id === listing.category)!;
          return (
            <View key={listing.id} style={[styles.product, { backgroundColor: colors.card }]}>
              <Pressable accessibilityRole="button" accessibilityLabel={`View services for ${listing.name}`} onPress={() => { setNotice(''); setDetailId(listing.id); }}>
                <Image source={imageSource(listing.category === 'agronomist' ? photos.maize : listing.category === 'agrovet' || listing.category === 'pharmacy' ? photos.tools : photos.livestock)} style={[styles.productImage, { backgroundColor: colors.raised }]} accessibilityLabel="Illustrative farm image, not a photo of this practice" />
                <Text style={[styles.productBadge, { backgroundColor: colors.raised, color: colors.mint }]}>{listing.sample ? 'Example only' : 'Your listing'}</Text>
                <View style={{ padding: 12, gap: 4 }}>
                  <Text style={[s.small, { fontSize: 10 }]} numberOfLines={1}>{listing.practitioner}</Text>
                  <Text style={[s.text, { fontWeight: '700', fontSize: 13, lineHeight: 18 }]} numberOfLines={2}>{listing.name}</Text>
                  <Text style={{ color: colors.orange, fontSize: 10 }} numberOfLines={1}>{type.label} · {listing.town}</Text>
                  <Text style={[s.small, { fontSize: 10 }]} numberOfLines={2}>{listing.services.join(' · ')}</Text>
                </View>
              </Pressable>
              <View style={[s.between, { paddingHorizontal: 12, paddingBottom: 10, gap: 6 }]}>
                <Text style={{ color: colors.mint, fontSize: 14, fontWeight: '800', flex: 1 }} numberOfLines={2}>{listing.fees || 'Ask for a quote'}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel={tab === 'mine' ? `Edit ${listing.name}` : `View ${listing.name}`} onPress={() => { if (tab === 'mine') startListing(listing); else { setNotice(''); setDetailId(listing.id); } }} style={[styles.add, { backgroundColor: colors.raised }]}>
                  <Icon name={tab === 'mine' ? 'create-outline' : 'arrow-forward'} size={18} />
                </Pressable>
              </View>
            </View>
          );
        })}
        </View>
        {!visible.length && (
          <Card>
            <Icon name="storefront-outline" size={36} />
            <Text style={s.sectionTitle}>{tab === 'mine' ? 'Your practice belongs here' : 'No matching listings yet'}</Text>
            <Text style={s.small}>{tab === 'mine' ? 'Add your practice and list the services you offer to farmers.' : 'Try another town or service, add a local practice, or browse real providers in Maps.'}</Text>
            <Button title="Add your practice" onPress={() => startListing()} />
            {tab === 'browse' && <Button title="Preview example cards" secondary onPress={() => { setShowSamples(true); setArea(''); setQuery(''); router.setParams({ category: 'all' }); }} />}
          </Card>
        )}
        {tab === 'browse' && <Button title="Find providers in Google Maps" secondary icon="map-outline" onPress={searchMaps} />}
        <Text style={s.small}>New listings stay in this session and are not verified or shared with other users. Confirm qualifications, services and availability directly with the practice.</Text>
      </Page>
      <Sheet visible={showForm} title={editingId ? 'Edit your practice' : 'List your practice'} onClose={() => setShowForm(false)}>
        <Text style={s.small}>Describe your practice and the services farmers can contact you for. This saves a session preview.</Text>
        <Field label="Practice or facility name *" value={draft.name} onChangeText={value => updateDraft('name', value)} placeholder="Your veterinary practice" />
        <Field label="Practitioner or team name *" value={draft.practitioner} onChangeText={value => updateDraft('practitioner', value)} placeholder="Practitioner or team" />
        <Text style={s.small}>Practice type</Text>
        <View style={styles.services}>{careCategories.map(option => <Pill key={option.id} text={option.label} active={draft.category === option.id} onPress={() => updateDraft('category', option.id)} />)}</View>
        <Field label="Town / county *" value={draft.town} onChangeText={value => updateDraft('town', value)} placeholder="Town and county" />
        <Field label="Address / landmark *" value={draft.address} onChangeText={value => updateDraft('address', value)} placeholder="Street, building or landmark" />
        <Field label="Contact phone *" value={draft.phone} onChangeText={value => updateDraft('phone', value)} placeholder="+254712345678" />
        <Field label="Services offered *" value={draft.services} onChangeText={value => updateDraft('services', value)} placeholder="Consultations, vaccinations, poultry care…" multiline />
        <Text style={s.small}>Separate services with commas or new lines.</Text>
        <Field label="About your practice" value={draft.description} onChangeText={value => updateDraft('description', value)} placeholder="Animals or crops you work with, experience and service area" multiline />
        <Field label="Opening hours" value={draft.hours} onChangeText={value => updateDraft('hours', value)} placeholder="Mon–Sat, 8am–5pm; appointments available" />
        <Field label="Fees / pricing" value={draft.fees} onChangeText={value => updateDraft('fees', value)} placeholder="Include currency, or ask for a quote" />
        <View style={s.between}><Text style={s.text}>Farm visits available</Text><Switch accessibilityLabel="Offer farm visits" value={draft.farmVisits} onValueChange={value => updateDraft('farmVisits', value)} /></View>
        {!!formError && <Text accessibilityRole="alert" style={s.text}>{formError}</Text>}
        <Button title={editingId ? 'Save changes' : 'Save practice listing'} icon="checkmark-outline" onPress={save} />
        {editingId && <Button title="Remove listing" secondary icon="trash-outline" onPress={() => { setShowForm(false); setDeleteId(editingId); }} />}
      </Sheet>
      <Sheet visible={!!detail} title={detail?.name ?? 'Practice details'} onClose={() => setDetailId(undefined)}>
        {detail && (
          <>
            <Text style={s.small}>{detail.sample ? 'Example card — not a real provider.' : 'Session listing — details provided by you.'}</Text>
            <Text style={s.sectionTitle}>{detail.practitioner}</Text>
            <Text style={s.text}>{detail.description || 'Contact the practice for more information.'}</Text>
            <Text style={s.sectionTitle}>Services offered</Text>
            {detail.services.map(service => <View key={service} style={s.row}><Icon name="checkmark-circle-outline" size={18} /><Text style={[s.text, styles.screen]}>{service}</Text></View>)}
            <Text style={s.sectionTitle}>Location & availability</Text>
            <Text style={s.text}>{[detail.address, detail.town].filter(Boolean).join(', ')}</Text>
            <Text style={s.text}>{detail.hours || 'Contact for opening hours'}</Text>
            <Text style={s.text}>{detail.farmVisits ? 'Farm visits available — contact to arrange.' : 'Contact the practice to arrange a visit.'}</Text>
            <Text style={s.sectionTitle}>Fees</Text>
            <Text style={s.text}>{detail.fees || 'Ask for a quote'}</Text>
            {!detail.sample && (
              <>
                <Text selectable style={s.text}>{detail.phone}</Text>
                <Button title="Call practice" icon="call-outline" onPress={() => void openLink('tel:' + detail.phone)} />
                <Button title="View location in Maps" secondary icon="map-outline" onPress={() => void openLink('https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([detail.name, detail.address, detail.town].join(', ')))} />
              </>
            )}
            {!!notice && <Text accessibilityRole="alert" style={s.small}>{notice}</Text>}
          </>
        )}
      </Sheet>
      <Sheet visible={!!deleteId} title="Remove this listing?" onClose={() => setDeleteId(undefined)}>
        <Text style={s.text}>This removes the practice and its services from your session directory.</Text>
        <Button title="Remove listing" onPress={() => { setVetListings(previous => previous.filter(listing => listing.id !== deleteId)); setDeleteId(undefined); setDetailId(undefined); setNotice('Listing removed.'); }} />
        <Button title="Keep listing" secondary onPress={() => setDeleteId(undefined)} />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  segment: { flex: 1, flexDirection: 'row', borderRadius: 12, padding: 4 },
  segmentItem: { flex: 1, flexDirection: 'row', gap: 5, alignItems: 'center', justifyContent: 'center', padding: 10, borderRadius: 8 },
  listingCount: { flexDirection: 'row', gap: 3, alignItems: 'center', minHeight: 44 },
  search: { flexDirection: 'row', gap: 9, alignItems: 'center', paddingHorizontal: 14, borderRadius: 13 },
  searchInput: { flex: 1, fontSize: 13, paddingVertical: 14 },
  banner: { height: 135, borderRadius: 16, overflow: 'hidden' },
  bannerShade: { flex: 1, backgroundColor: 'rgba(5,27,15,0.72)', padding: 16, gap: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  product: { width: '47%', flexGrow: 1, borderRadius: 16, overflow: 'hidden', maxWidth: '49%' },
  productImage: { width: '100%', height: 135 },
  productBadge: { position: 'absolute', top: 8, left: 8, fontSize: 10, paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10 },
  add: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  services: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
