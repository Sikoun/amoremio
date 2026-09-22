export type PartnerId = 'partner1' | 'partner2';

export type PetType = 'sealion' | 'lion' | 'bear' | 'bunny' | 'cat' | 'fox' | 'panda' | 'penguin';

export const PET_EMOJIS: Record<PetType, string> = {
  sealion: '🦭',
  lion: '🦁',
  bear: '🐻',
  bunny: '🐰',
  cat: '🐱',
  fox: '🦊',
  panda: '🐼',
  penguin: '🐧',
};

export type PetAccessoryHead =
  | 'none'
  | 'crown'
  | 'bow'
  | 'flower'
  | 'cap'
  | 'tophat'
  | 'sunglasses'
  | 'sprout'
  | 'party_hat'
  | 'halo';

export type PetAccessoryNeck =
  | 'none'
  | 'scarf'
  | 'bell'
  | 'bowtie'
  | 'heart_locket'
  | 'bandana';

export interface PetColorPalette {
  id: string;
  name: string;
  hex: string; // Swatch display color
  primary: string;
  secondary: string;
  accent: string;
}

export interface PetCustomization {
  species: PetType;
  colorShade: string; // matches id in PET_COLOR_PALETTES[species]
  headAccessory: PetAccessoryHead;
  neckAccessory: PetAccessoryNeck;
}

export const HEAD_ACCESSORIES: { id: PetAccessoryHead; label: string; icon: string }[] = [
  { id: 'none', label: 'None', icon: '✕' },
  { id: 'crown', label: 'Royal Crown', icon: '👑' },
  { id: 'bow', label: 'Pink Ribbon', icon: '🎀' },
  { id: 'flower', label: 'Sakura Blossom', icon: '🌸' },
  { id: 'cap', label: 'Baseball Cap', icon: '🧢' },
  { id: 'tophat', label: 'Top Hat', icon: '🎩' },
  { id: 'sunglasses', label: 'Cool Shades', icon: '🕶️' },
  { id: 'sprout', label: 'Kawaii Sprout', icon: '🌱' },
  { id: 'party_hat', label: 'Party Hat', icon: '🥳' },
  { id: 'halo', label: 'Angel Halo', icon: '✨' },
];

export const NECK_ACCESSORIES: { id: PetAccessoryNeck; label: string; icon: string }[] = [
  { id: 'none', label: 'None', icon: '✕' },
  { id: 'scarf', label: 'Cozy Scarf', icon: '🧣' },
  { id: 'bell', label: 'Gold Bell', icon: '🔔' },
  { id: 'bowtie', label: 'Dapper Bowtie', icon: '👔' },
  { id: 'heart_locket', label: 'Heart Locket', icon: '💖' },
  { id: 'bandana', label: 'Bandana', icon: '🤠' },
];

