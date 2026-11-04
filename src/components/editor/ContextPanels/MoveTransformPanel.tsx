import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, Diamond, MoreHorizontal, Move, 
  RotateCw, Maximize2, Scissors, Link2, Unlink2 
} from 'lucide-react';
import { Layer, TransformData } from '../../../types/project';
import { TickScrubber } from '../../common/TickScrubber';

interface MoveTransformPanelProps {
  layer: Layer;
  currentTime: number;
  onUpdateTransform: (transform: TransformData) => void;
  onToggleKeyframe: (property: string, value: number) => void;
  onOpenCurveGraph: () => void;
  onBack: () => void;
}

export const MoveTransformPanel: React.FC<MoveTransformPanelProps> = ({
  layer,
  currentTime,
  onUpdateTransform,
  onToggleKeyframe,
  onOpenCurveGraph,
  onBack
}) => {
  const [mode, setMode] = useState<'position' | 'rotation' | 'scale' | 'skew'>('position');
  const [rotationAxis, setRotationAxis] = useState<'X' | 'Y' | 'Z'>('Z');
  const t = layer.transform;

  // Swipe trackpad handling for position mode
  const trackpadRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleTrackpadPointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    lastPointRef.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handleTrackpadPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    const dx = e.clientX - lastPointRef.current.x;
    const dy = e.clientY - lastPointRef.current.y;
    lastPointRef.current = { x: e.clientX, y: e.clientY };

    onUpdateTransform({
      ...t,
      position: {
        x: Math.round((t.position.x + dx) * 10) / 10,
        y: Math.round((t.position.y + dy) * 10) / 10,
        z: t.position.z
      }
    });
  };

  const handleTrackpadPointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Rotation dial drag handler
  const dialRef = useRef<HTMLDivElement>(null);
  const handleDialPointerMove = (e: React.PointerEvent) => {
    if (!dialRef.current || e.buttons !== 1) return;
    const rect = dialRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const rad = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    const deg = Math.round((rad * 180) / Math.PI);
    onUpdateTransform({
      ...t,
      rotation: {
        ...t.rotation,
        z: (deg + 360) % 360
      }
    });
  };

  // Check if current property has a keyframe at current time
  const currentProp = 
    mode === 'position' ? 'position.x' : 
    mode === 'rotation' ? 'rotation.z' : 
    mode === 'scale' ? 'scale.x' : 'skew.x';
  
  const currentVal = 
    mode === 'position' ? t.position.x : 
    mode === 'rotation' ? t.rotation.z : 
    mode === 'scale' ? t.scale.x : t.skew.x;

  const hasKeyframe = (layer.keyframes || [])
    .find(k => k.property === currentProp)?.points
    .some(p => Math.abs(p.time - currentTime) < 0.05);

  return (
    <div className="w-full bg-[#131722] border-t border-[#1f2838] flex h-52 select-none">
      
      {/* Left Sub-Action Strip strictly matching screenshot 3, 4, 6, 13 */}
      <div className="w-12 border-r border-[#1c2436] flex flex-col items-center justify-between py-2 shrink-0">
        <button
          onClick={onBack}
          title="Back to Toolbar"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => onToggleKeyframe(currentProp, currentVal)}
          title="Add / Remove Keyframe"
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            hasKeyframe ? 'text-[#f0b232] bg-[#f0b232]/20' : 'text-slate-400 hover:text-[#f0b232]'
          }`}
        >
          <Diamond className="w-4 h-4 fill-current" />
        </button>

        <button
          onClick={onOpenCurveGraph}
          title="Open Curve Editor"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#f0b232] flex items-center justify-center transition-colors font-bold text-base"
        >
          ∿
        </button>

        <button
          title="More Options"
          className="w-8 h-8 rounded-lg text-slate-500 hover:text-slate-300 flex items-center justify-center transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Center Interactive Content Area */}
      <div className="flex-1 p-2 sm:p-3 flex flex-col justify-between overflow-hidden">
        
        {/* MODE 1: POSITION / PAN */}
        {mode === 'position' && (
          <div className="flex-1 flex flex-col justify-between">
            {/* Numeric Coordinates Pill */}
            <div className="flex items-center justify-center gap-3">
              <div className="px-4 py-1 rounded-lg bg-[#182132] border border-[#222c3e] flex items-center gap-4 text-xs font-mono">
                <div>
                  <span className="text-[#f0b232] font-bold mr-1">{t.position.x.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-400">X</span>
                </div>
                <div>
                  <span className="text-[#f0b232] font-bold mr-1">{t.position.y.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-400">Y</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold mr-1">{t.position.z.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-500">Z</span>
                </div>
              </div>
            </div>

            {/* Interactive Swipe Trackpad */}
            <div
              ref={trackpadRef}
              onPointerDown={handleTrackpadPointerDown}
              onPointerMove={handleTrackpadPointerMove}
              onPointerUp={handleTrackpadPointerUp}
              onPointerCancel={handleTrackpadPointerUp}
              className="flex-1 my-1.5 rounded-xl bg-[#0e121a] border border-[#1b2332] flex flex-col items-center justify-center cursor-move touch-none relative overflow-hidden group hover:border-[#f0b232]/40 transition-colors"
            >
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="w-16 h-16 rounded-full border border-dashed border-[#f0b232]" />
              </div>
              <span className="text-xs text-slate-400 font-medium z-10 group-hover:text-slate-200 transition-colors">
                Swipe here to move layer
              </span>
            </div>
          </div>
        )}

        {/* MODE 2: ROTATION */}
        {mode === 'rotation' && (
          <div className="flex-1 flex flex-col items-center justify-between">
            {/* Axis Selector */}
            <div className="flex items-center gap-2 p-0.5 bg-[#182132] rounded-lg border border-[#222c3e]">
              {(['X', 'Y', 'Z'] as const).map(axis => (
                <button
                  key={axis}
                  onClick={() => setRotationAxis(axis)}
                  className={`px-3 py-0.5 rounded text-[11px] font-bold transition-colors ${
                    rotationAxis === axis ? 'bg-[#f0b232] text-slate-950' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {axis}
                </button>
              ))}
            </div>

            {/* Rotary Dial */}
            <div
              ref={dialRef}
              onPointerMove={handleDialPointerMove}
              className="relative w-28 h-28 rounded-full border-2 border-[#26334a] bg-[#0e121a] flex items-center justify-center cursor-pointer shadow-inner"
            >
              <div
                style={{ transform: `rotate(${t.rotation.z}deg)` }}
                className="absolute inset-0 flex items-start justify-center pt-1 pointer-events-none transition-transform"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white shadow-md border-2 border-[#f0b232]" />
              </div>
              <div className="text-center pointer-events-none">
                <span className="text-lg font-bold font-mono text-[#f0b232]">
                  {Math.round(t.rotation.z)}°
                </span>
              </div>
            </div>
          </div>
        )}

        {/* MODE 3: SCALE / SIZE */}
        {mode === 'scale' && (
          <div className="flex-1 flex flex-col justify-center gap-2">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-semibold text-slate-300">Scale & Proportions</span>
              <button
                onClick={() => onUpdateTransform({ ...t, lockedAspect: !t.lockedAspect })}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-[#f0b232]"
              >
                {t.lockedAspect ? <Link2 className="w-3.5 h-3.5 text-[#f0b232]" /> : <Unlink2 className="w-3.5 h-3.5" />}
                <span>{t.lockedAspect ? 'Aspect Locked' : 'Free Scale'}</span>
              </button>
            </div>

            <TickScrubber
              value={t.scale.x * 100}
              min={10}
              max={500}
              step={1}
              label="Width Scale"
              unit="%"
              height="h-10"
              onChange={(val) => {
                const s = val / 100;
                onUpdateTransform({
                  ...t,
                  scale: {
                    x: s,
                    y: t.lockedAspect ? s : t.scale.y
                  }
                });
              }}
            />

            <TickScrubber
              value={t.scale.y * 100}
              min={10}
              max={500}
              step={1}
              label="Height Scale"
              unit="%"
              height="h-10"
              onChange={(val) => {
                const s = val / 100;
                onUpdateTransform({
                  ...t,
                  scale: {
                    x: t.lockedAspect ? s : t.scale.x,
                    y: s
                  }
                });
              }}
            />
          </div>
        )}

        {/* MODE 4: SKEW / SHEAR */}
        {mode === 'skew' && (
          <div className="flex-1 flex flex-col justify-center gap-2">
            <TickScrubber
              value={t.skew.x}
              min={-60}
              max={60}
              step={0.5}
              label="X Skew"
              unit="°"
              height="h-10"
              onChange={(val) => onUpdateTransform({ ...t, skew: { ...t.skew, x: val } })}
            />
            <TickScrubber
              value={t.skew.y}
              min={-60}
              max={60}
              step={0.5}
              label="Y Skew"
              unit="°"
              height="h-10"
              onChange={(val) => onUpdateTransform({ ...t, skew: { ...t.skew, y: val } })}
            />
          </div>
        )}

      </div>

      {/* Right Mode Selector Icons strictly matching screenshots 3, 4, 6, 13 */}
      <div className="w-12 border-l border-[#1c2436] flex flex-col items-center justify-between py-2 shrink-0">
        <button
          onClick={() => setMode('position')}
          title="Move & Pan"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            mode === 'position' ? 'bg-[#f0b232] text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Move className="w-4 h-4" />
        </button>

        <button
          onClick={() => setMode('rotation')}
          title="Rotate"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            mode === 'rotation' ? 'bg-[#f0b232] text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          onClick={() => setMode('scale')}
          title="Scale & Size"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            mode === 'scale' ? 'bg-[#f0b232] text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setMode('skew')}
          title="Skew & Shear"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            mode === 'skew' ? 'bg-[#f0b232] text-slate-950 shadow-md shadow-amber-500/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Scissors className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
