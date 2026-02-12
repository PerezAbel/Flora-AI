import SectionScreen from '@/components/section-screen';
import { useLanguage } from '@/contexts/language-context';

export default function AnimalWellBeingScreen() {
  const { tr } = useLanguage();

  return (
    <SectionScreen
      title={tr('Agent Animal Well Being')}
      body={tr('Monitor livestock health notes, environment warnings, and care recommendations.')}
    />
  );
}
