import React from 'react';
import { 
  ArrowLeft, Undo2, Redo2, Settings, Download, 
  Plus, Radio, Sparkles, Smartphone, Monitor 
} from 'lucide-react';
import { Project } from '../../types/project';

interface TopToolbarProps {
  project: Project;
  canUndo: boolean;
  canRedo: boolean;
  isWideView: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onBack: () => void;
  onOpenSettings: () => void;
  onOpenExport: () => void;
  onOpenAddLayer: () => void;
  onOpenAudioStudio: () => void;
  onToggleWideView: () => void;
}

export const TopToolbar: React.FC<TopToolbarProps> = ({
  project,
  canUndo,
  canRedo,
  isWideView,
  onUndo,
  onRedo,
  onBack,
  onOpenSettings,
  onOpenExport,
  onOpenAddLayer,
  onOpenAudioStudio,
  onToggleWideView
}) => {
  return (
    <header className="h-14 w-full bg-[#121620] border-b border-[#1f2838] px-3 sm:px-4 flex items-center justify-between select-none z-40">
      
      {/* Left zone: Back button and Project Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          title="Back to Dashboard"
          className="w-9 h-9 rounded-xl bg-[#18202d] hover:bg-[#222c3e] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <span className="text-xs sm:text-sm font-bold text-slate-100 truncate max-w-[140px] sm:max-w-xs">
            {project.settings.name}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">
            {project.settings.aspectRatio} • {project.settings.fps}fps • {project.settings.duration}s
          </span>
        </div>
      </div>

      {/* Center/Right zone: Undo, Redo, Audio Studio, Device Toggle, Export, Settings, Round Gold Add button */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Undo / Redo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 flex items-center justify-center transition-colors"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        <button
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 flex items-center justify-center transition-colors"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        {/* Audio Studio Modal Trigger */}
        <button
          onClick={onOpenAudioStudio}
          title="Open Audio Studio & Mixer"
          className="px-2.5 py-1 rounded-lg bg-[#18202d] hover:bg-[#222c3e] border border-[#232d3f] text-slate-300 hover:text-[#f0b232] text-xs font-semibold flex items-center gap-1 transition-colors"
        >
          <Radio className="w-3.5 h-3.5 text-[#f0b232]" />
          <span className="hidden sm:inline">Audio</span>
        </button>

        {/* Wide/Mobile Screen mode toggle */}
        <button
          onClick={onToggleWideView}
          title={isWideView ? 'Switch to Phone Mockup' : 'Switch to Full Screen Workspace'}
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          {isWideView ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
        </button>

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          title="Project Settings"
          className="w-8 h-8 rounded-lg text-slate-400 hover:text-white flex items-center justify-center transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          title="Export Video"
          className="px-3 py-1.5 rounded-xl bg-[#202a3c] hover:bg-[#2b3850] border border-[#2c3a52] text-slate-200 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-[#f0b232]" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Round Floating Gold (+) Add Button strictly matching all screenshots */}
        <button
          onClick={onOpenAddLayer}
          title="Add Layer / Media / Shape"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#d97706] via-[#f0b232] to-[#fde68a] text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0 ml-1"
        >
          <Plus className="w-5 h-5 font-bold" />
        </button>
      </div>

    </header>
  );
};
