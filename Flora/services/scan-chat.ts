import type { ScanEntry } from '@/contexts/agent-data-context';
import { buildCareReply } from './care-guidance';

export function scanChatText(scan: ScanEntry) {
  const sections = [
    'Preview scan result — not a confirmed diagnosis.',
    scan.result,
    scan.description,
    scan.confidence !== 'Not assessed' ? `Model confidence (preview): ${scan.confidence}` : undefined,
    scan.treatment?.length ? `Care guidance\n${scan.treatment.map(step => `• ${step}`).join('\n')}` : undefined,
    scan.prevention?.length ? `Prevention\n${scan.prevention.map(step => `• ${step}`).join('\n')}` : undefined,
    !scan.treatment?.length ? buildCareReply(scan.mode) : undefined,
  ];
  return sections.filter(Boolean).join('\n\n');
}
