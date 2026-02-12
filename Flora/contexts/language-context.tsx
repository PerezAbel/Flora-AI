import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

type Language = 'en' | 'sw';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  tr: (text: string) => string;
};

const sw: Record<string, string> = {
  Home: 'Nyumbani',
  Dashboard: 'Dashibodi',
  Alerts: 'Tahadhari',
  Profile: 'Wasifu',
  'Farmer Profile': 'Wasifu wa Mkulima',
  'App Version 1.0.0': 'Toleo la Programu 1.0.0',
  'Farm Profile': 'Wasifu wa Shamba',
  'Field Zones': 'Kanda za Shamba',
  'Crop Monitoring Schedule': 'Ratiba ya Ufuatiliaji wa Mazao',
  'Disease Alert Preferences': 'Mipangilio ya Tahadhari za Magonjwa',
  'Weather Units': 'Vipimo vya Hali ya Hewa',
  'Scan History': 'Historia ya Uchanganuzi',
  'Data Sync': 'Usawazishaji wa Data',
  'Privacy and Data': 'Faragha na Data',
  'Farmer Help and Support': 'Msaada kwa Mkulima',
  Logout: 'Toka',
  'Language Settings': 'Mipangilio ya Lugha',
  'Crop Agent': 'Wakala wa Mazao',
  'Animal Agent': 'Wakala wa Mifugo',
  'Application Updates': 'Masasisho ya Programu',
  'Current version: v1.0.0': 'Toleo la sasa: v1.0.0',
  'Last update: Security patch applied': 'Sasisho la mwisho: kiraka cha usalama kimewekwa',
  'Missed Notifications': 'Arifa Ulizokosa',
  'Leaf Rust risk rose to Medium': 'Hatari ya kutu ya majani imepanda hadi Kati',
  'Rainfall alert: heavy rain expected tomorrow': 'Tahadhari ya mvua: mvua kubwa inatarajiwa kesho',
  'Hi William!': 'Habari William!',
  'How can I help you today?': 'Ninawezaje kukusaidia leo?',
  'Ask anything...': 'Uliza chochote...',
  'Quick Actions': 'Vitendo vya Haraka',
  Scanning: 'Kuchanganua',
  'Scan crop or animal for early warning signs': 'Changanua zao au mnyama kwa dalili za mapema',
  'Upload Snapshot': 'Pakia Picha',
  'Upload photo for disease analysis': 'Pakia picha kwa uchambuzi wa ugonjwa',
  'Live Agent Monitoring': 'Ufuatiliaji wa Moja kwa Moja',
  'Track active field checks in real-time': 'Fuatilia ukaguzi wa shamba kwa wakati halisi',
  'Overall Risk Level': 'Kiwango cha Hatari kwa Ujumla',
  Medium: 'Kati',
  'Last updated: Today': 'Imesasishwa mwisho: Leo',
  'Recent Alerts': 'Tahadhari za Hivi Karibuni',
  'View Details': 'Tazama Maelezo',
  'Alert Details': 'Maelezo ya Tahadhari',
  'Scan Information': 'Taarifa za Uchanganuzi',
  'Recommended Action': 'Hatua Inayopendekezwa',
  'Detected: ': 'Iligunduliwa: ',
  'Next check: ': 'Ukaguzi unaofuata: ',
  'Crop Disease Analysis': 'Uchambuzi wa Magonjwa ya Mazao',
  'Animal Health Analysis': 'Uchambuzi wa Afya ya Mifugo',
  Crop: 'Mazao',
  Animal: 'Mifugo',
  'Check View Scan History': 'Angalia Historia ya Uchanganuzi',
  'Farmer Actions': 'Hatua za Mkulima',
  'Choose Language': 'Chagua Lugha',
  'Select your preferred app language. Changes apply immediately.':
    'Chagua lugha unayopendelea. Mabadiliko yataonekana mara moja.',
  English: 'Kiingereza',
  Swahili: 'Kiswahili',
  Selected: 'Imechaguliwa',
  'Welcome back': 'Karibu tena',
  Email: 'Barua pepe',
  Password: 'Nenosiri',
  'Log In': 'Ingia',
  'Need an account? Sign Up': 'Unahitaji akaunti? Jisajili',
  'Create account': 'Fungua akaunti',
  'Full name': 'Jina kamili',
  'Sign Up': 'Jisajili',
  'Already registered? Log In': 'Umeshajisajili? Ingia',
  'Your Reliable AI Farm Assistant': 'Msaidizi wako wa kuaminika wa shamba wa AI',
  'Get started with me': 'Anza nami',
  "Don't have an account yet?": 'Huna akaunti bado?',
  'No chat history yet for this agent.': 'Bado hakuna historia ya mazungumzo kwa wakala huyu.',
  'Chat not found. Start from Home to create a new conversation.':
    'Mazungumzo hayajapatikana. Anza kutoka Nyumbani kuunda mazungumzo mapya.',
  'Welcome to Flora AI': 'Karibu Flora AI',
  'Use the top-left selector to switch between Crop Agent and Animal Agent.':
    'Tumia kichaguzi cha juu kushoto kubadili kati ya Wakala wa Mazao na Wakala wa Mifugo.',
  'Use Quick Actions': 'Tumia Vitendo vya Haraka',
  'Tap the plus button in the input area to scan, upload snapshots, or start live monitoring.':
    'Gusa kitufe cha kuongeza kwenye sehemu ya kuandika ili kuchanganua, kupakia picha, au kuanza ufuatiliaji wa moja kwa moja.',
  'Check Dashboard': 'Angalia Dashibodi',
  'Open Dashboard to view crop and animal analytics, risk levels, and recommended actions.':
    'Fungua Dashibodi kuona uchambuzi wa mazao na mifugo, viwango vya hatari, na hatua zinazopendekezwa.',
  'Review Alerts': 'Kagua Tahadhari',
  'Go to Alerts to track current risks and tap View Details for scan-based recommendations.':
    'Nenda Tahadhari kufuatilia hatari za sasa na gusa Tazama Maelezo kwa mapendekezo ya uchanganuzi.',
  'Manage Profile Settings': 'Dhibiti Mipangilio ya Wasifu',
  'Use Profile to manage farm settings, language, privacy, and support options.':
    'Tumia Wasifu kudhibiti mipangilio ya shamba, lugha, faragha, na chaguo za msaada.',
  Step: 'Hatua',
  of: 'ya',
  Back: 'Nyuma',
  Skip: 'Ruka',
  Next: 'Ifuatayo',
  Done: 'Imekamilika',
  'Select an image from your device for disease analysis.':
    'Chagua picha kutoka kwenye kifaa chako kwa uchambuzi wa ugonjwa.',
  'Choose Image': 'Chagua Picha',
  'Image ready and synced to analytics': 'Picha iko tayari na imesawazishwa kwenye uchambuzi',
  'Snapshot uploaded and analyzed. Dashboard and Alerts updated.':
    'Picha imepakiwa na kuchambuliwa. Dashibodi na Tahadhari zimesasishwa.',
  'Image picker is unavailable in this offline build. Install expo-image-picker to enable device uploads.':
    'Kiteuzi cha picha hakipatikani kwenye toleo hili la nje ya mtandao. Sakinisha expo-image-picker kuwezesha upakiaji kutoka kifaa.',
  'Media permission denied. Please allow photo access.':
    'Ruhusa ya media imekataliwa. Tafadhali ruhusu ufikiaji wa picha.',
  'Point camera at crop leaves/stem and keep it steady.':
    'Elekeza kamera kwenye majani/shina la zao na ushike vizuri.',
  'Point camera at the animal and keep it steady for health cues.':
    'Elekeza kamera kwa mnyama na ushike vizuri kwa viashiria vya afya.',
  'Analyze Current Frame': 'Changanua Fremu ya Sasa',
  'Scan complete. Dashboard and Alerts have been updated.':
    'Uchanganuzi umekamilika. Dashibodi na Tahadhari zimesasishwa.',
  LIVE: 'MOJA KWA MOJA',
  PAUSED: 'IMESIMAMA',
  'Monitoring in progress. New analytics are being sent to Dashboard and Alerts.':
    'Ufuatiliaji unaendelea. Uchambuzi mpya unatumiwa kwenye Dashibodi na Tahadhari.',
  'Start monitoring to stream live field analysis updates.':
    'Anza ufuatiliaji ili kupokea masasisho ya moja kwa moja ya uchambuzi wa shamba.',
  'Updates sent:': 'Masasisho yaliyotumwa:',
  'Stop Monitoring': 'Simamisha Ufuatiliaji',
  'Start Monitoring': 'Anza Ufuatiliaji',
  'Open Dashboard': 'Fungua Dashibodi',
  'Open Alerts': 'Fungua Tahadhari',
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      tr: (text: string) => {
        if (language === 'en') return text;
        return sw[text] ?? text;
      },
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
