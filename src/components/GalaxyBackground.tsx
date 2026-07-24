import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

interface ThemeConfig {
  bgHsl: [number, number, number, number]; // [h, s, l, a]
  starColors: [number, number, number][];  // array of [h, s, l]
  coreColors: [number, number, number, number][]; // array of [h, s, l, a]
  style: 'spiral' | 'drift' | 'grid' | 'connect' | 'float' | 'wave';
}

const UNIFIED_STAR_COLORS: [number, number, number][] = [
  [43, 75, 58],   // Warm Gold
  [190, 95, 52],  // Celestial Cyan
  [220, 75, 45],  // Deep Royal Space Blue
  [38, 90, 65]    // Bright Amber Gold
];

const UNIFIED_CORE_COLORS: [number, number, number, number][] = [
  [43, 75, 55, 0.12],  // Subtle Gold Central Glow
  [190, 95, 50, 0.04]   // Subtle Cyan Ambient Glow
];

const UNIFIED_BG_HSL: [number, number, number, number] = [220, 35, 6, 0.08];

const THEMES: Record<string, ThemeConfig> = {
  // Home: Cosmic spiral galaxy (Gold & Cyan)
  '/': {
    bgHsl: UNIFIED_BG_HSL,
    starColors: UNIFIED_STAR_COLORS,
    coreColors: UNIFIED_CORE_COLORS,
    style: 'spiral'
  },
  // About: Soft celestial drift
  '/about': {
    bgHsl: UNIFIED_BG_HSL,
    starColors: UNIFIED_STAR_COLORS,
    coreColors: UNIFIED_CORE_COLORS,
    style: 'drift'
  },
  // Services: Tech stream grid
  '/services': {
    bgHsl: UNIFIED_BG_HSL,
    starColors: UNIFIED_STAR_COLORS,
    coreColors: UNIFIED_CORE_COLORS,
    style: 'grid'
  },
  // Case Studies: Constellation connections
  '/case-studies': {
    bgHsl: UNIFIED_BG_HSL,
    starColors: UNIFIED_STAR_COLORS,
    coreColors: UNIFIED_CORE_COLORS,
    style: 'connect'
  },
  // Blog: Floating celestial ambient particles
  '/blog': {
    bgHsl: UNIFIED_BG_HSL,
    starColors: UNIFIED_STAR_COLORS,
    coreColors: UNIFIED_CORE_COLORS,
    style: 'float'
  },
  // Contact: Interactive wave ribbons
  '/contact': {
    bgHsl: UNIFIED_BG_HSL,
    starColors: UNIFIED_STAR_COLORS,
    coreColors: UNIFIED_CORE_COLORS,
    style: 'wave'
  }
};

