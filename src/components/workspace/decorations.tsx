'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorkspaceStore } from '@/store/workspace-store'

function Plant() {
  const groupRef = useRef<any>(null)
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.3) * 0.02
    }
  })
  return (
    <group ref={groupRef} position={[-0.65, 0.78, -0.2]}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.04, 8]} />
        <meshStandardMaterial color="#4a3728" roughness={0.9} />
      </mesh>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[
          Math.sin(i * 1.047) * 0.08,
          0.06 + Math.random() * 0.02,
          Math.cos(i * 1.047) * 0.08
        ]} rotation={[Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3]} castShadow>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color={`hsl(${120 + i * 5}, 60%, ${35 + i * 3}%)`} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function DeskLamp() {
  const [lightOn, setLightOn] = useState(true)
  return (
    <group position={[0.6, 0.78, -0.25]}>
      <mesh position={[0, 0.02, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.08, 0.02, 12]} />
        <meshStandardMaterial color="#333" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.12, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
        <meshStandardMaterial color="#555" metalness={0.6} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.2, -0.06]} rotation={[0.4, 0, 0]} castShadow onClick={() => setLightOn(!lightOn)}>
        <coneGeometry args={[0.06, 0.04, 12]} />
        <meshStandardMaterial color="#222" roughness={0.4} />
      </mesh>
      {lightOn && (
        <pointLight position={[0, 0.22, -0.08]} intensity={0.8} distance={2} color="#ffd700" />
      )}
    </group>
  )
}

import { useState } from 'react'

function Artwork() {
  return (
    <group position={[0, 1.2, -1.2]}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <boxGeometry args={[0.4, 0.3, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.25, 0.011]}>
        <planeGeometry args={[0.35, 0.25]} />
        <meshStandardMaterial color="#2a4a6a" />
      </mesh>
      <mesh position={[0.1, 0.23, 0.015]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial color="#c0a060" emissive="#c0a060" emissiveIntensity={0.1} />
      </mesh>
    </group>
  )
}

function Notebook() {
  return (
    <group position={[0.1, 0.78, 0.05]}>
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.005, 0.1]} />
        <meshStandardMaterial color="#f5f0e0" roughness={0.9} />
      </mesh>
      <mesh position={[0.001, 0, 0]}>
        <boxGeometry args={[0.08, 0.007, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.8} />
      </mesh>
    </group>
  )
}

function BookshelfContent() {
  const books = useMemo(() => {
    const colors = ['#c0392b', '#2980b9', '#27ae60', '#8e44ad', '#d35400', '#2c3e50', '#f39c12', '#1abc9c']
    return Array.from({ length: 15 }).map((_, i) => ({
      x: -0.35 + (i % 5) * 0.18,
      y: 0.08 + Math.floor(i / 5) * 0.25,
      z: 0,
      w: 0.04 + Math.random() * 0.03,
      h: 0.15 + Math.random() * 0.08,
      color: colors[i % colors.length],
    }))
  }, [])

  return (
    <group position={[-0.8, 0.78, -0.4]}>
      <mesh position={[0, 0.2, 0]} castShadow>
        <boxGeometry args={[0.8, 0.4, 0.02]} />
        <meshStandardMaterial color="#5c4a3a" roughness={0.8} />
      </mesh>
      {books.map((b, i) => (
        <mesh key={i} position={[b.x, b.y, 0.012]} castShadow>
          <boxGeometry args={[b.w, b.h, 0.15]} />
          <meshStandardMaterial color={b.color} roughness={0.7} />
        </mesh>
      ))}
    </group>
  )
}

function AwardsShelf() {
  const unlocked = useWorkspaceStore(s => s.unlockedObjectIds)
  const hasAchievement = unlocked.includes('achievement-shelf')
  const count = hasAchievement ? 8 : 3

  return (
    <group position={[1.0, 0.78, -0.4]}>
      <mesh position={[0, 0.01, 0]} castShadow>
        <boxGeometry args={[0.6, 0.015, 0.2]} />
        <meshStandardMaterial color="#5c4a3a" roughness={0.8} />
      </mesh>
      {Array.from({ length: count }).map((_, i) => (
        <mesh key={i} position={[
          -0.25 + (i % 4) * 0.17,
          0.06 + Math.floor(i / 4) * 0.15,
          0
        ]} castShadow>
          <boxGeometry args={[0.025, 0.04 + Math.random() * 0.03, 0.025]} />
          <meshStandardMaterial color={['#ffd700', '#c0c0c0', '#cd7f32', '#ff6b6b'][i % 4]} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
    </group>
  )
}

function MissionDisplay() {
  return (
    <group position={[0.4, 1.1, -1.2]}>
      <mesh position={[0, 0.15, 0]} castShadow>
        <boxGeometry args={[0.35, 0.3, 0.02]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.3} metalness={0.5} />
      </mesh>
      <mesh position={[0, 0.15, 0.011]}>
        <planeGeometry args={[0.3, 0.25]} />
        <meshStandardMaterial color="#0a3d6b" emissive="#0a3d6b" emissiveIntensity={0.2} />
      </mesh>
      <mesh position={[0, 0.31, 0]} castShadow>
        <boxGeometry args={[0.02, 0.02, 0.02]} />
        <meshStandardMaterial color="#ff4444" emissive="#ff4444" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}

export function Decorations() {
  const unlocked = useWorkspaceStore(s => s.unlockedObjectIds)
  const hasPlant = unlocked.includes('desk-plant')
  const hasLamp = unlocked.includes('desk-lamp')
  const hasArtwork = unlocked.includes('artwork')
  const hasBookshelf = unlocked.includes('bookshelf')
  const hasAwards = unlocked.includes('awards-shelf')
  const hasMissionDisplay = unlocked.includes('mission-display')

  return (
    <group>
      {hasPlant && <Plant />}
      {hasLamp && <DeskLamp />}
      {!hasBookshelf && <Notebook />}
      {hasArtwork && <Artwork />}
      {hasBookshelf && <BookshelfContent />}
      {hasAwards && <AwardsShelf />}
      {hasMissionDisplay && <MissionDisplay />}
    </group>
  )
}
