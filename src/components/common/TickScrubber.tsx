import React, { useRef, useState, useEffect } from 'react';

interface TickScrubberProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  onChange: (val: number) => void;
  height?: string;
}

export const TickScrubber: React.FC<TickScrubberProps> = ({
  value,
  min = -10000,
  max = 10000,
  step = 1,
  label,
  unit = '',
  onChange,
  height = 'h-16'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startValRef = useRef(value);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    startXRef.current = e.clientX;
    startValRef.current = value;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startXRef.current;
    // Scale movement to value changes
    const change = deltaX * step * 0.75;
    let nextVal = startValRef.current + change;
    nextVal = Math.max(min, Math.min(max, nextVal));
    onChange(Math.round(nextVal * 10) / 10);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Compute background offset to simulate moving tick tape
  const tapeOffset = (value * 8) % 40;

  return (
    <div className="w-full flex flex-col gap-1 select-none">
      {label && (
        <div className="flex items-center justify-between text-xs px-2 text-slate-400">
          <span>{label}</span>
          <span className="font-mono text-[#f0b232] font-semibold">
            {value.toFixed(step < 1 ? 1 : 0)}{unit}
          </span>
        </div>
      )}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`relative ${height} w-full bg-[#10141e] border border-[#1e2638] rounded-lg cursor-ew-resize overflow-hidden flex items-center justify-center touch-none`}
      >
        {/* Background Vertical Tick Lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, #94a3b8 0px, #94a3b8 1px, transparent 1px, transparent 10px)`,
            backgroundPosition: `${tapeOffset}px 0`
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            backgroundImage: `repeating-linear-gradient(90deg, #e2e8f0 0px, #e2e8f0 1.5px, transparent 1.5px, transparent 50px)`,
            backgroundPosition: `${tapeOffset}px 0`
          }}
        />

        {/* Center Golden Indicator Needle */}
        <div className="absolute top-0 bottom-0 w-0.5 bg-[#f0b232] shadow-[0_0_8px_#f0b232] z-10 pointer-events-none" />

        {/* Center Current Value Badge Overlay */}
        <div className="z-20 pointer-events-none px-2 py-0.5 rounded bg-[#0b0e14]/80 backdrop-blur border border-[#f0b232]/30 text-xs font-mono font-medium text-slate-100">
          {value.toFixed(step < 1 ? 1 : 0)}{unit}
        </div>
      </div>
    </div>
  );
};
