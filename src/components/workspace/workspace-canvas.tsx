'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment, MeshTransmissionMaterial, Line } from '@react-three/drei'
import * as THREE from 'three'

function CoreCrystal({ level }: { level: number }) {
  const mesh = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    mesh.current.rotation.y = state.clock.elapsedTime * 0.3
    mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
  })

  const size = 0.5 + level * 0.03

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[size, 0]} />
      <MeshTransmissionMaterial
        backside
        thickness={0.5}
        roughness={0.1}
        chromaticAberration={0.3}
        anisotropy={0.5}
        distortion={0.2}
        color="#8B5CF6"
        metalness={0.1}
      />
    </mesh>
  )
}

function Orb({ position, color, size = 0.15, speed = 0.5 }: { position: [number, number, number]; color: string; size?: number; speed?: number }) {
  const mesh = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    mesh.current.position.y += Math.sin(state.clock.elapsedTime * speed + position[0]) * 0.001
  })

  return (
    <mesh ref={mesh} position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshPhysicalMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        metalness={0.2}
        roughness={0.3}
      />
    </mesh>
  )
}

function OrbitalRing({ radius, color, speed }: { radius: number; color: string; speed: number }) {
  const points = useMemo(() => {
    const pts: [number, number, number][] = []
    for (let i = 0; i < 64; i++) {
      const angle = (i / 64) * Math.PI * 2
      pts.push([Math.cos(angle) * radius, Math.sin(angle) * radius * 0.3, 0])
    }
    return pts
  }, [radius])

  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    groupRef.current.rotation.z = state.clock.elapsedTime * speed
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * speed * 0.5) * 0.1
  })

  return (
    <group ref={groupRef}>
      <Line points={points} color={color} opacity={0.3} transparent lineWidth={1} />
    </group>
  )
}

function FloatingPlatform() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.8, 0]}>
      <ringGeometry args={[1.2, 2, 64]} />
      <meshPhysicalMaterial
        color="#1a1a2e"
        metalness={0.8}
        roughness={0.2}
        transparent
        opacity={0.5}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Particles({ count = 50 }: { count?: number }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i++) {
      pos[i] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#8B5CF6" transparent opacity={0.4} sizeAttenuation />
    </points>
  )
}

export function WorkspaceCanvas({ level, theme }: { level: number; theme: string }) {
  const colors = useMemo(() => {
    const palette: Record<string, string[]> = {
      'neon-dreams': ['#8B5CF6', '#EC4899', '#06B6D4', '#10B981'],
      'deep-space': ['#3730A3', '#1E40AF', '#7C3AED', '#2563EB'],
      'midnight-ocean': ['#0D9488', '#0891B2', '#06B6D4', '#2DD4BF'],
      'aurora': ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'],
      'cyber': ['#EC4899', '#F59E0B', '#06B6D4', '#8B5CF6'],
      'minimal': ['#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6'],
    }
    return palette[theme] || palette['neon-dreams']
  }, [theme])

  return (
    <Canvas
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.4} />
      <pointLight position={[2, 3, 2]} intensity={0.8} color={colors[0]} />
      <pointLight position={[-2, 1, -2]} intensity={0.4} color={colors[1]} />
      <directionalLight position={[0, 2, 0]} intensity={0.3} />

      <FloatingPlatform />
      <CoreCrystal level={level} />

      <Orb position={[1, 0.2, 0.6]} color={colors[0]} size={0.12} />
      <Orb position={[-0.8, -0.1, 0.8]} color={colors[1]} size={0.1} />
      <Orb position={[0.5, 0.4, -0.9]} color={colors[2]} size={0.14} />
      <Orb position={[-0.6, 0.3, -0.7]} color={colors[3]} size={0.11} />

      <OrbitalRing radius={1.0} color={colors[0]} speed={0.3} />
      <OrbitalRing radius={1.4} color={colors[1]} speed={-0.2} />
      <OrbitalRing radius={1.8} color={colors[2]} speed={0.15} />

      <Particles count={60} />

      <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} enablePan={false} />
      <Environment preset="city" />
    </Canvas>
  )
}
