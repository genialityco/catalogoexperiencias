import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimations() {
  useEffect(() => {
    // Hero section animations
    gsap.from('.hero-title', {
      opacity: 0,
      y: 100,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    });

    gsap.from('.hero-subtitle', {
      opacity: 0,
      y: 50,
      duration: 1.2,
      delay: 0.3,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    // Pitch cards stagger animation
    gsap.from('.pitch-cards .card', {
      opacity: 0,
      y: 80,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.pitch-cards',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    // Feed cards animation with blur effect
    gsap.from('.feed-card', {
      opacity: 0,
      y: 100,
      filter: 'blur(10px)',
      duration: 1.2,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.feed-grid',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });

    // Pixel reveal overlay animation
    gsap.to('.feed-card .pixel-overlay', {
      opacity: 0,
      scale: 1.3,
      duration: 1,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.feed-grid',
        start: 'top 90%',
        toggleActions: 'play none none reverse'
      }
    });

    // Investment section parallax
    gsap.to('.investment', {
      backgroundPosition: '50% 100px',
      ease: 'none',
      scrollTrigger: {
        trigger: '.investment',
        start: 'top bottom',
        end: 'bottom top',
        scrub: true
      }
    });

    // BTL section reveal
    gsap.from('.btl-corner h2', {
      opacity: 0,
      x: -100,
      duration: 1.5,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.btl-corner',
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    });

    gsap.from('.check-item', {
      opacity: 0,
      x: 50,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '.value-checklist',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return null;
}