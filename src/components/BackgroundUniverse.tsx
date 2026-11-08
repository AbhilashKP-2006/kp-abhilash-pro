import React, { useEffect, useRef } from 'react';

interface BackgroundUniverseProps {
  canStart: boolean;
}

export const BackgroundUniverse: React.FC<BackgroundUniverseProps> = ({ canStart }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canStart) return;

    // Check prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl', { alpha: true, antialias: false, depth: false });
    } catch {
      gl = null;
    }
    if (!gl) return;

    const isMobile = window.innerWidth < 768;
    const width = window.innerWidth;
    const height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Particle count: 1 per 1800 sq px, max 1000 desktop, 350 mobile
    const area = width * height;
    const maxParticles = isMobile ? 350 : 1000;
    const count = Math.min(maxParticles, Math.max(150, Math.floor(area / 1800)));

    // Shader source
    const vsSource = `
      attribute vec2 a_base_pos;    // Normalized [0, 1] screen coordinates
      attribute float a_depth;      // [0.1, 1.0] depth factor (1.0 = near, 0.1 = far)
      attribute vec3 a_color;       // Base RGB color
      attribute float a_sway_seed;  // Random phase for sway & twinkle
      attribute float a_size;       // Point size

      uniform float u_time;
      uniform float u_scroll_y;
      uniform vec2 u_mouse;         // In canvas pixels
      uniform float u_home_fade;    // 0.1 on Home screen -> 1.0 down the page
      uniform vec2 u_resolution;

      varying vec3 v_color;
      varying float v_alpha;

      void main() {
        // Downward drift: 14 px/s for near particles, scaled by depth
        float speed = 14.0 * a_depth;
        float yOffset = mod(u_time * speed + u_scroll_y * (0.15 + a_depth * 0.35), u_resolution.y);
        
        // Sideways sway: ~22px
        float sway = sin(u_time * 0.8 + a_sway_seed) * 22.0 * a_depth;
        
        // Current position in screen space
        vec2 pos = vec2(
          mod(a_base_pos.x * u_resolution.x + sway, u_resolution.x),
          mod(a_base_pos.y * u_resolution.y + yOffset, u_resolution.y)
        );

        // Cursor push interaction: within 120px, gentle push
        float distToMouse = distance(pos, u_mouse);
        if (distToMouse < 120.0 && u_mouse.x > 0.0) {
          float force = (1.0 - distToMouse / 120.0);
          vec2 pushDir = normalize(pos - u_mouse + vec2(0.001, 0.001));
          pos += pushDir * force * 35.0;
        }

        // Clip space transformation
        vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
        clipSpace.y = -clipSpace.y;

        gl_Position = vec4(clipSpace, 0.0, 1.0);
        gl_PointSize = a_size;

        // Twinkle (~20% opacity oscillation) + depth opacity [0.3 to 0.85]
        float baseOpacity = mix(0.3, 0.85, a_depth);
        float twinkle = 1.0 + 0.2 * sin(u_time * 1.5 + a_sway_seed * 2.0);
        
        v_color = a_color;
        v_alpha = clamp(baseOpacity * twinkle * u_home_fade, 0.05, 0.9);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec3 v_color;
      varying float v_alpha;

      void main() {
        gl_FragColor = vec4(v_color, v_alpha);
      }
    `;

    // Helpers to compile
    function compile(src: string, type: number) {
      if (!gl) return null;
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const vs = compile(vsSource, gl.VERTEX_SHADER);
    const fs = compile(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    // Build particle data once:
    // a_base_pos(2) + a_depth(1) + a_color(3) + a_sway_seed(1) + a_size(1) = 8 floats per particle
    const stride = 8;
    const vertexData = new Float32Array(count * stride);

    for (let i = 0; i < count; i++) {
      const base = i * stride;
      vertexData[base + 0] = Math.random(); // base X
      vertexData[base + 1] = Math.random(); // base Y
      
      const depth = 0.2 + Math.random() * 0.8; // depth [0.2, 1.0]
      vertexData[base + 2] = depth;

      // Color distribution:
      // ~94% B&W: 42% white, 30% light grey, 22% mid grey
      // 6% soft tints (2% blue, 2% warm orange, 2% teal)
      const roll = Math.random();
      let r = 0.98, g = 0.98, b = 0.98; // bright white rgb(250,250,250)
      if (roll < 0.42) {
        r = 250 / 255; g = 250 / 255; b = 250 / 255;
      } else if (roll < 0.72) {
        r = 200 / 255; g = 200 / 255; b = 205 / 255; // light grey
      } else if (roll < 0.94) {
        r = 105 / 255; g = 105 / 255; b = 110 / 255; // mid grey
      } else if (roll < 0.96) {
        r = 150 / 255; g = 170 / 255; b = 220 / 255; // soft blue
      } else if (roll < 0.98) {
        r = 225 / 255; g = 165 / 255; b = 125 / 255; // soft warm orange
      } else {
        r = 130 / 255; g = 200 / 255; b = 190 / 255; // soft teal
      }

      vertexData[base + 3] = r;
      vertexData[base + 4] = g;
      vertexData[base + 5] = b;
      vertexData[base + 6] = Math.random() * Math.PI * 2; // sway seed
      vertexData[base + 7] = (0.7 + depth * 1.5) * dpr;   // size: 0.7 to 2.2 px
    }

    const vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

    const FSIZE = Float32Array.BYTES_PER_ELEMENT;
    const aBasePos = gl.getAttribLocation(prog, 'a_base_pos');
    const aDepth = gl.getAttribLocation(prog, 'a_depth');
    const aColor = gl.getAttribLocation(prog, 'a_color');
    const aSway = gl.getAttribLocation(prog, 'a_sway_seed');
    const aSize = gl.getAttribLocation(prog, 'a_size');

    gl.vertexAttribPointer(aBasePos, 2, gl.FLOAT, false, stride * FSIZE, 0);
    gl.enableVertexAttribArray(aBasePos);

    gl.vertexAttribPointer(aDepth, 1, gl.FLOAT, false, stride * FSIZE, 2 * FSIZE);
    gl.enableVertexAttribArray(aDepth);

    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, stride * FSIZE, 3 * FSIZE);
    gl.enableVertexAttribArray(aColor);

    gl.vertexAttribPointer(aSway, 1, gl.FLOAT, false, stride * FSIZE, 6 * FSIZE);
    gl.enableVertexAttribArray(aSway);

    gl.vertexAttribPointer(aSize, 1, gl.FLOAT, false, stride * FSIZE, 7 * FSIZE);
    gl.enableVertexAttribArray(aSize);

    // Uniform locations
    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uScrollY = gl.getUniformLocation(prog, 'u_scroll_y');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uHomeFade = gl.getUniformLocation(prog, 'u_home_fade');
    const uResolution = gl.getUniformLocation(prog, 'u_resolution');

    gl.uniform2f(uResolution, canvas.width, canvas.height);

    let mouseX = -1000;
    let mouseY = -1000;
    let scrollY = window.scrollY;
    let isTabVisible = true;
    let animId: number;

    const handlePointerMove = (e: MouseEvent) => {
      mouseX = e.clientX * dpr;
      mouseY = e.clientY * dpr;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    const handleVisibility = () => {
      isTabVisible = !document.hidden;
    };

    const handleResize = () => {
      if (!canvas || !gl) return;
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      canvas.width = nw * dpr;
      canvas.height = nh * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uResolution, canvas.width, canvas.height);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('resize', handleResize, { passive: true });

    const startTime = performance.now();

    function render(time: number) {
      if (!isTabVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      const elapsed = (time - startTime) * 0.001;

      // On Home screen: faint (~10% strength, 0.10); reaches full strength (1.0) after scrolling 80% screen height
      const homeScreenThreshold = window.innerHeight * 0.8;
      const fadeProgress = Math.min(1.0, Math.max(0.10, 0.10 + 0.90 * (scrollY / homeScreenThreshold)));

      if (gl && prog) {
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.uniform1f(uTime, elapsed);
        gl.uniform1f(uScrollY, scrollY * dpr);
        gl.uniform2f(uMouse, mouseX, mouseY);
        gl.uniform1f(uHomeFade, fadeProgress);

        gl.drawArrays(gl.POINTS, 0, count);
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      if (gl && vbo) gl.deleteBuffer(vbo);
      if (gl && prog) gl.deleteProgram(prog);
    };
  }, [canStart]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ willChange: 'transform' }}
    />
  );
};
