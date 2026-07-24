import { useEffect, useRef, useCallback } from 'react';

export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  // Use refs for all mutable state to avoid re-renders
  const mousePos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const isVisible = useRef(false);
  const isHovered = useRef(false);
  const currentScale = useRef(1);

  useEffect(() => {
    // Only run on desktop — no cursor on touch devices
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      return;
    }

    // Hide default cursor
    document.body.style.cursor = 'none';
    const allInteractive = document.querySelectorAll('a, button, input, textarea, select, [role="button"]');
    allInteractive.forEach(el => (el as HTMLElement).style.cursor = 'none');

    // Observe new DOM nodes and hide their cursors too
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(n => {
          if (n instanceof HTMLElement) {
            const targets = n.querySelectorAll('a, button, input, textarea, select, [role="button"]');
            targets.forEach(el => (el as HTMLElement).style.cursor = 'none');
            if (n.matches('a, button, input, textarea, select, [role="button"]')) {
              n.style.cursor = 'none';
            }
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;
      if (!isVisible.current) {
        isVisible.current = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.tagName === 'SELECT' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('clickable') ||
        target.getAttribute('role') === 'button'
      );
      isHovered.current = !!interactive;
    };

    const onMouseLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
      isVisible.current = false;
    };

    const onMouseDown = () => {
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px, 0) scale(0.85)`;
      }
    };

    const onMouseUp = () => {
      // scale will be restored by animation loop
    };

    const animateRing = () => {
      if (isVisible.current) {
        // Smooth lerp — 0.15 is a sweet spot between snappy and floaty
        ringPos.current.x += (mousePos.current.x - ringPos.current.x) * 0.15;
        ringPos.current.y += (mousePos.current.y - ringPos.current.y) * 0.15;

        // Smooth scale interpolation to prevent jarring size changes
        const targetScale = isHovered.current ? 1.6 : 1;
        currentScale.current += (targetScale - currentScale.current) * 0.12;

        if (ringRef.current) {
          ringRef.current.style.transform = `translate3d(${ringPos.current.x - 16}px, ${ringPos.current.y - 16}px, 0) scale(${currentScale.current.toFixed(3)})`;
          ringRef.current.style.borderColor = isHovered.current ? '#00D4FF' : '#C9A84C';
          ringRef.current.style.backgroundColor = isHovered.current ? 'rgba(0, 212, 255, 0.06)' : 'transparent';
        }
        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${mousePos.current.x - 3}px, ${mousePos.current.y - 3}px, 0)`;
          dotRef.current.style.backgroundColor = isHovered.current ? '#00D4FF' : '#C9A84C';
        }
      }

      animationFrameId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    animationFrameId = requestAnimationFrame(animateRing);

    return () => {
      document.body.style.cursor = 'auto';
      observer.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <>
      {/* Inner Dot — immediate, no transition on transform */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 6,
          height: 6,
          borderRadius: '50%',
          backgroundColor: '#C9A84C',
          pointerEvents: 'none',
          zIndex: 10000,
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.2s ease',
        }}
      />
      {/* Outer Ring — GPU-accelerated, no CSS transition on transform */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: '50%',
          border: '1.5px solid #C9A84C',
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          zIndex: 9999,
          opacity: 0,
          willChange: 'transform',
          transition: 'opacity 0.2s ease',
        }}
      />
    </>
  );
}
