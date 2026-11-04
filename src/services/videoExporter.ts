import { Project } from '../types/project';
import { RenderEngine } from './renderEngine';

export interface ExportOptions {
  format: 'mp4' | 'webm' | 'gif' | 'json';
  resolution: '480p' | '720p' | '1080p' | '4K';
  fps: number;
}

export class VideoExporter {
  public static async exportVideo(
    project: Project,
    options: ExportOptions,
    onProgress: (percent: number) => void
  ): Promise<string> {
    // If user selected project package JSON export
    if (options.format === 'json') {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
      return dataStr;
    }

    const duration = project.settings.duration || 5.0;
    const fps = options.fps || 30;
    const totalFrames = Math.ceil(duration * fps);

    // Dimension setup based on resolution
    let targetWidth = 1080;
    let targetHeight = 1920;
    if (options.resolution === '720p') {
      targetWidth = 720;
      targetHeight = 1280;
    } else if (options.resolution === '4K') {
      targetWidth = 2160;
      targetHeight = 3840;
    }
    if (project.settings.aspectRatio === '16:9') {
      const temp = targetWidth;
      targetWidth = targetHeight;
      targetHeight = temp;
    } else if (project.settings.aspectRatio === '1:1') {
      targetHeight = targetWidth;
    }

    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = targetWidth;
    offscreenCanvas.height = targetHeight;

    // Check MediaRecorder stream support
    const stream = offscreenCanvas.captureStream(fps);
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm';
    }

    const recordedChunks: Blob[] = [];
    let recorder: MediaRecorder;
    try {
      recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8000000 });
    } catch {
      recorder = new MediaRecorder(stream);
    }

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        recordedChunks.push(e.data);
      }
    };

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const videoUrl = URL.createObjectURL(blob);
        onProgress(100);
        resolve(videoUrl);
      };

      recorder.start();

      let currentFrame = 0;
      const frameInterval = 1000 / fps;

      const renderNextFrame = () => {
        if (currentFrame >= totalFrames) {
          recorder.stop();
          return;
        }

        const currentTime = (currentFrame / fps);
        RenderEngine.renderComposition(offscreenCanvas, project, currentTime, null, false);
        currentFrame++;
        const percent = Math.min(99, Math.round((currentFrame / totalFrames) * 100));
        onProgress(percent);

        setTimeout(renderNextFrame, frameInterval / 2);
      };

      renderNextFrame();
    });
  }
}
