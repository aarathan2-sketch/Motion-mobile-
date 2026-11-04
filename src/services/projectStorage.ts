import { Project, Layer } from '../types/project';

const STORAGE_KEY = 'motion_mobile_projects_v1';
const ACTIVE_PROJECT_KEY = 'motion_mobile_active_project_id';

export const INITIAL_DEMO_PROJECT: Project = {
  settings: {
    id: 'demo-project-1',
    name: 'Cyberpunk Title Intro',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    fps: 30,
    previewQuality: 100,
    background: '#0B0E14',
    duration: 5.0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  layers: [
    // Layer 1: Background Shape
    {
      id: 'layer-bg',
      name: 'Background Gradient',
      type: 'shape',
      startTime: 0,
      duration: 5.0,
      locked: false,
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      speed: 1,
      zIndex: 1,
      transform: {
        position: { x: 540, y: 960, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1 },
        skew: { x: 0, y: 0 },
        anchorPoint: { x: 0.5, y: 0.5 },
        lockedAspect: false
      },
      keyframes: [],
      shape: {
        shapeKind: 'rect',
        width: 1080,
        height: 1920,
        fillType: 'solid',
        fillColor: '#121722',
        strokeColor: '#242F45',
        strokeWidth: 4
      },
      effects: [
        {
          id: 'eff-bg-vig',
          effectId: 'vignette',
          name: 'Vignette',
          category: 'Matte/Mask/Key',
          enabled: true,
          parameters: { intensity: 0.7, radius: 0.8, color: '#000000' }
        }
      ]
    },
    // Layer 2: Animated Star/Badge Shape
    {
      id: 'layer-shape-badge',
      name: 'Glowing Star Emblem',
      type: 'shape',
      startTime: 0,
      duration: 5.0,
      locked: false,
      visible: true,
      opacity: 0.9,
      blendMode: 'screen',
      speed: 1,
      zIndex: 2,
      transform: {
        position: { x: 540, y: 780, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1 },
        skew: { x: 0, y: 0 },
        anchorPoint: { x: 0.5, y: 0.5 },
        lockedAspect: true
      },
      keyframes: [
        {
          property: 'rotation.z',
          points: [
            { id: 'kf-rot-0', time: 0, value: 0, easing: 'linear' },
            { id: 'kf-rot-1', time: 5.0, value: 360, easing: 'linear' }
          ]
        },
        {
          property: 'scale.x',
          points: [
            { id: 'kf-sc-0', time: 0, value: 0.2, easing: 'elastic' },
            { id: 'kf-sc-1', time: 1.0, value: 1.2, easing: 'bounce' },
            { id: 'kf-sc-2', time: 2.0, value: 1.0, easing: 'ease-out' }
          ]
        },
        {
          property: 'scale.y',
          points: [
            { id: 'kf-scy-0', time: 0, value: 0.2, easing: 'elastic' },
            { id: 'kf-scy-1', time: 1.0, value: 1.2, easing: 'bounce' },
            { id: 'kf-scy-2', time: 2.0, value: 1.0, easing: 'ease-out' }
          ]
        }
      ],
      shape: {
        shapeKind: 'star',
        width: 320,
        height: 320,
        fillType: 'solid',
        fillColor: '#F0B232',
        strokeColor: '#FFFFFF',
        strokeWidth: 6,
        points: 5
      },
      effects: [
        {
          id: 'eff-star-glow',
          effectId: 'glow',
          name: 'Glow & Bloom',
          category: 'Color & Light',
          enabled: true,
          parameters: { radius: 28, intensity: 2.2, color: '#F0B232' }
        }
      ]
    },
    // Layer 3: Main Title Text
    {
      id: 'layer-title-text',
      name: 'Motion Mobile Title',
      type: 'text',
      startTime: 0.4,
      duration: 4.6,
      locked: false,
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      speed: 1,
      zIndex: 3,
      transform: {
        position: { x: 540, y: 1100, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1 },
        skew: { x: 0, y: 0 },
        anchorPoint: { x: 0.5, y: 0.5 },
        lockedAspect: false
      },
      keyframes: [
        {
          property: 'position.y',
          points: [
            { id: 'kf-posy-0', time: 0.4, value: 1300, easing: 'ease-out' },
            { id: 'kf-posy-1', time: 1.4, value: 1100, easing: 'cubic' }
          ]
        },
        {
          property: 'opacity',
          points: [
            { id: 'kf-op-0', time: 0.4, value: 0, easing: 'linear' },
            { id: 'kf-op-1', time: 1.0, value: 1, easing: 'linear' }
          ]
        }
      ],
      text: {
        text: 'MOTION MOBILE',
        fontFamily: 'Outfit',
        fontSize: 68,
        fontWeight: '800',
        fontStyle: 'normal',
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 4,
        lineHeight: 1.2,
        strokeColor: '#F0B232',
        strokeWidth: 2,
        shadowColor: 'rgba(240, 178, 50, 0.6)',
        shadowBlur: 20,
        shadowOffsetX: 0,
        shadowOffsetY: 4
      },
      effects: [
        {
          id: 'eff-txt-rgb',
          effectId: 'rgb-split',
          name: 'RGB Split / Chromatic',
          category: 'Distortion/Warp',
          enabled: true,
          parameters: { offset: 6, angle: 90 }
        }
      ]
    },
    // Layer 4: Subtitle Text
    {
      id: 'layer-sub-text',
      name: 'Subtitle Layer',
      type: 'text',
      startTime: 0.8,
      duration: 4.2,
      locked: false,
      visible: true,
      opacity: 0.85,
      blendMode: 'normal',
      speed: 1,
      zIndex: 4,
      transform: {
        position: { x: 540, y: 1210, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1 },
        skew: { x: 0, y: 0 },
        anchorPoint: { x: 0.5, y: 0.5 },
        lockedAspect: false
      },
      keyframes: [
        {
          property: 'opacity',
          points: [
            { id: 'kf-subop-0', time: 0.8, value: 0, easing: 'linear' },
            { id: 'kf-subop-1', time: 1.5, value: 0.85, easing: 'linear' }
          ]
        }
      ],
      text: {
        text: 'PRO MOTION GRAPHICS & GPU ENGINE',
        fontFamily: 'JetBrains Mono',
        fontSize: 26,
        fontWeight: '600',
        fontStyle: 'normal',
        color: '#94A3B8',
        align: 'center',
        letterSpacing: 3,
        lineHeight: 1.2
      },
      effects: []
    }
  ],
  audioTracks: [
    {
      id: 'audio-demo-track',
      name: 'Future Bass Energetic.mp3',
      src: 'synth://future-bass',
      duration: 5.0,
      startTime: 0,
      volume: 0.8,
      pan: 0,
      muted: false
    }
  ]
};

export class ProjectStorage {
  static getProjects(): Project[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        this.saveProjects([INITIAL_DEMO_PROJECT]);
        return [INITIAL_DEMO_PROJECT];
      }
      return JSON.parse(data);
    } catch {
      return [INITIAL_DEMO_PROJECT];
    }
  }

  static saveProjects(projects: Project[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  }

  static getActiveProjectId(): string {
    return localStorage.getItem(ACTIVE_PROJECT_KEY) || INITIAL_DEMO_PROJECT.settings.id;
  }

  static setActiveProjectId(id: string): void {
    localStorage.setItem(ACTIVE_PROJECT_KEY, id);
  }

  static getProject(id: string): Project | undefined {
    const list = this.getProjects();
    return list.find(p => p.settings.id === id);
  }

  static saveProject(project: Project): void {
    const list = this.getProjects();
    const index = list.findIndex(p => p.settings.id === project.settings.id);
    const updated = {
      ...project,
      settings: {
        ...project.settings,
        updatedAt: new Date().toISOString()
      }
    };
    if (index >= 0) {
      list[index] = updated;
    } else {
      list.unshift(updated);
    }
    this.saveProjects(list);
  }

  static createProject(settings: Omit<Project['settings'], 'id' | 'createdAt' | 'updatedAt'>): Project {
    const newProject: Project = {
      settings: {
        ...settings,
        id: 'proj-' + Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      layers: [],
      audioTracks: []
    };
    const list = this.getProjects();
    list.unshift(newProject);
    this.saveProjects(list);
    this.setActiveProjectId(newProject.settings.id);
    return newProject;
  }

  static duplicateProject(id: string): Project | null {
    const target = this.getProject(id);
    if (!target) return null;
    const duplicated: Project = {
      ...JSON.parse(JSON.stringify(target)),
      settings: {
        ...target.settings,
        id: 'proj-' + Date.now(),
        name: `${target.settings.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };
    const list = this.getProjects();
    list.unshift(duplicated);
    this.saveProjects(list);
    return duplicated;
  }

  static deleteProject(id: string): void {
    const list = this.getProjects().filter(p => p.settings.id !== id);
    this.saveProjects(list);
    if (this.getActiveProjectId() === id) {
      if (list.length > 0) {
        this.setActiveProjectId(list[0].settings.id);
      } else {
        this.saveProject(INITIAL_DEMO_PROJECT);
        this.setActiveProjectId(INITIAL_DEMO_PROJECT.settings.id);
      }
    }
  }
}
