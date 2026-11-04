import React, { useState } from 'react';
import { X, Download, Film, Sparkles, CheckCircle2, Loader2, FileJson } from 'lucide-react';
import { Project } from '../../types/project';
import { VideoExporter, ExportOptions } from '../../services/videoExporter';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  project
}) => {
  const [format, setFormat] = useState<'mp4' | 'webm' | 'gif' | 'json'>('mp4');
  const [resolution, setResolution] = useState<'720p' | '1080p' | '4K'>('1080p');
  const [fps, setFps] = useState<number>(30);
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartExport = async () => {
    setIsExporting(true);
    setProgress(0);
    setDownloadUrl(null);

    const options: ExportOptions = {
      format,
      resolution,
      fps
    };

    try {
      const url = await VideoExporter.exportVideo(project, options, (p) => {
        setProgress(p);
      });
      setDownloadUrl(url);
    } catch (e) {
      console.error('Export error:', e);
    } finally {
      setIsExporting(false);
    }
  };

  const downloadFileName = `${project.settings.name.toLowerCase().replace(/\s+/g, '_')}_render.${
    format === 'json' ? 'mmp.json' : format === 'mp4' ? 'mp4' : 'webm'
  }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-md bg-[#121620] border border-[#222c3e] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f2838] pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#f0b232]/20 text-[#f0b232] flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">Export & Render Studio</h3>
              <span className="text-[10px] text-slate-400">High-Fidelity Hardware Encoder</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#18202d] text-slate-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selection */}
        <div className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-300">Export Format</span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFormat('mp4')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                format === 'mp4'
                  ? 'bg-[#f0b232] text-slate-950 border-[#f0b232] shadow-md shadow-amber-500/20'
                  : 'bg-[#18202c] text-slate-300 border-[#222c3e] hover:border-slate-500'
              }`}
            >
              MP4 Video
            </button>
            <button
              onClick={() => setFormat('webm')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                format === 'webm'
                  ? 'bg-[#f0b232] text-slate-950 border-[#f0b232] shadow-md shadow-amber-500/20'
                  : 'bg-[#18202c] text-slate-300 border-[#222c3e] hover:border-slate-500'
              }`}
            >
              WebM Video
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                format === 'json'
                  ? 'bg-[#f0b232] text-slate-950 border-[#f0b232] shadow-md shadow-amber-500/20'
                  : 'bg-[#18202c] text-slate-300 border-[#222c3e] hover:border-slate-500'
              }`}
            >
              Project (.mmp)
            </button>
          </div>
        </div>

        {/* Resolution & FPS */}
        {format !== 'json' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-300">Resolution</span>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value as any)}
                className="w-full bg-[#18202c] border border-[#263248] rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-[#f0b232]"
              >
                <option value="720p">720p HD</option>
                <option value="1080p">1080p FHD (Recommended)</option>
                <option value="4K">4K Ultra HD</option>
              </select>
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-300">Frame Rate</span>
              <select
                value={fps}
                onChange={(e) => setFps(Number(e.target.value))}
                className="w-full bg-[#18202c] border border-[#263248] rounded-xl px-3 py-2 text-xs font-medium text-slate-200 focus:outline-none focus:border-[#f0b232]"
              >
                <option value={24}>24 fps (Cinematic)</option>
                <option value={30}>30 fps (Standard)</option>
                <option value={60}>60 fps (Smooth Pro)</option>
              </select>
            </div>
          </div>
        )}

        {/* Progress or Actions */}
        {isExporting ? (
          <div className="p-4 bg-[#18202c] rounded-2xl border border-[#222c3e] flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-[#f0b232] font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Rendering composition frames...</span>
              </div>
              <span className="font-mono text-slate-200 font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-[#0b0e14] rounded-full overflow-hidden">
              <div
                style={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-[#d97706] to-[#f0b232] transition-all duration-150"
              />
            </div>
          </div>
        ) : downloadUrl ? (
          <div className="p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/60 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4" />
              <span>Export Successful!</span>
            </div>
            <a
              href={downloadUrl}
              download={downloadFileName}
              className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
            >
              <Download className="w-4 h-4" />
              <span>Download {downloadFileName}</span>
            </a>
          </div>
        ) : (
          <button
            onClick={handleStartExport}
            className="w-full py-3.5 rounded-xl bg-[#f0b232] hover:bg-[#f7c34b] text-slate-950 font-bold text-xs tracking-wide shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
          >
            <Download className="w-4 h-4" />
            <span>Render & Export</span>
          </button>
        )}

      </div>
    </div>
  );
};
