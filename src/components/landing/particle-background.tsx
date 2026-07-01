'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 2000
const SPREAD = 15
const COLORS = ['#a855f7', '#6366f1', '#8b5cf6', '#ec4899']

function ParticleField({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Points>(null)
  const clockRef = useRef(0)

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    const col = new Float32Array(PARTICLE_COUNT * 3)
    const siz = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      pos[i3] = (Math.random() - 0.5) * SPREAD
      pos[i3 + 1] = (Math.random() - 0.5) * SPREAD
      pos[i3 + 2] = (Math.random() - 0.5) * SPREAD * 0.5

      const c = new THREE.Color(COLORS[Math.floor(Math.random() * COLORS.length)])
      col[i3] = c.r
      col[i3 + 1] = c.g
      col[i3 + 2] = c.b

      siz[i] = 0.02 + Math.random() * 0.04
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(siz, 1))
    return geo
  }, [])

  useFrame((_state, delta) => {
    if (!meshRef.current) return
    const pos = meshRef.current.geometry.attributes.position.array as Float32Array
    clockRef.current += delta

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3
      const phase = i * 0.01 + clockRef.current * 0.3

      pos[i3 + 1] += Math.sin(phase) * 0.001
      pos[i3] += Math.cos(phase * 0.7) * 0.001

      const mx = mouse.current.x * 0.5
      const my = mouse.current.y * 0.5
      const dx = pos[i3] - mx * SPREAD * 0.3
      const dy = pos[i3 + 1] + my * SPREAD * 0.3
      pos[i3] += dx * 0.0001
      pos[i3 + 1] += dy * 0.0001
    }

    meshRef.current.geometry.attributes.position.needsUpdate = true
    meshRef.current.rotation.y = clockRef.current * 0.02
  })

  return (
    <points ref={meshRef} geometry={geometry}>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

function Scene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  return <ParticleField mouse={mouse} />
}

export function ParticleBackground({ className }: { className?: string }) {
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div className={`fixed inset-0 z-0 ${className ?? ''}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  )
}
