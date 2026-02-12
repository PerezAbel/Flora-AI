import SectionScreen from '@/components/section-screen';
import { useLanguage } from '@/contexts/language-context';

export default function SettingsScreen() {
  const { tr } = useLanguage();

  return (
    <SectionScreen
      title={tr('Agent Settings')}
      body={tr('Configure detection sensitivity, notification channels, and preferred intervention style.')}
    />
  );
}