export const PET_COLOR_PALETTES: Record<PetType, PetColorPalette[]> = {
  sealion: [
    { id: 'default', name: 'Lavender Ice', hex: '#a5b4fc', primary: '#c7d2fe', secondary: '#a5b4fc', accent: '#818cf8' },
    { id: 'mint', name: 'Ocean Mint', hex: '#6ee7b7', primary: '#a7f3d0', secondary: '#6ee7b7', accent: '#34d399' },
    { id: 'rose', name: 'Blush Pearl', hex: '#f472b6', primary: '#fbcfe8', secondary: '#f472b6', accent: '#ec4899' },
    { id: 'peach', name: 'Coral Sunset', hex: '#fb923c', primary: '#fed7aa', secondary: '#fb923c', accent: '#f97316' },
    { id: 'navy', name: 'Deep Midnight', hex: '#64748b', primary: '#94a3b8', secondary: '#64748b', accent: '#475569' },
    { id: 'snow', name: 'Arctic Snow', hex: '#e2e8f0', primary: '#f8fafc', secondary: '#e2e8f0', accent: '#cbd5e1' },
  ],
  lion: [
    { id: 'default', name: 'Golden Sun', hex: '#f59e0b', primary: '#fbbf24', secondary: '#d97706', accent: '#92400e' },
    { id: 'amber', name: 'Ruby Amber', hex: '#ea580c', primary: '#f97316', secondary: '#dc2626', accent: '#991b1b' },
    { id: 'caramel', name: 'Toffee Caramel', hex: '#b45309', primary: '#d97706', secondary: '#92400e', accent: '#78350f' },
    { id: 'rose', name: 'Rose Gold', hex: '#f472b6', primary: '#fbcfe8', secondary: '#f472b6', accent: '#db2777' },
    { id: 'slate', name: 'Shadow Charcoal', hex: '#475569', primary: '#64748b', secondary: '#334155', accent: '#1e293b' },
    { id: 'snow', name: 'White Lion', hex: '#e2e8f0', primary: '#f8fafc', secondary: '#e2e8f0', accent: '#94a3b8' },
  ],
  bear: [
    { id: 'default', name: 'Grizzly Brown', hex: '#92400e', primary: '#92400e', secondary: '#fed7aa', accent: '#78350f' },
    { id: 'chocolate', name: 'Dark Cocoa', hex: '#451a03', primary: '#78350f', secondary: '#fed7aa', accent: '#451a03' },
    { id: 'milktea', name: 'Milk Tea Honey', hex: '#d97706', primary: '#d97706', secondary: '#fef3c7', accent: '#b45309' },
    { id: 'polar', name: 'Polar White', hex: '#e2e8f0', primary: '#f8fafc', secondary: '#fed7aa', accent: '#cbd5e1' },
    { id: 'pink', name: 'Strawberry Bear', hex: '#f472b6', primary: '#f472b6', secondary: '#fce7f3', accent: '#db2777' },
  ],
  bunny: [
    { id: 'default', name: 'Cotton Cloud', hex: '#ffffff', primary: '#ffffff', secondary: '#fecdd3', accent: '#fda4af' },
    { id: 'peach', name: 'Sweet Peach', hex: '#fed7aa', primary: '#ffedd5', secondary: '#fed7aa', accent: '#fb923c' },
    { id: 'lavender', name: 'Lilac Dream', hex: '#e9d5ff', primary: '#f3e8ff', secondary: '#d8b4fe', accent: '#a855f7' },
    { id: 'mint', name: 'Matcha Frost', hex: '#a7f3d0', primary: '#d1fae5', secondary: '#6ee7b7', accent: '#10b981' },
    { id: 'choco', name: 'Choco Bunny', hex: '#78350f', primary: '#92400e', secondary: '#fef3c7', accent: '#78350f' },
  ],
  cat: [
    { id: 'default', name: 'Ginger Marmalade', hex: '#ea580c', primary: '#ea580c', secondary: '#ffedd5', accent: '#c2410c' },
    { id: 'calico', name: 'Pastel Calico', hex: '#fed7aa', primary: '#fed7aa', secondary: '#ffffff', accent: '#fb923c' },
    { id: 'tuxedo', name: 'Midnight Onyx', hex: '#18181b', primary: '#27272a', secondary: '#ffffff', accent: '#09090b' },
    { id: 'blue', name: 'Russian Silver', hex: '#64748b', primary: '#94a3b8', secondary: '#e2e8f0', accent: '#475569' },
    { id: 'pink', name: 'Sakura Kitten', hex: '#fbcfe8', primary: '#fbcfe8', secondary: '#fdf2f8', accent: '#f472b6' },
  ],
  fox: [
    { id: 'default', name: 'Autumn Ember', hex: '#ea580c', primary: '#ea580c', secondary: '#ffffff', accent: '#c2410c' },
    { id: 'crimson', name: 'Maple Crimson', hex: '#dc2626', primary: '#dc2626', secondary: '#ffffff', accent: '#991b1b' },
    { id: 'arctic', name: 'Arctic Frost', hex: '#f1f5f9', primary: '#f8fafc', secondary: '#ffffff', accent: '#cbd5e1' },
    { id: 'shadow', name: 'Midnight Shadow', hex: '#334155', primary: '#475569', secondary: '#ffffff', accent: '#1e293b' },
    { id: 'golden', name: 'Golden Wheat', hex: '#d97706', primary: '#f59e0b', secondary: '#ffffff', accent: '#b45309' },
  ],
  panda: [
    { id: 'default', name: 'Classic Panda', hex: '#18181b', primary: '#ffffff', secondary: '#18181b', accent: '#18181b' },
    { id: 'redpanda', name: 'Red Panda Spice', hex: '#d97706', primary: '#ea580c', secondary: '#78350f', accent: '#451a03' },
    { id: 'bamboo', name: 'Bamboo Mint', hex: '#86efac', primary: '#ffffff', secondary: '#22c55e', accent: '#15803d' },
    { id: 'lavender', name: 'Lavender Panda', hex: '#c084fc', primary: '#ffffff', secondary: '#9333ea', accent: '#6b21a8' },
    { id: 'pink', name: 'Sakura Panda', hex: '#f472b6', primary: '#ffffff', secondary: '#ec4899', accent: '#be185d' },
  ],
  penguin: [
    { id: 'default', name: 'Classic Tuxedo', hex: '#0f172a', primary: '#0f172a', secondary: '#ffffff', accent: '#f59e0b' },
    { id: 'royal', name: 'Royal Sapphire', hex: '#1e3a8a', primary: '#1e40af', secondary: '#ffffff', accent: '#f59e0b' },
    { id: 'emerald', name: 'Emerald Wave', hex: '#064e3b', primary: '#065f46', secondary: '#ffffff', accent: '#f59e0b' },
    { id: 'violet', name: 'Cosmic Violet', hex: '#581c87', primary: '#6b21a8', secondary: '#ffffff', accent: '#f59e0b' },
    { id: 'ice', name: 'Glacier Blue', hex: '#0369a1', primary: '#0284c7', secondary: '#ffffff', accent: '#f59e0b' },
  ],
};

export interface Partner {
  id: PartnerId;
  name: string;
  nickname: string;
  avatarEmoji: string;
  pet?: PetType;
  customPet?: PetCustomization;
  mood: string;
  moodEmoji: string;
  lastActive: string;
}

export interface Question {
  id: string;
  text: string;
  category: 'romantic' | 'deep' | 'fun' | 'memories' | 'spicy';
  date: string; // YYYY-MM-DD
}

export interface QuestionAnswer {
  text: string;
  answeredAt: string;
}

export interface DailyAnswers {
  questionId: string;
  date: string;
  partner1?: QuestionAnswer;
  partner2?: QuestionAnswer;
}

export interface Poke {
  id: string;
  from: PartnerId;
  message: string;
  emoji: string;
  timestamp: string;
}

export interface CoupleData {
  anniversaryDate: string; // YYYY-MM-DD
  partner1: Partner;
  partner2: Partner;
  dailyQuestions: Record<string, Question>;
  answers: Record<string, DailyAnswers>; // keyed by date YYYY-MM-DD
  recentPokes: Poke[];
}

