import type { AgentMode, AlertLevel } from '@/contexts/agent-data-context';
import { DEMO_RESULTS } from './demo-data';

export type InferenceResult = {
  label: string;
  confidence: number; // 0-1 or 0-100
  description?: string;
  risk?: AlertLevel;
  recommendation?: string;
  treatment?: string[];
  prevention?: string[];
  alternatives?: Array<{ label: string; confidence: number; description?: string }>;
};

const MODEL_MAP: Record<AgentMode, { endpoint: string; modelId: string }> = {
  // Animal agent bundles cattle + poultry weights on the server
  animal: { endpoint: '/predict/animal', modelId: 'animal' },
  crop: { endpoint: '/predict/plant', modelId: 'plant' },
};

const BASE_URL = process.env.EXPO_PUBLIC_INFERENCE_URL || 'http://localhost:8000';
const AUTH_TOKEN = process.env.EXPO_PUBLIC_INFERENCE_TOKEN;
const TIMEOUT_MS = 10000;
// Hardcode agents to use demo responses only (no network calls).
const DEMO_MODE = true;

function normalizeConfidence(raw: number | undefined): number {
  if (raw === undefined || Number.isNaN(raw)) return 0.75; // sensible default
  // Accept either 0-1 or 0-100
  return raw > 1 ? Math.min(raw / 100, 1) : Math.min(Math.max(raw, 0), 1);
}

function keywordScore(text: string, haystack: string): number {
  return text
    .replace(/[^a-z0-9 ]/gi, ' ')
    .toLowerCase()
    .split(' ')
    .filter((w) => w.length >= 3)
    .reduce((score, w) => (haystack.includes(w) ? score + 1 : score), 0);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function randomTripleByMode(mode: AgentMode) {
  const pool = DEMO_RESULTS.filter((r) => r.mode === mode);
  return shuffle(pool).slice(0, 3);
}

function findDemoInference(mode: AgentMode, imageUri?: string): InferenceResult | null {
  const uriLower = (imageUri || '').toLowerCase();
  const filename = imageUri?.split('/').pop() ?? '';
  const lower = filename.toLowerCase();
  const candidates = DEMO_RESULTS.filter((r) => r.mode === mode);
  if (!candidates.length) return null;

  const scored = candidates
    .map((r) => {
      let score = 0;
      const sourceBase = decodeURIComponent(r.source.split('/').pop() || '').toLowerCase();
      if (lower.includes(r.id.toLowerCase())) score += 3;
      if (lower.includes(sourceBase)) score += 3;
      if (uriLower.includes(r.source.toLowerCase())) score += 4; // direct URL match
      score += keywordScore(r.mostLikely, lower);
      const extraKeywords = ['rust', 'blight', 'mosaic', 'blast', 'fmd', 'pox', 'bumble', 'lumpy'];
      extraKeywords.forEach((k) => {
        if (lower.includes(k) && r.mostLikely.toLowerCase().includes(k)) score += 2;
      });
      return { ref: r, score };
    })
    .sort((a, b) => b.score - a.score);

  const bestScore = scored[0]?.score ?? 0;
  const topThree = bestScore > 2 ? scored.slice(0, 3).map(({ ref }) => ref) : randomTripleByMode(mode);

  const best = topThree[0];

  if (bestScore === 0 && !DEMO_MODE) return null;
  const confidence = normalizeConfidence(parseFloat(best.confidence));
  return {
    label: best.mostLikely,
    confidence,
    description: best.why,
    risk: confidence > 0.88 ? 'High' : confidence > 0.75 ? 'Medium' : 'Low',
    recommendation: `${best.treatment.join(' | ')}`,
    treatment: best.treatment,
    prevention: best.prevention,
    alternatives: topThree.map((alt) => ({
      label: alt.mostLikely,
      confidence: normalizeConfidence(parseFloat(alt.confidence)),
      description: alt.why,
    })),
  };
}

export async function runInference(mode: AgentMode, imageUri?: string): Promise<InferenceResult> {
  // Always return demo/hardcoded responses.
  const demo = findDemoInference(mode, imageUri);
  if (demo) return demo;

  // Fallback: random three by mode to avoid repetitive healthy default.
  const randomTop = randomTripleByMode(mode);
  const primary = randomTop[0];
  return {
    label: primary?.mostLikely ?? (mode === 'crop' ? 'Crop disease (demo)' : 'Animal condition (demo)'),
    confidence: normalizeConfidence(parseFloat(primary?.confidence ?? '0.8')),
    description: primary?.why,
    risk: 'Medium',
    recommendation: primary?.treatment?.join(' | '),
    treatment: primary?.treatment,
    prevention: primary?.prevention,
    alternatives: randomTop.map((alt) => ({
      label: alt.mostLikely,
      confidence: normalizeConfidence(parseFloat(alt.confidence)),
      description: alt.why,
    })),
  };
}
