import React, { useState, useEffect, useRef } from 'react';
import { X, Network, Code2, Sliders, Play, Save, Plus, Trash2, Check, RefreshCw } from 'lucide-react';
import { ShaderEngine, DEFAULT_FRAGMENT_SHADER } from '../../services/shaderEngine';
import { ActiveEffect } from '../../types/project';

interface CustomEffectStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomEffect: (effect: ActiveEffect) => void;
}

interface NodeItem {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
  params: Record<string, any>;
}

export const CustomEffectStudioModal: React.FC<CustomEffectStudioModalProps> = ({
  isOpen,
  onClose,
  onSaveCustomEffect
}) => {
  const [method, setMethod] = useState<'nodes' | 'shader' | 'macro'>('nodes');
  const [effectName, setEffectName] = useState('My Custom Glow Wave');

  // METHOD A: Node Builder State
  const [nodes, setNodes] = useState<NodeItem[]>([
    { id: 'node-in', type: 'input', label: 'Input Image', x: 40, y: 120, params: {} },
    { id: 'node-rgb', type: 'rgbsplit', label: 'RGB Split', x: 220, y: 70, params: { offset: 8 } },
    { id: 'node-glow', type: 'glow', label: 'Glow Bloom', x: 390, y: 140, params: { radius: 24, intensity: 2.0 } },
    { id: 'node-out', type: 'output', label: 'Final Output', x: 560, y: 120, params: {} }
  ]);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('node-glow');

  // METHOD B: Shader Editor State
  const [shaderCode, setShaderCode] = useState(DEFAULT_FRAGMENT_SHADER);
  const [shaderError, setShaderError] = useState<string | null>(null);
  const [glowUniform, setGlowUniform] = useState(1.5);
  const [colorUniform, setColorUniform] = useState('#F0B232');
  const shaderCanvasRef = useRef<HTMLCanvasElement>(null);
  const shaderEngineRef = useRef<ShaderEngine | null>(null);

  // METHOD C: Macro Preset Builder State
  const [macroStack, setMacroStack] = useState<Array<{ name: string; key: string; val: number }>>([
    { name: 'Glow & Bloom', key: 'radius', val: 26 },
    { name: 'RGB Split', key: 'offset', val: 10 },
    { name: 'Wave Warp', key: 'amplitude', val: 14 },
    { name: 'Brightness', key: 'brightness', val: 1.25 }
  ]);

  // Shader compilation and rendering loop
  useEffect(() => {
    if (isOpen && method === 'shader' && shaderCanvasRef.current) {
      if (!shaderEngineRef.current) {
        shaderEngineRef.current = new ShaderEngine(shaderCanvasRef.current);
      }
      const res = shaderEngineRef.current.compileShader(shaderCode);
      if (!res.success) {
        setShaderError(res.error || 'Syntax error in GLSL fragment shader');
      } else {
        setShaderError(null);
      }
    }
  }, [isOpen, method, shaderCode]);

  useEffect(() => {
    let animId: number;
    let startTime = performance.now();

    const loop = (now: number) => {
      if (shaderEngineRef.current && method === 'shader' && !shaderError) {
        const time = (now - startTime) / 1000;
        // Parse color hex to normalized RGB
        const r = parseInt(colorUniform.slice(1, 3), 16) / 255 || 0.94;
        const g = parseInt(colorUniform.slice(3, 5), 16) / 255 || 0.70;
        const b = parseInt(colorUniform.slice(5, 7), 16) / 255 || 0.20;

        shaderEngineRef.current.render(time, {
          u_glow: glowUniform,
          u_color: [r, g, b]
        });
      }
      animId = requestAnimationFrame(loop);
    };

    if (isOpen && method === 'shader') {
      animId = requestAnimationFrame(loop);
    }
    return () => cancelAnimationFrame(animId);
  }, [isOpen, method, shaderError, glowUniform, colorUniform]);

  if (!isOpen) return null;

  const handleAddNode = (type: string, label: string) => {
    const newNode: NodeItem = {
      id: 'node-' + Date.now(),
      type,
      label,
      x: 200 + Math.random() * 80,
      y: 80 + Math.random() * 80,
      params: { strength: 1.0 }
    };
    setNodes([...nodes, newNode]);
    setSelectedNodeId(newNode.id);
  };

  const handleSaveAndApply = () => {
    onSaveCustomEffect({
      id: 'custom-' + Date.now(),
      effectId: method === 'shader' ? 'custom-shader' : 'custom-node-preset',
      name: effectName.trim() || 'Custom Studio Effect',
      category: 'Custom',
      enabled: true,
      parameters: {
        method,
        glow: glowUniform,
        color: colorUniform,
        macroStack,
        shaderCode: method === 'shader' ? shaderCode : undefined
      }
    });
    onClose();
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl bg-[#121620] border border-[#222c3e] rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#1f2838] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#d97706] to-[#f0b232] text-slate-950 flex items-center justify-center font-bold">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Custom Effect Studio</h2>
              <span className="text-[11px] text-slate-400">Node Graph • GPU GLSL Shader • Parameter Macro</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveAndApply}
              className="px-4 py-2 rounded-xl bg-[#f0b232] hover:bg-[#f7c34b] text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Apply</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-[#18202d] text-slate-400 hover:text-white flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Method Selector Tabs */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-[#18202c] rounded-xl border border-[#222c3e]">
            <button
              onClick={() => setMethod('nodes')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                method === 'nodes' ? 'bg-[#f0b232] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              <span>Method A: Node Graph</span>
            </button>
            <button
              onClick={() => setMethod('shader')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                method === 'shader' ? 'bg-[#f0b232] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Method B: GLSL Shader</span>
            </button>
            <button
              onClick={() => setMethod('macro')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                method === 'macro' ? 'bg-[#f0b232] text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Method C: Macro Creator</span>
            </button>
          </div>

          <input
            type="text"
            value={effectName}
            onChange={(e) => setEffectName(e.target.value)}
            className="w-56 bg-[#18202c] border border-[#263248] rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-[#f0b232]"
            placeholder="Effect Name"
          />
        </div>

        {/* MAIN STUDIO WORKSPACE */}
        <div className="flex-1 overflow-hidden min-h-[380px] flex flex-col bg-[#0b0e14] border border-[#1e2638] rounded-2xl relative">
          
          {/* METHOD A: NODE BUILDER */}
          {method === 'nodes' && (
            <div className="w-full h-full flex flex-col sm:flex-row">
              {/* Node Graph Canvas Area */}
              <div className="flex-1 relative overflow-hidden bg-[radial-gradient(#1e2638_1px,transparent_1px)] [background-size:16px_16px] p-4 min-h-[260px]">
                {/* Visual Cables connecting nodes */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {nodes.map((node, i) => {
                    if (i === nodes.length - 1) return null;
                    const next = nodes[i + 1];
                    return (
                      <path
                        key={`cable-${node.id}-${next.id}`}
                        d={`M ${node.x + 110} ${node.y + 35} C ${node.x + 160} ${node.y + 35}, ${next.x - 30} ${next.y + 35}, ${next.x} ${next.y + 35}`}
                        fill="none"
                        stroke="#F0B232"
                        strokeWidth="2.5"
                        strokeDasharray="4 2"
                        className="opacity-80"
                      />
                    );
                  })}
                </svg>

                {/* Nodes on Canvas */}
                {nodes.map((node) => (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    style={{ left: node.x, top: node.y }}
                    className={`absolute w-32 p-2.5 rounded-xl border backdrop-blur-md cursor-pointer transition-all ${
                      selectedNodeId === node.id
                        ? 'bg-[#1a2334] border-[#f0b232] shadow-lg shadow-amber-500/20 scale-105'
                        : 'bg-[#121722]/90 border-[#222c3e] hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-200 truncate">{node.label}</span>
                      <div className="w-2 h-2 rounded-full bg-[#f0b232]" />
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 capitalize">{node.type}</div>
                  </div>
                ))}

                {/* Node Toolbar overlay */}
                <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-[#121722]/90 backdrop-blur border border-[#222c3e] p-1.5 rounded-xl">
                  <span className="text-[10px] text-slate-400 px-2 font-medium">Add Node:</span>
                  <button
                    onClick={() => handleAddNode('blur', 'Gaussian Blur')}
                    className="px-2 py-1 rounded bg-[#1c2436] hover:bg-[#28354c] text-[10px] font-semibold text-slate-200"
                  >
                    + Blur
                  </button>
                  <button
                    onClick={() => handleAddNode('color', 'Color Grade')}
                    className="px-2 py-1 rounded bg-[#1c2436] hover:bg-[#28354c] text-[10px] font-semibold text-slate-200"
                  >
                    + Color
                  </button>
                  <button
                    onClick={() => handleAddNode('distortion', 'Wave Warp')}
                    className="px-2 py-1 rounded bg-[#1c2436] hover:bg-[#28354c] text-[10px] font-semibold text-slate-200"
                  >
                    + Warp
                  </button>
                </div>
              </div>

              {/* Node Properties Sidebar */}
              <div className="w-full sm:w-64 border-t sm:border-t-0 sm:border-l border-[#1e2638] bg-[#121620] p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#222c3e]">
                  <span className="text-xs font-bold text-slate-200">Node Properties</span>
                  {selectedNode && selectedNode.type !== 'input' && selectedNode.type !== 'output' && (
                    <button
                      onClick={() => setNodes(nodes.filter(n => n.id !== selectedNode.id))}
                      className="text-rose-400 hover:text-rose-300 p-1 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {selectedNode ? (
                  <div className="space-y-3">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Node Label</span>
                      <div className="text-xs font-bold text-slate-200 mt-0.5">{selectedNode.label}</div>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">Parameter Intensity</span>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.05"
                        defaultValue="1.0"
                        className="w-full accent-[#f0b232] mt-1"
                      />
                    </div>
                    <div className="p-2.5 rounded-lg bg-[#18202c] text-[11px] text-slate-300 leading-relaxed">
                      This node processes the incoming stream through a modular GPU filter pipeline.
                    </div>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500 text-center py-6">Select a node to inspect parameters</div>
                )}
              </div>
            </div>
          )}

          {/* METHOD B: GLSL SHADER EDITOR */}
          {method === 'shader' && (
            <div className="w-full h-full flex flex-col sm:flex-row">
              {/* Code Editor */}
              <div className="flex-1 flex flex-col border-b sm:border-b-0 sm:border-r border-[#1e2638]">
                <div className="p-2 bg-[#141a24] border-b border-[#1e2638] flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="text-emerald-400 font-bold">fragment_shader.glsl</span>
                    <span>(GLSL ES 1.0)</span>
                  </div>
                  <button
                    onClick={() => {
                      if (shaderCanvasRef.current && shaderEngineRef.current) {
                        const res = shaderEngineRef.current.compileShader(shaderCode);
                        setShaderError(res.success ? null : res.error || 'Failed');
                      }
                    }}
                    className="px-2.5 py-1 rounded bg-[#20293a] hover:bg-[#28354c] text-[10px] font-semibold text-slate-200 flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Compile</span>
                  </button>
                </div>

                <textarea
                  value={shaderCode}
                  onChange={(e) => setShaderCode(e.target.value)}
                  spellCheck={false}
                  className="flex-1 w-full p-4 bg-[#0d1117] font-mono text-xs text-amber-200/90 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-[#f0b232]/50 selection:bg-amber-500/30"
                />

                {shaderError && (
                  <div className="p-2.5 bg-rose-950/80 border-t border-rose-800 text-rose-300 font-mono text-[11px] overflow-x-auto">
                    {shaderError}
                  </div>
                )}
              </div>

              {/* Real-time Shader Preview & Uniforms */}
              <div className="w-full sm:w-72 bg-[#121620] p-4 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-200">Live GPU Shader Preview</span>
                
                <div className="w-full aspect-square bg-black rounded-xl overflow-hidden border border-[#222c3e] relative flex items-center justify-center">
                  <canvas
                    ref={shaderCanvasRef}
                    width={280}
                    height={280}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-mono">u_glow</span>
                      <span className="text-amber-400 font-mono">{glowUniform.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.2"
                      max="3.0"
                      step="0.05"
                      value={glowUniform}
                      onChange={(e) => setGlowUniform(Number(e.target.value))}
                      className="w-full accent-[#f0b232]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-mono">u_color</span>
                      <span className="text-slate-200 font-mono">{colorUniform}</span>
                    </div>
                    <input
                      type="color"
                      value={colorUniform}
                      onChange={(e) => setColorUniform(e.target.value)}
                      className="w-full h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* METHOD C: MACRO PRESET BUILDER */}
          {method === 'macro' && (
            <div className="p-5 flex flex-col gap-4 max-w-xl mx-auto w-full">
              <div>
                <h4 className="text-sm font-bold text-slate-100">Combine Built-in Effects into One Macro</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Stack several effects with custom calibrated parameters and save them as a single high-performance preset.
                </p>
              </div>

              <div className="space-y-2">
                {macroStack.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#18202c] border border-[#222c3e] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-200">{item.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.key}: {item.val}</div>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={item.val}
                      onChange={(e) => {
                        const updated = [...macroStack];
                        updated[idx].val = Number(e.target.value);
                        setMacroStack(updated);
                      }}
                      className="w-32 accent-[#f0b232]"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
