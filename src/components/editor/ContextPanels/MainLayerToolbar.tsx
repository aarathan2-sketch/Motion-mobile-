import React from 'react';
import { 
  Gauge, Scissors, Volume2, VolumeX, Palette, Shield, 
  Layers, Move, Shapes, Star, Sparkles, Copy, Trash2 
} from 'lucide-react';
import { Layer } from '../../../types/project';

interface MainLayerToolbarProps {
  layer: Layer;
  onOpenPanel: (panel: 'transform' | 'color' | 'border' | 'blending' | 'shape' | 'presets' | 'effects' | 'drawing') => void;
  onSplitLeft: () => void;
  onSplitCenter: () => void;
  onSplitRight: () => void;
  onToggleMute: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export const MainLayerToolbar: React.FC<MainLayerToolbarProps> = ({
  layer,
  onOpenPanel,
  onSplitLeft,
  onSplitCenter,
  onSplitRight,
  onToggleMute,
  onDuplicate,
  onDelete
}) => {
  const isAudioMuted = layer.audio?.muted ?? false;

  return (
    <div className="w-full bg-[#131722] border-t border-[#1f2838] flex flex-col p-2.5 sm:p-3 select-none">
      
      {/* Quick Action Top Row matching Screenshot 5 */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2 pb-2.5 mb-2.5 border-b border-[#1c2436]">
        {/* Speed button with NEW badge */}
        <button
          onClick={() => onOpenPanel('transform')}
          className="relative py-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] text-slate-200 flex flex-col items-center justify-center transition-colors group"
        >
          <span className="absolute -top-1.5 right-1.5 text-[8px] font-bold px-1 rounded bg-[#f0b232] text-slate-950">
            NEW
          </span>
          <Gauge className="w-4 h-4 text-slate-300 group-hover:text-[#f0b232] transition-colors" />
        </button>

        {/* Trim Left */}
        <button
          onClick={onSplitLeft}
          title="Trim Start to Playhead"
          className="py-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] text-slate-200 flex items-center justify-center transition-colors group"
        >
          <span className="text-xs font-mono font-bold tracking-tighter text-slate-300 group-hover:text-[#f0b232]">
            ] [
          </span>
        </button>

        {/* Split Clip Center */}
        <button
          onClick={onSplitCenter}
          title="Split Layer into Two Clips"
          className="py-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] text-slate-200 flex items-center justify-center transition-colors group"
        >
          <Scissors className="w-4 h-4 text-slate-300 group-hover:text-[#f0b232]" />
        </button>

        {/* Trim Right */}
        <button
          onClick={onSplitRight}
          title="Trim End from Playhead"
          className="py-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] text-slate-200 flex items-center justify-center transition-colors group"
        >
          <span className="text-xs font-mono font-bold tracking-tighter text-slate-300 group-hover:text-[#f0b232]">
            ] [
          </span>
        </button>

        {/* Mute Toggle */}
        <button
          onClick={onToggleMute}
          className="py-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] text-slate-200 flex items-center justify-center transition-colors group"
        >
          {isAudioMuted ? (
            <VolumeX className="w-4 h-4 text-rose-400" />
          ) : (
            <Volume2 className="w-4 h-4 text-slate-300 group-hover:text-[#f0b232]" />
          )}
        </button>
      </div>

      {/* 7-Card Grid strictly matching screenshot 5 */}
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
        {/* Color & Fill */}
        <button
          onClick={() => onOpenPanel('color')}
          className="p-2 sm:p-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] flex flex-col items-center justify-center text-center transition-all group"
        >
          <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-[#f0b232] mb-1 transition-colors" />
          <span className="text-[10px] sm:text-xs font-semibold text-slate-300 group-hover:text-slate-100">
            Color & Fill
          </span>
        </button>

        {/* Border & Shadow */}
        <button
          onClick={() => onOpenPanel('border')}
          className="p-2 sm:p-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] flex flex-col items-center justify-center text-center transition-all group"
        >
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-[#f0b232] mb-1 transition-colors" />
          <span className="text-[10px] sm:text-xs font-semibold text-slate-300 group-hover:text-slate-100">
            Border & Shadow
          </span>
        </button>

        {/* Blending & Opacity */}
        <button
          onClick={() => onOpenPanel('blending')}
          className="p-2 sm:p-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] flex flex-col items-center justify-center text-center transition-all group"
        >
          <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-[#f0b232] mb-1 transition-colors" />
          <span className="text-[10px] sm:text-xs font-semibold text-slate-300 group-hover:text-slate-100">
            Blending & Opacity
          </span>
        </button>

        {/* Move & Transform */}
        <button
          onClick={() => onOpenPanel('transform')}
          className="p-2 sm:p-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] flex flex-col items-center justify-center text-center transition-all group"
        >
          <Move className="w-4 h-4 sm:w-5 sm:h-5 text-[#f0b232] mb-1 transition-colors" />
          <span className="text-[10px] sm:text-xs font-semibold text-slate-300 group-hover:text-[#f0b232]">
            Move & Transform
          </span>
        </button>

        {/* Edit Shape (or Drawing if drawing layer) */}
        {layer.type === 'drawing' ? (
          <button
            onClick={() => onOpenPanel('drawing')}
            className="p-2 sm:p-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] flex flex-col items-center justify-center text-center transition-all group"
          >
            <Shapes className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-[#f0b232] mb-1 transition-colors" />
            <span className="text-[10px] sm:text-xs font-semibold text-slate-300 group-hover:text-slate-100">
              Edit Drawing
            </span>
          </button>
        ) : (
          <button
            onClick={() => onOpenPanel('shape')}
            className="p-2 sm:p-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] flex flex-col items-center justify-center text-center transition-all group"
          >
            <Shapes className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-[#f0b232] mb-1 transition-colors" />
            <span className="text-[10px] sm:text-xs font-semibold text-slate-300 group-hover:text-slate-100">
              Edit Shape
            </span>
          </button>
        )}

        {/* Presets with NEW badge */}
        <button
          onClick={() => onOpenPanel('presets')}
          className="relative p-2 sm:p-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] flex flex-col items-center justify-center text-center transition-all group"
        >
          <span className="absolute -top-1.5 right-1.5 text-[8px] font-bold px-1 rounded bg-[#f0b232] text-slate-950">
            NEW
          </span>
          <Star className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-[#f0b232] mb-1 transition-colors" />
          <span className="text-[10px] sm:text-xs font-semibold text-slate-300 group-hover:text-slate-100">
            Presets
          </span>
        </button>

        {/* Effects */}
        <button
          onClick={() => onOpenPanel('effects')}
          className="p-2 sm:p-2.5 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] flex flex-col items-center justify-center text-center transition-all group"
        >
          <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-slate-300 group-hover:text-[#f0b232] mb-1 transition-colors" />
          <span className="text-[10px] sm:text-xs font-semibold text-slate-300 group-hover:text-slate-100">
            Effects ({layer.effects?.length || 0})
          </span>
        </button>

        {/* Layer Duplicate / Delete quick action */}
        <div className="flex gap-1">
          <button
            onClick={onDuplicate}
            title="Duplicate Layer"
            className="flex-1 rounded-xl bg-[#1b2232] hover:bg-[#253047] border border-[#232d42] flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            title="Delete Layer"
            className="flex-1 rounded-xl bg-[#1b2232] hover:bg-rose-950/60 border border-[#232d42] hover:border-rose-800 flex items-center justify-center text-slate-400 hover:text-rose-400 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};
