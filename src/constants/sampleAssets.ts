export interface MediaAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'audio';
  category: string;
  src: string;
  thumbnail: string;
  duration?: number;
  width?: number;
  height?: number;
}

export const SAMPLE_MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'sample-img-neon',
    name: 'Cyberpunk Skyline.png',
    type: 'image',
    category: 'Backgrounds',
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="%230F172A"/><stop offset="50%" stop-color="%231E1B4B"/><stop offset="100%" stop-color="%23311042"/></linearGradient><linearGradient id="gold" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stop-color="%23F59E0B"/><stop offset="100%" stop-color="%23FCD34D"/></linearGradient></defs><rect width="1080" height="1920" fill="url(%23g1)"/><circle cx="540" cy="960" r="380" fill="none" stroke="url(%23gold)" stroke-width="8" opacity="0.3"/><circle cx="540" cy="960" r="260" fill="none" stroke="%2338BDF8" stroke-width="4" opacity="0.4"/><polygon points="540,680 780,1100 300,1100" fill="none" stroke="url(%23gold)" stroke-width="6" opacity="0.6"/><text x="540" y="1350" font-family="sans-serif" font-size="48" font-weight="bold" fill="%23FFFFFF" text-anchor="middle" letter-spacing="8">MOTION MOBILE</text><text x="540" y="1410" font-family="sans-serif" font-size="24" fill="%2394A3B8" text-anchor="middle" letter-spacing="4">GPU VECTOR ENGINE</text></svg>',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><rect width="160" height="90" fill="%231E1B4B"/><circle cx="80" cy="45" r="25" fill="none" stroke="%23F59E0B" stroke-width="3"/></svg>',
    width: 1080,
    height: 1920
  },
  {
    id: 'sample-img-gold',
    name: 'Gold Fluid Abstract.jpg',
    type: 'image',
    category: 'Abstract',
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><radialGradient id="rg" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="%23FDE68A"/><stop offset="30%" stop-color="%23D97706"/><stop offset="70%" stop-color="%2378350F"/><stop offset="100%" stop-color="%230F0F14"/></radialGradient></defs><rect width="1080" height="1920" fill="url(%23rg)"/><path d="M-100,800 C300,600 700,1100 1200,900 L1200,1920 L-100,1920 Z" fill="%2307090E" opacity="0.85"/></svg>',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><rect width="160" height="90" fill="%2378350F"/><path d="M0,60 Q80,20 160,50 L160,90 L0,90 Z" fill="%230F0F14"/></svg>',
    width: 1080,
    height: 1920
  },
  {
    id: 'sample-img-green-screen',
    name: 'Character Silhouette (Chroma Ready).png',
    type: 'image',
    category: 'Keying',
    src: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><rect width="1080" height="1920" fill="%2300FF00"/><circle cx="540" cy="700" r="140" fill="%23111827"/><path d="M380,880 C440,840 640,840 700,880 L760,1400 L320,1400 Z" fill="%23111827"/><rect x="420" y="1400" width="80" height="350" fill="%23111827"/><rect x="580" y="1400" width="80" height="350" fill="%23111827"/></svg>',
    thumbnail: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="160" height="90" viewBox="0 0 160 90"><rect width="160" height="90" fill="%2300FF00"/><circle cx="80" cy="40" r="14" fill="%23111827"/><path d="M60,60 L100,60 L95,90 L65,90 Z" fill="%23111827"/></svg>',
    width: 1080,
    height: 1920
  }
];

export const SAMPLE_AUDIO_TRACKS: MediaAsset[] = [
  {
    id: 'sample-audio-beat',
    name: 'Future Bass Energetic.mp3',
    type: 'audio',
    category: 'Music',
    src: 'synth://future-bass',
    thumbnail: '',
    duration: 15.0
  },
  {
    id: 'sample-audio-cinematic',
    name: 'Deep Cinematic Sub Rise.wav',
    type: 'audio',
    category: 'SFX',
    src: 'synth://cinematic-sub',
    thumbnail: '',
    duration: 6.0
  },
  {
    id: 'sample-audio-whoosh',
    name: 'Fast Transition Whoosh.wav',
    type: 'audio',
    category: 'SFX',
    src: 'synth://whoosh',
    thumbnail: '',
    duration: 1.5
  }
];

export const AVAILABLE_FONTS = [
  { name: 'Outfit (Modern)', font: 'Outfit' },
  { name: 'Plus Jakarta (Clean)', font: 'Plus Jakarta Sans' },
  { name: 'JetBrains Mono (Code/Cyber)', font: 'JetBrains Mono' },
  { name: 'Impact Heavy', font: 'Impact, sans-serif' },
  { name: 'Georgia Serif', font: 'Georgia, serif' },
  { name: 'Trebuchet Bold', font: 'Trebuchet MS, sans-serif' }
];

export const COLOR_SWATCHES = [
  '#FFFFFF', '#FF3B30', '#FF9500', '#FFCC00', 
  '#34C759', '#00C7BE', '#30B0C7', '#32ADE6', 
  '#007AFF', '#5856D6', '#AF52DE', '#FF2D55', 
  '#A2845E', '#8E8E93', '#3A3A3C', '#000000'
];
