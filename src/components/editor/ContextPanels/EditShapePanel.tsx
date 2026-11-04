import React from 'react';
import { ArrowLeft, Diamond, Link2, Unlink2 } from 'lucide-react';
import { Layer, ShapeData } from '../../../types/project';
import { TickScrubber } from '../../common/TickScrubber';

interface EditShapePanelProps {
  layer: Layer;
  onUpdateShape: (shape: ShapeData) => void;
  onBack: () => void;
}

export const EditShapePanel: React.FC<EditShapePanelProps> = ({
  layer,
  onUpdateShape,
  onBack
}) => {
  const shape = layer.shape || {
    shapeKind: 'rect',
    width: 300,
    height: 300,
    fillType: 'solid',
    fillColor: '#F0B232',
    strokeColor: '#FFFFFF',
    strokeWidth: 0,
    cornerRadius: 20
  };

  const isAspectLocked = layer.transform.lockedAspect;

  return (
    <div className="w-full bg-[#131722] border-t border-[#1f2838] flex h-52 select-none">
      
      {/* Left Sub-Action Strip matching screenshot 2 */}
      <div className="w-12 border-r border-[#1c2436] flex flex-col items-center justify-between py-2 shrink-0">
        <button
          onClick={onBack}
          title="Back"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          title="Keyframe Shape"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#f0b232] flex items-center justify-center transition-colors"
        >
          <Diamond className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 text-slate-400 flex items-center justify-center font-bold">
          ∿
        </div>
      </div>

      {/* Main Shape Properties */}
      <div className="flex-1 p-2 sm:p-3 flex flex-col justify-between">
        
        {/* Top Size header with X and Y readouts strictly matching screenshot 2 */}
        <div className="flex items-center justify-between px-2">
          <div className="px-3 py-1 rounded bg-[#182132] border border-[#222c3e] text-xs font-bold text-slate-200">
            Size
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-slate-400 mr-1 text-[10px]">X:</span>
              <span className="text-[#f0b232] font-bold">{Math.round(shape.width)}</span>
            </div>
            <div>
              <span className="text-slate-400 mr-1 text-[10px]">Y:</span>
              <span className="text-[#f0b232] font-bold">{Math.round(shape.height)}</span>
            </div>
          </div>
        </div>

        {/* Width & Height Tick Scrubbers */}
        <div className="space-y-1.5">
          <TickScrubber
            value={shape.width}
            min={20}
            max={2000}
            step={2}
            label="Width (X)"
            height="h-10"
            onChange={(val) => {
              onUpdateShape({
                ...shape,
                width: val,
                height: isAspectLocked ? (val * (shape.height / (shape.width || 1))) : shape.height
              });
            }}
          />

          <TickScrubber
            value={shape.height}
            min={20}
            max={2000}
            step={2}
            label="Height (Y)"
            height="h-10"
            onChange={(val) => {
              onUpdateShape({
                ...shape,
                height: val,
                width: isAspectLocked ? (val * (shape.width / (shape.height || 1))) : shape.width
              });
            }}
          />
        </div>

        {/* Corner Radius or Star Points */}
        <div className="flex items-center gap-3 px-1 pt-1 border-t border-[#1c2436]">
          {shape.cornerRadius !== undefined && (
            <div className="flex-1 flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Corner Radius:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={shape.cornerRadius}
                onChange={(e) => onUpdateShape({ ...shape, cornerRadius: Number(e.target.value) })}
                className="flex-1 accent-[#f0b232]"
              />
              <span className="text-xs font-mono text-[#f0b232] w-6">{shape.cornerRadius}</span>
            </div>
          )}

          {shape.points !== undefined && (
            <div className="flex-1 flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Points:</span>
              <input
                type="range"
                min="3"
                max="16"
                value={shape.points}
                onChange={(e) => onUpdateShape({ ...shape, points: Number(e.target.value) })}
                className="flex-1 accent-[#f0b232]"
              />
              <span className="text-xs font-mono text-[#f0b232] w-6">{shape.points}</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
