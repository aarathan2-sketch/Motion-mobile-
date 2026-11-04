export interface EffectDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  iconName: string;
  thumbnailBg: string;
  parameters: Array<{
    key: string;
    label: string;
    type: 'slider' | 'color' | 'toggle' | 'select';
    defaultVal: any;
    min?: number;
    max?: number;
    step?: number;
    options?: string[];
  }>;
}

export const EFFECT_CATEGORIES = [
  'Color & Light',
  'Drawing & Edge',
  'Blur',
  'Distortion/Warp',
  'Procedural',
  '3D',
  'Move/Transform',
  'Repeat',
  'Matte/Mask/Key',
  'Opacity/Visibility',
  'Text',
  'Custom'
] as const;

export const BUILT_IN_EFFECTS: EffectDefinition[] = [
  // Matte/Mask/Key
  {
    id: 'chroma-key',
    name: 'Chroma Key',
    category: 'Matte/Mask/Key',
    description: 'Professional green-screen & color removal with edge suppression',
    iconName: 'Sparkles',
    thumbnailBg: 'from-emerald-900 to-green-950',
    parameters: [
      { key: 'keyColor', label: 'Key Color', type: 'color', defaultVal: '#00FF00' },
      { key: 'threshold', label: 'Threshold', type: 'slider', defaultVal: 0.35, min: 0.05, max: 0.9, step: 0.01 },
      { key: 'feather', label: 'Feather', type: 'slider', defaultVal: 0.1, min: 0, max: 0.5, step: 0.01 },
      { key: 'spillRemoval', label: 'Spill Suppression', type: 'slider', defaultVal: 0.5, min: 0, max: 1, step: 0.05 }
    ]
  },
  {
    id: 'vignette',
    name: 'Vignette',
    category: 'Matte/Mask/Key',
    description: 'Darkens or softens outer edges with smooth falloff',
    iconName: 'Aperture',
    thumbnailBg: 'from-zinc-900 to-black',
    parameters: [
      { key: 'intensity', label: 'Intensity', type: 'slider', defaultVal: 0.6, min: 0, max: 1, step: 0.05 },
      { key: 'radius', label: 'Radius', type: 'slider', defaultVal: 0.7, min: 0.2, max: 1.2, step: 0.05 },
      { key: 'color', label: 'Edge Color', type: 'color', defaultVal: '#000000' }
    ]
  },

  // Blur
  {
    id: 'directional-blur',
    name: 'Directional Blur',
    category: 'Blur',
    description: 'Linear motion blur along a specific directional angle',
    iconName: 'Wind',
    thumbnailBg: 'from-blue-900 to-sky-950',
    parameters: [
      { key: 'strength', label: 'Strength', type: 'slider', defaultVal: 12, min: 0, max: 60, step: 1 },
      { key: 'angle', label: 'Angle', type: 'slider', defaultVal: 45, min: 0, max: 360, step: 1 }
    ]
  },
  {
    id: 'gaussian-blur',
    name: 'Gaussian Blur',
    category: 'Blur',
    description: 'Smooth, isotropic 2D Gaussian blur filter',
    iconName: 'EyeOff',
    thumbnailBg: 'from-indigo-900 to-slate-900',
    parameters: [
      { key: 'radius', label: 'Blur Radius', type: 'slider', defaultVal: 8, min: 0, max: 40, step: 1 }
    ]
  },
  {
    id: 'radial-blur',
    name: 'Radial / Zoom Blur',
    category: 'Blur',
    description: 'High-speed radial zoom or rotational blur around an anchor',
    iconName: 'RotateCcw',
    thumbnailBg: 'from-violet-900 to-indigo-950',
    parameters: [
      { key: 'amount', label: 'Blur Amount', type: 'slider', defaultVal: 15, min: 0, max: 50, step: 1 },
      { key: 'mode', label: 'Blur Mode', type: 'select', defaultVal: 'zoom', options: ['zoom', 'spin'] }
    ]
  },

  // Color & Light
  {
    id: 'brightness-contrast',
    name: 'Brightness & Contrast',
    category: 'Color & Light',
    description: 'Adjust overall luminance and tonal dynamic range',
    iconName: 'Sun',
    thumbnailBg: 'from-amber-900 to-orange-950',
    parameters: [
      { key: 'brightness', label: 'Brightness', type: 'slider', defaultVal: 1.0, min: 0.2, max: 2.0, step: 0.05 },
      { key: 'contrast', label: 'Contrast', type: 'slider', defaultVal: 1.0, min: 0.2, max: 2.5, step: 0.05 }
    ]
  },
  {
    id: 'hue-saturation',
    name: 'Hue Shift & Saturation',
    category: 'Color & Light',
    description: 'Shift color spectrum and adjust color vibrancy',
    iconName: 'Palette',
    thumbnailBg: 'from-rose-900 to-purple-950',
    parameters: [
      { key: 'hue', label: 'Hue Rotate', type: 'slider', defaultVal: 0, min: -180, max: 180, step: 1 },
      { key: 'saturation', label: 'Saturation', type: 'slider', defaultVal: 1.0, min: 0, max: 3.0, step: 0.1 }
    ]
  },
  {
    id: 'glow',
    name: 'Glow & Bloom',
    category: 'Color & Light',
    description: 'Radiant neon aura around highlights and bright areas',
    iconName: 'Zap',
    thumbnailBg: 'from-yellow-900 to-amber-950',
    parameters: [
      { key: 'radius', label: 'Glow Radius', type: 'slider', defaultVal: 20, min: 2, max: 60, step: 1 },
      { key: 'intensity', label: 'Intensity', type: 'slider', defaultVal: 1.2, min: 0.2, max: 3.0, step: 0.1 },
      { key: 'color', label: 'Glow Color', type: 'color', defaultVal: '#F0B232' }
    ]
  },

  // Distortion / Warp
  {
    id: 'wave-warp',
    name: 'Wave Warp',
    category: 'Distortion/Warp',
    description: 'Oscillating sine waves and water ripple distortions',
    iconName: 'Waves',
    thumbnailBg: 'from-teal-900 to-cyan-950',
    parameters: [
      { key: 'amplitude', label: 'Wave Amplitude', type: 'slider', defaultVal: 12, min: 0, max: 50, step: 1 },
      { key: 'frequency', label: 'Wave Frequency', type: 'slider', defaultVal: 0.04, min: 0.01, max: 0.2, step: 0.005 },
      { key: 'speed', label: 'Animation Speed', type: 'slider', defaultVal: 2.0, min: 0, max: 10, step: 0.2 }
    ]
  },
  {
    id: 'rgb-split',
    name: 'RGB Split / Chromatic',
    category: 'Distortion/Warp',
    description: 'Chromatic aberration displacing Red, Green, and Blue channels',
    iconName: 'Layers',
    thumbnailBg: 'from-pink-900 to-indigo-950',
    parameters: [
      { key: 'offset', label: 'Separation', type: 'slider', defaultVal: 8, min: 0, max: 30, step: 1 },
      { key: 'angle', label: 'Angle', type: 'slider', defaultVal: 0, min: 0, max: 360, step: 5 }
    ]
  },
  {
    id: 'pinch-bulge',
    name: 'Pinch & Bulge',
    category: 'Distortion/Warp',
    description: 'Spherical magnifying lens distortion or vortex sink',
    iconName: 'Maximize2',
    thumbnailBg: 'from-purple-900 to-slate-900',
    parameters: [
      { key: 'strength', label: 'Strength', type: 'slider', defaultVal: 0.4, min: -1.0, max: 1.0, step: 0.05 },
      { key: 'radius', label: 'Radius', type: 'slider', defaultVal: 150, min: 30, max: 300, step: 5 }
    ]
  },

  // Drawing & Edge
  {
    id: 'edge-detect',
    name: 'Find Edges & Neon',
    category: 'Drawing & Edge',
    description: 'Sobel edge detection creating comic or neon outlines',
    iconName: 'Edit3',
    thumbnailBg: 'from-cyan-900 to-blue-950',
    parameters: [
      { key: 'strokeWidth', label: 'Edge Width', type: 'slider', defaultVal: 2, min: 1, max: 8, step: 1 },
      { key: 'invert', label: 'Invert Background', type: 'toggle', defaultVal: false },
      { key: 'color', label: 'Neon Color', type: 'color', defaultVal: '#00F5FF' }
    ]
  },

  // Procedural
  {
    id: 'digital-noise',
    name: 'Film Grain & Noise',
    category: 'Procedural',
    description: 'Analog film texture, VHS static, and grain noise',
    iconName: 'Tv',
    thumbnailBg: 'from-stone-900 to-neutral-950',
    parameters: [
      { key: 'amount', label: 'Noise Density', type: 'slider', defaultVal: 0.15, min: 0.02, max: 0.6, step: 0.02 },
      { key: 'monochrome', label: 'Monochrome', type: 'toggle', defaultVal: true }
    ]
  },
  {
    id: 'four-color-gradient',
    name: 'Four-Color Gradient',
    category: 'Procedural',
    description: 'Mesmerizing multi-corner atmospheric gradient wash',
    iconName: 'Grid',
    thumbnailBg: 'from-fuchsia-900 to-violet-950',
    parameters: [
      { key: 'colorTopLeft', label: 'Top Left', type: 'color', defaultVal: '#FF416C' },
      { key: 'colorTopRight', label: 'Top Right', type: 'color', defaultVal: '#FF4B2B' },
      { key: 'colorBottomLeft', label: 'Bottom Left', type: 'color', defaultVal: '#1FA2FF' },
      { key: 'colorBottomRight', label: 'Bottom Right', type: 'color', defaultVal: '#12D8FA' },
      { key: 'blend', label: 'Blend', type: 'slider', defaultVal: 0.5, min: 0.1, max: 1.0, step: 0.05 }
    ]
  },

  // Move / Transform
  {
    id: 'auto-shake',
    name: 'Auto Shake & Jitter',
    category: 'Move/Transform',
    description: 'Camera hand-held shake, earthquake impact, or rhythmic jitter',
    iconName: 'Activity',
    thumbnailBg: 'from-rose-950 to-red-950',
    parameters: [
      { key: 'magnitude', label: 'Magnitude', type: 'slider', defaultVal: 10, min: 1, max: 50, step: 1 },
      { key: 'speed', label: 'Shake Speed', type: 'slider', defaultVal: 15, min: 1, max: 40, step: 1 },
      { key: 'rotationShake', label: 'Include Rotation', type: 'toggle', defaultVal: true }
    ]
  },
  {
    id: 'pulse-scale',
    name: 'Pulse & Heartbeat',
    category: 'Move/Transform',
    description: 'Continuous smooth zoom breathing or beat pulse',
    iconName: 'Heart',
    thumbnailBg: 'from-red-900 to-rose-950',
    parameters: [
      { key: 'scaleDelta', label: 'Scale Range', type: 'slider', defaultVal: 0.15, min: 0.02, max: 0.5, step: 0.02 },
      { key: 'bpm', label: 'Tempo (BPM)', type: 'slider', defaultVal: 120, min: 40, max: 200, step: 5 }
    ]
  },

  // Repeat
  {
    id: 'mirror-repeat',
    name: 'Kaleidoscope & Mirror',
    category: 'Repeat',
    description: 'Symmetrical reflection mirroring along vertical/horizontal axes',
    iconName: 'Copy',
    thumbnailBg: 'from-purple-950 to-violet-950',
    parameters: [
      { key: 'segments', label: 'Mirror Segments', type: 'slider', defaultVal: 4, min: 2, max: 12, step: 2 },
      { key: 'rotation', label: 'Angle', type: 'slider', defaultVal: 0, min: 0, max: 360, step: 5 }
    ]
  },

  // Opacity / Visibility
  {
    id: 'fade-in-out',
    name: 'Fade In / Out',
    category: 'Opacity/Visibility',
    description: 'Smooth automated transition from and to black or transparency',
    iconName: 'Eye',
    thumbnailBg: 'from-slate-900 to-black',
    parameters: [
      { key: 'inDuration', label: 'Fade In (s)', type: 'slider', defaultVal: 0.8, min: 0, max: 3, step: 0.1 },
      { key: 'outDuration', label: 'Fade Out (s)', type: 'slider', defaultVal: 0.8, min: 0, max: 3, step: 0.1 }
    ]
  }
];
