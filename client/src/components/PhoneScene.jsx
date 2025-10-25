import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, PresentationControls, ContactShadows, Float, Html } from '@react-three/drei'
import Phone from './Phone'

export default function PhoneScene({ color = '#0b0d12' }) {
  return (
    <div className="scene-card">
      <div className="canvas-wrap">
        <Canvas dpr={[1, 2]} camera={{ position: [0.9, 0.8, 1.6], fov: 35 }}>
          <color attach="background" args={["#07070a"]} />
          <ambientLight intensity={0.3} />
          <directionalLight intensity={1.1} position={[2, 2, 2]} />
          <Suspense fallback={<Html center style={{ color: '#9aa3b2' }}>Loading 3D…</Html>}>
            <PresentationControls global rotation={[0.1, 0.2, 0]} polar={[ -0.4, 0.4 ]} azimuth={[ -0.6, 0.6 ]} config={{ mass: 1, tension: 200 }}>
              <Float floatIntensity={1.5} speed={2.2}>
                <Phone color={color} />
              </Float>
            </PresentationControls>
            <Environment preset="city" />
          </Suspense>
          <ContactShadows frames={1} position={[0, -0.9, 0]} opacity={0.35} blur={2.6} far={1.4} color="#0b0d12" />
        </Canvas>
      </div>
    </div>
  )
}
