import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'both', // Permitir desplazamiento vertical y horizontal
      gestureDirection: 'both', // Gestos en ambas direcciones
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: true, // Activar desplazamiento suave en dispositivos táctiles
      touchMultiplier: 2,
      infinite: false,
    });

    // Expose lenis globally for other components
    window.lenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      delete window.lenis;
    };
  }, []);

  return null;
}