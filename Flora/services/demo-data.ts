export type DemoResult = {
  id: string;
  source: string;
  mode: 'animal' | 'crop';
  mostLikely: string;
  confidence: string;
  why: string;
  treatment: string[];
  prevention: string[];
};

export const DEMO_RESULTS: DemoResult[] = [
  {
    id: 'img1-chicken-foot',
    source: 'https://commons.wikimedia.org/wiki/Special:FilePath/Pododermatitis%20%28Bumblefoot%29%20in%20a%20rooster.jpg',
    mode: 'animal',
    mostLikely: 'Bumblefoot / pododermatitis',
    confidence: '0.93',
    why: 'Dark plantar scab on footpad; mild swelling consistent with bumblefoot.',
    treatment: [
      'Clean lesion, keep foot dry and bandaged',
      'Address perch/ground trauma',
      'Vet care for deep swelling/abscess (analgesia ± antibiotics per severity)',
    ],
    prevention: ['Keep litter clean/dry', 'Remove sharp wires/rough perches', 'Regular foot checks, especially in heavy birds'],
  },
  {
    id: 'img2-black-chicken-face',
    source: 'https://commons.wikimedia.org/wiki/Special:FilePath/Village%20poultry%205%20%284332620680%29.jpg',
    mode: 'animal',
    mostLikely: 'Dry fowlpox (cutaneous avian pox)',
    confidence: '0.96',
    why: 'Multiple wart-like crusts on comb/face—classic dry pox distribution.',
    treatment: ['No direct antiviral; isolate affected birds', 'Supportive care; manage secondary infections', 'Vaccinate flock where indicated (preventive, not curative)'],
    prevention: ['Vaccination in endemic areas', 'Biosecurity and traffic control', 'Mosquito/insect control'],
  },
  {
    id: 'img3-rooster-grass',
    source: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rooster04%20adjusted.jpg',
    mode: 'animal',
    mostLikely: 'Mild ectoparasites (lice/mites)',
    confidence: '0.82',
    why: 'Feathering slightly ruffled; common subclinical sign in free-range poultry.',
    treatment: ['Topical pyrethrin or approved poultry dust', 'Sanitize coop/bedding'],
    prevention: ['Regular coop cleaning', 'Periodic dusting or spraying per label'],
  },
  {
    id: 'img4-brown-cow-blue-wall',
    source: 'https://commons.wikimedia.org/wiki/Special:FilePath/Brown%20cow%20in%20a%20field.jpg',
    mode: 'animal',
    mostLikely: 'Early photosensitization risk',
    confidence: '0.8',
    why: 'Sun-exposed areas at risk; no lesions yet but flagging as precaution.',
    treatment: ['Provide shade', 'Remove photosensitizing plants'],
    prevention: ['Manage pasture weeds', 'Supplement with antioxidants as advised'],
  },
  {
    id: 'img5-white-cattle-nodules',
    source: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lumpy%20Skin%20Disease%2001.jpg',
    mode: 'animal',
    mostLikely: 'Lumpy skin disease (LSD)',
    confidence: '0.9',
    why: 'Multiple raised nodules over body—hallmark of LSD.',
    treatment: ['Vet confirmation (PCR/virus isolation)', 'Supportive care; isolate case', 'Herd-level outbreak control per authority guidance'],
    prevention: ['Vaccination', 'Vector control (biting insects)', 'Quarantine/movement control, hygiene'],
  },
  {
    id: 'img6-brown-calf-nodules',
    source: 'https://commons.wikimedia.org/wiki/Special:FilePath/Lumpy%20Skin%20Disease%2001.jpg',
    mode: 'animal',
    mostLikely: 'Lumpy skin disease (LSD)',
    confidence: '0.85',
    why: 'Widespread raised nodules; pattern fits LSD.',
    treatment: ['Confirm by PCR', 'Isolate suspect animal; supportive care', 'Initiate herd control/vaccination per vet authority'],
    prevention: ['Vaccination', 'Vector control', 'Quarantine/movement restriction'],
  },
  {
    id: 'img7-cattle-oral-lesions',
    source: 'https://commons.wikimedia.org/wiki/Special:FilePath/Foot%20and%20mouth%20disease%20in%20mouth.jpg',
    mode: 'animal',
    mostLikely: 'Foot-and-mouth disease (FMD)',
    confidence: '0.97',
    why: 'Severe oral erosions with profuse saliva—classic FMD.',
    treatment: ['No specific antiviral; supportive care only in endemic settings', 'Follow official control policy (often movement control/culling in FMD-free regions)'],
    prevention: ['Immediate isolation and movement stop', 'Notify veterinarian/animal health authority', 'Vaccination only per official program', 'Strict biosecurity and disinfection'],
  },
  {
    id: 'crop-maize-rust',
    source: 'https://commons.wikimedia.org/wiki/Special:FilePath/Puccinia%20sorghi%20Schwein.%201538032.jpg',
    mode: 'crop',
    mostLikely: 'Maize leaf rust',
    confidence: '0.91',
    why: 'Orange-brown pustules scattered on leaf surface with chlorotic halos.',
    treatment: ['Apply triazole or strobilurin fungicide per label', 'Remove heavily infected leaves if localized', 'Rotate with non-host crops'],
    prevention: ['Use rust-resistant maize hybrids', 'Avoid dense planting and improve airflow', 'Scout weekly during humid periods'],
  },
  {
    id: 'crop-tomato-blight',
    source: 'https://commons.wikimedia.org/wiki/Special:FilePath/Alternaria%20solani%20-%20leaf%20lesions.jpg',
    mode: 'crop',
    mostLikely: 'Tomato early blight',
    confidence: '0.88',
    why: 'Target-shaped concentric rings on older leaves with yellow margins.',
    treatment: ['Apply chlorothalonil or copper fungicide promptly', 'Prune lower leaves, stake plants to reduce splash', 'Remove infected debris'],
    prevention: ['Use disease-free seed/seedlings', 'Mulch to reduce soil splash', 'Rotate nightshades at least 2-3 years'],
  },
  {
    id: 'crop-cassava-mosaic',
    source: 'https://commons.wikimedia.org/wiki/Special:FilePath/Manihot%20esculenta%20flowers.jpg',
    mode: 'crop',
    mostLikely: 'Cassava mosaic disease (CMD)',
    confidence: '0.9',
    why: 'Mottled light-and-dark green mosaic with leaf distortion on cassava.',
    treatment: ['Rogue and destroy severely infected plants', 'Replant with certified virus-free cuttings'],
    prevention: ['Plant CMD-resistant varieties', 'Control whiteflies where feasible', 'Avoid moving infected cuttings between fields'],
  },
  {
    id: 'crop-rice-blast',
    source: 'https://commons.wikimedia.org/wiki/Special:FilePath/Rice%20blast%20Magnaporthe%20grisea.jpg',
    mode: 'crop',
    mostLikely: 'Rice blast',
    confidence: '0.89',
    why: 'Spindle-shaped lesions with gray centers and brown borders on rice leaves.',
    treatment: ['Apply blast-labeled fungicide at early lesion detection', 'Balance nitrogen—avoid over-fertilization', 'Improve drainage to reduce leaf wetness'],
    prevention: ['Use blast-resistant cultivars', 'Seed treatment with fungicide where recommended', 'Maintain field sanitation and manage volunteer rice'],
  },
];
