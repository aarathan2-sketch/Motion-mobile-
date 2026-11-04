import { Layer, Project, EasingPreset, KeyframeTrack, ShapeKind } from '../types/project';

// Cubic Bezier evaluation helper
function cubicBezier(t: number, p1x: number, p1y: number, p2x: number, p2y: number): number {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;

  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  function sampleCurveX(time: number) {
    return ((ax * time + bx) * time + cx) * time;
  }
  function sampleCurveY(time: number) {
    return ((ay * time + by) * time + cy) * time;
  }
  function solveCurveX(x: number) {
    let t0 = 0;
    let t1 = 1;
    let t2 = x;
    if (t2 < 0) return 0;
    if (t2 > 1) return 1;
    for (let i = 0; i < 8; i++) {
      const x2 = sampleCurveX(t2) - x;
      if (Math.abs(x2) < 1e-4) return t2;
      const d2 = (3 * ax * t2 + 2 * bx) * t2 + cx;
      if (Math.abs(d2) < 1e-4) break;
      t2 -= x2 / d2;
    }
    while (t0 < t1) {
      const x2 = sampleCurveX(t2);
      if (Math.abs(x2 - x) < 1e-4) return t2;
      if (x > x2) t0 = t2;
      else t1 = t2;
      t2 = (t1 - t0) * 0.5 + t0;
    }
    return t2;
  }
  return sampleCurveY(solveCurveX(t));
}

// Easing calculator for any progress 0..1
export function calculateEasing(progress: number, easing: EasingPreset, handles?: [number, number, number, number]): number {
  const p = Math.max(0, Math.min(1, progress));
  switch (easing) {
    case 'linear':
      return p;
    case 'ease-in':
      return p * p * p;
    case 'ease-out':
      return 1 - Math.pow(1 - p, 3);
    case 'ease-in-out':
      return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    case 'cubic':
      return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
    case 'bounce': {
      const n1 = 7.5625;
      const d1 = 2.75;
      let q = p;
      if (q < 1 / d1) {
        return n1 * q * q;
      } else if (q < 2 / d1) {
        return n1 * (q -= 1.5 / d1) * q + 0.75;
      } else if (q < 2.5 / d1) {
        return n1 * (q -= 2.25 / d1) * q + 0.9375;
      } else {
        return n1 * (q -= 2.625 / d1) * q + 0.984375;
      }
    }
    case 'elastic': {
      const c4 = (2 * Math.PI) / 3;
      return p === 0 ? 0 : p === 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - 0.75) * c4) + 1;
    }
    case 'bezier':
      if (handles) {
        return cubicBezier(p, handles[0], handles[1], handles[2], handles[3]);
      }
      return p;
    default:
      return p;
  }
}

// Evaluate interpolated value on a track at time t
export function evaluateKeyframeTrack(track: KeyframeTrack, time: number, defaultValue: number): number {
  if (!track.points || track.points.length === 0) return defaultValue;
  if (track.points.length === 1) return track.points[0].value;

  // Sorted points
  const points = [...track.points].sort((a, b) => a.time - b.time);

  if (time <= points[0].time) return points[0].value;
  if (time >= points[points.length - 1].time) return points[points.length - 1].value;

  for (let i = 0; i < points.length - 1; i++) {
    const kfA = points[i];
    const kfB = points[i + 1];
    if (time >= kfA.time && time <= kfB.time) {
      const duration = kfB.time - kfA.time;
      if (duration === 0) return kfA.value;
      const linearT = (time - kfA.time) / duration;
      const easedT = calculateEasing(linearT, kfB.easing || 'linear', kfB.curveHandles);
      return kfA.value + (kfB.value - kfA.value) * easedT;
    }
  }

  return defaultValue;
}

// Blend Mode mapper for 2D Canvas
const BLEND_MODE_MAP: Record<string, GlobalCompositeOperation> = {
  normal: 'source-over',
  multiply: 'multiply',
  screen: 'screen',
  overlay: 'overlay',
  darken: 'darken',
  lighten: 'lighten',
  'color-dodge': 'color-dodge',
  'color-burn': 'color-burn',
  'hard-light': 'hard-light',
  'soft-light': 'soft-light',
  difference: 'difference',
  exclusion: 'exclusion',
  hue: 'hue',
  saturation: 'saturation',
  color: 'color',
  luminosity: 'luminosity'
};