export default function GalaxyBackground() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Track current router path
  const currentPath = router.pathname;
  const pathRef = useRef(currentPath);

  useEffect(() => {
    pathRef.current = currentPath;
  }, [currentPath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Get matching theme or default to home
    const getThemeConfig = (path: string): ThemeConfig => {
      return THEMES[path] || THEMES['/'];
    };

    // Interpolation state
    let activeBgHsl: [number, number, number, number] = [...getThemeConfig(pathRef.current).bgHsl];
    let activeCoreColors: [number, number, number, number][] = getThemeConfig(pathRef.current).coreColors.map(c => [...c]);

    const numStars = 200;
    const stars: Array<{
      // Current rendered values (interpolated)
      x: number;
      y: number;
      h: number;
      s: number;
      l: number;
      size: number;
      alpha: number;

      // Behavior properties
      seed: number;
      speedMult: number;
      angle: number;
      distance: number;
      arm: number;
      twist: number;
      initialX: number;
      initialY: number;
      driftSpeedX: number;
      driftSpeedY: number;
      phase: number;
    }> = [];

    // Initialize stars with varied random properties for different styles
    for (let i = 0; i < numStars; i++) {
      const distance = Math.random() * (Math.max(width, height) / 2);
      const arm = (i % 3) * ((2 * Math.PI) / 3);
      const twist = distance * 0.005;
      const angle = arm + twist + (Math.random() - 0.5) * 0.4;
      const starTheme = getThemeConfig(pathRef.current);
      const randColor = starTheme.starColors[i % starTheme.starColors.length];

      stars.push({
        x: width / 2 + Math.cos(angle) * distance,
        y: height / 2 + Math.sin(angle) * distance,
        h: randColor[0],
        s: randColor[1],
        l: randColor[2],
        size: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.5 + 0.5,

        seed: Math.random(),
        speedMult: Math.random() * 0.5 + 0.5,
        angle: angle,
        distance: distance,
        arm: arm,
        twist: twist,
        initialX: Math.random() * width,
        initialY: Math.random() * height,
        driftSpeedX: (Math.random() - 0.5) * 0.4,
        driftSpeedY: (Math.random() - 0.5) * 0.4,
        phase: Math.random() * Math.PI * 2
      });
    }

    // Keep track of mouse coords for interactive parallax shifts
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX - width / 2) * 0.08;
      targetMouseY = (e.clientY - height / 2) * 0.08;
    };

    window.addEventListener('mousemove', handleMouseMove);

    let time = 0;

    const animate = () => {
      time += 0.02;

      // Ease mouse tracking
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      const currentTheme = getThemeConfig(pathRef.current);

      // Interpolate global background color
      for (let j = 0; j < 4; j++) {
        activeBgHsl[j] += (currentTheme.bgHsl[j] - activeBgHsl[j]) * 0.05;
      }

      // Clear canvas with deep space semi-transparent background
      ctx.fillStyle = `hsla(${activeBgHsl[0]}, ${activeBgHsl[1]}%, ${activeBgHsl[2]}%, ${activeBgHsl[3]})`;
      ctx.fillRect(0, 0, width, height);

      const centerX = width / 2 + mouseX;
      const centerY = height / 2 + mouseY;

      // Interpolate and Draw core glow
      for (let j = 0; j < Math.min(activeCoreColors.length, currentTheme.coreColors.length); j++) {
        for (let k = 0; k < 4; k++) {
          activeCoreColors[j][k] += (currentTheme.coreColors[j][k] - activeCoreColors[j][k]) * 0.05;
        }
      }

      const coreGlow = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 250);
      coreGlow.addColorStop(0, `hsla(${activeCoreColors[0][0]}, ${activeCoreColors[0][1]}%, ${activeCoreColors[0][2]}%, ${activeCoreColors[0][3]})`);
      if (activeCoreColors[1]) {
        coreGlow.addColorStop(0.4, `hsla(${activeCoreColors[1][0]}, ${activeCoreColors[1][1]}%, ${activeCoreColors[1][2]}%, ${activeCoreColors[1][3]})`);
      }
      coreGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 250, 0, Math.PI * 2);
      ctx.fill();

      // Update and draw stars
      stars.forEach((star, index) => {
        // Target coordinate based on the current theme style
        let targetX = centerX;
        let targetY = centerY;

        switch (currentTheme.style) {
          case 'spiral': {
            star.angle += (Math.random() * 0.05 + 0.02) * (1 - star.distance / (Math.max(width, height) / 2)) * 0.05 * star.speedMult;
            const rawX = Math.cos(star.angle) * star.distance;
            const rawY = Math.sin(star.angle) * star.distance;
            targetX = centerX + rawX;
            targetY = centerY + rawY;
            break;
          }
          case 'drift': {
            // Move initial positions linearly
            star.initialX += star.driftSpeedX;
            star.initialY += star.driftSpeedY;
            if (star.initialX < 0) star.initialX = width;
            if (star.initialX > width) star.initialX = 0;
            if (star.initialY < 0) star.initialY = height;
            if (star.initialY > height) star.initialY = 0;

            targetX = star.initialX + mouseX * 0.2;
            targetY = star.initialY + mouseY * 0.2;
            break;
          }
          case 'grid': {
            // Technical matrix code columns
            const cols = 25;
            const colIndex = index % cols;
            const colX = (colIndex / cols) * width;
            
            // Flow downwards
            star.initialY += star.speedMult * 2.5;
            if (star.initialY > height) star.initialY = 0;

            // Interactive wave offset
            const gridOffset = Math.sin(colX * 0.01 + time) * 15;
            targetX = colX + gridOffset;
            targetY = star.initialY;
            break;
          }
          case 'connect': {
            // Normal float, prepare nodes for connection
            star.initialX += Math.sin(time + star.phase) * 0.1;
            star.initialY += Math.cos(time + star.phase) * 0.1;
            if (star.initialX < 0) star.initialX = width;
            if (star.initialX > width) star.initialX = 0;
            if (star.initialY < 0) star.initialY = height;
            if (star.initialY > height) star.initialY = 0;

            targetX = star.initialX + mouseX * 0.4;
            targetY = star.initialY + mouseY * 0.4;
            break;
          }
          case 'float': {
            // Fireflies floating upwards and swaying
            star.initialY -= star.speedMult * 0.8;
            if (star.initialY < -20) star.initialY = height + 20;
            
            targetX = star.initialX + Math.sin(time * 0.5 + star.phase) * 40 + mouseX * 0.1;
            targetY = star.initialY;
            break;
          }
          case 'wave': {
            // Ribbons of sine waves
            const segment = (index / numStars) * width;
            const waveY = centerY + Math.sin(segment * 0.003 + time) * 160 + Math.cos(segment * 0.007 - time * 0.5) * 60;
            targetX = segment;
            targetY = waveY + (star.seed - 0.5) * 80;
            break;
          }
        }

        // Interpolate position for a fluid morphing effect
        star.x += (targetX - star.x) * 0.06;
        star.y += (targetY - star.y) * 0.06;

        // Interpolate colors
        const targetColor = currentTheme.starColors[index % currentTheme.starColors.length];
        star.h += (targetColor[0] - star.h) * 0.06;
        star.s += (targetColor[1] - star.s) * 0.06;
        star.l += (targetColor[2] - star.l) * 0.06;

        // Draw the star particle
        ctx.fillStyle = `hsla(${star.h}, ${star.s}%, ${star.l}%, ${star.alpha})`;
        ctx.beginPath();
        // Subtle glow filter for some stars
        if (star.seed > 0.88 && currentTheme.style !== 'grid') {
          ctx.shadowBlur = 6;
          ctx.shadowColor = `hsla(${star.h}, ${star.s}%, ${star.l}%, 0.8)`;
        }
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      // Draw constellation connections if in 'connect' mode
      if (currentTheme.style === 'connect') {
        ctx.lineWidth = 0.5;
        for (let i = 0; i < numStars; i++) {
          for (let j = i + 1; j < numStars; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 90) {
              const alpha = (1 - dist / 90) * 0.18;
              ctx.strokeStyle = `hsla(${stars[i].h}, ${stars[i].s}%, ${stars[i].l}%, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(stars[i].x, stars[i].y);
              ctx.lineTo(stars[j].x, stars[j].y);
              ctx.stroke();
            }
          }
        }
      }
      
      // Draw grid stream connections in 'grid' mode for technological feel
      if (currentTheme.style === 'grid') {
        ctx.lineWidth = 0.4;
        for (let i = 0; i < numStars; i += 4) {
          const next = stars[(i + 1) % numStars];
          if (Math.abs(stars[i].x - next.x) < 40 && Math.abs(stars[i].y - next.y) < 150) {
            ctx.strokeStyle = `hsla(${stars[i].h}, ${stars[i].s}%, ${stars[i].l}%, 0.12)`;
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(next.x, next.y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars.forEach(star => {
        star.initialX = Math.random() * width;
        star.initialY = Math.random() * height;
      });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}
