import React from 'react';
import { ArrowLeft, Plus, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react';
import { Layer, ActiveEffect } from '../../../types/project';
import { BUILT_IN_EFFECTS } from '../../../constants/effectsList';

interface LayerEffectsPanelProps {
  layer: Layer;
  onUpdateEffects: (effects: ActiveEffect[]) => void;
  onOpenBrowser: () => void;
  onBack: () => void;
}

export const LayerEffectsPanel: React.FC<LayerEffectsPanelProps> = ({
  layer,
  onUpdateEffects,
  onOpenBrowser,
  onBack
}) => {
  const effects = layer.effects || [];

  const handleToggleEffect = (id: string) => {
    const next = effects.map(e => e.id === id ? { ...e, enabled: !e.enabled } : e);
    onUpdateEffects(next);
  };

  const handleRemoveEffect = (id: string) => {
    const next = effects.filter(e => e.id !== id);
    onUpdateEffects(next);
  };

  const handleParamChange = (effId: string, paramKey: string, val: any) => {
    const next = effects.map(e => {
      if (e.id === effId) {
        return {
          ...e,
          parameters: {
            ...e.parameters,
            [paramKey]: val
          }
        };
      }
      return e;
    });
    onUpdateEffects(next);
  };

  return (
    <div className="w-full bg-[#131722] border-t border-[#1f2838] flex h-52 select-none">
      
      {/* Left Back Strip */}
      <div className="w-12 border-r border-[#1c2436] flex flex-col items-center justify-start py-2 shrink-0">
        <button
          onClick={onBack}
          title="Back"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Main Effects Stack */}
      <div className="flex-1 p-3 flex flex-col justify-between overflow-hidden">
        
        {/* Header & Add Button */}
        <div className="flex items-center justify-between pb-2 border-b border-[#1f2838]">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#f0b232]" />
            <span className="text-xs font-bold text-slate-200">Active Effects ({effects.length})</span>
          </div>

          <button
            onClick={onOpenBrowser}
            className="px-3 py-1 rounded-lg bg-[#f0b232] hover:bg-[#f7c34b] text-slate-950 font-bold text-[11px] flex items-center gap-1 shadow-sm"
          >
            <Plus className="w-3 h-3" />
            <span>Add Effect</span>
          </button>
        </div>

        {/* Scrollable list of active effects */}
        <div className="flex-1 overflow-y-auto space-y-2 py-1 pr-1">
          {effects.map((eff) => {
            const def = BUILT_IN_EFFECTS.find(b => b.id === eff.effectId);
            return (
              <div
                key={eff.id}
                className={`p-2.5 rounded-xl border transition-colors ${
                  eff.enabled ? 'bg-[#182132] border-[#222c3e]' : 'bg-[#121620] border-slate-800 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200">{eff.name}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                      {eff.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggleEffect(eff.id)}
                      className="p-1 text-slate-400 hover:text-white rounded"
                    >
                      {eff.enabled ? <Eye className="w-3.5 h-3.5 text-[#f0b232]" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                    <button
                      onClick={() => handleRemoveEffect(eff.id)}
                      className="p-1 text-slate-400 hover:text-rose-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Effect Parameters Controls */}
                {def && def.parameters.length > 0 && (
                  <div className="space-y-1.5 pt-1 border-t border-[#222c3e]">
                    {def.parameters.slice(0, 2).map((param) => {
                      const val = eff.parameters[param.key] ?? param.defaultVal;
                      return (
                        <div key={param.key} className="flex items-center justify-between gap-3 text-[11px]">
                          <span className="text-slate-400 w-24 truncate">{param.label}</span>
                          {param.type === 'slider' && (
                            <div className="flex-1 flex items-center gap-2">
                              <input
                                type="range"
                                min={param.min}
                                max={param.max}
                                step={param.step}
                                value={val}
                                onChange={(e) => handleParamChange(eff.id, param.key, Number(e.target.value))}
                                className="flex-1 accent-[#f0b232] h-1"
                              />
                              <span className="font-mono text-[10px] text-slate-300 w-8 text-right">
                                {typeof val === 'number' ? val.toFixed(param.step && param.step < 1 ? 1 : 0) : val}
                              </span>
                            </div>
                          )}
                          {param.type === 'color' && (
                            <input
                              type="color"
                              value={val}
                              onChange={(e) => handleParamChange(eff.id, param.key, e.target.value)}
                              className="w-5 h-5 rounded border border-slate-700 bg-transparent cursor-pointer"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {effects.length === 0 && (
            <div className="text-center py-6 text-xs text-slate-500">
              No effects applied to this layer yet. Click "+ Add Effect" to browse.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
