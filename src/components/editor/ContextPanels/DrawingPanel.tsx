import React, { useState } from 'react';
import { 
  ArrowLeft, Edit2, Brush, PenLine, Eraser, 
  Pipette, Palette, Plus, SlidersHorizontal 
} from 'lucide-react';
import { Layer, DrawingData } from '../../../types/project';
import { COLOR_SWATCHES } from '../../../constants/sampleAssets';

interface DrawingPanelProps {
  layer: Layer;
  onUpdateDrawing: (drawing: DrawingData) => void;
  onBack: () => void;
}

export const DrawingPanel: React.FC<DrawingPanelProps> = ({
  layer,
  onUpdateDrawing,
  onBack
}) => {
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#0000FF');
  const [brushType, setBrushType] = useState<'pen' | 'brush' | 'wavy' | 'eraser'>('pen');

  const drawing = layer.drawing || { strokes: [] };

  const handleClearStrokes = () => {
    onUpdateDrawing({ strokes: [] });
  };

  return (
    <div className="w-full bg-[#131722] border-t border-[#1f2838] flex h-56 select-none">
      
      {/* Main Drawing Controls */}
      <div className="flex-1 p-3 flex flex-col justify-between">
        
        {/* Brush Size Slider row strictly matching screenshot 11 */}
        <div className="flex items-center gap-3 px-1">
          <div
            style={{ width: Math.max(8, brushSize * 2), height: Math.max(8, brushSize * 2), backgroundColor: brushColor }}
            className="rounded-full shrink-0 shadow-sm border border-white/20"
          />
          <input
            type="range"
            min="1"
            max="30"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="flex-1 accent-[#f0b232] h-1.5 bg-[#0b0e14] rounded-lg"
          />
          <div className="px-3 py-1 rounded bg-[#182132] border border-[#222c3e] text-xs font-mono font-bold text-slate-100">
            {brushSize}
          </div>
        </div>

        {/* Current Color Bar strictly matching screenshot 11 */}
        <div
          style={{ backgroundColor: brushColor }}
          className="h-8 rounded-lg px-3 flex items-center justify-between text-xs font-mono font-bold text-white shadow-sm"
        >
          <span>{brushColor.toUpperCase()} (100%)</span>
          <button className="w-5 h-5 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center">
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 16 Swatches 2-Row Grid matching screenshot 11 */}
        <div className="grid grid-cols-8 gap-1.5 max-w-sm mx-auto w-full">
          {COLOR_SWATCHES.map((swatch, idx) => (
            <button
              key={idx}
              onClick={() => setBrushColor(swatch)}
              style={{ backgroundColor: swatch }}
              className={`w-full aspect-square rounded-md border transition-transform active:scale-90 ${
                brushColor.toUpperCase() === swatch.toUpperCase()
                  ? 'border-white ring-2 ring-[#f0b232] scale-110 z-10'
                  : 'border-slate-700/60 hover:scale-105'
              }`}
            />
          ))}
        </div>

      </div>

      {/* Right Brush Tool Selection Strip strictly matching screenshot 11 */}
      <div className="w-12 border-l border-[#1c2436] flex flex-col items-center justify-between py-2 shrink-0">
        <button
          onClick={() => setBrushType('pen')}
          title="Pen"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            brushType === 'pen' ? 'bg-[#f0b232] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          onClick={() => setBrushType('brush')}
          title="Paintbrush"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            brushType === 'brush' ? 'bg-[#f0b232] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Brush className="w-4 h-4" />
        </button>

        <button
          onClick={() => setBrushType('wavy')}
          title="Calligraphy"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            brushType === 'wavy' ? 'bg-[#f0b232] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <PenLine className="w-4 h-4" />
        </button>

        <button
          onClick={() => {
            setBrushType('eraser');
            handleClearStrokes();
          }}
          title="Eraser / Clear"
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
            brushType === 'eraser' ? 'bg-[#f0b232] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
