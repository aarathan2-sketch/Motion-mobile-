import React, { useState, useRef } from 'react';
import { 
  Shapes, Image, Music, Box, Sparkles, Edit3, 
  PenTool, Type, X, Upload, Mic, Play, Square, Circle, 
  Triangle, Star, MessageSquare, Heart, ArrowRight, Minus 
} from 'lucide-react';
import { Layer, ShapeKind } from '../../types/project';
import { SAMPLE_MEDIA_ASSETS, SAMPLE_AUDIO_TRACKS } from '../../constants/sampleAssets';
import { TEXT_TEMPLATES } from '../../constants/textTemplates';

interface AddLayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLayer: (layer: Omit<Layer, 'id' | 'zIndex'>) => void;
  currentTime: number;
}

export const AddLayerModal: React.FC<AddLayerModalProps> = ({
  isOpen,
  onClose,
  onAddLayer,
  currentTime
}) => {
  const [activeTab, setActiveTab] = useState<'shape' | 'media' | 'audio' | 'object' | 'template' | 'freehand' | 'vector' | 'text'>('shape');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleAddShape = (shapeKind: ShapeKind) => {
    onAddLayer({
      name: `${shapeKind.charAt(0).toUpperCase() + shapeKind.slice(1)} Shape`,
      type: 'shape',
      startTime: currentTime,
      duration: 4.0,
      locked: false,
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      speed: 1,
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
        shapeKind,
        width: 320,
        height: 320,
        fillType: 'solid',
        fillColor: '#F0B232',
        strokeColor: '#FFFFFF',
        strokeWidth: 0,
        cornerRadius: 20,
        points: shapeKind === 'star' ? 5 : shapeKind === 'polygon' ? 6 : undefined
      },
      effects: []
    });
    onClose();
  };

  const handleAddText = () => {
    onAddLayer({
      name: 'Text Layer',
      type: 'text',
      startTime: currentTime,
      duration: 4.0,
      locked: false,
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      speed: 1,
      transform: {
        position: { x: 540, y: 960, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1 },
        skew: { x: 0, y: 0 },
        anchorPoint: { x: 0.5, y: 0.5 },
        lockedAspect: false
      },
      keyframes: [],
      text: {
        text: 'EDIT TEXT',
        fontFamily: 'Outfit',
        fontSize: 72,
        fontWeight: '700',
        fontStyle: 'normal',
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 2,
        lineHeight: 1.2
      },
      effects: []
    });
    onClose();
  };

  const handleAddMedia = (asset: typeof SAMPLE_MEDIA_ASSETS[0]) => {
    onAddLayer({
      name: asset.name,
      type: asset.type === 'video' ? 'video' : 'image',
      startTime: currentTime,
      duration: 4.0,
      locked: false,
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      speed: 1,
      transform: {
        position: { x: 540, y: 960, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1 },
        skew: { x: 0, y: 0 },
        anchorPoint: { x: 0.5, y: 0.5 },
        lockedAspect: true
      },
      keyframes: [],
      media: {
        src: asset.src,
        naturalWidth: asset.width || 1080,
        naturalHeight: asset.height || 1920,
        fit: 'contain'
      },
      effects: []
    });
    onClose();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      const isVideo = file.type.startsWith('video/');
      const isAudio = file.type.startsWith('audio/');

      if (isAudio) {
        onAddLayer({
          name: file.name,
          type: 'audio',
          startTime: currentTime,
          duration: 5.0,
          locked: false,
          visible: true,
          opacity: 1,
          blendMode: 'normal',
          speed: 1,
          transform: {
            position: { x: 0, y: 0, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1 },
            skew: { x: 0, y: 0 },
            anchorPoint: { x: 0.5, y: 0.5 },
            lockedAspect: true
          },
          keyframes: [],
          audio: {
            volume: 1.0,
            pan: 0,
            pitch: 1.0,
            speed: 1.0,
            muted: false,
            fadeIn: 0,
            fadeOut: 0,
            eqBass: 0,
            eqTreble: 0,
            reverb: 0
          },
          effects: []
        });
      } else {
        onAddLayer({
          name: file.name,
          type: isVideo ? 'video' : 'image',
          startTime: currentTime,
          duration: 4.0,
          locked: false,
          visible: true,
          opacity: 1,
          blendMode: 'normal',
          speed: 1,
          transform: {
            position: { x: 540, y: 960, z: 0 },
            rotation: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1 },
            skew: { x: 0, y: 0 },
            anchorPoint: { x: 0.5, y: 0.5 },
            lockedAspect: true
          },
          keyframes: [],
          media: {
            src,
            naturalWidth: 800,
            naturalHeight: 800,
            fit: 'contain'
          },
          effects: []
        });
      }
      onClose();
    };
    reader.readAsDataURL(file);
  };

  const handleAddDrawing = () => {
    onAddLayer({
      name: 'Drawing Layer',
      type: 'drawing',
      startTime: currentTime,
      duration: 4.0,
      locked: false,
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      speed: 1,
      transform: {
        position: { x: 540, y: 960, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1 },
        skew: { x: 0, y: 0 },
        anchorPoint: { x: 0.5, y: 0.5 },
        lockedAspect: false
      },
      keyframes: [],
      drawing: {
        strokes: [
          {
            color: '#F0B232',
            size: 6,
            points: [
              { x: -100, y: 0 },
              { x: -50, y: -40 },
              { x: 0, y: 30 },
              { x: 50, y: -30 },
              { x: 100, y: 10 }
            ]
          }
        ]
      },
      effects: []
    });
    onClose();
  };

  const handleApplyTemplate = (tmpl: typeof TEXT_TEMPLATES[0]) => {
    const baseLayer: Layer = {
      id: 'tmp-' + Date.now(),
      name: `${tmpl.name}`,
      type: 'text',
      startTime: currentTime,
      duration: tmpl.duration + 2.0,
      locked: false,
      visible: true,
      opacity: 1,
      blendMode: 'normal',
      speed: 1,
      zIndex: 10,
      transform: {
        position: { x: 540, y: 960, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1 },
        skew: { x: 0, y: 0 },
        anchorPoint: { x: 0.5, y: 0.5 },
        lockedAspect: false
      },
      keyframes: [],
      text: {
        text: tmpl.name.toUpperCase(),
        fontFamily: 'Outfit',
        fontSize: 64,
        fontWeight: '800',
        fontStyle: 'normal',
        color: '#FFFFFF',
        align: 'center',
        letterSpacing: 2,
        lineHeight: 1.2
      },
      effects: []
    };

    const finalLayer = tmpl.apply(baseLayer);
    onAddLayer(finalLayer);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full bg-[#121620] border-t border-[#232d40] rounded-t-3xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden text-slate-100">
        
        {/* Top Header / Tab Bar matching Reference Screenshot 8 */}
        <div className="px-4 pt-3 pb-2 border-b border-[#1f2838] flex items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveTab('shape')}
              className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeTab === 'shape' ? 'text-[#f0b232] bg-[#1a2130]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shapes className="w-4 h-4 mb-0.5" />
              <span>Shape</span>
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeTab === 'media' ? 'text-[#f0b232] bg-[#1a2130]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Image className="w-4 h-4 mb-0.5" />
              <span>Media</span>
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeTab === 'audio' ? 'text-[#f0b232] bg-[#1a2130]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Music className="w-4 h-4 mb-0.5" />
              <span>Audio</span>
            </button>
            <button
              onClick={() => setActiveTab('object')}
              className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeTab === 'object' ? 'text-[#f0b232] bg-[#1a2130]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-4 h-4 mb-0.5" />
              <span>Object / Element</span>
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`relative flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeTab === 'template' ? 'text-[#f0b232] bg-[#1a2130]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="absolute -top-1 right-2 text-[8px] font-bold px-1 rounded bg-[#f0b232] text-slate-950">NEW</span>
              <Sparkles className="w-4 h-4 mb-0.5" />
              <span>Template</span>
            </button>
            <button
              onClick={() => setActiveTab('freehand')}
              className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeTab === 'freehand' ? 'text-[#f0b232] bg-[#1a2130]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Edit3 className="w-4 h-4 mb-0.5" />
              <span>Freehand</span>
            </button>
            <button
              onClick={() => setActiveTab('vector')}
              className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeTab === 'vector' ? 'text-[#f0b232] bg-[#1a2130]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PenTool className="w-4 h-4 mb-0.5" />
              <span>Vector</span>
            </button>
            <button
              onClick={() => setActiveTab('text')}
              className={`flex flex-col items-center px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-colors ${
                activeTab === 'text' ? 'text-[#f0b232] bg-[#1a2130]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Type className="w-4 h-4 mb-0.5" />
              <span>Text</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#18202d] text-slate-400 hover:text-white flex items-center justify-center shrink-0 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 overflow-y-auto max-h-[50vh]">
          {/* SHAPE TAB - matching screenshot 8 & 10 */}
          {activeTab === 'shape' && (
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {[
                { kind: 'rect', label: 'Rectangle', icon: <Square className="w-6 h-6" /> },
                { kind: 'roundRect', label: 'Rounded Rect', icon: <Square className="w-6 h-6 rounded-md" /> },
                { kind: 'circle', label: 'Circle', icon: <Circle className="w-6 h-6" /> },
                { kind: 'triangle', label: 'Triangle', icon: <Triangle className="w-6 h-6" /> },
                { kind: 'star', label: 'Star', icon: <Star className="w-6 h-6 fill-current" /> },
                { kind: 'heart', label: 'Heart', icon: <Heart className="w-6 h-6 fill-current" /> },
                { kind: 'speech', label: 'Speech', icon: <MessageSquare className="w-6 h-6" /> },
                { kind: 'arrow', label: 'Arrow', icon: <ArrowRight className="w-6 h-6" /> },
                { kind: 'line', label: 'Line', icon: <Minus className="w-6 h-6" /> }
              ].map(s => (
                <button
                  key={s.kind}
                  onClick={() => handleAddShape(s.kind as ShapeKind)}
                  className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-[#18202c] hover:bg-[#222c3e] border border-[#232d3f] text-slate-300 hover:text-[#f0b232] hover:border-[#f0b232]/50 transition-all group"
                >
                  <div className="text-slate-300 group-hover:text-[#f0b232] transition-colors mb-2">
                    {s.icon}
                  </div>
                  <span className="text-[11px] font-medium">{s.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* MEDIA TAB */}
          {activeTab === 'media' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Device Gallery & Assets</span>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-lg bg-[#f0b232] hover:bg-[#f7c34b] text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import File</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*,audio/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {SAMPLE_MEDIA_ASSETS.map(asset => (
                  <button
                    key={asset.id}
                    onClick={() => handleAddMedia(asset)}
                    className="flex flex-col rounded-xl overflow-hidden bg-[#18202c] border border-[#232d3f] hover:border-[#f0b232] text-left transition-all group"
                  >
                    <div className="aspect-video w-full bg-slate-900 overflow-hidden relative">
                      <img src={asset.thumbnail || asset.src} alt={asset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <span className="absolute bottom-1 right-1 px-1 rounded bg-black/70 text-[9px] font-mono text-slate-300">
                        {asset.category}
                      </span>
                    </div>
                    <div className="p-2">
                      <div className="text-xs font-semibold text-slate-200 truncate">{asset.name}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* AUDIO TAB */}
          {activeTab === 'audio' && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Audio Studio Tracks</span>
                <span className="text-[10px] text-slate-400">Synthesized / Recorded</span>
              </div>
              <div className="space-y-2">
                {SAMPLE_AUDIO_TRACKS.map(track => (
                  <div
                    key={track.id}
                    className="p-3 rounded-xl bg-[#18202c] border border-[#232d3f] flex items-center justify-between hover:border-[#f0b232]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#f0b232]/20 text-[#f0b232] flex items-center justify-center">
                        <Music className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-200">{track.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{track.duration}s • {track.category}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onAddLayer({
                          name: track.name,
                          type: 'audio',
                          startTime: currentTime,
                          duration: track.duration || 5.0,
                          locked: false,
                          visible: true,
                          opacity: 1,
                          blendMode: 'normal',
                          speed: 1,
                          transform: {
                            position: { x: 0, y: 0, z: 0 },
                            rotation: { x: 0, y: 0, z: 0 },
                            scale: { x: 1, y: 1 },
                            skew: { x: 0, y: 0 },
                            anchorPoint: { x: 0.5, y: 0.5 },
                            lockedAspect: false
                          },
                          keyframes: [],
                          audio: {
                            volume: 0.8,
                            pan: 0,
                            pitch: 1.0,
                            speed: 1.0,
                            muted: false,
                            fadeIn: 0,
                            fadeOut: 0,
                            eqBass: 0,
                            eqTreble: 0,
                            reverb: 0
                          },
                          effects: []
                        });
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#f0b232] text-slate-950 font-bold text-xs hover:bg-[#f7c34b] transition-colors"
                    >
                      Add Track
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEMPLATE TAB */}
          {activeTab === 'template' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TEXT_TEMPLATES.map(tmpl => (
                <div
                  key={tmpl.id}
                  className="p-3.5 rounded-xl bg-[#18202c] border border-[#232d3f] flex flex-col justify-between gap-2 hover:border-[#f0b232] transition-colors"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-slate-100">{tmpl.name}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#f0b232]/20 text-[#f0b232] font-semibold">{tmpl.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-tight">{tmpl.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#222c3e]">
                    <span className="text-[10px] font-mono text-slate-400">{tmpl.duration}s keyframes</span>
                    <button
                      onClick={() => handleApplyTemplate(tmpl)}
                      className="px-3 py-1 rounded-lg bg-[#f0b232] text-slate-950 font-bold text-xs hover:bg-[#f7c34b]"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FREEHAND DRAWING TAB */}
          {activeTab === 'freehand' && (
            <div className="p-4 rounded-2xl bg-[#18202c] border border-[#232d3f] flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#f0b232]/20 text-[#f0b232] flex items-center justify-center">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Freehand Vector Drawing</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Add a responsive drawing layer to sketch with customizable brush size, colors, smoothing, and eraser.
                </p>
              </div>
              <button
                onClick={handleAddDrawing}
                className="px-5 py-2.5 rounded-xl bg-[#f0b232] text-slate-950 font-bold text-xs hover:bg-[#f7c34b] shadow-lg shadow-amber-500/20"
              >
                Create Drawing Layer
              </button>
            </div>
          )}

          {/* TEXT TAB */}
          {activeTab === 'text' && (
            <div className="p-4 rounded-2xl bg-[#18202c] border border-[#232d3f] flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#f0b232]/20 text-[#f0b232] flex items-center justify-center">
                <Type className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Typography Text Layer</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  High-performance text layer with font selection, kerning, alignment, stroke, glow, and keyframing.
                </p>
              </div>
              <button
                onClick={handleAddText}
                className="px-5 py-2.5 rounded-xl bg-[#f0b232] text-slate-950 font-bold text-xs hover:bg-[#f7c34b] shadow-lg shadow-amber-500/20"
              >
                Insert Text Layer
              </button>
            </div>
          )}

          {/* OBJECT / ELEMENT TAB */}
          {activeTab === 'object' && (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleAddShape('rect')}
                className="p-3 rounded-xl bg-[#18202c] border border-[#232d3f] hover:border-[#f0b232] text-left transition-colors"
              >
                <div className="font-semibold text-xs text-slate-100">Null Object</div>
                <div className="text-[10px] text-slate-400 mt-1">Parent transform anchor for multiple layers</div>
              </button>
              <button
                onClick={() => handleAddShape('circle')}
                className="p-3 rounded-xl bg-[#18202c] border border-[#232d3f] hover:border-[#f0b232] text-left transition-colors"
              >
                <div className="font-semibold text-xs text-slate-100">Adjustment Layer</div>
                <div className="text-[10px] text-slate-400 mt-1">Applies color grading & effects to all layers below</div>
              </button>
            </div>
          )}

          {/* VECTOR DRAWING TAB */}
          {activeTab === 'vector' && (
            <div className="p-4 rounded-2xl bg-[#18202c] border border-[#232d3f] flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#f0b232]/20 text-[#f0b232] flex items-center justify-center">
                <PenTool className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-100">Vector Bezier Pen</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm">
                  Precision node-based vector path creator with anchor points and tangent handles.
                </p>
              </div>
              <button
                onClick={handleAddDrawing}
                className="px-5 py-2.5 rounded-xl bg-[#f0b232] text-slate-950 font-bold text-xs hover:bg-[#f7c34b]"
              >
                Launch Pen Canvas
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
