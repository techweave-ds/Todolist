'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, ContactShadows } from '@react-three/drei'
import { useWorkspaceStore } from '@/store/workspace-store'
import { Desk } from './desk'
import { Chair } from './chair'
import { Electronics } from './electronics'
import { Decorations } from './decorations'
import { EnvironmentElements, AmbientLighting, DustParticles } from './environment'

function SceneContent() {
  const autoRotate = useWorkspaceStore(s => s.autoRotate)

  return (
    <>
      <PerspectiveCamera makeDefault position={[2.5, 2.0, 2.5]} fov={40} />
      <OrbitControls
        enablePan={false}
        minDistance={1.5}
        maxDistance={5}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.5}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        enableDamping
        dampingFactor={0.1}
      />

      <AmbientLighting />

      <Desk />
      <Chair />
      <Electronics />
      <Decorations />
      <EnvironmentElements />
      <DustParticles />

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.4}
        scale={5}
        blur={2}
        far={1}
      />
    </>
  )
}

export function WorkspaceScene() {
  const reduceMotion = useWorkspaceStore(s => s.reduceMotion)

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <Canvas
        shadows
        dpr={[1, reduceMotion ? 1 : 2]}
        gl={{ antialias: true, alpha: false }}
        camera={{ position: [2.5, 2, 2.5], fov: 40 }}
      >
        <color attach="background" args={['#0a0a0a']} />
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  )
}
