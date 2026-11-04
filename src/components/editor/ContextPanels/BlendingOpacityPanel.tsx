import React, { useState } from 'react';
import { ArrowLeft, Diamond, ChevronRight, ChevronDown } from 'lucide-react';
import { Layer, BlendMode } from '../../../types/project';

interface BlendingOpacityPanelProps {
  layer: Layer;
  onUpdateOpacity: (opacity: number) => void;
  onUpdateBlendMode: (mode: BlendMode) => void;
  onBack: () => void;
}

export const BlendingOpacityPanel: React.FC<BlendingOpacityPanelProps> = ({
  layer,
  onUpdateOpacity,
  onUpdateBlendMode,
  onBack
}) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Darken');

  const categories: Array<{ name: string; modes: Array<{ label: string; mode: BlendMode }> }> = [
    {
      name: 'Darken',
      modes: [
        { label: 'Darken', mode: 'darken' },
        { label: 'Multiply', mode: 'multiply' },
        { label: 'Color Burn', mode: 'color-burn' }
      ]
    },
    {
      name: 'Lighten',
      modes: [
        { label: 'Lighten', mode: 'lighten' },
        { label: 'Screen', mode: 'screen' },
        { label: 'Color Dodge', mode: 'color-dodge' }
      ]
    },
    {
      name: 'Contrast',
      modes: [
        { label: 'Overlay', mode: 'overlay' },
        { label: 'Soft Light', mode: 'soft-light' },
        { label: 'Hard Light', mode: 'hard-light' }
      ]
    },
    {
      name: 'Difference',
      modes: [
        { label: 'Difference', mode: 'difference' },
        { label: 'Exclusion', mode: 'exclusion' }
      ]
    }
  ];

  return (
    <div className="w-full bg-[#131722] border-t border-[#1f2838] flex h-52 select-none">
      
      {/* Left Sub-Action Strip matching reference screenshot 1 */}
      <div className="w-12 border-r border-[#1c2436] flex flex-col items-center justify-between py-2 shrink-0">
        <button
          onClick={onBack}
          title="Back"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          title="Keyframe Opacity"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#f0b232] flex items-center justify-center transition-colors"
        >
          <Diamond className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 text-slate-400 flex items-center justify-center font-bold">
          ∿
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden">
        
        {/* Opacity Slider Bar strictly matching screenshot 1 */}
        <div className="flex items-center gap-3 bg-[#182132] border border-[#222c3e] rounded-xl px-3 py-2">
          <div className="w-4 h-4 rounded-full border border-slate-500 bg-gradient-to-tr from-slate-400 to-transparent shrink-0" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={layer.opacity}
            onChange={(e) => onUpdateOpacity(Number(e.target.value))}
            className="flex-1 accent-[#f0b232] h-1.5 bg-[#0b0e14] rounded-lg"
          />
          <span className="font-mono text-xs font-bold text-slate-100 w-12 text-right">
            {Math.round(layer.opacity * 100)}%
          </span>
        </div>

        {/* Blend Mode Accordion List matching screenshot 1 */}
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          {/* Normal Mode row */}
          <button
            onClick={() => onUpdateBlendMode('normal')}
            className={`w-full py-2 px-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-colors ${
              layer.blendMode === 'normal'
                ? 'bg-[#1e2738] border-[#f0b232] text-[#f0b232]'
                : 'bg-[#182132] border-[#222c3e] text-slate-300 hover:bg-[#1d2638]'
            }`}
          >
            <span>Normal</span>
            {layer.blendMode === 'normal' && <span className="text-[10px] text-[#f0b232]">● Active</span>}
          </button>

          {categories.map(cat => {
            const isExpanded = expandedCategory === cat.name;
            const hasActiveMode = cat.modes.some(m => m.mode === layer.blendMode);

            return (
              <div key={cat.name} className="rounded-xl border border-[#222c3e] overflow-hidden bg-[#182132]">
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : cat.name)}
                  className="w-full py-2 px-3 flex items-center justify-between text-xs font-semibold text-slate-200 hover:bg-[#1e2738] transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#f0b232]">▶</span>
                    <span>{cat.name}</span>
                  </div>
                  {hasActiveMode && (
                    <span className="text-[10px] font-mono text-[#f0b232] uppercase">
                      {layer.blendMode}
                    </span>
                  )}
                </button>

                {isExpanded && (
                  <div className="p-1.5 bg-[#121620] border-t border-[#222c3e] grid grid-cols-3 gap-1">
                    {cat.modes.map(m => (
                      <button
                        key={m.mode}
                        onClick={() => onUpdateBlendMode(m.mode)}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition-colors ${
                          layer.blendMode === m.mode
                            ? 'bg-[#f0b232] text-slate-950 font-bold'
                            : 'bg-[#182132] text-slate-300 hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
