import React, { useRef, useEffect, useState } from 'react';
import { ZoomIn, ZoomOut, Maximize, Eye, Grid } from 'lucide-react';
import { Project, Layer } from '../../types/project';
import { RenderEngine } from '../../services/renderEngine';

interface PreviewCanvasProps {
  project: Project;
  currentTime: number;
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string | null) => void;
  onUpdateLayerTransform: (layerId: string, deltaX: number, deltaY: number) => void;
}

export const PreviewCanvas: React.FC<PreviewCanvasProps> = ({
  project,
  currentTime,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayerTransform
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showOverlays, setShowOverlays] = useState<boolean>(true);

  // Drag-to-position state
  const isDraggingLayerRef = useRef<boolean>(false);
  const startDragCoordRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Re-render composition when project, time, or selected layer changes
  useEffect(() => {
    if (!canvasRef.current) return;
    RenderEngine.renderComposition(
      canvasRef.current,
      project,
      currentTime,
      selectedLayerId,
      showOverlays
    );
  }, [project, currentTime, selectedLayerId, showOverlays]);

  // Handle pointer down on canvas to drag selected layer
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!canvasRef.current || !selectedLayerId) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    isDraggingLayerRef.current = true;
    startDragCoordRef.current = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingLayerRef.current || !canvasRef.current || !selectedLayerId) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const currentX = (e.clientX - rect.left) * scaleX;
    const currentY = (e.clientY - rect.top) * scaleY;

    const dx = currentX - startDragCoordRef.current.x;
    const dy = currentY - startDragCoordRef.current.y;
    startDragCoordRef.current = { x: currentX, y: currentY };

    onUpdateLayerTransform(selectedLayerId, dx, dy);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingLayerRef.current = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  const compWidth = project.settings.width || 1080;
  const compHeight = project.settings.height || 1920;

  return (
    <div
      ref={containerRef}
      className="relative flex-1 w-full bg-[#0a0d13] overflow-hidden flex items-center justify-center p-2 sm:p-4 touch-none select-none"
    >
      {/* Top Left Overlay Controls matching screenshot with magnifying glass [+] */}
      <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-[#121620]/80 backdrop-blur-md border border-[#222c3e] p-1 rounded-xl shadow-lg">
        <button
          onClick={() => setZoomLevel(prev => Math.min(2.5, prev + 0.2))}
          title="Zoom In"
          className="w-7 h-7 rounded-lg text-slate-300 hover:text-[#f0b232] flex items-center justify-center transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.2))}
          title="Zoom Out"
          className="w-7 h-7 rounded-lg text-slate-300 hover:text-[#f0b232] flex items-center justify-center transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(1.0)}
          title="Fit to Screen (100%)"
          className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold text-slate-300 hover:text-white"
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        <button
          onClick={() => setShowGrid(!showGrid)}
          title="Toggle Alignment Grid"
          className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            showGrid ? 'text-[#f0b232] bg-[#f0b232]/20' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Viewport Frame with Shadow and Aspect Ratio */}
      <div
        style={{
          transform: `scale(${zoomLevel})`,
          aspectRatio: `${compWidth} / ${compHeight}`
        }}
        className="relative max-h-full max-w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/80 border border-[#232f45] transition-transform duration-75"
      >
        {/* Render Canvas */}
        <canvas
          ref={canvasRef}
          width={compWidth}
          height={compHeight}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full object-contain cursor-crosshair bg-transparent"
        />

        {/* Alignment Grid Overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-[#f0b232]/20">
            <div className="border-r border-b border-[#f0b232]/20" />
            <div className="border-r border-b border-[#f0b232]/20" />
            <div className="border-b border-[#f0b232]/20" />
            <div className="border-r border-b border-[#f0b232]/20" />
            <div className="border-r border-b border-[#f0b232]/20" />
            <div className="border-b border-[#f0b232]/20" />
            <div className="border-r border-[#f0b232]/20" />
            <div className="border-r border-[#f0b232]/20" />
            <div />
          </div>
        )}
      </div>

    </div>
  );
};
