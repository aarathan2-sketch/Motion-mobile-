import React, { useState } from 'react';
import { 
  Plus, Search, Film, Sparkles, Type, Folder, 
  Settings, MoreVertical, Copy, Trash2, Edit3, 
  Download, Play, Cpu, Zap, HardDrive 
} from 'lucide-react';
import { Project, ProjectSettings } from '../../types/project';
import { BrandLogo } from '../common/BrandLogo';
import { AndroidStatusBar } from '../common/AndroidStatusBar';
import { NewProjectModal } from '../modals/NewProjectModal';

interface HomeScreenProps {
  projects: Project[];
  activeProjectId: string;
  onOpenProject: (id: string) => void;
  onCreateProject: (settings: Omit<ProjectSettings, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onDuplicateProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onOpenTemplates: () => void;
  onOpenEffects: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  projects,
  activeProjectId,
  onOpenProject,
  onCreateProject,
  onDuplicateProject,
  onDeleteProject,
  onOpenTemplates,
  onOpenEffects
}) => {
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredProjects = projects.filter(p => 
    searchQuery === '' || p.settings.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center">
      
      {/* Mobile Frame Container */}
      <div className="w-full max-w-xl min-h-screen bg-[#0c1017] flex flex-col border-x border-[#1a2334] relative shadow-2xl">
        
        {/* Status Bar */}
        <AndroidStatusBar />

        {/* Top App Header matching reference screenshot 12 */}
        <div className="px-5 pt-3 pb-2 flex items-center justify-between border-b border-[#1b2332]">
          <BrandLogo size="md" showSubtitle />

          {/* Floating Gold (+) Action Button matching reference */}
          <button
            onClick={() => setIsNewProjectOpen(true)}
            className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#d97706] via-[#f0b232] to-[#fde68a] text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-6 h-6 font-bold" />
          </button>
        </div>

        {/* Greeting & Hardware Status banner strictly matching reference 12 */}
        <div className="px-5 py-4 bg-gradient-to-b from-[#131924] to-transparent border-b border-[#18202d]">
          <h1 className="text-lg font-bold tracking-tight text-slate-100">
            Good morning, Creator
          </h1>
          <p className="text-[11px] text-slate-400 font-mono mt-1 leading-relaxed">
            Video engine ready • H.264 ready + HEVC • 17 hardware paths • up to 32 instances
          </p>
        </div>

        {/* Search Bar & Quick Categories */}
        <div className="p-4 flex flex-col gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects..."
              className="w-full bg-[#141a26] border border-[#232d3f] rounded-2xl px-4 py-2.5 pl-10 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#f0b232] transition-colors"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setIsNewProjectOpen(true)}
              className="p-3 rounded-2xl bg-gradient-to-br from-[#1a2334] to-[#121824] border border-[#243147] hover:border-[#f0b232] flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-[#f0b232]/20 text-[#f0b232] flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">New Project</span>
            </button>

            <button
              onClick={onOpenTemplates}
              className="p-3 rounded-2xl bg-gradient-to-br from-[#1a2334] to-[#121824] border border-[#243147] hover:border-[#f0b232] flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">Templates</span>
            </button>

            <button
              onClick={onOpenEffects}
              className="p-3 rounded-2xl bg-gradient-to-br from-[#1a2334] to-[#121824] border border-[#243147] hover:border-[#f0b232] flex flex-col items-center justify-center text-center transition-all group cursor-pointer"
            >
              <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                <Film className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-200">Effects</span>
            </button>
          </div>
        </div>

        {/* Recent Projects Section */}
        <div className="flex-1 px-4 pb-6 overflow-y-auto">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recent Projects</h2>
            <span className="text-[11px] text-[#f0b232] font-semibold">{filteredProjects.length} Projects</span>
          </div>

          <div className="space-y-3">
            {filteredProjects.map((project) => {
              const isSelected = project.settings.id === activeProjectId;
              const isMenuOpen = activeMenuId === project.settings.id;

              return (
                <div
                  key={project.settings.id}
                  onClick={() => onOpenProject(project.settings.id)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#182132] border-[#f0b232]/80 shadow-lg shadow-amber-500/10'
                      : 'bg-[#141a26] border-[#222c3e] hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    {/* Project Preview Thumbnail Card */}
                    <div className="w-20 h-24 rounded-xl bg-[#090c12] border border-[#222c3e] overflow-hidden relative shrink-0 flex items-center justify-center">
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-[#161f2e] to-[#253248] p-1 text-center">
                        <span className="text-[9px] font-bold text-[#f0b232] uppercase">{project.settings.aspectRatio}</span>
                        <span className="text-[8px] text-slate-400 font-mono mt-0.5">{project.settings.fps} FPS</span>
                        <div className="mt-2 w-6 h-6 rounded-full bg-[#f0b232]/20 flex items-center justify-center text-[#f0b232]">
                          <Play className="w-3 h-3 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>

                    {/* Metadata & Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-100 truncate">
                          {project.settings.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveMenuId(isMenuOpen ? null : project.settings.id);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-white"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono mt-1">
                        {project.settings.width} × {project.settings.height} • {project.settings.duration}s
                      </div>

                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-2">
                        <span>{project.layers.length} Layers</span>
                        <span>•</span>
                        <span>{project.audioTracks.length} Audio</span>
                        <span>•</span>
                        <span>{new Date(project.settings.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Context Menu for Project Actions */}
                  {isMenuOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-4 top-12 z-30 w-36 bg-[#1a2232] border border-[#2b3952] rounded-xl shadow-xl p-1 text-xs"
                    >
                      <button
                        onClick={() => {
                          onDuplicateProject(project.settings.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg hover:bg-[#253147] text-slate-200 flex items-center gap-2 text-left"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#f0b232]" />
                        <span>Duplicate</span>
                      </button>

                      <button
                        onClick={() => {
                          onDeleteProject(project.settings.id);
                          setActiveMenuId(null);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg hover:bg-rose-950/80 text-rose-300 flex items-center gap-2 text-left"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* New Project Configuration Modal */}
        <NewProjectModal
          isOpen={isNewProjectOpen}
          onClose={() => setIsNewProjectOpen(false)}
          onCreate={onCreateProject}
        />

      </div>

    </div>
  );
};
