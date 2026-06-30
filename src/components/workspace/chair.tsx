'use client'

import { useWorkspaceStore } from '@/store/workspace-store'

export function Chair() {
  const unlocked = useWorkspaceStore(s => s.unlockedObjectIds)
  const hasPremium = unlocked.includes('premium-chair')
  const seatColor = hasPremium ? '#1a1a1a' : '#3a3a3a'
  const backColor = hasPremium ? '#2a2a2a' : '#4a4a4a'
  const metalColor = hasPremium ? '#c0c0c0' : '#666666'

  return (
    <group position={[-0.8, 0, 0.5]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.05, 0.45]} />
        <meshStandardMaterial color={seatColor} roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 0.45, -0.1]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.4, 0.45, 0.03]} />
        <meshStandardMaterial color={backColor} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 0.15, 8]} />
        <meshStandardMaterial color={metalColor} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.15, 0.02, -0.15]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 6]} />
        <meshStandardMaterial color={metalColor} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.15, 0.02, -0.15]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 6]} />
        <meshStandardMaterial color={metalColor} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[-0.15, 0.02, 0.15]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 6]} />
        <meshStandardMaterial color={metalColor} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.15, 0.02, 0.15]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 6]} />
        <meshStandardMaterial color={metalColor} metalness={0.6} roughness={0.4} />
      </mesh>
      {hasPremium && (
        <mesh position={[0, 0.25, -0.1]} castShadow>
          <boxGeometry args={[0.35, 0.01, 0.3]} />
          <meshStandardMaterial color={seatColor} roughness={0.9} />
        </mesh>
      )}
    </group>
  )
}
