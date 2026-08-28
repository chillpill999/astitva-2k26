"use client";

// ============================================================================
// ASTITVA 2K26 - WebGL Particle Vortex & GLSL Shader Hero Canvas
// Path: components/landing/HeroShaderCanvas.tsx
// ============================================================================

import React, { useEffect, useRef, useState } from "react";

export function HeroShaderCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasWebGL, setHasWebGL] = useState<boolean | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check WebGL availability
    let gl: WebGLRenderingContext | null = null;
    try {
      gl =
        (canvas.getContext("webgl") as WebGLRenderingContext) ||
        (canvas.getContext("experimental-webgl") as WebGLRenderingContext);
    } catch {
      gl = null;
    }

    if (!gl) {
      setHasWebGL(false);
      return run2DFallback(canvas);
    }

    setHasWebGL(true);
    return runWebGLShader(canvas, gl);
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-70 transition-opacity duration-1000"
      />
      {/* Ambient Vignette & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EAE7DC]/30 via-transparent to-[#EAE7DC] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#EAE7DC_85%)] pointer-events-none opacity-80" />
    </div>
  );
}

export const ParticleHeroCanvas = HeroShaderCanvas;

// ----------------------------------------------------------------------------
// WEBGL SHADER IMPLEMENTATION (Stitch MCP ANIMATION_2 Matrix)
// ----------------------------------------------------------------------------
function runWebGLShader(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
  let animationFrameId: number;
  let mouseX = 0.5;
  let mouseY = 0.5;
  let targetMouseX = 0.5;
  let targetMouseY = 0.5;

  const vertexShaderSource = `
    attribute vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const fragmentShaderSource = `
    precision mediump float;
    uniform vec2 u_resolution;
    uniform float u_time;
    uniform vec2 u_mouse;

    void main() {
      vec2 st = (gl_FragCoord.xy * 2.0 - u_resolution.xy) / min(u_resolution.x, u_resolution.y);
      vec2 mouseOffset = (u_mouse - 0.5) * 0.4;
      st += mouseOffset;

      float dist = length(st);
      float angle = atan(st.y, st.x);

      // Swirling Vortex Dynamics
      float spiral = sin(dist * 6.0 - u_time * 0.8 + angle * 3.0);
      float ring = abs(sin(dist * 12.0 - u_time * 0.4));
      float glow = 0.04 / (abs(spiral) + 0.12) * (1.0 - smoothstep(0.0, 1.6, dist));

      // Particle grid stars
      vec2 grid = fract(st * 18.0 + vec2(sin(u_time * 0.2), cos(u_time * 0.3))) - 0.5;
      float star = 0.008 / (length(grid) + 0.04) * smoothstep(0.8, 0.1, dist);

      // Dual-Harmonic Color Blending (Electric Blue #3B82F6 & Neon Purple #8B5CF6 & Cyan #06B6D4)
      vec3 electricBlue = vec3(0.23, 0.51, 0.96);
      vec3 neonPurple   = vec3(0.54, 0.36, 0.96);
      vec3 cyberCyan    = vec3(0.02, 0.71, 0.83);

      float colorPulse = sin(u_time * 0.5) * 0.5 + 0.5;
      vec3 baseColor = mix(electricBlue, neonPurple, colorPulse + spiral * 0.3);
      baseColor = mix(baseColor, cyberCyan, star * 2.0);

      vec3 finalColor = baseColor * (glow + star * 1.5) + pow(glow, 2.5) * 0.3;
      
      // Edge fade
      float alpha = clamp(glow * 1.8 + star * 1.2, 0.0, 1.0) * (1.0 - smoothstep(0.6, 1.5, dist));
      gl_FragColor = vec4(finalColor, alpha * 0.85);
    }
  `;

  function createShader(glCtx: WebGLRenderingContext, type: number, source: string) {
    const shader = glCtx.createShader(type);
    if (!shader) return null;
    glCtx.shaderSource(shader, source);
    glCtx.compileShader(shader);
    if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
      glCtx.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertShader || !fragShader) {
    return run2DFallback(canvas);
  }

  const program = gl.createProgram();
  if (!program) return run2DFallback(canvas);

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return run2DFallback(canvas);
  }

  gl.useProgram(program);

  // Position Buffer Setup
  const positionLocation = gl.getAttribLocation(program, "position");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const timeLocation = gl.getUniformLocation(program, "u_time");
  const mouseLocation = gl.getUniformLocation(program, "u_mouse");

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  const positions = new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0,
  ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  // Enable alpha blending
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const displayWidth = Math.floor(canvas.clientWidth * dpr);
    const displayHeight = Math.floor(canvas.clientHeight * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    targetMouseX = e.clientX / window.innerWidth;
    targetMouseY = 1.0 - e.clientY / window.innerHeight;
  };

  window.addEventListener("mousemove", handleMouseMove, { passive: true });
  window.addEventListener("resize", resize);
  resize();

  let startTime = performance.now();

  function render() {
    resize();
    const currentTime = (performance.now() - startTime) * 0.001;

    // Smooth mouse lerp
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, currentTime);
    gl.uniform2f(mouseLocation, mouseX, mouseY);

    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLES, 0, 6);

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("resize", resize);
    if (gl) {
      gl.deleteProgram(program);
      gl.deleteBuffer(positionBuffer);
    }
  };
}

// ----------------------------------------------------------------------------
// 2D CANVAS FALLBACK IMPLEMENTATION (Offline / Low-Spec Hardware)
// ----------------------------------------------------------------------------
function run2DFallback(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let animationFrameId: number;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles: Array<{
    x: number;
    y: number;
    radius: number;
    color: string;
    vx: number;
    vy: number;
    alpha: number;
  }> = [];

  const colors = ["#3B82F6", "#8B5CF6", "#06B6D4", "#60A5FA"];

  for (let i = 0; i < 70; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.6 + 0.2,
    });
  }

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener("resize", resize);

  function render() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.shadowBlur = 12;
      ctx.shadowColor = p.color;
      ctx.fill();
    }

    // Connect close particles with subtle cyber lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = "#3B82F6";
          ctx.globalAlpha = (1 - dist / 110) * 0.2;
          ctx.stroke();
        }
      }
    }

    animationFrameId = requestAnimationFrame(render);
  }

  render();

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener("resize", resize);
  };
}
