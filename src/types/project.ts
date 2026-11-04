/**
 * Core type definitions for Motion Mobile
 * Professional Mobile Video Editor and Motion Graphics Studio
 */

export type AspectRatioType = '16:9' | '9:16' | '1:1' | '4:5' | '4:3' | 'custom';

export type ResolutionPreset = '480p' | '720p' | '1080p' | '1440p' | '4K' | 'custom';

export type FrameRate = 12 | 15 | 24 | 25 | 30 | 50 | 60 | 90 | 120;

export type LayerType = 
  | 'video' 
  | 'image' 
  | 'text' 
  | 'shape' 
  | 'drawing' 
  | 'audio' 
  | 'group' 
  | 'null' 
  | 'camera';

export type BlendMode = 
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity';

export type EasingPreset = 
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'bounce'
  | 'elastic'
  | 'cubic'
  | 'bezier';

export interface KeyframePoint {
  id: string;
  time: number; // in seconds
  value: number;
  easing: EasingPreset;
  curveHandles?: [number, number, number, number]; // [x1, y1, x2, y2] for cubic-bezier
}

export interface KeyframeTrack {
  property: string; // e.g. 'position.x', 'position.y', 'rotation.z', 'scale.x', 'scale.y', 'opacity', 'skew.x'
  points: KeyframePoint[];
}

export interface TransformData {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number }; // z is primary 2D rotation in degrees
  scale: { x: number; y: number };
  skew: { x: number; y: number }; // skew angles in degrees
  anchorPoint: { x: number; y: number };
  lockedAspect: boolean;
}

export type ShapeKind = 
  | 'rect'
  | 'roundRect'
  | 'circle'
  | 'ellipse'
  | 'triangle'
  | 'polygon'
  | 'star'
  | 'speech'
  | 'heart'
  | 'crescent'
  | 'arrow'
  | 'line';

export interface ShapeData {
  shapeKind: ShapeKind;
  width: number;
  height: number;
  fillType: 'solid' | 'gradient' | 'none';
  fillColor: string;
  gradientColors?: string[];
  gradientAngle?: number;
  strokeColor: string;
  strokeWidth: number;
  cornerRadius?: number;
  points?: number; // for polygon & star
}

export interface TextData {
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  fontStyle: 'normal' | 'italic';
  color: string;
  align: 'left' | 'center' | 'right';
  letterSpacing: number;
  lineHeight: number;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
}

export interface DrawingStroke {
  color: string;
  size: number;
  points: Array<{ x: number; y: number }>;
}

export interface DrawingData {
  strokes: DrawingStroke[];
}

export interface MediaData {
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  fit: 'contain' | 'cover' | 'fill';
  loop?: boolean;
}

export interface AudioSettings {
  volume: number; // 0.0 to 1.0 (or up to 2.0 gain)
  pan: number; // -1.0 to 1.0
  pitch: number; // semitones or playbackRate
  speed: number;
  muted: boolean;
  solo?: boolean;
  fadeIn: number; // seconds
  fadeOut: number; // seconds
  eqBass: number; // -12 to +12 dB
  eqTreble: number; // -12 to +12 dB
  reverb: number; // 0 to 1
}

export interface ActiveEffect {
  id: string;
  effectId: string;
  name: string;
  category: string;
  enabled: boolean;
  parameters: Record<string, any>;
}

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  startTime: number; // seconds
  duration: number; // seconds
  locked: boolean;
  visible: boolean;
  opacity: number; // 0 to 1
  blendMode: BlendMode;
  speed: number; // 0.25 to 4.0
  zIndex: number;
  
  // Transform
  transform: TransformData;
  keyframes: KeyframeTrack[];

  // Component payloads
  shape?: ShapeData;
  text?: TextData;
  media?: MediaData;
  drawing?: DrawingData;
  audio?: AudioSettings;

  // Effects & Modifiers
  effects: ActiveEffect[];
  
  // Chroma key / Mask
  chromaKey?: {
    enabled: boolean;
    color: string;
    tolerance: number;
    feather: number;
  };

  // Group / Parent link
  parentId?: string;
}

export interface AudioTrack {
  id: string;
  name: string;
  src: string;
  duration: number;
  startTime: number;
  volume: number;
  pan: number;
  muted: boolean;
  waveformData?: number[];
}

export interface ProjectSettings {
  id: string;
  name: string;
  aspectRatio: AspectRatioType;
  width: number;
  height: number;
  fps: FrameRate;
  previewQuality: 100 | 75 | 50 | 25;
  background: string;
  duration: number; // in seconds
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  settings: ProjectSettings;
  layers: Layer[];
  audioTracks: AudioTrack[];
}

// Custom Effect Studio types
export type EffectStudioNodeType = 
  | 'input' 
  | 'color' 
  | 'brightness' 
  | 'blur' 
  | 'glow' 
  | 'noise' 
  | 'rgbsplit' 
  | 'distortion' 
  | 'gradient' 
  | 'transform'
  | 'output';

export interface VisualEffectNode {
  id: string;
  type: EffectStudioNodeType;
  title: string;
  x: number;
  y: number;
  params: Record<string, any>;
}

export interface VisualEffectConnection {
  id: string;
  fromNodeId: string;
  fromPort: string;
  toNodeId: string;
  toPort: string;
}

export interface CustomNodeEffect {
  id: string;
  name: string;
  description: string;
  author: string;
  nodes: VisualEffectNode[];
  connections: VisualEffectConnection[];
  createdAt: string;
}

export interface CustomShaderEffect {
  id: string;
  name: string;
  description: string;
  fragmentShader: string;
  uniforms: Record<string, {
    label: string;
    type: 'float' | 'color' | 'vec2';
    value: any;
    min?: number;
    max?: number;
  }>;
  createdAt: string;
}

export interface TextAnimationTemplate {
  id: string;
  name: string;
  category: 'Intro' | 'Exit' | 'Typography' | 'Advanced';
  duration: number;
  description: string;
  tags: string[];
  apply: (layer: Layer) => Layer;
}
