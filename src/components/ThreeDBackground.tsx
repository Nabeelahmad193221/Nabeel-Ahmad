import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Text, MeshDistortMaterial, Grid } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';

// Performance controller based on screen size
function useWindowSize() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

// Interactive Camera controller for mouse-follow responsive parallax
function CameraParallaxController() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.current.y = (e.clientY / window.innerHeight) - 0.5;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    const targetX = mouse.current.x * 3.5;
    const targetY = -mouse.current.y * 3.5 + 2.0;
    
    // Smooth lerping of camera position based on mouse position
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, 5 * delta);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, 5 * delta);
    state.camera.lookAt(0, 0.5, 0);
  });

  return null;
}

// 3D Floating Analytical Shapes with Glassmorphism / Metallic Glow Mat
function FloatingAnalyticalShapes() {
  const isMobile = useWindowSize();
  const count = isMobile ? 4 : 9; // Performance throttle

  const items = useMemo(() => {
    const geometries = [
      <icosahedronGeometry args={[0.3, 0]} />,
      <octahedronGeometry args={[0.35, 0]} />,
      <torusGeometry args={[0.28, 0.08, 16, 48]} />,
      <boxGeometry args={[0.32, 0.32, 0.32]} />,
      <coneGeometry args={[0.25, 0.5, 5]} />
    ];
    
    return [...Array(count)].map((_, i) => ({
      geom: geometries[i % geometries.length],
      pos: [
        (Math.random() - 0.5) * 8.5,
        (Math.random() - 0.5) * 4 + 1,
        (Math.random() - 0.5) * 6
      ] as [number, number, number],
      speed: Math.random() * 1.8 + 0.6,
      rotSpeed: [Math.random() * 0.6, Math.random() * 0.6, Math.random() * 0.6] as [number, number, number],
      color: i % 3 === 0 ? "#6366f1" : i % 3 === 1 ? "#22d3ee" : "#a855f7"
    }));
  }, [count]);

  return (
    <>
      {items.map((item, idx) => (
        <Float 
          key={idx} 
          position={item.pos} 
          speed={item.speed} 
          rotationIntensity={1.8} 
          floatIntensity={1.8}
        >
          <mesh>
            {item.geom}
            <MeshDistortMaterial
              color={item.color}
              speed={1.8}
              distort={0.3}
              radius={1}
              transparent
              opacity={0.65}
              roughness={0.08}
              metalness={0.92}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

// 3D Particle Cloud representing Big Data Nodes
function DataNodes() {
  const ref = useRef<THREE.Points>(null!);
  const isMobile = useWindowSize();
  const nodeCount = isMobile ? 180 : 400; // Efficient limits

  const points = useMemo(() => {
    const p = new Float32Array(nodeCount * 3);
    for (let i = 0; i < nodeCount; i++) {
      p[i * 3] = (Math.random() - 0.5) * 11;
      p[i * 3 + 1] = (Math.random() - 0.5) * 8 + 1; // raised y-axis
      p[i * 3 + 2] = (Math.random() - 0.5) * 11;
    }
    return p;
  }, [nodeCount]);

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.04;
    ref.current.rotation.x += delta * 0.01;
  });

  return (
    <Points ref={ref} positions={points} stride={3}>
      <PointMaterial
        transparent
        color="#818cf8"
        size={isMobile ? 0.045 : 0.06}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.45}
      />
    </Points>
  );
}

// Spinning Wireframe orbits representing analytical calculations
function DataConnections() {
  const ref = useRef<THREE.Group>(null!);
  const isMobile = useWindowSize();
  const circleCount = isMobile ? 6 : 12;

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.07;
    ref.current.rotation.x += delta * 0.02;
  });

  return (
    <group ref={ref} position={[0, 0.5, 0]}>
      {[...Array(circleCount)].map((_, i) => (
        <mesh key={i} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
          <torusGeometry args={[3.2, 0.003, 8, 64]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
}

// Central Analytics Gyroscopic Hologram with floating stats
function CentralHologram() {
  const ring1Ref = useRef<THREE.Mesh>(null!);
  const ring2Ref = useRef<THREE.Mesh>(null!);
  const coreRef = useRef<THREE.Mesh>(null!);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    ring1Ref.current.rotation.z += delta * 0.35;
    ring2Ref.current.rotation.z -= delta * 0.2;
    ring2Ref.current.rotation.x += delta * 0.1;
    
    coreRef.current.rotation.y += delta * 0.55;
    coreRef.current.position.y = Math.sin(t * 1.5) * 0.06;
  });

  return (
    <group position={[0, 0.5, 0]}>
      {/* Outer Hologram Rim 1 */}
      <mesh ref={ring1Ref}>
        <ringGeometry args={[0.95, 1.0, 64]} />
        <meshBasicMaterial color="#6366f1" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>

      {/* Cross-axial Rim 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 4, 0, 0]}>
        <ringGeometry args={[1.1, 1.13, 64]} />
        <meshBasicMaterial color="#22d3ee" side={THREE.DoubleSide} transparent opacity={0.3} />
      </mesh>
      
      {/* Concentric Spherical Core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[0.42, 32, 32]} />
        <MeshDistortMaterial
          color="#4f46e5"
          speed={1.8}
          distort={0.35}
          radius={1}
          emissive="#6366f1"
          emissiveIntensity={0.65}
          roughness={0.1}
        />
      </mesh>

      {/* Floating telemetry metrics */}
      <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.4}>
        <Text
          position={[1.5, 0.6, 0]}
          fontSize={0.14}
          color="#818cf8"
          anchorX="left"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDb32oWyt_6SXYj53T-5P30_3P165To.woff"
        >
          EFFICIENCY // 98.4%
        </Text>
        <Text
          position={[-1.5, -0.6, 0]}
          fontSize={0.14}
          color="#22d3ee"
          anchorX="right"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v13/tDb32oWyt_6SXYj53T-5P30_3P165To.woff"
        >
          SAP DB // CONFLICTS 0
        </Text>
      </Float>
    </group>
  );
}

// Living visual bar histogram (representing active metrics streams)
function LiveVolumeDashboard() {
  const groupRef = useRef<THREE.Group>(null!);
  const isMobile = useWindowSize();
  const barCount = isMobile ? 8 : 16;
  
  const bars = useMemo(() => {
    return [...Array(barCount)].map((_, i) => {
      const angle = (i / barCount) * Math.PI * 2;
      const radius = 2.4;
      return {
        pos: [Math.cos(angle) * radius, -1.2, Math.sin(angle) * radius] as [number, number, number],
        speed: Math.random() * 1.5 + 0.8,
        color: i % 2 === 0 ? "#6366f1" : "#06b6d4"
      };
    });
  }, [barCount]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.children.forEach((child, i) => {
      if (bars[i]) {
        // Create an organic pulsating stream representing real-time manufacturing pipelines
        const scaleVal = 1 + Math.sin(t * bars[i].speed + i) * 0.75;
        child.scale.y = THREE.MathUtils.lerp(child.scale.y, scaleVal, 10 * delta);
        // Elevate position slightly to match bottom grounding point
        child.position.y = -1.2 + (child.scale.y * 0.25);
      }
    });
  });

  return (
    <group ref={groupRef}>
      {bars.map((bar, i) => (
        <mesh key={i} position={bar.pos}>
          <boxGeometry args={[0.08, 0.5, 0.08]} />
          <meshStandardMaterial 
            color={bar.color} 
            transparent 
            opacity={0.4} 
            roughness={0.2}
            metalness={0.8}
            emissive={bar.color}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

const ThreeDBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
      <Canvas 
        camera={{ position: [0, 2, 5], fov: 75 }} 
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.8} />
        <pointLight position={[8, 8, 8]} intensity={1.8} color="#6366f1" />
        <pointLight position={[-8, -8, -8]} intensity={1.2} color="#22d3ee" />
        <pointLight position={[0, -5, 5]} intensity={1.0} color="#c084fc" />

        <React.Suspense fallback={null}>
          <CentralHologram />
          <DataNodes />
          <DataConnections />
          <LiveVolumeDashboard />
          <FloatingAnalyticalShapes />
          <CameraParallaxController />
          
          <Grid
            infiniteGrid
            fadeDistance={18}
            fadeStrength={4.5}
            cellSize={0.8}
            sectionSize={4}
            sectionColor="#6366f1"
            sectionThickness={1.2}
            cellColor="#475569"
            cellThickness={0.5}
            position={[0, -1.25, 0]}
          />

          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.85} 
              mipmapBlur 
              intensity={0.45} 
              radius={0.35} 
            />
            <ChromaticAberration offset={new THREE.Vector2(0.0008, 0.0008)} />
          </EffectComposer>
        </React.Suspense>
      </Canvas>
    </div>
  );
};

export default ThreeDBackground;
