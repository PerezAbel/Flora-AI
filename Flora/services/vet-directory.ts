export const careCategories = [
  { id: 'vet', label: 'Vets', icon: 'paw-outline', query: 'veterinarian animal hospital' },
  { id: 'hospital', label: 'Animal hospitals', icon: 'medical-outline', query: 'emergency veterinary hospital' },
  { id: 'agronomist', label: 'Plant doctors', icon: 'leaf-outline', query: 'agronomist plant clinic' },
  { id: 'pharmacy', label: 'Vet pharmacies', icon: 'bag-add-outline', query: 'veterinary pharmacy' },
  { id: 'agrovet', label: 'Agrovets', icon: 'storefront-outline', query: 'agrovet' },
] as const;

export type CareCategory = typeof careCategories[number]['id'];
export type VetListing = {
  id: string;
  name: string;
  practitioner: string;
  category: CareCategory;
  town: string;
  address: string;
  phone: string;
  services: string[];
  description: string;
  hours: string;
  fees: string;
  farmVisits: boolean;
  sample: boolean;
};

export const sampleVetListings: VetListing[] = [
  {
    id: 'sample-vet', name: 'Example Farm Veterinary Practice', practitioner: 'Example veterinary team',
    category: 'vet', town: 'Sample town', address: '', phone: '',
    services: ['Livestock consultations', 'Vaccination', 'Poultry care', 'Farm visits'],
    description: 'An example of how a veterinary practice and its services appear to farmers.',
    hours: 'Hours provided by the practice', fees: 'Ask for a quote', farmVisits: true, sample: true,
  },
  {
    id: 'sample-plant', name: 'Example Plant Health Clinic', practitioner: 'Example crop specialist',
    category: 'agronomist', town: 'Sample town', address: '', phone: '',
    services: ['Plant health assessment', 'Soil sampling', 'Pest management advice'],
    description: 'An example listing for an agronomist or plant diagnostic service.',
    hours: 'By appointment', fees: 'Ask for a quote', farmVisits: false, sample: true,
  },
];
