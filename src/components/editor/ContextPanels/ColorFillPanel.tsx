import React, { useState } from 'react';
import { 
  ArrowLeft, Diamond, Ban, Droplet, Layers, 
  Film, Pipette, Palette, SlidersHorizontal 
} from 'lucide-react';
import { Layer } from '../../../types/project';
import { COLOR_SWATCHES } from '../../../constants/sampleAssets';

interface ColorFillPanelProps {
  layer: Layer;
  onUpdateColor: (color: string) => void;
  onBack: () => void;
}

export const ColorFillPanel: React.FC<ColorFillPanelProps> = ({
  layer,
  onUpdateColor,
  onBack
}) => {
  const [fillMode, setFillMode] = useState<'none' | 'solid' | 'gradient' | 'media'>('solid');
  
  const currentColor = 
    layer.shape?.fillColor || 
    layer.text?.color || 
    layer.drawing?.strokes[0]?.color || 
    '#FFFFFF';

  const [hexInput, setHexInput] = useState(currentColor.toUpperCase());

  const handleSwatchSelect = (c: string) => {
    setHexInput(c);
    onUpdateColor(c);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHexInput(val);
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      onUpdateColor(val);
    }
  };

  return (
    <div className="w-full bg-[#131722] border-t border-[#1f2838] flex h-52 select-none">
      
      {/* Left Sub-Action Strip matching reference screenshot 7 */}
      <div className="w-12 border-r border-[#1c2436] flex flex-col items-center justify-between py-2 shrink-0">
        <button
          onClick={onBack}
          title="Back"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <button
          title="Keyframe Color"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#f0b232] flex items-center justify-center transition-colors"
        >
          <Diamond className="w-4 h-4" />
        </button>
        <div className="w-8 h-8 text-slate-400 flex items-center justify-center font-bold">
          ∿
        </div>
      </div>

      {/* Main Color Editing Content */}
      <div className="flex-1 p-2 sm:p-3 flex flex-col justify-between">
        
        {/* Fill Mode Tabs matching screenshot 7 */}
        <div className="flex items-center gap-1.5 p-1 bg-[#182132] rounded-xl border border-[#222c3e] w-fit mx-auto">
          <button
            onClick={() => setFillMode('none')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              fillMode === 'none' ? 'bg-[#f0b232] text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setFillMode('solid')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              fillMode === 'solid' ? 'bg-[#f0b232] text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Droplet className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setFillMode('gradient')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              fillMode === 'gradient' ? 'bg-[#f0b232] text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setFillMode('media')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
              fillMode === 'media' ? 'bg-[#f0b232] text-slate-950' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Hex Input Display matching screenshot 7 */}
        <div className="w-full flex items-center justify-center">
          <div className="w-64 bg-[#10151f] border border-[#232d3f] rounded-lg px-3 py-1.5 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">HEX:</span>
            <input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              className="bg-transparent text-[#f0b232] font-bold text-center focus:outline-none w-28 uppercase"
            />
            <span className="text-slate-400">(100%)</span>
          </div>
        </div>

        {/* 16 Swatches 2-Row Grid matching screenshot 7 */}
        <div className="grid grid-cols-8 gap-1.5 sm:gap-2 max-w-sm mx-auto w-full">
          {COLOR_SWATCHES.map((swatch, idx) => (
            <button
              key={idx}
              onClick={() => handleSwatchSelect(swatch)}
              style={{ backgroundColor: swatch }}
              className={`w-full aspect-square rounded-md border transition-transform active:scale-90 ${
                currentColor.toUpperCase() === swatch.toUpperCase()
                  ? 'border-white ring-2 ring-[#f0b232] scale-110 z-10'
                  : 'border-slate-700/60 hover:scale-105'
              }`}
            />
          ))}
        </div>

      </div>

      {/* Right Tools Strip matching screenshot 7 */}
      <div className="w-12 border-l border-[#1c2436] flex flex-col items-center justify-between py-2 shrink-0">
        <label
          title="Eyedropper / Native Color Picker"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#f0b232] flex items-center justify-center cursor-pointer transition-colors relative"
        >
          <Pipette className="w-4 h-4" />
          <input
            type="color"
            value={currentColor}
            onChange={(e) => handleSwatchSelect(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </label>

        <button
          title="Gradient Designer"
          onClick={() => handleSwatchSelect('#F0B232')}
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#f0b232] flex items-center justify-center transition-colors"
        >
          <Palette className="w-4 h-4" />
        </button>

        <button
          title="Color Wheel"
          onClick={() => handleSwatchSelect('#38BDF8')}
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-[#f0b232] flex items-center justify-center transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
