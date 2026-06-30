'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import { useWorkspaceStore } from '@/store/workspace-store'

function Laptop() {
  return (
    <group position={[0, 0.78, -0.05]} rotation={[0, 0, 0]}>
      <mesh position={[0, 0.01, 0.12]} castShadow>
        <boxGeometry args={[0.35, 0.015, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.04, -0.08]} rotation={[-1.2, 0, 0]} castShadow>
        <boxGeometry args={[0.35, 0.01, 0.25]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.3} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0.025, -0.08]} rotation={[-1.2, 0, 0]}>
        <planeGeometry args={[0.3, 0.2]} />
        <meshStandardMaterial color="#0a3d6b" emissive="#0a3d6b" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

function Monitor({ large }: { large?: boolean }) {
  const w = large ? 0.5 : 0.35
  const h = large ? 0.35 : 0.25
  return (
    <group>
      <mesh position={[0, h / 2 + 0.02, 0]} castShadow>
        <boxGeometry args={[w, h, 0.02]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh position={[0, h / 2 + 0.02, 0.01]}>
        <planeGeometry args={[w * 0.92, h * 0.92]} />
        <meshStandardMaterial color="#0a3d6b" emissive="#0a3d6b" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[0, 0.01, 0]} castShadow>
        <boxGeometry args={[0.02, 0.02, 0.08]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[0, -0.01, -0.04]} castShadow>
        <boxGeometry args={[w * 0.6, 0.01, 0.08]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  )
}

function Keyboard() {
  return (
    <group position={[0, 0.78, 0.25]}>
      <mesh castShadow>
        <boxGeometry args={[0.3, 0.015, 0.12]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.5} />
      </mesh>
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[-0.12 + (i % 10) * 0.025, 0.01, -0.04 + Math.floor(i / 10) * 0.04]}>
          <boxGeometry args={[0.018, 0.008, 0.018]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      ))}
    </group>
  )
}

function Mouse() {
  return (
    <group position={[0.18, 0.78, 0.28]}>
      <mesh position={[0, 0.01, 0]} castShadow>
        <boxGeometry args={[0.04, 0.02, 0.06]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.4} />
      </mesh>
    </group>
  )
}

function Clock() {
  const ref = useRef<any>(null)
  useFrame(() => {
    if (!ref.current) return
    const now = new Date()
    const hours = now.getHours() % 12
    const minutes = now.getMinutes()
    const seconds = now.getSeconds()
    const hAngle = (hours + minutes / 60) * (Math.PI / 6)
    const mAngle = minutes * (Math.PI / 30)
    const sAngle = seconds * (Math.PI / 30)

    if (ref.current.children[0]) ref.current.children[0].rotation.z = hAngle
    if (ref.current.children[1]) ref.current.children[1].rotation.z = mAngle
    if (ref.current.children[2]) ref.current.children[2].rotation.z = sAngle
  })

  return (
    <group position={[1.1, 1.6, -0.5]}>
      <mesh ref={ref}>
        <circleGeometry args={[0.08, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
        <mesh position={[0, 0, 0.001]}>
          <boxGeometry args={[0.003, 0.04, 0.002]} />
          <meshStandardMaterial color="#fff" />
        </mesh>
        <mesh position={[0, 0, 0.001]}>
          <boxGeometry args={[0.003, 0.05, 0.002]} />
          <meshStandardMaterial color="#ddd" />
        </mesh>
        <mesh position={[0, 0, 0.001]}>
          <boxGeometry args={[0.001, 0.055, 0.002]} />
          <meshStandardMaterial color="#ff4444" />
        </mesh>
      </mesh>
    </group>
  )
}

export function Electronics() {
  const unlocked = useWorkspaceStore(s => s.unlockedObjectIds)
  const hasDualMonitors = unlocked.includes('dual-monitors')
  const hasLargeMonitor = unlocked.includes('large-monitor')
  const hasKeyboard = unlocked.includes('mechanical-keyboard')
  const hasMouse = unlocked.includes('mechanical-keyboard') || unlocked.includes('dual-monitors')
  const hasClock = unlocked.includes('clock')

  return (
    <group position={[0, 0, 0]}>
      <Laptop />
      {hasDualMonitors && (
        <group position={[-0.3, 0.78, -0.15]}>
          {hasLargeMonitor ? (
            <Monitor large />
          ) : (
            <>
              <group position={[-0.2, 0, 0]}>
                <Monitor />
              </group>
              <group position={[0.2, 0, 0]}>
                <Monitor />
              </group>
            </>
          )}
        </group>
      )}
      {!hasDualMonitors && hasLargeMonitor && (
        <group position={[-0.3, 0.78, -0.15]}>
          <Monitor large />
        </group>
      )}
      {hasKeyboard && <Keyboard />}
      {hasMouse && <Mouse />}
      {hasClock && <Clock />}
    </group>
  )
}
