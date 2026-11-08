import React, { useEffect, useRef, useState } from 'react';
import { computeSwarmStart } from '../utils/particleMath';
import { getCachedParticleSystem, prepareParticleSystem } from '../utils/particleEngine';

interface PhotoParticlesProps {
  sectionRef: React.RefObject<HTMLElement | null>;
  photoTargetRef: React.RefObject<HTMLDivElement | null>;
  isBuildStarted: boolean;
  onPhotoReady: () => void;
  onPhotoFadeIn: () => void;
}

export const PhotoParticles: React.FC<PhotoParticlesProps> = ({
  sectionRef,
  photoTargetRef,
  isBuildStarted,
  onPhotoReady,
  onPhotoFadeIn,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (!isBuildStarted || isDestroyed || isInitializedRef.current) return;
    isInitializedRef.current = true;

    const canvas = canvasRef.current;
    const section = sectionRef.current;
    const photoTarget = photoTargetRef.current;
    if (!canvas || !section || !photoTarget) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false });
    } catch {
      gl = null;
    }

    if (!gl) {
      // Fallback if WebGL unavailable
      onPhotoFadeIn();
      onPhotoReady();
      setIsDestroyed(true);
      return;
    }

    // Normal opaque blending per specification (NEVER additive gl.ONE, gl.ONE or mix-blend-mode)
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const sectionRect = section.getBoundingClientRect();
    const photoRect = photoTarget.getBoundingClientRect();

    canvas.width = Math.floor(sectionRect.width * dpr);
    canvas.height = Math.floor(sectionRect.height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);

    let animId: number = 0;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;

    const vsSource = `
      attribute vec2 a_start;
      attribute vec2 a_target;
      attribute vec3 a_color;
      attribute float a_delay;
      attribute float a_curve;

      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_point_size;

      varying vec3 v_color;
      varying float v_alpha;

      void main() {
        v_color = a_color;
        
        float t = clamp(u_time / 3.6, 0.0, 1.0);
        
        if (t < a_delay) {
          gl_Position = vec4(-2.0, -2.0, 0.0, 1.0);
          gl_PointSize = 0.0;
          v_alpha = 0.0;
          return;
        }
        
        float p = clamp((t - a_delay) / 0.6, 0.0, 1.0);
        float e = 1.0 - pow(1.0 - p, 3.0);
        float wv = sin(p * 3.1415926535) * a_curve;
        
        vec2 diff = a_target - a_start;
        float x = a_start.x + diff.x * e - diff.y * wv;
        float y = a_start.y + diff.y * e + diff.x * wv;
        
        vec2 clipSpace = (vec2(x, y) / u_resolution) * 2.0 - 1.0;
        clipSpace.y = -clipSpace.y;
        
        gl_Position = vec4(clipSpace, 0.0, 1.0);
        gl_PointSize = u_point_size;
        v_alpha = 1.0;
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec3 v_color;
      varying float v_alpha;

      void main() {
        if (v_alpha <= 0.0) discard;
        gl_FragColor = vec4(v_color, v_alpha);
      }
    `;

    function createShader(src: string, type: number) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    // Initialize with precomputed or dynamically loaded system
    async function startBuild() {
      if (!gl || !canvas || !photoTarget || !section) return;

      let sys = getCachedParticleSystem();
      if (!sys) {
        sys = await prepareParticleSystem();
      }

      const { targets, step, naturalWidth, naturalHeight } = sys;
      const particleCount = targets.length;

      const pRect = photoTarget.getBoundingClientRect();
      const sRect = section.getBoundingClientRect();

      const offsetX = pRect.left - sRect.left;
      const offsetY = pRect.top - sRect.top;
      const scaleX = pRect.width / naturalWidth;
      const scaleY = pRect.height / naturalHeight;

      // 8 floats per particle: a_start(2) + a_target(2) + a_color(3) + a_delay(1) + a_curve(1) = 9 floats
      const stride = 9;
      const bufferData = new Float32Array(particleCount * stride);

      for (let i = 0; i < particleCount; i++) {
        const pt = targets[i];
        const { startX, startY, delay, curveK } = computeSwarmStart(
          canvas.width,
          canvas.height,
          i,
          particleCount
        );

        const targetX = (offsetX + pt.targetX * scaleX) * dpr;
        const targetY = (offsetY + pt.targetY * scaleY) * dpr;

        const base = i * stride;
        bufferData[base + 0] = startX;
        bufferData[base + 1] = startY;
        bufferData[base + 2] = targetX;
        bufferData[base + 3] = targetY;
        bufferData[base + 4] = pt.r;
        bufferData[base + 5] = pt.g;
        bufferData[base + 6] = pt.b;
        bufferData[base + 7] = delay;
        bufferData[base + 8] = curveK;
      }

      const vs = createShader(vsSource, gl.VERTEX_SHADER);
      const fs = createShader(fsSource, gl.FRAGMENT_SHADER);
      if (!vs || !fs) return;

      program = gl.createProgram();
      if (!program) return;
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      gl.useProgram(program);

      buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, bufferData, gl.STATIC_DRAW);

      const FSIZE = Float32Array.BYTES_PER_ELEMENT;
      const aStart = gl.getAttribLocation(program, 'a_start');
      const aTarget = gl.getAttribLocation(program, 'a_target');
      const aColor = gl.getAttribLocation(program, 'a_color');
      const aDelay = gl.getAttribLocation(program, 'a_delay');
      const aCurve = gl.getAttribLocation(program, 'a_curve');

      gl.vertexAttribPointer(aStart, 2, gl.FLOAT, false, stride * FSIZE, 0);
      gl.enableVertexAttribArray(aStart);

      gl.vertexAttribPointer(aTarget, 2, gl.FLOAT, false, stride * FSIZE, 2 * FSIZE);
      gl.enableVertexAttribArray(aTarget);

      gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride * FSIZE, 4 * FSIZE);
      gl.enableVertexAttribArray(aColor);

      gl.vertexAttribPointer(aDelay, 1, gl.FLOAT, false, stride * FSIZE, 7 * FSIZE);
      gl.enableVertexAttribArray(aDelay);

      gl.vertexAttribPointer(aCurve, 1, gl.FLOAT, false, stride * FSIZE, 8 * FSIZE);
      gl.enableVertexAttribArray(aCurve);

      const uTime = gl.getUniformLocation(program, 'u_time');
      const uResolution = gl.getUniformLocation(program, 'u_resolution');
      const uPointSize = gl.getUniformLocation(program, 'u_point_size');

      gl.uniform2f(uResolution, canvas.width, canvas.height);
      gl.uniform1f(uPointSize, Math.ceil(step * dpr));

      // Adaptive quality tracking
      let frameCount = 0;
      let totalTime = 0;
      let lastTime = performance.now();
      let activeCount = particleCount;
      let startTime = 0;
      let photoFadeTriggered = false;

      function render(timestamp: number) {
        if (!startTime) startTime = timestamp;
        const elapsedSeconds = (timestamp - startTime) / 1000;

        // Frame time tracking for 60-frame adaptive quality
        const frameDelta = timestamp - lastTime;
        lastTime = timestamp;
        if (frameCount < 60) {
          frameCount++;
          totalTime += frameDelta;
          if (frameCount === 60) {
            const avgTime = totalTime / 60;
            if (avgTime > 22) {
              // Frame time exceeded 22ms: automatically cut particle count by 40%
              activeCount = Math.floor(particleCount * 0.6);
            }
          }
        }

        if (gl && program) {
          gl.clearColor(0, 0, 0, 0);
          gl.clear(gl.COLOR_BUFFER_BIT);

          gl.uniform1f(uTime, Math.min(3.6, elapsedSeconds));
          gl.drawArrays(gl.POINTS, 0, activeCount);
        }

        // At 3.6s: particles reach photo shape, trigger simultaneous 1.0s crossfade to real photo
        if (elapsedSeconds >= 3.6 && !photoFadeTriggered) {
          photoFadeTriggered = true;
          setCanvasOpacity(0);
          onPhotoFadeIn();

          // After 1.0s crossfade completes, destroy canvas completely
          setTimeout(() => {
            if (gl) {
              if (buffer) gl.deleteBuffer(buffer);
              if (program) gl.deleteProgram(program);
              const ext = gl.getExtension('WEBGL_lose_context');
              if (ext) ext.loseContext();
            }
            setIsDestroyed(true);
            onPhotoReady();
          }, 1000);
          return;
        }

        animId = requestAnimationFrame(render);
      }

      animId = requestAnimationFrame(render);
    }

    startBuild().catch((e) => {
      console.error('Particle build error:', e);
      onPhotoFadeIn();
      onPhotoReady();
      setIsDestroyed(true);
    });

    return () => {
      cancelAnimationFrame(animId);
      if (gl) {
        if (buffer) gl.deleteBuffer(buffer);
        if (program) gl.deleteProgram(program);
      }
    };
  }, [isBuildStarted, isDestroyed, onPhotoFadeIn, onPhotoReady, photoTargetRef, sectionRef]);

  if (isDestroyed || !isBuildStarted) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none z-10"
      style={{
        opacity: canvasOpacity,
        transition: 'opacity 1.0s ease-in-out',
        willChange: 'opacity',
        mixBlendMode: 'normal',
        filter: 'none',
        backdropFilter: 'none',
        boxShadow: 'none',
      }}
    />
  );
};
