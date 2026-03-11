import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function LiquidBlob() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <Sphere ref={meshRef} args={[1, 64, 64]} scale={1.5}>
      <MeshDistortMaterial
        color="#ff00ff"
        attach="material"
        distort={0.6}
        speed={1.5}
        roughness={0}
        metalness={0.1}
        emissive="#ff00ff"
        emissiveIntensity={0.1}
      />
    </Sphere>
  );
}

function LiquidEffect() {
  return (
    <div className="absolute inset-0 -z-10 opacity-30">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[-10, -10, -10]} color="#00ffff" />
        <pointLight position={[10, 10, 10]} color="#ff00ff" />
        <LiquidBlob />
      </Canvas>
    </div>
  );
}

export default LiquidEffect;