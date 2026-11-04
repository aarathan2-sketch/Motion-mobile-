import React, { useState, useEffect, useRef } from 'react';
import { Project, Layer, TransformData, ShapeData, DrawingData, BlendMode, ActiveEffect, AudioTrack, EasingPreset } from '../../types/project';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { TopToolbar } from './TopToolbar';
import { PreviewCanvas } from './PreviewCanvas';
import { TimelineBar } from './TimelineBar';

// Context Panels
import { MainLayerToolbar } from './ContextPanels/MainLayerToolbar';
import { MoveTransformPanel } from './ContextPanels/MoveTransformPanel';
import { ColorFillPanel } from './ContextPanels/ColorFillPanel';
import { BorderShadowPanel } from './ContextPanels/BorderShadowPanel';
import { BlendingOpacityPanel } from './ContextPanels/BlendingOpacityPanel';
import { EditShapePanel } from './ContextPanels/EditShapePanel';
import { DrawingPanel } from './ContextPanels/DrawingPanel';
import { LayerEffectsPanel } from './ContextPanels/LayerEffectsPanel';

// Modals
import { AddLayerModal } from '../modals/AddLayerModal';
import { EffectsBrowserModal } from '../modals/EffectsBrowserModal';
import { CustomEffectStudioModal } from '../modals/CustomEffectStudioModal';
import { CurveGraphModal } from '../modals/CurveGraphModal';
import { AudioStudioModal } from '../modals/AudioStudioModal';
import { ExportModal } from '../modals/ExportModal';
import { NewProjectModal } from '../modals/NewProjectModal';

interface EditorWorkspaceProps {
  initialProject: Project;
  onBackToHome: () => void;
  onSaveProject: (project: Project) => void;
}

