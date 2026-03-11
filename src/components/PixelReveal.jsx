import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { VideoTexture } from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uProgress;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    vec4 color = texture2D(uTexture, uv);

    // Pixelation effect
    float pixelSize = mix(40.0, 1.0, uProgress);
    uv = floor(uv * pixelSize) / pixelSize;

    gl_FragColor = texture2D(uTexture, uv);
  }
`;

function PixelatedPlane({ videoSrc, cardRef }) {
  const meshRef = useRef();
  const progress = useRef(0);
  const videoRef = useRef();
  const textureRef = useRef();

  useEffect(() => {
    // Create video element
    const video = document.createElement('video');
    video.src = videoSrc;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.crossOrigin = 'anonymous';

    videoRef.current = video;

    // Create video texture
    const texture = new VideoTexture(video);
    textureRef.current = texture;

    // Play video when loaded
    video.addEventListener('loadeddata', () => {
      video.play();
    });

    return () => {
      video.pause();
      video.remove();
    };
  }, [videoSrc]);

  useFrame(() => {
    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  });

  useEffect(() => {
    if (!cardRef.current) return;

    // Hide the original video
    const videoElement = cardRef.current.parentElement.querySelector('video');
    if (videoElement) {
      videoElement.style.opacity = '0';
    }

    // Animate the progress with ScrollTrigger
    gsap.to(progress, {
      current: 1,
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
        toggleActions: 'play reset restart reset',
      },
      duration: 1,
      ease: 'linear',
      onUpdate: () => {
        // Update the shader uniform
        if (meshRef.current && meshRef.current.material) {
          meshRef.current.material.uniforms.uProgress.value = progress.current;
        }
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [cardRef]);

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[16, 9]} />
      <shaderMaterial
        uniforms={{
          uTexture: { value: textureRef.current || null },
          uProgress: { value: progress.current }
        }}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
      />
    </mesh>
  );
}

export default function PixelReveal({ videoSrc }) {
  const cardRef = useRef();

  return (
    <div ref={cardRef} className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
      >
        <PixelatedPlane videoSrc={videoSrc} cardRef={cardRef} />
      </Canvas>
    </div>
  );
}