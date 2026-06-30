'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useWorkspaceStore } from '@/store/workspace-store'

export function Desk() {
  const unlocked = useWorkspaceStore(s => s.unlockedObjectIds)
  const hasStanding = unlocked.includes('standing-desk')
  const hasExecutive = unlocked.includes('executive-desk')

  const deskHeight = hasExecutive ? 0.9 : hasStanding ? 0.85 : 0.75
  const deskWidth = hasExecutive ? 2.0 : hasStanding ? 1.8 : 1.6
  const deskDepth = 0.8
  const color = hasExecutive ? '#2a2a2a' : hasStanding ? '#3a3a3a' : '#4a3728'
  const topColor = hasExecutive ? '#1a1a1a' : '#5c4a3a'

  return (
    <group position={[0, 0, 0]}>
      <mesh position={[0, deskHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[deskWidth, 0.05, deskDepth]} />
        <meshStandardMaterial color={topColor} roughness={0.6} metalness={0.1} />
      </mesh>
      {!hasExecutive && (
        <>
          <mesh position={[-deskWidth / 2 + 0.05, deskHeight / 4, -deskDepth / 2 + 0.05]} castShadow>
            <boxGeometry args={[0.05, deskHeight / 2, 0.05]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
          <mesh position={[deskWidth / 2 - 0.05, deskHeight / 4, -deskDepth / 2 + 0.05]} castShadow>
            <boxGeometry args={[0.05, deskHeight / 2, 0.05]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
          <mesh position={[-deskWidth / 2 + 0.05, deskHeight / 4, deskDepth / 2 - 0.05]} castShadow>
            <boxGeometry args={[0.05, deskHeight / 2, 0.05]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
          <mesh position={[deskWidth / 2 - 0.05, deskHeight / 4, deskDepth / 2 - 0.05]} castShadow>
            <boxGeometry args={[0.05, deskHeight / 2, 0.05]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>
        </>
      )}
      {hasExecutive && (
        <mesh position={[0, deskHeight / 4, 0]} castShadow>
          <boxGeometry args={[deskWidth - 0.1, deskHeight / 2, deskDepth - 0.1]} />
          <meshStandardMaterial color={color} roughness={0.3} metalness={0.4} />
        </mesh>
      )}
    </group>
  )
}
