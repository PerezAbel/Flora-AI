export type CareMode = 'crop' | 'animal';

export function buildCareReply(mode: CareMode) {
  const guidance = careGuidance[mode];
  return [
    'General care guidance — not a diagnosis. Photos have not been analyzed.',
    'Care & remedies',
    ...guidance.steps,
    'Medicines & treatment options',
    guidance.medicines,
    'When to act & treatment duration',
    guidance.timing,
    'Recommended professional',
    guidance.professional,
  ].join('\n\n');
}

export const careGuidance = {
  crop: {
    professional: 'Agronomist or plant diagnostic service',
    search: 'agronomist',
    steps: [
      'Photograph the whole plant and both sides of affected leaves. Note how many plants are affected and when symptoms started.',
      'Check soil moisture, drainage, recent weather and any fertilizer or spray changes. Similar symptoms can have different causes.',
      'Ask a plant specialist to identify the cause before choosing a pesticide or other treatment.',
    ],
    medicines: 'No pesticide or remedy can be selected from this intake alone. After identifying the cause, use only a product labeled for that crop and pest; check application intervals, re-entry and harvest restrictions.',
    timing: 'Treatment duration and time to crop damage are not estimated. They depend on the confirmed cause, crop stage and conditions. Ask the specialist when to start, when to reassess, and what worsening signs require earlier action.',
    source: 'UC IPM · Diagnosing plant problems',
    url: 'https://ipm.ucanr.edu/agriculture/floriculture-and-ornamental-nurseries/diagnosing-plant-problems/',
  },
  animal: {
    professional: 'Veterinarian or veterinary hospital',
    search: 'vet',
    steps: [
      'Record the species, age, symptoms, onset, appetite changes and any medicines already given for the veterinarian.',
      'Contact a veterinarian for an assessment. Photos alone cannot establish the cause or the correct treatment.',
      'Do not give medicines or induce vomiting unless directed by a veterinarian.',
    ],
    medicines: 'A veterinarian needs to select the medicine, dose and course for the species, weight and diagnosis. For food-producing animals, also request milk, meat and egg withdrawal instructions.',
    timing: 'A safe treatment duration or time before permanent harm cannot be predicted here. Ask the veterinarian for a treatment schedule and reassessment time. Breathing difficulty or suspected poisoning needs urgent veterinary help.',
    source: 'AVMA · Pet first aid',
    url: 'https://ebusiness.avma.org/files/ProductDownloads/mcm-client-brochures-pet-first-aid-2025.pdf',
  },
} satisfies Record<CareMode, { professional: string; search: string; steps: string[]; medicines: string; timing: string; source: string; url: string }>;
