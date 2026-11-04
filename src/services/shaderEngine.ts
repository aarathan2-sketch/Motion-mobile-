/**
 * WebGL Fragment Shader Engine for Motion Mobile
 * Powers custom GPU effects, shader coding studio, and live shader compilation
 */

export const DEFAULT_FRAGMENT_SHADER = `precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform float u_glow;
uniform vec3 u_color;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    vec2 center = vec2(0.5, 0.5);
    float dist = length(uv - center);
    
    // Animated glowing concentric rings
    float ring = sin(dist * 30.0 - u_time * 4.0);
    ring = abs(ring);
    ring = 0.04 / (ring + 0.05) * u_glow;
    
    vec3 col = u_color * ring;
    gl_FragColor = vec4(col, 1.0);
}
`;

export interface ShaderCompilationResult {
  success: boolean;
  error?: string;
}

export class ShaderEngine {
  private gl: WebGLRenderingContext | null = null;
  private program: WebGLProgram | null = null;
  private positionBuffer: WebGLBuffer | null = null;
  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.gl = canvas.getContext('webgl', { preserveDrawingBuffer: true });
    if (this.gl) {
      this.initBuffers();
    }
  }

  private initBuffers() {
    if (!this.gl) return;
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    this.positionBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
  }

  public compileShader(fragmentSource: string): ShaderCompilationResult {
    if (!this.gl) return { success: false, error: 'WebGL not supported' };

    const vsSource = `
      attribute vec2 a_position;
      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
      }
    `;

    // Compile Vertex Shader
    const vs = this.gl.createShader(this.gl.VERTEX_SHADER)!;
    this.gl.shaderSource(vs, vsSource);
    this.gl.compileShader(vs);

    // Compile Fragment Shader
    const fs = this.gl.createShader(this.gl.FRAGMENT_SHADER)!;
    this.gl.shaderSource(fs, fragmentSource);
    this.gl.compileShader(fs);

    if (!this.gl.getShaderParameter(fs, this.gl.COMPILE_STATUS)) {
      const err = this.gl.getShaderInfoLog(fs) || 'Fragment shader compilation failed';
      this.gl.deleteShader(vs);
      this.gl.deleteShader(fs);
      return { success: false, error: err };
    }

    const prog = this.gl.createProgram()!;
    this.gl.attachShader(prog, vs);
    this.gl.attachShader(prog, fs);
    this.gl.linkProgram(prog);

    if (!this.gl.getProgramParameter(prog, this.gl.LINK_STATUS)) {
      const err = this.gl.getProgramInfoLog(prog) || 'Program link failed';
      return { success: false, error: err };
    }

    if (this.program) {
      this.gl.deleteProgram(this.program);
    }
    this.program = prog;
    return { success: true };
  }

  public render(time: number, uniforms: Record<string, any> = {}) {
    if (!this.gl || !this.program) return;

    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    this.gl.useProgram(this.program);

    // Set standard uniforms
    const uRes = this.gl.getUniformLocation(this.program, 'u_resolution');
    if (uRes) this.gl.uniform2f(uRes, this.canvas.width, this.canvas.height);

    const uTime = this.gl.getUniformLocation(this.program, 'u_time');
    if (uTime) this.gl.uniform1f(uTime, time);

    // Set user-defined uniforms
    Object.entries(uniforms).forEach(([key, val]) => {
      const loc = this.gl!.getUniformLocation(this.program!, key);
      if (!loc) return;
      if (typeof val === 'number') {
        this.gl!.uniform1f(loc, val);
      } else if (Array.isArray(val)) {
        if (val.length === 2) this.gl!.uniform2f(loc, val[0], val[1]);
        if (val.length === 3) this.gl!.uniform3f(loc, val[0], val[1], val[2]);
        if (val.length === 4) this.gl!.uniform4f(loc, val[0], val[1], val[2], val[3]);
      }
    });

    const posAttr = this.gl.getAttribLocation(this.program, 'a_position');
    this.gl.enableVertexAttribArray(posAttr);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.vertexAttribPointer(posAttr, 2, this.gl.FLOAT, false, 0, 0);

    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
  }
}