// Image element cache to avoid re-decoding every frame
const imageCache: Map<string, HTMLImageElement> = new Map();

function getCachedImage(src: string): HTMLImageElement | null {
  if (imageCache.has(src)) {
    const img = imageCache.get(src)!;
    return img.complete ? img : null;
  }
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.src = src;
  imageCache.set(src, img);
  return null;
}

export class RenderEngine {
  /**
   * Renders the entire project composition onto the target canvas at time t (seconds)
   */
  public static renderComposition(
    canvas: HTMLCanvasElement,
    project: Project,
    time: number,
    selectedLayerId: string | null = null,
    showOverlays: boolean = true
  ) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Fill Project Background
    if (project.settings.background !== 'transparent') {
      ctx.fillStyle = project.settings.background;
      ctx.fillRect(0, 0, width, height);
    }

    // Sort layers by zIndex or order
    const visibleLayers = [...project.layers]
      .filter(l => l.visible && time >= l.startTime && time <= l.startTime + l.duration)
      .sort((a, b) => a.zIndex - b.zIndex);

    visibleLayers.forEach(layer => {
      this.renderLayer(ctx, layer, time, width, height);
    });

    // Render selection bounding box & handles if a layer is selected and overlays are on
    if (selectedLayerId && showOverlays) {
      const selected = project.layers.find(l => l.id === selectedLayerId);
      if (selected && time >= selected.startTime && time <= selected.startTime + selected.duration) {
        this.renderSelectionGizmo(ctx, selected, time);
      }
    }
  }

  /**
   * Evaluates dynamic layer transform at time t
   */
  public static evaluateLayerTransform(layer: Layer, time: number) {
    const t = layer.transform;
    const kfs = layer.keyframes || [];

    const getTrackVal = (prop: string, defVal: number) => {
      const track = kfs.find(k => k.property === prop);
      return track ? evaluateKeyframeTrack(track, time, defVal) : defVal;
    };

    let posX = getTrackVal('position.x', t.position.x);
    let posY = getTrackVal('position.y', t.position.y);
    const posZ = getTrackVal('position.z', t.position.z);
    let rotZ = getTrackVal('rotation.z', t.rotation.z);
    let scaleX = getTrackVal('scale.x', t.scale.x);
    let scaleY = getTrackVal('scale.y', t.scale.y);
    const skewX = getTrackVal('skew.x', t.skew.x);
    const skewY = getTrackVal('skew.y', t.skew.y);
    const opacity = getTrackVal('opacity', layer.opacity);

    // Apply procedural auto-shake or pulse effects if active on layer
    const shakeEff = layer.effects?.find(e => e.effectId === 'auto-shake' && e.enabled);
    if (shakeEff) {
      const mag = shakeEff.parameters.magnitude ?? 10;
      const speed = shakeEff.parameters.speed ?? 15;
      posX += Math.sin(time * speed) * mag;
      posY += Math.cos(time * speed * 1.3) * mag;
      if (shakeEff.parameters.rotationShake) {
        rotZ += Math.sin(time * speed * 0.7) * (mag * 0.2);
      }
    }

    const pulseEff = layer.effects?.find(e => e.effectId === 'pulse-scale' && e.enabled);
    if (pulseEff) {
      const bpm = pulseEff.parameters.bpm ?? 120;
      const delta = pulseEff.parameters.scaleDelta ?? 0.15;
      const freq = (bpm / 60) * Math.PI * 2;
      const pulseFactor = 1 + Math.sin(time * freq) * delta;
      scaleX *= pulseFactor;
      scaleY *= pulseFactor;
    }

    return {
      posX,
      posY,
      posZ,
      rotZ,
      scaleX,
      scaleY,
      skewX,
      skewY,
      opacity: Math.max(0, Math.min(1, opacity))
    };
  }

  /**
   * Renders an individual layer
   */
  private static renderLayer(
    ctx: CanvasRenderingContext2D,
    layer: Layer,
    time: number,
    canvasWidth: number,
    canvasHeight: number
  ) {
    const tf = this.evaluateLayerTransform(layer, time);
    if (tf.opacity <= 0) return;

    ctx.save();

    // Composite settings
    ctx.globalAlpha = tf.opacity;
    ctx.globalCompositeOperation = BLEND_MODE_MAP[layer.blendMode] || 'source-over';

    // Apply layer filters/effects stack
    let filterStr = '';
    const blurEff = layer.effects?.find(e => e.effectId === 'gaussian-blur' && e.enabled);
    if (blurEff) {
      filterStr += ` blur(${blurEff.parameters.radius || 4}px)`;
    }
    const colorEff = layer.effects?.find(e => e.effectId === 'brightness-contrast' && e.enabled);
    if (colorEff) {
      const b = colorEff.parameters.brightness ?? 1.0;
      const c = colorEff.parameters.contrast ?? 1.0;
      filterStr += ` brightness(${b}) contrast(${c})`;
    }
    const hueEff = layer.effects?.find(e => e.effectId === 'hue-saturation' && e.enabled);
    if (hueEff) {
      const h = hueEff.parameters.hue ?? 0;
      const s = hueEff.parameters.saturation ?? 1.0;
      filterStr += ` hue-rotate(${h}deg) saturate(${s})`;
    }
    if (filterStr.trim()) {
      ctx.filter = filterStr.trim();
    }

    // Apply Glow effect
    const glowEff = layer.effects?.find(e => e.effectId === 'glow' && e.enabled);
    if (glowEff) {
      ctx.shadowColor = glowEff.parameters.color || '#F0B232';
      ctx.shadowBlur = (glowEff.parameters.radius || 20) * (glowEff.parameters.intensity || 1.2);
    }

    // Apply Transformation Matrix
    ctx.translate(tf.posX, tf.posY);
    ctx.rotate((tf.rotZ * Math.PI) / 180);
    ctx.scale(tf.scaleX, tf.scaleY);

    if (tf.skewX !== 0 || tf.skewY !== 0) {
      const tanX = Math.tan((tf.skewX * Math.PI) / 180);
      const tanY = Math.tan((tf.skewY * Math.PI) / 180);
      ctx.transform(1, tanY, tanX, 1, 0, 0);
    }

    // Draw payload based on layer type
    switch (layer.type) {
      case 'shape':
        if (layer.shape) this.drawShape(ctx, layer.shape);
        break;
      case 'text':
        if (layer.text) this.drawText(ctx, layer.text);
        break;
      case 'drawing':
        if (layer.drawing) this.drawDrawing(ctx, layer.drawing);
        break;
      case 'image':
      case 'video':
        if (layer.media) this.drawImage(ctx, layer.media, layer.chromaKey);
        break;
    }

    // Check RGB Split effect (drawn as chromatic offsets)
    const rgbEff = layer.effects?.find(e => e.effectId === 'rgb-split' && e.enabled);
    if (rgbEff && (layer.type === 'text' || layer.type === 'shape')) {
      const offset = rgbEff.parameters.offset || 6;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.translate(offset, 0);
      if (layer.type === 'shape' && layer.shape) {
        this.drawShape(ctx, { ...layer.shape, strokeColor: '#FF0055', strokeWidth: 2, fillColor: 'rgba(255,0,80,0.3)' });
      } else if (layer.type === 'text' && layer.text) {
        this.drawText(ctx, { ...layer.text, color: '#00F0FF' });
      }
      ctx.restore();
    }

    // Check Vignette effect
    const vigEff = layer.effects?.find(e => e.effectId === 'vignette' && e.enabled);
    if (vigEff) {
      this.drawVignette(ctx, canvasWidth, canvasHeight, vigEff.parameters);
    }

    ctx.restore();
  }

  /**
   * Draws vector shapes
   */
  private static drawShape(ctx: CanvasRenderingContext2D, shape: any) {
    const { shapeKind, width, height, fillColor, strokeColor, strokeWidth, cornerRadius = 16, points = 5 } = shape;
    ctx.save();
    ctx.fillStyle = fillColor || '#F0B232';
    ctx.strokeStyle = strokeColor || 'transparent';
    ctx.lineWidth = strokeWidth || 0;

    const w2 = width / 2;
    const h2 = height / 2;

    ctx.beginPath();
    switch (shapeKind as ShapeKind) {
      case 'rect':
        ctx.rect(-w2, -h2, width, height);
        break;
      case 'roundRect':
        ctx.roundRect(-w2, -h2, width, height, cornerRadius);
        break;
      case 'circle':
      case 'ellipse':
        ctx.ellipse(0, 0, Math.abs(w2), Math.abs(h2), 0, 0, Math.PI * 2);
        break;
      case 'triangle':
        ctx.moveTo(0, -h2);
        ctx.lineTo(w2, h2);
        ctx.lineTo(-w2, h2);
        ctx.closePath();
        break;
      case 'polygon': {
        const sides = Math.max(3, points);
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
          const x = w2 * Math.cos(angle);
          const y = h2 * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        break;
      }
      case 'star': {
        const numPoints = Math.max(4, points);
        const innerRadius = w2 * 0.45;
        for (let i = 0; i < numPoints * 2; i++) {
          const r = i % 2 === 0 ? w2 : innerRadius;
          const angle = (i * Math.PI) / numPoints - Math.PI / 2;
          const x = r * Math.cos(angle);
          const y = r * Math.sin(angle);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        break;
      }
      case 'heart': {
        ctx.moveTo(0, h2 * 0.8);
        ctx.bezierCurveTo(-w2 * 1.3, -h2 * 0.2, -w2 * 0.7, -h2, 0, -h2 * 0.4);
        ctx.bezierCurveTo(w2 * 0.7, -h2, w2 * 1.3, -h2 * 0.2, 0, h2 * 0.8);
        ctx.closePath();
        break;
      }
      case 'arrow':
        ctx.moveTo(-w2, -h2 * 0.3);
        ctx.lineTo(0, -h2 * 0.3);
        ctx.lineTo(0, -h2 * 0.7);
        ctx.lineTo(w2, 0);
        ctx.lineTo(0, h2 * 0.7);
        ctx.lineTo(0, h2 * 0.3);
        ctx.lineTo(-w2, h2 * 0.3);
        ctx.closePath();
        break;
      case 'line':
        ctx.moveTo(-w2, 0);
        ctx.lineTo(w2, 0);
        break;
      default:
        ctx.rect(-w2, -h2, width, height);
    }

    if (shape.fillType !== 'none') {
      ctx.fill();
    }
    if (strokeWidth > 0 && strokeColor !== 'transparent') {
      ctx.stroke();
    }
    ctx.restore();
  }

  /**
   * Draws typography text layer
   */
  private static drawText(ctx: CanvasRenderingContext2D, textData: any) {
    const {
      text,
      fontSize = 48,
      fontFamily = 'Outfit',
      fontWeight = '600',
      fontStyle = 'normal',
      color = '#FFFFFF',
      align = 'center',
      strokeColor,
      strokeWidth = 0,
      shadowColor,
      shadowBlur = 0,
      shadowOffsetX = 0,
      shadowOffsetY = 0
    } = textData;

    ctx.save();
    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}, sans-serif`;
    ctx.textAlign = align;
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;

    if (shadowBlur > 0 && shadowColor) {
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = shadowOffsetX;
      ctx.shadowOffsetY = shadowOffsetY;
    }

    // Support multiline text
    const lines = String(text).split('\n');
    const lineHeight = fontSize * 1.25;
    const totalHeight = lines.length * lineHeight;
    const startY = -(totalHeight / 2) + lineHeight / 2;

    lines.forEach((line, index) => {
      const y = startY + index * lineHeight;
      if (strokeWidth > 0 && strokeColor) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.strokeText(line, 0, y);
      }
      ctx.fillText(line, 0, y);
    });

    ctx.restore();
  }

  /**
   * Draws freehand drawing strokes
   */
  private static drawDrawing(ctx: CanvasRenderingContext2D, drawing: any) {
    if (!drawing.strokes || drawing.strokes.length === 0) return;
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    drawing.strokes.forEach((stroke: any) => {
      if (stroke.points.length < 2) return;
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.size;
      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
    ctx.restore();
  }

  /**
   * Draws image / video asset with Chroma Key support
   */
  private static drawImage(ctx: CanvasRenderingContext2D, media: any, chromaKey?: any) {
    const img = getCachedImage(media.src);
    if (!img) return;

    const w = media.naturalWidth || img.width || 400;
    const h = media.naturalHeight || img.height || 400;
    const w2 = w / 2;
    const h2 = h / 2;

    if (chromaKey && chromaKey.enabled) {
      // Offline canvas for pixel manipulation
      const offscreen = document.createElement('canvas');
      offscreen.width = w;
      offscreen.height = h;
      const offCtx = offscreen.getContext('2d');
      if (offCtx) {
        offCtx.drawImage(img, 0, 0, w, h);
        const imgData = offCtx.getImageData(0, 0, w, h);
        const data = imgData.data;

        // Parse key color
        const keyHex = chromaKey.color || '#00FF00';
        const kr = parseInt(keyHex.slice(1, 3), 16) || 0;
        const kg = parseInt(keyHex.slice(3, 5), 16) || 255;
        const kb = parseInt(keyHex.slice(5, 7), 16) || 0;
        const tol = (chromaKey.tolerance ?? 0.35) * 441; // Euclidean max color dist ~441

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const dist = Math.sqrt((r - kr) ** 2 + (g - kg) ** 2 + (b - kb) ** 2);
          if (dist < tol) {
            data[i + 3] = 0; // Transparent
          }
        }
        offCtx.putImageData(imgData, 0, 0);
        ctx.drawImage(offscreen, -w2, -h2, w, h);
        return;
      }
    }

    ctx.drawImage(img, -w2, -h2, w, h);
  }

  /**
   * Draws Vignette falloff
   */
  private static drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number, params: any) {
    const intensity = params.intensity ?? 0.6;
    const radius = (params.radius ?? 0.7) * (Math.max(width, height) / 2);
    const grad = ctx.createRadialGradient(0, 0, radius * 0.5, 0, 0, radius);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, `rgba(0,0,0,${intensity})`);
    ctx.fillStyle = grad;
    ctx.fillRect(-width / 2, -height / 2, width, height);
  }

  /**
   * Renders interactive transform bounding box with corner and rotation handles
   */
  private static renderSelectionGizmo(ctx: CanvasRenderingContext2D, layer: Layer, time: number) {
    const tf = this.evaluateLayerTransform(layer, time);

    let w = 240;
    let h = 120;
    if (layer.shape) {
      w = layer.shape.width;
      h = layer.shape.height;
    } else if (layer.text) {
      w = (layer.text.fontSize * (layer.text.text.length || 8)) * 0.65;
      h = layer.text.fontSize * 1.5;
    } else if (layer.media) {
      w = layer.media.naturalWidth || 360;
      h = layer.media.naturalHeight || 360;
    }

    ctx.save();
    ctx.translate(tf.posX, tf.posY);
    ctx.rotate((tf.rotZ * Math.PI) / 180);
    ctx.scale(tf.scaleX, tf.scaleY);

    const w2 = w / 2;
    const h2 = h / 2;

    // Bounding Box stroke with Motion Mobile Golden theme
    ctx.strokeStyle = '#F0B232';
    ctx.lineWidth = 2.5;
    ctx.setLineDash([6, 4]);
    ctx.strokeRect(-w2, -h2, w, h);
    ctx.setLineDash([]);

    // Corner Handles
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#F0B232';
    ctx.lineWidth = 2;
    const handleSize = 10;
    const corners = [
      [-w2, -h2],
      [w2, -h2],
      [w2, h2],
      [-w2, h2],
      [0, -h2 - 25] // Top rotation handle
    ];

    corners.forEach(([cx, cy], i) => {
      ctx.beginPath();
      if (i === 4) {
        // Rotation handle connection line
        ctx.strokeStyle = '#F0B232';
        ctx.beginPath();
        ctx.moveTo(0, -h2);
        ctx.lineTo(0, -h2 - 25);
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#F0B232';
        ctx.fill();
      } else {
        ctx.rect(cx - handleSize / 2, cy - handleSize / 2, handleSize, handleSize);
        ctx.fill();
        ctx.stroke();
      }
    });

    // Center Anchor Point
    ctx.beginPath();
    ctx.arc(0, 0, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#F0B232';
    ctx.fill();

    ctx.restore();
  }
}