export const EditorWorkspace: React.FC<EditorWorkspaceProps> = ({
  initialProject,
  onBackToHome,
  onSaveProject
}) => {
  const [project, setProject] = useState<Project>(initialProject);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(initialProject.layers[0]?.id || null);
  const [activePanel, setActivePanel] = useState<'main' | 'transform' | 'color' | 'border' | 'blending' | 'shape' | 'presets' | 'effects' | 'drawing'>('main');

  // History stack for Undo / Redo
  const [history, setHistory] = useState<Project[]>([initialProject]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Modals state
  const [isAddLayerOpen, setIsAddLayerOpen] = useState(false);
  const [isEffectsBrowserOpen, setIsEffectsBrowserOpen] = useState(false);
  const [isCustomStudioOpen, setIsCustomStudioOpen] = useState(false);
  const [isCurveGraphOpen, setIsCurveGraphOpen] = useState(false);
  const [isAudioStudioOpen, setIsAudioStudioOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWideView, setIsWideView] = useState(false);

  // Sync state changes with autosave & history
  const updateProject = (newProject: Project, recordHistory = true) => {
    setProject(newProject);
    onSaveProject(newProject);
    if (recordHistory) {
      const nextHistory = history.slice(0, historyIndex + 1);
      nextHistory.push(newProject);
      setHistory(nextHistory);
      setHistoryIndex(nextHistory.length - 1);
    }
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setProject(prev);
      onSaveProject(prev);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setProject(next);
      onSaveProject(next);
    }
  };

  // Playhead animation loop
  const animFrameRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(performance.now());

  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    lastTimeRef.current = performance.now();
    const tick = (now: number) => {
      const deltaSec = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentTime((prev) => {
        const next = prev + deltaSec;
        if (next >= project.settings.duration) {
          setIsPlaying(false);
          return 0;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, project.settings.duration]);

  const selectedLayer = project.layers.find((l) => l.id === selectedLayerId);

  // Layer manipulation handlers
  const handleUpdateLayer = (updated: Layer) => {
    const nextLayers = project.layers.map((l) => (l.id === updated.id ? updated : l));
    updateProject({ ...project, layers: nextLayers });
  };

  const handleAddLayer = (newLayerData: Omit<Layer, 'id' | 'zIndex'>) => {
    const newLayer: Layer = {
      ...newLayerData,
      id: 'layer-' + Date.now(),
      zIndex: project.layers.length + 1
    };
    const nextLayers = [...project.layers, newLayer];
    updateProject({ ...project, layers: nextLayers });
    setSelectedLayerId(newLayer.id);
    if (newLayer.type === 'drawing') {
      setActivePanel('drawing');
    } else {
      setActivePanel('main');
    }
  };

  const handleDeleteLayer = () => {
    if (!selectedLayerId) return;
    const nextLayers = project.layers.filter((l) => l.id !== selectedLayerId);
    updateProject({ ...project, layers: nextLayers });
    setSelectedLayerId(nextLayers[0]?.id || null);
    setActivePanel('main');
  };

  const handleDuplicateLayer = () => {
    if (!selectedLayer) return;
    const duplicated: Layer = {
      ...JSON.parse(JSON.stringify(selectedLayer)),
      id: 'layer-' + Date.now(),
      name: `${selectedLayer.name} Copy`,
      zIndex: project.layers.length + 1,
      transform: {
        ...selectedLayer.transform,
        position: {
          x: selectedLayer.transform.position.x + 30,
          y: selectedLayer.transform.position.y + 30,
          z: selectedLayer.transform.position.z
        }
      }
    };
    updateProject({ ...project, layers: [...project.layers, duplicated] });
    setSelectedLayerId(duplicated.id);
  };

  const handleSplitCenter = () => {
    if (!selectedLayer) return;
    if (currentTime <= selectedLayer.startTime || currentTime >= selectedLayer.startTime + selectedLayer.duration) return;

    const firstDuration = currentTime - selectedLayer.startTime;
    const secondDuration = selectedLayer.duration - firstDuration;

    const firstClip: Layer = {
      ...selectedLayer,
      duration: firstDuration
    };

    const secondClip: Layer = {
      ...JSON.parse(JSON.stringify(selectedLayer)),
      id: 'layer-' + Date.now(),
      name: `${selectedLayer.name} (Part 2)`,
      startTime: currentTime,
      duration: secondDuration,
      zIndex: project.layers.length + 1
    };

    const nextLayers = project.layers
      .map((l) => (l.id === selectedLayer.id ? firstClip : l))
      .concat(secondClip);

    updateProject({ ...project, layers: nextLayers });
    setSelectedLayerId(secondClip.id);
  };

  const handleSplitLeft = () => {
    if (!selectedLayer) return;
    if (currentTime > selectedLayer.startTime && currentTime < selectedLayer.startTime + selectedLayer.duration) {
      const removed = currentTime - selectedLayer.startTime;
      handleUpdateLayer({
        ...selectedLayer,
        startTime: currentTime,
        duration: Math.max(0.2, selectedLayer.duration - removed)
      });
    }
  };

  const handleSplitRight = () => {
    if (!selectedLayer) return;
    if (currentTime > selectedLayer.startTime && currentTime < selectedLayer.startTime + selectedLayer.duration) {
      handleUpdateLayer({
        ...selectedLayer,
        duration: Math.max(0.2, currentTime - selectedLayer.startTime)
      });
    }
  };

  const handleToggleKeyframe = (property: string, value: number) => {
    if (!selectedLayer) return;
    const kfs = [...(selectedLayer.keyframes || [])];
    const trackIndex = kfs.findIndex((k) => k.property === property);

    if (trackIndex >= 0) {
      const track = { ...kfs[trackIndex] };
      const existingPtIndex = track.points.findIndex((p) => Math.abs(p.time - currentTime) < 0.05);
      if (existingPtIndex >= 0) {
        // Remove keyframe
        track.points = track.points.filter((_, i) => i !== existingPtIndex);
      } else {
        // Add keyframe
        track.points = [
          ...track.points,
          { id: 'kf-' + Date.now(), time: currentTime, value, easing: 'ease-out' as EasingPreset }
        ].sort((a, b) => a.time - b.time);
      }
      kfs[trackIndex] = track;
    } else {
      // Create new track
      kfs.push({
        property,
        points: [{ id: 'kf-' + Date.now(), time: currentTime, value, easing: 'ease-out' as EasingPreset }]
      });
    }

    handleUpdateLayer({ ...selectedLayer, keyframes: kfs });
  };

  const handleApplyCurve = (easing: EasingPreset, handles?: [number, number, number, number]) => {
    if (!selectedLayer) return;
    const kfs = (selectedLayer.keyframes || []).map((track) => ({
      ...track,
      points: track.points.map((p) => ({
        ...p,
        easing,
        curveHandles: handles
      }))
    }));
    handleUpdateLayer({ ...selectedLayer, keyframes: kfs });
  };

  return (
    <div className={`min-h-screen bg-[#07090e] flex items-center justify-center ${isWideView ? 'p-0' : 'p-2 sm:p-4'}`}>
      
      {/* Device Enclosure / Workspace Frame */}
      <div
        className={`w-full bg-[#0c1017] flex flex-col overflow-hidden shadow-2xl transition-all ${
          isWideView
            ? 'h-screen rounded-none'
            : 'max-w-[430px] h-[92vh] max-h-[920px] rounded-[36px] border-[6px] border-[#1a2334] ring-1 ring-slate-800'
        }`}
      >
        {/* Status Bar */}
        <AndroidStatusBar />

        {/* Top Toolbar */}
        <TopToolbar
          project={project}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
          isWideView={isWideView}
          onUndo={handleUndo}
          onRedo={handleRedo}
          onBack={onBackToHome}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
          onOpenAddLayer={() => setIsAddLayerOpen(true)}
          onOpenAudioStudio={() => setIsAudioStudioOpen(true)}
          onToggleWideView={() => setIsWideView(!isWideView)}
        />

        {/* Preview Canvas Stage */}
        <PreviewCanvas
          project={project}
          currentTime={currentTime}
          selectedLayerId={selectedLayerId}
          onSelectLayer={setSelectedLayerId}
          onUpdateLayerTransform={(layerId, dx, dy) => {
            const target = project.layers.find((l) => l.id === layerId);
            if (target) {
              handleUpdateLayer({
                ...target,
                transform: {
                  ...target.transform,
                  position: {
                    x: Math.round((target.transform.position.x + dx) * 10) / 10,
                    y: Math.round((target.transform.position.y + dy) * 10) / 10,
                    z: target.transform.position.z
                  }
                }
              });
            }
          }}
        />

        {/* Multitrack Timeline & Playhead Bar */}
        <TimelineBar
          project={project}
          currentTime={currentTime}
          isPlaying={isPlaying}
          selectedLayerId={selectedLayerId}
          onTimeChange={setCurrentTime}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          onSelectLayer={setSelectedLayerId}
          onToggleLayerVisibility={(id) => {
            const target = project.layers.find((l) => l.id === id);
            if (target) handleUpdateLayer({ ...target, visible: !target.visible });
          }}
          onToggleLayerLock={(id) => {
            const target = project.layers.find((l) => l.id === id);
            if (target) handleUpdateLayer({ ...target, locked: !target.locked });
          }}
          onUndo={handleUndo}
          onRedo={handleRedo}
          canUndo={historyIndex > 0}
          canRedo={historyIndex < history.length - 1}
        />

        {/* Contextual Bottom Editing Panel strictly matching screenshots */}
        {selectedLayer ? (
          <>
            {activePanel === 'main' && (
              <MainLayerToolbar
                layer={selectedLayer}
                onOpenPanel={setActivePanel}
                onSplitLeft={handleSplitLeft}
                onSplitCenter={handleSplitCenter}
                onSplitRight={handleSplitRight}
                onToggleMute={() => {
                  const muted = !(selectedLayer.audio?.muted ?? false);
                  handleUpdateLayer({
                    ...selectedLayer,
                    audio: {
                      ...(selectedLayer.audio || {
                        volume: 1,
                        pan: 0,
                        pitch: 1,
                        speed: 1,
                        fadeIn: 0,
                        fadeOut: 0,
                        eqBass: 0,
                        eqTreble: 0,
                        reverb: 0
                      }),
                      muted
                    }
                  });
                }}
                onDuplicate={handleDuplicateLayer}
                onDelete={handleDeleteLayer}
              />
            )}

            {activePanel === 'transform' && (
              <MoveTransformPanel
                layer={selectedLayer}
                currentTime={currentTime}
                onUpdateTransform={(t) => handleUpdateLayer({ ...selectedLayer, transform: t })}
                onToggleKeyframe={handleToggleKeyframe}
                onOpenCurveGraph={() => setIsCurveGraphOpen(true)}
                onBack={() => setActivePanel('main')}
              />
            )}

            {activePanel === 'color' && (
              <ColorFillPanel
                layer={selectedLayer}
                onUpdateColor={(c) => {
                  if (selectedLayer.shape) {
                    handleUpdateLayer({
                      ...selectedLayer,
                      shape: { ...selectedLayer.shape, fillColor: c }
                    });
                  } else if (selectedLayer.text) {
                    handleUpdateLayer({
                      ...selectedLayer,
                      text: { ...selectedLayer.text, color: c }
                    });
                  }
                }}
                onBack={() => setActivePanel('main')}
              />
            )}

            {activePanel === 'border' && (
              <BorderShadowPanel
                layer={selectedLayer}
                onUpdateStroke={(color, width) => {
                  if (selectedLayer.shape) {
                    handleUpdateLayer({
                      ...selectedLayer,
                      shape: { ...selectedLayer.shape, strokeColor: color, strokeWidth: width }
                    });
                  } else if (selectedLayer.text) {
                    handleUpdateLayer({
                      ...selectedLayer,
                      text: { ...selectedLayer.text, strokeColor: color, strokeWidth: width }
                    });
                  }
                }}
                onBack={() => setActivePanel('main')}
              />
            )}

            {activePanel === 'blending' && (
              <BlendingOpacityPanel
                layer={selectedLayer}
                onUpdateOpacity={(op) => handleUpdateLayer({ ...selectedLayer, opacity: op })}
                onUpdateBlendMode={(bm) => handleUpdateLayer({ ...selectedLayer, blendMode: bm })}
                onBack={() => setActivePanel('main')}
              />
            )}

            {activePanel === 'shape' && (
              <EditShapePanel
                layer={selectedLayer}
                onUpdateShape={(s) => handleUpdateLayer({ ...selectedLayer, shape: s })}
                onBack={() => setActivePanel('main')}
              />
            )}

            {activePanel === 'drawing' && (
              <DrawingPanel
                layer={selectedLayer}
                onUpdateDrawing={(d) => handleUpdateLayer({ ...selectedLayer, drawing: d })}
                onBack={() => setActivePanel('main')}
              />
            )}

            {activePanel === 'effects' && (
              <LayerEffectsPanel
                layer={selectedLayer}
                onUpdateEffects={(effs) => handleUpdateLayer({ ...selectedLayer, effects: effs })}
                onOpenBrowser={() => setIsEffectsBrowserOpen(true)}
                onBack={() => setActivePanel('main')}
              />
            )}

            {activePanel === 'presets' && (
              <div className="w-full bg-[#131722] border-t border-[#1f2838] p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-100">Animation Presets</h4>
                  <p className="text-[11px] text-slate-400">Apply ready-made text and layer motion templates.</p>
                </div>
                <button
                  onClick={() => setIsAddLayerOpen(true)}
                  className="px-4 py-2 rounded-xl bg-[#f0b232] text-slate-950 font-bold text-xs"
                >
                  Browse Templates
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="w-full bg-[#131722] border-t border-[#1f2838] p-4 flex items-center justify-between text-xs text-slate-400">
            <span>Select a layer in timeline or canvas to inspect controls</span>
            <button
              onClick={() => setIsAddLayerOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-[#f0b232] text-slate-950 font-bold text-xs"
            >
              + Add Layer
            </button>
          </div>
        )}

      </div>

      {/* MODALS */}
      <AddLayerModal
        isOpen={isAddLayerOpen}
        onClose={() => setIsAddLayerOpen(false)}
        onAddLayer={handleAddLayer}
        currentTime={currentTime}
      />

      <EffectsBrowserModal
        isOpen={isEffectsBrowserOpen}
        onClose={() => setIsEffectsBrowserOpen(false)}
        onSelectEffect={(eff) => {
          if (selectedLayer) {
            handleUpdateLayer({
              ...selectedLayer,
              effects: [...(selectedLayer.effects || []), eff]
            });
            setActivePanel('effects');
          }
        }}
        onOpenCustomStudio={() => setIsCustomStudioOpen(true)}
      />

      <CustomEffectStudioModal
        isOpen={isCustomStudioOpen}
        onClose={() => setIsCustomStudioOpen(false)}
        onSaveCustomEffect={(eff) => {
          if (selectedLayer) {
            handleUpdateLayer({
              ...selectedLayer,
              effects: [...(selectedLayer.effects || []), eff]
            });
            setActivePanel('effects');
          }
        }}
      />

      <CurveGraphModal
        isOpen={isCurveGraphOpen}
        onClose={() => setIsCurveGraphOpen(false)}
        currentEasing="bezier"
        onApplyCurve={handleApplyCurve}
      />

      <AudioStudioModal
        isOpen={isAudioStudioOpen}
        onClose={() => setIsAudioStudioOpen(false)}
        audioTracks={project.audioTracks}
        onUpdateTracks={(tracks) => updateProject({ ...project, audioTracks: tracks })}
      />

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        project={project}
      />

      <NewProjectModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onCreate={(newSettings) => {
          updateProject({
            ...project,
            settings: {
              ...project.settings,
              ...newSettings
            }
          });
        }}
      />

    </div>
  );
};
