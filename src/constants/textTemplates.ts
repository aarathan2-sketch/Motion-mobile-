import { Layer } from '../types/project';

export interface TextAnimationTemplate {
  id: string;
  name: string;
  category: 'Intro' | 'Exit' | 'Typography' | 'Advanced';
  duration: number;
  description: string;
  previewClass: string;
  apply: (layer: Layer) => Layer;
}

export const TEXT_TEMPLATES: TextAnimationTemplate[] = [
  {
    id: 'typewriter',
    name: 'Typewriter Reveal',
    category: 'Typography',
    duration: 2.0,
    description: 'Letter-by-letter mechanical typewriter reveal with cursor cadence',
    previewClass: 'animate-pulse font-mono',
    apply: (layer: Layer): Layer => {
      const updated = { ...layer };
      updated.keyframes = [
        ...(layer.keyframes || []).filter(k => k.property !== 'opacity'),
        {
          property: 'opacity',
          points: [
            { id: 'tw-1', time: layer.startTime, value: 0, easing: 'linear' },
            { id: 'tw-2', time: layer.startTime + 0.2, value: 0.3, easing: 'linear' },
            { id: 'tw-3', time: layer.startTime + 0.6, value: 0.6, easing: 'linear' },
            { id: 'tw-4', time: layer.startTime + 1.2, value: 1.0, easing: 'linear' }
          ]
        }
      ];
      if (updated.text) {
        updated.text = { ...updated.text, fontFamily: 'JetBrains Mono' };
      }
      return updated;
    }
  },
  {
    id: 'kinetic-pop',
    name: 'Kinetic Pop & Overshoot',
    category: 'Intro',
    duration: 1.2,
    description: 'High-energy explosive punch with elastic bounce settling',
    previewClass: 'scale-110 text-amber-400 font-black',
    apply: (layer: Layer): Layer => {
      const updated = { ...layer };
      const t0 = layer.startTime;
      updated.keyframes = [
        ...(layer.keyframes || []).filter(k => !['scale.x', 'scale.y', 'opacity'].includes(k.property)),
        {
          property: 'scale.x',
          points: [
            { id: 'kp-sx1', time: t0, value: 0.1, easing: 'elastic' },
            { id: 'kp-sx2', time: t0 + 0.5, value: 1.35, easing: 'bounce' },
            { id: 'kp-sx3', time: t0 + 0.9, value: 1.0, easing: 'ease-out' }
          ]
        },
        {
          property: 'scale.y',
          points: [
            { id: 'kp-sy1', time: t0, value: 0.1, easing: 'elastic' },
            { id: 'kp-sy2', time: t0 + 0.5, value: 1.35, easing: 'bounce' },
            { id: 'kp-sy3', time: t0 + 0.9, value: 1.0, easing: 'ease-out' }
          ]
        },
        {
          property: 'opacity',
          points: [
            { id: 'kp-op1', time: t0, value: 0, easing: 'ease-out' },
            { id: 'kp-op2', time: t0 + 0.3, value: 1, easing: 'linear' }
          ]
        }
      ];
      return updated;
    }
  },
  {
    id: 'neon-glow',
    name: 'Cyber Neon Flicker',
    category: 'Advanced',
    duration: 1.5,
    description: 'Strobing high-voltage neon tube flicker with radiant gold glow',
    previewClass: 'drop-shadow-[0_0_12px_#F0B232] text-yellow-300 font-bold',
    apply: (layer: Layer): Layer => {
      const updated = { ...layer };
      const t0 = layer.startTime;
      updated.keyframes = [
        ...(layer.keyframes || []).filter(k => k.property !== 'opacity'),
        {
          property: 'opacity',
          points: [
            { id: 'ng-1', time: t0, value: 0.1, easing: 'linear' },
            { id: 'ng-2', time: t0 + 0.1, value: 0.8, easing: 'linear' },
            { id: 'ng-3', time: t0 + 0.15, value: 0.2, easing: 'linear' },
            { id: 'ng-4', time: t0 + 0.25, value: 1.0, easing: 'linear' },
            { id: 'ng-5', time: t0 + 0.35, value: 0.4, easing: 'linear' },
            { id: 'ng-6', time: t0 + 0.45, value: 1.0, easing: 'linear' }
          ]
        }
      ];
      // Attach glow effect if not already present
      if (!updated.effects.some(e => e.effectId === 'glow')) {
        updated.effects.push({
          id: 'glow-' + Date.now(),
          effectId: 'glow',
          name: 'Glow & Bloom',
          category: 'Color & Light',
          enabled: true,
          parameters: { radius: 24, intensity: 2.0, color: '#F0B232' }
        });
      }
      return updated;
    }
  },
  {
    id: 'slide-blur-in',
    name: 'Cinematic Velocity Slide',
    category: 'Intro',
    duration: 1.0,
    description: 'Smooth horizontal glide from left with momentum deceleration',
    previewClass: 'translate-x-2 blur-[1px]',
    apply: (layer: Layer): Layer => {
      const updated = { ...layer };
      const t0 = layer.startTime;
      const initialX = updated.transform.position.x;
      updated.keyframes = [
        ...(layer.keyframes || []).filter(k => !['position.x', 'opacity'].includes(k.property)),
        {
          property: 'position.x',
          points: [
            { id: 'sb-x1', time: t0, value: initialX - 350, easing: 'ease-out' },
            { id: 'sb-x2', time: t0 + 0.8, value: initialX, easing: 'cubic' }
          ]
        },
        {
          property: 'opacity',
          points: [
            { id: 'sb-op1', time: t0, value: 0, easing: 'linear' },
            { id: 'sb-op2', time: t0 + 0.5, value: 1, easing: 'linear' }
          ]
        }
      ];
      return updated;
    }
  },
  {
    id: '3d-flip-down',
    name: '3D Flip Down',
    category: 'Advanced',
    duration: 1.4,
    description: 'Flips down in 3D perspective space with gravity snap',
    previewClass: 'rotate-x-45 font-semibold text-amber-200',
    apply: (layer: Layer): Layer => {
      const updated = { ...layer };
      const t0 = layer.startTime;
      updated.keyframes = [
        ...(layer.keyframes || []).filter(k => !['rotation.z', 'scale.y', 'opacity'].includes(k.property)),
        {
          property: 'rotation.z',
          points: [
            { id: 'flip-r1', time: t0, value: -70, easing: 'bounce' },
            { id: 'flip-r2', time: t0 + 0.9, value: 0, easing: 'ease-out' }
          ]
        },
        {
          property: 'scale.y',
          points: [
            { id: 'flip-sy1', time: t0, value: 0.2, easing: 'cubic' },
            { id: 'flip-sy2', time: t0 + 0.7, value: 1.0, easing: 'ease-out' }
          ]
        },
        {
          property: 'opacity',
          points: [
            { id: 'flip-op1', time: t0, value: 0, easing: 'linear' },
            { id: 'flip-op2', time: t0 + 0.4, value: 1, easing: 'linear' }
          ]
        }
      ];
      return updated;
    }
  },
  {
    id: 'glitch-stagger',
    name: 'Digital Glitch Tremor',
    category: 'Advanced',
    duration: 1.2,
    description: 'High-frequency cyber glitch with chromatic jitter and skewing',
    previewClass: 'skew-x-12 tracking-widest text-cyan-400',
    apply: (layer: Layer): Layer => {
      const updated = { ...layer };
      const t0 = layer.startTime;
      updated.keyframes = [
        ...(layer.keyframes || []).filter(k => !['skew.x', 'position.x'].includes(k.property)),
        {
          property: 'skew.x',
          points: [
            { id: 'g-sk1', time: t0, value: 0, easing: 'linear' },
            { id: 'g-sk2', time: t0 + 0.1, value: 25, easing: 'linear' },
            { id: 'g-sk3', time: t0 + 0.2, value: -18, easing: 'linear' },
            { id: 'g-sk4', time: t0 + 0.35, value: 12, easing: 'linear' },
            { id: 'g-sk5', time: t0 + 0.5, value: 0, easing: 'ease-out' }
          ]
        }
      ];
      if (!updated.effects.some(e => e.effectId === 'rgb-split')) {
        updated.effects.push({
          id: 'rgb-' + Date.now(),
          effectId: 'rgb-split',
          name: 'RGB Split / Chromatic',
          category: 'Distortion/Warp',
          enabled: true,
          parameters: { offset: 12, angle: 90 }
        });
      }
      return updated;
    }
  }
];
