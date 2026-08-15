import { Theme } from '@/types';

export const THEME_ACCENTS: Record<Theme, { primary: string; secondary: string; label: string }> = {
  love: {
    primary: '#8a2f4c',
    secondary: '#c9973f',
    label: 'Love ♡',
  },
  birthday: {
    primary: '#e8634a',
    secondary: '#d4a96a',
    label: 'Birthday 🎂',
  },
  anniversary: {
    primary: '#7a4060',
    secondary: '#b87333',
    label: 'Anniversary',
  },
  friendship: {
    primary: '#4a7c6b',
    secondary: '#e8d5b0',
    label: 'Friendship',
  },
};

export const DESIGN_TOKENS = {
  colors: {
    bgFrom: '#fdf3f0',
    bgTo: '#f4dde2',
    ink: '#3a1f2b',
    wine: '#8a2f4c',
    gold: '#c9973f',
    paper: '#fffaf6',
  },
  fonts: {
    display: 'Cormorant Garamond',
    body: 'Karla',
    script: 'Petit Formal Script',
  },
};

export const PRESET_SONGS = [
  { id: 'preset1', label: 'Whispers & Warmth', file: '/music/whispers-and-warmth.mp3' },
  { id: 'preset2', label: 'Golden Hour', file: '/music/golden-hour.mp3' },
  { id: 'preset3', label: 'Tender Strings', file: '/music/tender-strings.mp3' },
  { id: 'preset4', label: 'Soft Rain', file: '/music/soft-rain.mp3' },
] as const;

export const DEFAULT_PRESS_MESSAGES = [
  'I love you more than words could ever say.',
  'You make every day feel like a gift.',
  'I fall for you a little more every single day.',
  "You're my favourite person in the whole world.",
  'Being loved by you is the best thing that ever happened to me.',
];

export const DEFAULT_REASONS = [
  'Because your laugh makes everything better.',
  'Because you make the ordinary feel magical.',
  "Because you're the first person I want to tell everything to.",
  'Because of how you care — so quietly, so deeply.',
  'Because you feel like home.',
];
