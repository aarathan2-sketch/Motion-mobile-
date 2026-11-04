import React from 'react';
import { ArrowLeft, Diamond, Shield } from 'lucide-react';
import { Layer } from '../../../types/project';

interface BorderShadowPanelProps {
  layer: Layer;
  onUpdateStroke: (strokeColor: string, strokeWidth: number) => void;
  onBack: () => void;
}

export const BorderShadowPanel: React.FC<BorderShadowPanelProps> = ({
  layer,
  onUpdateStroke,
  onBack
}) => {
  const currentWidth = layer.shape?.strokeWidth || layer.text?.strokeWidth || 0;
  const currentColor = layer.shape?.strokeColor || layer.text?.strokeColor || '#F0B232';

  return (
    <div className="w-full bg-[#131722] border-t border-[#1f2838] flex h-52 select-none">
      
      {/* Left Sub-Action Strip */}
      <div className="w-12 border-r border-[#1c2436] flex flex-col items-center justify-between py-2 shrink-0">
        <button
          onClick={onBack}
          title="Back"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          title="Keyframe Stroke"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#f0b232] flex items-center justify-center transition-colors"
        >
          <Diamond className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 text-slate-400 flex items-center justify-center font-bold">
          ∿
        </div>
      </div>

      {/* Main Border & Shadow Content */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Border & Stroke Outline</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-[#f0b232]">{currentWidth}px</span>
          </div>
        </div>

        {/* Stroke Width Slider */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>Stroke Thickness</span>
          </div>
          <input
            type="range"
            min="0"
            max="40"
            value={currentWidth}
            onChange={(e) => onUpdateStroke(currentColor, Number(e.target.value))}
            className="w-full accent-[#f0b232]"
          />
        </div>

        {/* Stroke Color Picker */}
        <div className="flex items-center justify-between bg-[#182132] border border-[#222c3e] p-2 rounded-xl">
          <span className="text-xs text-slate-300 font-medium">Stroke Color</span>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentColor}
              onChange={(e) => onUpdateStroke(e.target.value, currentWidth || 4)}
              className="w-7 h-7 rounded border border-slate-700 bg-transparent cursor-pointer"
            />
            <span className="font-mono text-xs text-slate-300 uppercase">{currentColor}</span>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-[#182132] border border-[#222c3e] text-[11px] text-slate-400">
          Pro-tip: Combine thick border with Blending Mode 'Screen' to produce glowing vector decals.
        </div>
      </div>

    </div>
  );
};
