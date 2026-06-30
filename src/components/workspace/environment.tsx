'use client'

import { useMemo } from 'react'
import { useWorkspaceStore } from '@/store/workspace-store'
import { AmbientMode } from '@/core/workspace/progression'

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[6, 5]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </mesh>
  )
}

function Walls() {
  return (
    <group>
      <mesh position={[0, 1.5, -1.5]} receiveShadow>
        <planeGeometry args={[6, 3]} />
        <meshStandardMaterial color="#151515" roughness={0.95} />
      </mesh>
      <mesh position={[-1.8, 1.5, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial color="#121212" roughness={0.95} />
      </mesh>
      <mesh position={[1.8, 1.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[5, 3]} />
        <meshStandardMaterial color="#121212" roughness={0.95} />
      </mesh>
    </group>
  )
}

function Window() {
  const unlocked = useWorkspaceStore(s => s.unlockedObjectIds)
  const hasPanoramic = unlocked.includes('panoramic-window')

  return (
    <group position={[0, 1.5, -1.49]}>
      {hasPanoramic ? (
        <mesh>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial color="#0a1628" emissive="#1a3a6a" emissiveIntensity={0.1} transparent opacity={0.3} />
        </mesh>
      ) : (
        <mesh>
          <planeGeometry args={[1.2, 1.2]} />
          <meshStandardMaterial color="#0a1628" emissive="#1a3a6a" emissiveIntensity={0.05} transparent opacity={0.4} />
        </mesh>
      )}
      {!hasPanoramic && (
        <>
          <mesh position={[0, 0, 0.01]}>
            <planeGeometry args={[1.2, 0.02]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          <mesh position={[0, 0.6, 0.01]}>
            <planeGeometry args={[0.02, 1.2]} />
            <meshStandardMaterial color="#333" />
          </mesh>
        </>
      )}
    </group>
  )
}

const AMBIENT_COLORS: Record<AmbientMode, {
  ambient: string; directional: string; intensity: number; bg: string
}> = {
  morning: { ambient: '#ffd7b0', directional: '#fff5e0', intensity: 0.8, bg: '#1a2a3a' },
  afternoon: { ambient: '#ffffff', directional: '#fff8f0', intensity: 1.0, bg: '#1a2a4a' },
  evening: { ambient: '#ff9966', directional: '#ffcc88', intensity: 0.6, bg: '#2a1a1a' },
  night: { ambient: '#224488', directional: '#4466aa', intensity: 0.3, bg: '#0a0a1a' },
  rain: { ambient: '#667788', directional: '#8899aa', intensity: 0.4, bg: '#1a1a2a' },
  forest: { ambient: '#446644', directional: '#88aa66', intensity: 0.6, bg: '#1a2a1a' },
  space: { ambient: '#4444aa', directional: '#6666cc', intensity: 0.3, bg: '#050510' },
}

export function AmbientLighting() {
  const mode = useWorkspaceStore(s => s.ambientMode)
  const unlocked = useWorkspaceStore(s => s.unlockedObjectIds)
  const hasAmbient = unlocked.includes('ambient-lighting')
  const colors = AMBIENT_COLORS[mode]
  const intensity = hasAmbient ? colors.intensity : colors.intensity * 0.5

  return (
    <>
      <ambientLight color={colors.ambient} intensity={intensity} />
      <directionalLight
        position={[2, 3, 2]}
        intensity={intensity * 0.6}
        color={colors.directional}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <hemisphereLight args={[colors.ambient, '#000022', intensity * 0.3]} />
    </>
  )
}

export function DustParticles() {
  const intensity = useWorkspaceStore(s => s.dustIntensity)
  const positions = useMemo(() => {
    const arr = new Float32Array(200 * 3)
    for (let i = 0; i < 200; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 5
      arr[i * 3 + 1] = Math.random() * 2.5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4
    }
    return arr
  }, [])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.005}
        color="#ffffff"
        transparent
        opacity={intensity * 0.5}
        sizeAttenuation
      />
    </points>
  )
}

export function EnvironmentElements() {
  const unlocked = useWorkspaceStore(s => s.unlockedObjectIds)
  const hasPremiumFurniture = unlocked.includes('premium-furniture')
  const hasDigitalWall = unlocked.includes('digital-wall')

  return (
    <group>
      <Floor />
      <Walls />
      <Window />
      {hasPremiumFurniture && (
        <mesh position={[-0.4, 0.15, 1.1]} castShadow>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.6} />
        </mesh>
      )}
      {hasDigitalWall && (
        <mesh position={[-1.79, 1.2, 0]}>
          <planeGeometry args={[0.05, 1.5, 2.5]} />
          <meshStandardMaterial color="#0a3d6b" emissive="#0a3d6b" emissiveIntensity={0.15} />
        </mesh>
      )}
    </group>
  )
}
