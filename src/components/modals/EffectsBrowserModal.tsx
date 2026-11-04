import React, { useState } from 'react';
import { X, Search, Sparkles, Wind, Eye, Wrench } from 'lucide-react';
import { BUILT_IN_EFFECTS, EFFECT_CATEGORIES, EffectDefinition } from '../../constants/effectsList';
import { ActiveEffect } from '../../types/project';

interface EffectsBrowserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEffect: (effect: ActiveEffect) => void;
  onOpenCustomStudio: () => void;
}

export const EffectsBrowserModal: React.FC<EffectsBrowserModalProps> = ({
  isOpen,
  onClose,
  onSelectEffect,
  onOpenCustomStudio
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleApply = (effDef: EffectDefinition) => {
    const defaultParams: Record<string, any> = {};
    effDef.parameters.forEach(p => {
      defaultParams[p.key] = p.defaultVal;
    });

    onSelectEffect({
      id: 'eff-' + Date.now(),
      effectId: effDef.id,
      name: effDef.name,
      category: effDef.category,
      enabled: true,
      parameters: defaultParams
    });
    onClose();
  };

  const filteredEffects = BUILT_IN_EFFECTS.filter(e => {
    const matchesSearch = searchQuery === '' || 
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = !selectedCategory || e.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-xl bg-[#12161f] border border-[#222b3d] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden text-slate-100">
        
        {/* Top Header matching reference screenshot 9 */}
        <div className="flex items-center justify-between border-b border-[#1f2838] pb-3">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#18202d] text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-slate-100">Gold Effects</h2>

          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-32 sm:w-44 bg-[#18202d] border border-[#28354c] rounded-full px-3 py-1 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#f0b232] pl-7"
            />
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Featured Horizontal Cards matching reference screenshot 9 */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          {/* Chroma Key */}
          <button
            onClick={() => {
              const ck = BUILT_IN_EFFECTS.find(e => e.id === 'chroma-key');
              if (ck) handleApply(ck);
            }}
            className="flex-shrink-0 w-32 rounded-xl bg-[#18202c] border border-[#232d3f] hover:border-[#f0b232] overflow-hidden text-center group transition-all"
          >
            <div className="h-20 bg-gradient-to-tr from-emerald-900 to-green-600 flex items-center justify-center p-2 relative">
              <div className="w-10 h-10 rounded-full bg-black/80 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-6 h-6" />
              </div>
            </div>
            <div className="p-2 text-[11px] font-semibold text-slate-200 truncate group-hover:text-[#f0b232]">
              Chroma Key
            </div>
          </button>

          {/* Directional Blur */}
          <button
            onClick={() => {
              const db = BUILT_IN_EFFECTS.find(e => e.id === 'directional-blur');
              if (db) handleApply(db);
            }}
            className="flex-shrink-0 w-32 rounded-xl bg-[#18202c] border border-[#232d3f] hover:border-[#f0b232] overflow-hidden text-center group transition-all"
          >
            <div className="h-20 bg-gradient-to-tr from-blue-900 to-sky-600 flex items-center justify-center p-2">
              <div className="w-12 h-12 rounded-full bg-blue-500/50 blur-[4px] flex items-center justify-center">
                <Wind className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="p-2 text-[11px] font-semibold text-slate-200 truncate group-hover:text-[#f0b232]">
              Directional Blur
            </div>
          </button>

          {/* Fade In / Out */}
          <button
            onClick={() => {
              const fo = BUILT_IN_EFFECTS.find(e => e.id === 'fade-in-out');
              if (fo) handleApply(fo);
            }}
            className="flex-shrink-0 w-32 rounded-xl bg-[#18202c] border border-[#232d3f] hover:border-[#f0b232] overflow-hidden text-center group transition-all"
          >
            <div className="h-20 bg-gradient-to-tr from-slate-900 via-slate-800 to-black flex items-center justify-center p-2">
              <Eye className="w-6 h-6 text-slate-300" />
            </div>
            <div className="p-2 text-[11px] font-semibold text-slate-200 truncate group-hover:text-[#f0b232]">
              Fade In/Out
            </div>
          </button>

          {/* Custom Effect Studio banner */}
          <button
            onClick={() => {
              onClose();
              onOpenCustomStudio();
            }}
            className="flex-shrink-0 w-32 rounded-xl bg-gradient-to-br from-[#d97706]/30 via-[#f0b232]/20 to-black border border-[#f0b232]/50 hover:border-[#f0b232] overflow-hidden text-center group transition-all"
          >
            <div className="h-20 flex flex-col items-center justify-center p-2 text-[#f0b232]">
              <Wrench className="w-7 h-7 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Node / Shader</span>
            </div>
            <div className="p-2 text-[11px] font-bold text-[#f0b232] truncate">
              Custom Studio
            </div>
          </button>
        </div>

        {/* Category Cards Grid strictly matching screenshot 9 */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Categories</span>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-[11px] text-[#f0b232] hover:underline"
              >
                Clear Filter ({selectedCategory})
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {EFFECT_CATEGORIES.map(cat => {
              const isCustom = cat === 'Custom';
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    if (isCustom) {
                      onClose();
                      onOpenCustomStudio();
                    } else {
                      setSelectedCategory(isSelected ? null : cat);
                    }
                  }}
                  className={`relative h-16 rounded-xl p-3 flex items-center justify-center font-bold text-xs sm:text-sm tracking-wide text-center transition-all border ${
                    isCustom
                      ? 'bg-gradient-to-r from-[#b8861d]/40 to-[#f0b232]/30 border-[#f0b232] text-[#f0b232] shadow-md shadow-amber-500/10'
                      : isSelected
                      ? 'bg-[#1e2738] border-[#f0b232] text-[#f0b232]'
                      : 'bg-[#18202d] border-[#232d3f] text-slate-200 hover:border-slate-500 hover:bg-[#1d2738]'
                  }`}
                >
                  <div className="relative z-10">{cat}</div>
                </button>
              );
            })}
          </div>

          {/* Filtered or Expanded Effects List */}
          <div className="pt-2">
            <h4 className="text-xs font-semibold text-slate-400 mb-2">Available Effects</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredEffects.map(eff => (
                <div
                  key={eff.id}
                  onClick={() => handleApply(eff)}
                  className="p-3 rounded-xl bg-[#18202c] border border-[#232d3f] hover:border-[#f0b232] flex items-center justify-between cursor-pointer transition-colors group"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-[#f0b232] transition-colors">{eff.name}</span>
                    <span className="text-[10px] text-slate-400">{eff.category}</span>
                  </div>
                  <button className="px-2.5 py-1 rounded-md bg-[#222c3e] group-hover:bg-[#f0b232] text-slate-300 group-hover:text-slate-950 font-semibold text-[11px] transition-colors">
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
