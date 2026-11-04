import React, { useState, useRef, useEffect } from 'react';
import { X, Check, RotateCcw } from 'lucide-react';
import { EasingPreset } from '../../types/project';

interface CurveGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEasing: EasingPreset;
  currentHandles?: [number, number, number, number];
  onApplyCurve: (easing: EasingPreset, handles?: [number, number, number, number]) => void;
}

export const CurveGraphModal: React.FC<CurveGraphModalProps> = ({
  isOpen,
  onClose,
  currentEasing,
  currentHandles = [0.25, 0.1, 0.25, 1.0],
  onApplyCurve
}) => {
  const [handles, setHandles] = useState<[number, number, number, number]>(currentHandles);
  const [selectedEasing, setSelectedEasing] = useState<EasingPreset>(currentEasing);
  const [draggingHandle, setDraggingHandle] = useState<1 | 2 | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHandles(currentHandles);
      setSelectedEasing(currentEasing);
    }
  }, [isOpen, currentHandles, currentEasing]);

  if (!isOpen) return null;

  // Preset curves
  const PRESETS: Array<{ name: string; type: EasingPreset; handles?: [number, number, number, number] }> = [
    { name: 'Linear', type: 'linear', handles: [0.0, 0.0, 1.0, 1.0] },
    { name: 'Ease In', type: 'ease-in', handles: [0.42, 0.0, 1.0, 1.0] },
    { name: 'Ease Out', type: 'ease-out', handles: [0.0, 0.0, 0.58, 1.0] },
    { name: 'Ease In Out', type: 'ease-in-out', handles: [0.42, 0.0, 0.58, 1.0] },
    { name: 'Fast Out Slow In', type: 'bezier', handles: [0.4, 0.0, 0.2, 1.0] },
    { name: 'Punchy Overshoot', type: 'bezier', handles: [0.34, 1.56, 0.64, 1.0] },
    { name: 'Bounce', type: 'bounce' },
    { name: 'Elastic', type: 'elastic' }
  ];

  const handlePointerDown = (handleNum: 1 | 2, e: React.PointerEvent) => {
    e.stopPropagation();
    setDraggingHandle(handleNum);
    setSelectedEasing('bezier');
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingHandle || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    // Invert Y so bottom is 0, top is 1
    const y = Math.max(-0.5, Math.min(1.5, 1 - (e.clientY - rect.top) / rect.height));

    const next = [...handles] as [number, number, number, number];
    if (draggingHandle === 1) {
      next[0] = Math.round(x * 100) / 100;
      next[1] = Math.round(y * 100) / 100;
    } else {
      next[2] = Math.round(x * 100) / 100;
      next[3] = Math.round(y * 100) / 100;
    }
    setHandles(next);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDraggingHandle(null);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const svgW = 280;
  const svgH = 280;
  // Convert 0..1 to SVG coordinates
  const p0 = { x: 0, y: svgH };
  const p1 = { x: handles[0] * svgW, y: svgH - handles[1] * svgH };
  const p2 = { x: handles[2] * svgW, y: svgH - handles[3] * svgH };
  const p3 = { x: svgW, y: 0 };

  const curvePath = `M ${p0.x} ${p0.y} C ${p1.x} ${p1.y}, ${p2.x} ${p2.y}, ${p3.x} ${p3.y}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#121620] border border-[#222c3e] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f2838] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f0b232]/20 text-[#f0b232] flex items-center justify-center font-bold">
              ∿
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Keyframe Graph Editor</h3>
              <span className="text-[10px] text-slate-400 font-mono">
                cubic-bezier({handles.join(', ')})
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#18202d] text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Bezier Canvas */}
        <div className="relative w-full aspect-square bg-[#0b0e14] border border-[#1e2638] rounded-2xl flex items-center justify-center overflow-hidden p-6 touch-none">
          {/* Subtle Grid Lines */}
          <div className="absolute inset-6 pointer-events-none border border-slate-800/80">
            <div className="w-full h-1/2 border-b border-slate-800/60" />
            <div className="absolute top-0 bottom-0 left-1/2 border-r border-slate-800/60" />
          </div>

          <svg
            ref={svgRef}
            viewBox={`0 0 ${svgW} ${svgH}`}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className="w-full h-full overflow-visible"
          >
            {/* Tangent line 1 */}
            <line
              x1={p0.x}
              y1={p0.y}
              x2={p1.x}
              y2={p1.y}
              stroke="#64748B"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            {/* Tangent line 2 */}
            <line
              x1={p3.x}
              y1={p3.y}
              x2={p2.x}
              y2={p2.y}
              stroke="#64748B"
              strokeWidth="2"
              strokeDasharray="4 3"
            />

            {/* Bezier Curve stroke */}
            <path
              d={curvePath}
              fill="none"
              stroke="#F0B232"
              strokeWidth="4"
              className="drop-shadow-[0_0_8px_#F0B232]"
            />

            {/* Control Point 1 */}
            <circle
              cx={p1.x}
              cy={p1.y}
              r="8"
              fill="#F0B232"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className="cursor-pointer active:scale-125 transition-transform"
              onPointerDown={(e) => handlePointerDown(1, e)}
            />

            {/* Control Point 2 */}
            <circle
              cx={p2.x}
              cy={p2.y}
              r="8"
              fill="#38BDF8"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className="cursor-pointer active:scale-125 transition-transform"
              onPointerDown={(e) => handlePointerDown(2, e)}
            />

            {/* Start and End Anchor points */}
            <circle cx={p0.x} cy={p0.y} r="5" fill="#FFFFFF" />
            <circle cx={p3.x} cy={p3.y} r="5" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Easing Preset Pills */}
        <div className="grid grid-cols-4 gap-1.5">
          {PRESETS.map(p => (
            <button
              key={p.name}
              onClick={() => {
                setSelectedEasing(p.type);
                if (p.handles) setHandles(p.handles);
              }}
              className={`py-1.5 px-2 rounded-lg text-[10px] font-semibold truncate border transition-colors ${
                selectedEasing === p.type
                  ? 'bg-[#f0b232] text-slate-950 border-[#f0b232]'
                  : 'bg-[#18202c] text-slate-300 border-[#222c3e] hover:border-slate-500'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1f2838]">
          <button
            onClick={() => setHandles([0.25, 0.1, 0.25, 1.0])}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Curve</span>
          </button>

          <button
            onClick={() => {
              onApplyCurve(selectedEasing, handles);
              onClose();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#f0b232] hover:bg-[#f7c34b] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
          >
            <Check className="w-4 h-4" />
            <span>Apply to Keyframes</span>
          </button>
        </div>

      </div>
    </div>
  );
};
