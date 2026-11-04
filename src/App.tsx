import React, { useState, useEffect } from 'react';
import { Project, ProjectSettings } from './types/project';
import { ProjectStorage, INITIAL_DEMO_PROJECT } from './services/projectStorage';
import { HomeScreen } from './components/home/HomeScreen';
import { EditorWorkspace } from './components/editor/EditorWorkspace';
import { EffectsBrowserModal } from './components/modals/EffectsBrowserModal';
import { CustomEffectStudioModal } from './components/modals/CustomEffectStudioModal';
import { AddLayerModal } from './components/modals/AddLayerModal';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'editor'>('home');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProjectId, setActiveProjectId] = useState<string>('');
  
  // Secondary modals accessible from Home
  const [isHomeEffectsOpen, setIsHomeEffectsOpen] = useState(false);
  const [isCustomStudioOpen, setIsCustomStudioOpen] = useState(false);
  const [isHomeTemplatesOpen, setIsHomeTemplatesOpen] = useState(false);

  // Initialize projects on load
  useEffect(() => {
    const loaded = ProjectStorage.getProjects();
    setProjects(loaded);
    const activeId = ProjectStorage.getActiveProjectId();
    setActiveProjectId(activeId || loaded[0]?.settings.id || INITIAL_DEMO_PROJECT.settings.id);
  }, []);

  const activeProject = projects.find(p => p.settings.id === activeProjectId) || projects[0] || INITIAL_DEMO_PROJECT;

  const handleOpenProject = (id: string) => {
    setActiveProjectId(id);
    ProjectStorage.setActiveProjectId(id);
    setCurrentView('editor');
  };

  const handleCreateProject = (settings: Omit<ProjectSettings, 'id' | 'createdAt' | 'updatedAt'>) => {
    const created = ProjectStorage.createProject(settings);
    setProjects(ProjectStorage.getProjects());
    setActiveProjectId(created.settings.id);
    setCurrentView('editor');
  };

  const handleDuplicateProject = (id: string) => {
    const duplicated = ProjectStorage.duplicateProject(id);
    if (duplicated) {
      setProjects(ProjectStorage.getProjects());
    }
  };

  const handleDeleteProject = (id: string) => {
    ProjectStorage.deleteProject(id);
    const list = ProjectStorage.getProjects();
    setProjects(list);
    setActiveProjectId(list[0]?.settings.id || '');
  };

  const handleSaveProject = (updated: Project) => {
    ProjectStorage.saveProject(updated);
    setProjects(ProjectStorage.getProjects());
  };

  return (
    <div className="w-full min-h-screen bg-[#07090e] font-['Outfit',sans-serif] text-slate-100 antialiased select-none">
      {currentView === 'home' ? (
        <HomeScreen
          projects={projects}
          activeProjectId={activeProjectId}
          onOpenProject={handleOpenProject}
          onCreateProject={handleCreateProject}
          onDuplicateProject={handleDuplicateProject}
          onDeleteProject={handleDeleteProject}
          onOpenTemplates={() => setIsHomeTemplatesOpen(true)}
          onOpenEffects={() => setIsHomeEffectsOpen(true)}
        />
      ) : (
        <EditorWorkspace
          key={activeProject.settings.id}
          initialProject={activeProject}
          onBackToHome={() => setCurrentView('home')}
          onSaveProject={handleSaveProject}
        />
      )}

      {/* Standalone Effects Browser from Home */}
      <EffectsBrowserModal
        isOpen={isHomeEffectsOpen}
        onClose={() => setIsHomeEffectsOpen(false)}
        onSelectEffect={() => {
          setIsHomeEffectsOpen(false);
          setCurrentView('editor');
        }}
        onOpenCustomStudio={() => {
          setIsHomeEffectsOpen(false);
          setIsCustomStudioOpen(true);
        }}
      />

      {/* Standalone Custom Effect Studio Modal */}
      <CustomEffectStudioModal
        isOpen={isCustomStudioOpen}
        onClose={() => setIsCustomStudioOpen(false)}
        onSaveCustomEffect={() => {
          setIsCustomStudioOpen(false);
          setCurrentView('editor');
        }}
      />

      {/* Standalone Templates modal from Home */}
      <AddLayerModal
        isOpen={isHomeTemplatesOpen}
        onClose={() => setIsHomeTemplatesOpen(false)}
        currentTime={0}
        onAddLayer={(newLayer) => {
          setIsHomeTemplatesOpen(false);
          // Insert layer into active project and switch to editor
          const updated = {
            ...activeProject,
            layers: [...activeProject.layers, { ...newLayer, id: 'layer-' + Date.now(), zIndex: activeProject.layers.length + 1 }]
          };
          handleSaveProject(updated);
          setCurrentView('editor');
        }}
      />
    </div>
  );
}
