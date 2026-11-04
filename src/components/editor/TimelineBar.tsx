import React, { useRef } from 'react';
import { 
  Undo2, Redo2, SkipBack, Play, Pause, SkipForward, 
  Layers, Maximize2, Eye, EyeOff, Lock, Unlock, Volume2, VolumeX 
} from 'lucide-react';
import { Project, Layer } from '../../types/project';

interface TimelineBarProps {
  project: Project;
  currentTime: number;
  isPlaying: boolean;
  selectedLayerId: string | null;
  onTimeChange: (time: number) => void;
  onTogglePlay: () => void;
  onSelectLayer: (id: string | null) => void;
  onToggleLayerVisibility: (id: string) => void;
  onToggleLayerLock: (id: string) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const TimelineBar: React.FC<TimelineBarProps> = ({
  project,
  currentTime,
  isPlaying,
  selectedLayerId,
  onTimeChange,
  onTogglePlay,
  onSelectLayer,
  onToggleLayerVisibility,
  onToggleLayerLock,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  const rulerRef = useRef<HTMLDivElement>(null);
  const totalDuration = project.settings.duration || 5.0;

  // Format time into MM:SS:FF
  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const f = Math.floor((sec % 1) * (project.settings.fps || 30));
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`;
  };

  // Handle click or drag on the ruler to scrub playhead
  const handleRulerPointerDown = (e: React.PointerEvent) => {
    if (!rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onTimeChange(ratio * totalDuration);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleRulerPointerMove = (e: React.PointerEvent) => {
    if (e.buttons !== 1 || !rulerRef.current) return;
    const rect = rulerRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onTimeChange(ratio * totalDuration);
  };

  const selectedLayer = project.layers.find(l => l.id === selectedLayerId);
  const playheadPercent = Math.min(100, (currentTime / totalDuration) * 100);

  return (
    <div className="w-full bg-[#0d1017] border-t border-[#1a2130] flex flex-col select-none">
      
      {/* Playback Controls Row strictly matching reference screenshots */}
      <div className="h-11 px-3 sm:px-4 bg-[#111622] border-b border-[#1c2436] flex items-center justify-between text-slate-300">
        
        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className="w-8 h-8 rounded-lg text-[#f0b232] hover:text-[#f7c34b] disabled:opacity-30 disabled:text-slate-500 flex items-center justify-center transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className="w-8 h-8 rounded-lg text-[#f0b232] hover:text-[#f7c34b] disabled:opacity-30 disabled:text-slate-500 flex items-center justify-center transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Jump Prev, Play/Pause in Gold, Jump Next */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => onTimeChange(0)}
            title="Jump to Start"
            className="w-8 h-8 rounded-lg text-slate-300 hover:text-[#f0b232] flex items-center justify-center transition-colors"
          >
            <SkipBack className="w-4 h-4 text-[#f0b232]" />
          </button>

          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause' : 'Play'}
            className="w-9 h-9 rounded-full bg-[#f0b232] text-slate-950 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-md shadow-amber-500/20"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          <button
            onClick={() => onTimeChange(totalDuration)}
            title="Jump to End"
            className="w-8 h-8 rounded-lg text-slate-300 hover:text-[#f0b232] flex items-center justify-center transition-colors"
          >
            <SkipForward className="w-4 h-4 text-[#f0b232]" />
          </button>
        </div>

        {/* Right side: Layer Stack toggle & Fullscreen */}
        <div className="flex items-center gap-1.5">
          <button
            title="Layer Stack"
            className="w-8 h-8 rounded-lg text-slate-300 hover:text-[#f0b232] flex items-center justify-center transition-colors"
          >
            <Layers className="w-4 h-4 text-[#f0b232]" />
          </button>
          <button
            title="Fit / Fullscreen"
            className="w-8 h-8 rounded-lg text-slate-300 hover:text-[#f0b232] flex items-center justify-center transition-colors"
          >
            <Maximize2 className="w-4 h-4 text-[#f0b232]" />
          </button>
        </div>
      </div>

      {/* Timecode and Ruler Bar strictly matching screenshots */}
      <div className="relative h-7 bg-[#0b0e14] border-b border-[#18202d] flex items-center px-3">
        {/* Floating Timecode Pill strictly matching screenshot e.g. 00:00:00 */}
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded bg-[#18202c] border border-[#2a364c] text-[11px] font-mono font-bold text-slate-100 z-30 shadow-md">
          {formatTimecode(currentTime)}
        </div>

        {/* Green progress line at top of ruler matching screenshots */}
        <div
          style={{ width: `${playheadPercent}%` }}
          className="absolute top-0 left-0 h-0.5 bg-[#10b981] z-20"
        />

        {/* Scrubbable Ruler */}
        <div
          ref={rulerRef}
          onPointerDown={handleRulerPointerDown}
          onPointerMove={handleRulerPointerMove}
          className="relative flex-1 h-full cursor-pointer flex items-center overflow-hidden touch-none"
        >
          <div className="w-full h-full timeline-ticks opacity-40 pointer-events-none" />
          <div className="absolute inset-0 timeline-ticks-major opacity-60 pointer-events-none" />

          {/* White Playhead Needle with triangle head */}
          <div
            style={{ left: `${playheadPercent}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_6px_#ffffff] z-20 pointer-events-none -translate-x-1/2"
          >
            <div className="w-2.5 h-2.5 bg-white rotate-45 -mt-1 -ml-1 shadow-sm" />
          </div>
        </div>
      </div>

      {/* Multitrack Layers Tracks View */}
      <div className="h-28 overflow-y-auto px-2 py-1.5 space-y-1 bg-[#0b0e14]/90 relative">
        {/* Global Playhead vertical line cutting through layers */}
        <div
          style={{ left: `calc(40px + ${playheadPercent * 0.85}%)` }}
          className="absolute top-0 bottom-0 w-0.5 bg-white/70 z-20 pointer-events-none"
        />

        {project.layers.map((layer) => {
          const isSelected = layer.id === selectedLayerId;
          const leftPercent = (layer.startTime / totalDuration) * 100;
          const widthPercent = (layer.duration / totalDuration) * 100;

          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className="h-8 w-full flex items-center gap-1.5 group cursor-pointer"
            >
              {/* Left Eye & Lock Icon strictly matching screenshot 1 */}
              <div className="flex items-center gap-1 w-9 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLayerVisibility(layer.id);
                  }}
                  className="text-slate-400 hover:text-white"
                >
                  {layer.visible ? (
                    <Eye className="w-3.5 h-3.5 text-slate-300" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </button>
              </div>

              {/* Layer Track Clip Pill */}
              <div className="relative flex-1 h-full bg-[#131822] rounded-lg overflow-hidden border border-[#1e2738] flex items-center">
                <div
                  style={{
                    left: `${Math.max(0, leftPercent)}%`,
                    width: `${Math.min(100 - leftPercent, widthPercent)}%`
                  }}
                  className={`absolute top-0.5 bottom-0.5 rounded-md px-2 flex items-center justify-between text-[11px] font-semibold transition-all border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#2dd4bf]/40 via-[#38bdf8]/40 to-[#818cf8]/40 border-[#38bdf8] text-white shadow-md'
                      : 'bg-[#1e2637] border-slate-700/60 text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {/* Left Trim Handle arrow strictly matching screenshot `[ < ]` */}
                  <span className="text-[10px] text-slate-300 font-bold shrink-0">
                    &lt;
                  </span>

                  <span className="truncate px-1.5">
                    {layer.name}
                  </span>

                  {/* Keyframe indicators on clip */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    {layer.keyframes && layer.keyframes.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f0b232]" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Audio Tracks if present */}
        {project.audioTracks.map((track) => (
          <div key={track.id} className="h-7 w-full flex items-center gap-1.5">
            <div className="w-9 shrink-0 flex items-center justify-center text-[#f0b232]">
              <Volume2 className="w-3.5 h-3.5" />
            </div>
            <div className="relative flex-1 h-full bg-[#111827] rounded-lg border border-[#1f2937] px-2 flex items-center">
              <div className="w-full h-full bg-[#10b981]/20 rounded flex items-center px-2">
                <span className="text-[10px] font-medium text-emerald-300 truncate">
                  ♫ {track.name}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
