import React, { useState } from 'react';
import { X, Smartphone, Monitor, Square, SmartphoneNfc, Edit2, ChevronDown } from 'lucide-react';
import { AspectRatioType, FrameRate, ProjectSettings } from '../../types/project';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (settings: Omit<ProjectSettings, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [tab, setTab] = useState<'project' | 'element'>('project');
  const [projectName, setProjectName] = useState('Project');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  const [resolution, setResolution] = useState<'1080p' | '720p' | '1440p' | '4K'>('1080p');
  const [fps, setFps] = useState<FrameRate>(30);
  const [previewQuality, setPreviewQuality] = useState<100 | 75 | 50 | 25>(100);
  const [background, setBackground] = useState<'#E2E8F0' | '#000000' | 'transparent' | '#FFFFFF'>('#E2E8F0');

  if (!isOpen) return null;

  const handleCreate = () => {
    let width = 1080;
    let height = 1920;
    if (aspectRatio === '16:9') {
      width = 1920;
      height = 1080;
    } else if (aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    } else if (aspectRatio === '4:5') {
      width = 1080;
      height = 1350;
    } else if (aspectRatio === '4:3') {
      width = 1440;
      height = 1080;
    }

    if (resolution === '720p') {
      width = Math.round(width * 0.666);
      height = Math.round(height * 0.666);
    } else if (resolution === '4K') {
      width = width * 2;
      height = height * 2;
    }

    onCreate({
      name: projectName.trim() || 'New Project',
      aspectRatio,
      width,
      height,
      fps,
      previewQuality,
      background,
      duration: 5.0
    });
    onClose();
  };

  const bgNames: Record<string, string> = {
    '#E2E8F0': 'Light Grey',
    '#000000': 'Black',
    'transparent': 'Transparent',
    '#FFFFFF': 'White'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#12161f] border border-[#222b3d] rounded-3xl p-5 sm:p-6 shadow-2xl relative text-slate-100 flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
        
        {/* Segmented Mode: Project vs Element */}
        <div className="grid grid-cols-2 p-1 bg-[#181f2c] rounded-xl border border-[#222c3e]">
          <button
            onClick={() => setTab('project')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'project'
                ? 'bg-transparent border border-[#f0b232] text-[#f0b232] shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Project
          </button>
          <button
            onClick={() => setTab('element')}
            className={`py-2 text-xs font-semibold rounded-lg transition-all ${
              tab === 'element'
                ? 'bg-transparent border border-[#f0b232] text-[#f0b232] shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Element
          </button>
        </div>

        {/* Project Name Input */}
        <div className="relative">
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project Name"
            className="w-full bg-[#181f2c] border border-[#263248] rounded-xl px-4 py-3 text-sm font-medium text-slate-100 focus:outline-none focus:border-[#f0b232] transition-colors pr-10"
          />
          {projectName && (
            <button
              onClick={() => setProjectName('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-700/60 text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Aspect Ratio Selector Row */}
        <div>
          <div className="grid grid-cols-6 gap-2">
            {/* 16:9 */}
            <button
              onClick={() => setAspectRatio('16:9')}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all text-xs font-bold ${
                aspectRatio === '16:9'
                  ? 'bg-[#f0b232] text-[#12161f] border-[#f0b232]'
                  : 'bg-[#181f2c] text-slate-300 border-[#222c3e] hover:border-slate-600'
              }`}
            >
              <Monitor className="w-4 h-4 mb-1" />
              <span>16:9</span>
            </button>

            {/* 9:16 (Active in Gold in Reference) */}
            <button
              onClick={() => setAspectRatio('9:16')}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all text-xs font-bold ${
                aspectRatio === '9:16'
                  ? 'bg-[#f0b232] text-[#12161f] border-[#f0b232]'
                  : 'bg-[#181f2c] text-slate-300 border-[#222c3e] hover:border-slate-600'
              }`}
            >
              <Smartphone className="w-4 h-4 mb-1" />
              <span>9:16</span>
            </button>

            {/* 4:5 */}
            <button
              onClick={() => setAspectRatio('4:5')}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all text-xs font-bold ${
                aspectRatio === '4:5'
                  ? 'bg-[#f0b232] text-[#12161f] border-[#f0b232]'
                  : 'bg-[#181f2c] text-slate-300 border-[#222c3e] hover:border-slate-600'
              }`}
            >
              <SmartphoneNfc className="w-4 h-4 mb-1" />
              <span>4:5</span>
            </button>

            {/* 1:1 */}
            <button
              onClick={() => setAspectRatio('1:1')}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all text-xs font-bold ${
                aspectRatio === '1:1'
                  ? 'bg-[#f0b232] text-[#12161f] border-[#f0b232]'
                  : 'bg-[#181f2c] text-slate-300 border-[#222c3e] hover:border-slate-600'
              }`}
            >
              <Square className="w-4 h-4 mb-1" />
              <span>1:1</span>
            </button>

            {/* 4:3 */}
            <button
              onClick={() => setAspectRatio('4:3')}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all text-xs font-bold ${
                aspectRatio === '4:3'
                  ? 'bg-[#f0b232] text-[#12161f] border-[#f0b232]'
                  : 'bg-[#181f2c] text-slate-300 border-[#222c3e] hover:border-slate-600'
              }`}
            >
              <Monitor className="w-4 h-4 mb-1" />
              <span>4:3</span>
            </button>

            {/* Custom */}
            <button
              onClick={() => setAspectRatio('custom')}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border transition-all text-xs font-bold ${
                aspectRatio === 'custom'
                  ? 'bg-[#f0b232] text-[#12161f] border-[#f0b232]'
                  : 'bg-[#181f2c] text-slate-300 border-[#222c3e] hover:border-slate-600'
              }`}
            >
              <Edit2 className="w-4 h-4 mb-1" />
              <span>Edit</span>
            </button>
          </div>
        </div>

        {/* Resolution Dropdown */}
        <div className="flex items-center justify-between gap-3 bg-[#181f2c] border border-[#222c3e] p-3 rounded-xl">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-200">Resolution</span>
            <span className="text-[10px] text-slate-400">
              Composition Size {aspectRatio === '9:16' ? '1080 × 1920' : '1920 × 1080'}
            </span>
          </div>
          <div className="relative">
            <select
              value={resolution}
              onChange={(e) => setResolution(e.target.value as any)}
              className="appearance-none bg-[#11151e] border border-[#28354c] rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-[#f0b232]"
            >
              <option value="1080p">1080p (FHD)</option>
              <option value="720p">720p (HD)</option>
              <option value="1440p">1440p (2K)</option>
              <option value="4K">4K (Ultra HD)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Frame Rate Dropdown */}
        <div className="flex items-center justify-between gap-3 bg-[#181f2c] border border-[#222c3e] p-3 rounded-xl">
          <span className="text-xs font-medium text-slate-200">Frame Rate</span>
          <div className="relative">
            <select
              value={fps}
              onChange={(e) => setFps(Number(e.target.value) as FrameRate)}
              className="appearance-none bg-[#11151e] border border-[#28354c] rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-[#f0b232]"
            >
              <option value={12}>12 fps</option>
              <option value={15}>15 fps</option>
              <option value={24}>24 fps (Cinema)</option>
              <option value={25}>25 fps (PAL)</option>
              <option value={30}>30 fps</option>
              <option value={50}>50 fps</option>
              <option value={60}>60 fps (Smooth)</option>
              <option value={90}>90 fps</option>
              <option value={120}>120 fps (Pro)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Preview Quality Dropdown */}
        <div className="flex items-center justify-between gap-3 bg-[#181f2c] border border-[#222c3e] p-3 rounded-xl">
          <span className="text-xs font-medium text-slate-200">Preview Quality</span>
          <div className="relative">
            <select
              value={previewQuality}
              onChange={(e) => setPreviewQuality(Number(e.target.value) as any)}
              className="appearance-none bg-[#11151e] border border-[#28354c] rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-[#f0b232]"
            >
              <option value={100}>Full (100%)</option>
              <option value={75}>High (75%)</option>
              <option value={50}>Medium (50%)</option>
              <option value={25}>Draft (25%)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Background Color Dropdown */}
        <div className="flex items-center justify-between gap-3 bg-[#181f2c] border border-[#222c3e] p-3 rounded-xl">
          <span className="text-xs font-medium text-slate-200">Background</span>
          <div className="relative flex items-center gap-2">
            <div
              className="w-4 h-4 rounded border border-slate-500 shadow-sm"
              style={{
                backgroundColor: background === 'transparent' ? '#334155' : background,
                backgroundImage: background === 'transparent' ? 'linear-gradient(45deg, #000 25%, transparent 25%), linear-gradient(-45deg, #000 25%, transparent 25%)' : 'none'
              }}
            />
            <select
              value={background}
              onChange={(e) => setBackground(e.target.value as any)}
              className="appearance-none bg-[#11151e] border border-[#28354c] rounded-lg px-3 py-1.5 pr-8 text-xs font-medium text-slate-200 focus:outline-none focus:border-[#f0b232]"
            >
              <option value="#E2E8F0">Light Grey</option>
              <option value="#000000">Black</option>
              <option value="#FFFFFF">White</option>
              <option value="transparent">Transparent</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Create Project Button (Golden Yellow) */}
        <button
          onClick={handleCreate}
          className="w-full py-3.5 rounded-xl bg-[#f0b232] hover:bg-[#f7c34b] active:scale-[0.99] text-[#0f141d] font-bold text-sm tracking-wide shadow-lg shadow-amber-500/20 transition-all cursor-pointer mt-1"
        >
          Create Project
        </button>

        {/* Close Button X below modal */}
        <div className="flex justify-center pt-1">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-[#181f2c] hover:bg-[#20293a] border border-[#28354c] text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>
  );
};
