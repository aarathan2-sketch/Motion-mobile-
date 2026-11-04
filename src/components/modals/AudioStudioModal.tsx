import React, { useState } from 'react';
import { X, Mic, Play, Pause, Volume2, Sliders, Music, Radio, Plus, Trash2, Check } from 'lucide-react';
import { AudioTrack } from '../../types/project';
import { audioEngine } from '../../services/audioEngine';

interface AudioStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  audioTracks: AudioTrack[];
  onUpdateTracks: (tracks: AudioTrack[]) => void;
}

export const AudioStudioModal: React.FC<AudioStudioModalProps> = ({
  isOpen,
  onClose,
  audioTracks,
  onUpdateTracks
}) => {
  const [tracks, setTracks] = useState<AudioTrack[]>(audioTracks);
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(audioTracks[0]?.id || null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);

  if (!isOpen) return null;

  const selectedTrack = tracks.find(t => t.id === selectedTrackId);

  const handleTogglePlay = (track: AudioTrack) => {
    audioEngine.playSynthesizedTrack(track.id, track.src, track.volume);
  };

  const handleRecordToggle = async () => {
    if (!isRecording) {
      const ok = await audioEngine.startRecording();
      if (ok) {
        setIsRecording(true);
        setRecordingSeconds(0);
      }
    } else {
      setIsRecording(false);
      const res = await audioEngine.stopRecording();
      if (res) {
        const newTrack: AudioTrack = {
          id: 'voice-' + Date.now(),
          name: 'Voice Recording ' + (tracks.length + 1),
          src: res.url,
          duration: res.duration,
          startTime: 0,
          volume: 1.0,
          pan: 0,
          muted: false,
          waveformData: audioEngine.generateWaveform(36)
        };
        const updated = [...tracks, newTrack];
        setTracks(updated);
        setSelectedTrackId(newTrack.id);
        onUpdateTracks(updated);
      }
    }
  };

  const handleSave = () => {
    onUpdateTracks(tracks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#121620] border border-[#222c3e] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1f2838] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#d97706] to-[#f0b232] text-slate-950 flex items-center justify-center font-bold">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Audio Studio & Multitrack Mixer</h2>
              <span className="text-[11px] text-slate-400">Equalizer • Reverb • Spatial Pan • Voice Over</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#f0b232] hover:bg-[#f7c34b] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Check className="w-4 h-4" />
              <span>Save Mix</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#18202d] text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Multitrack Waveform Canvas Area */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {tracks.map((track, idx) => {
            const isSelected = track.id === selectedTrackId;
            const waveform = track.waveformData || audioEngine.generateWaveform(32);
            return (
              <div
                key={track.id}
                onClick={() => setSelectedTrackId(track.id)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#182130] border-[#f0b232] shadow-lg shadow-amber-500/10'
                    : 'bg-[#151b27] border-[#222c3e] hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Music className="w-4 h-4 text-[#f0b232]" />
                    <span className="text-xs font-bold text-slate-200">{track.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleTogglePlay(track);
                      }}
                      className="px-2.5 py-1 rounded bg-[#202a3c] hover:bg-[#f0b232] text-slate-300 hover:text-slate-950 text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3" />
                      <span>Preview</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const next = tracks.filter(t => t.id !== track.id);
                        setTracks(next);
                        if (selectedTrackId === track.id) setSelectedTrackId(next[0]?.id || null);
                      }}
                      className="p-1 text-slate-500 hover:text-rose-400 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Waveform Visualization Bars */}
                <div className="h-10 w-full bg-[#0b0e14] rounded-lg p-1.5 flex items-end gap-1 overflow-hidden">
                  {waveform.map((bar, bIdx) => (
                    <div
                      key={bIdx}
                      style={{ height: `${Math.round(bar * 100)}%` }}
                      className={`flex-1 rounded-sm ${isSelected ? 'bg-[#f0b232]' : 'bg-slate-600'}`}
                    />
                  ))}
                </div>
              </div>
            );
          })}

          {tracks.length === 0 && (
            <div className="text-center py-8 text-xs text-slate-400">
              No audio tracks in project. Record voice-over or add music below.
            </div>
          )}
        </div>

        {/* Selected Track Mixer Controls & Recording */}
        <div className="p-4 bg-[#151b27] border border-[#222c3e] rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Microphone Recording Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRecordToggle}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isRecording
                  ? 'bg-rose-600 text-white animate-pulse shadow-lg shadow-rose-600/30'
                  : 'bg-[#202a3c] hover:bg-[#28354c] text-slate-200 border border-[#2c3950]'
              }`}
            >
              <Mic className="w-4 h-4 text-rose-400" />
              <span>{isRecording ? 'Stop Recording' : 'Record Voice-Over'}</span>
            </button>
            {isRecording && (
              <span className="text-xs font-mono text-rose-400 font-bold">● REC</span>
            )}
          </div>

          {/* Quick Sliders: Volume & Pan */}
          {selectedTrack && (
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex flex-col gap-1 w-32">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Volume</span>
                  <span className="font-mono text-[#f0b232]">{Math.round(selectedTrack.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1.5"
                  step="0.05"
                  value={selectedTrack.volume}
                  onChange={(e) => {
                    const next = tracks.map(t => t.id === selectedTrack.id ? { ...t, volume: Number(e.target.value) } : t);
                    setTracks(next);
                  }}
                  className="accent-[#f0b232]"
                />
              </div>

              <div className="flex flex-col gap-1 w-28">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Pan (L/R)</span>
                  <span className="font-mono text-slate-300">{selectedTrack.pan.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value={selectedTrack.pan}
                  onChange={(e) => {
                    const next = tracks.map(t => t.id === selectedTrack.id ? { ...t, pan: Number(e.target.value) } : t);
                    setTracks(next);
                  }}
                  className="accent-[#f0b232]"
                />
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
