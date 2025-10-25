import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, MeshTransmissionMaterial } from '@react-three/drei'

function CameraIsle({ position = [0,0,0] }) {
  return (
    <group position={position}>
      <RoundedBox args={[0.46, 0.24, 0.02]} radius={0.08} smoothness={8}>
        <meshStandardMaterial color="#101115" roughness={0.6} metalness={0.6} />
      </RoundedBox>
      <mesh position={[ -0.11, 0.02, 0.015 ]}>
        <circleGeometry args={[0.06, 32]} />
        <meshStandardMaterial color="#0b0c0f" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[ 0.09, -0.02, 0.015 ]}>
        <circleGeometry args={[0.05, 32]} />
        <meshStandardMaterial color="#0b0c0f" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0.2, 0.08, 0.015]}>
        <circleGeometry args={[0.02, 32]} />
        <meshStandardMaterial color="#1f2530" emissive="#88e9ff" emissiveIntensity={1.4} />
      </mesh>
    </group>
  )
}

export default function Phone({ color = '#0a0b10' }) {
  const group = useRef()
  const t = useRef(0)

  useFrame((state, delta) => {
    t.current += delta
    if (group.current) {
      group.current.rotation.x = Math.sin(t.current / 3) * 0.06
      group.current.rotation.y = Math.cos(t.current / 2.5) * 0.12
      group.current.position.y = Math.sin(t.current / 2) * 0.03
    }
  })

  return (
    <group ref={group}>
      {/* Phone body */}
      <RoundedBox args={[0.78, 1.64, 0.08]} radius={0.2} smoothness={12}>
        <meshPhysicalMaterial color={color} roughness={0.35} metalness={0.8} clearcoat={1} clearcoatRoughness={0.35} />
      </RoundedBox>

      {/* Screen glass */}
      <RoundedBox args={[0.74, 1.56, 0.02]} radius={0.18} smoothness={10} position={[0,0,0.04]}>
        <MeshTransmissionMaterial thickness={0.42} anisotropy={0.2} chromaticAberration={0.015} transmission={1} roughness={0.18} ior={1.5} samples={8} />
      </RoundedBox>

      {/* Screen content block (emissive layer) */}
      <RoundedBox args={[0.74, 1.56, 0.002]} radius={0.18} smoothness={10} position={[0, 0, 0.044]}>
        <meshStandardMaterial color="#0a0e13" emissive="#0a0e13" emissiveIntensity={0.9} />
      </RoundedBox>

      {/* Dynamic rings under the phone */}
      <mesh rotation={[-Math.PI/2,0,0]} position={[0, -0.86, 0]}>
        <ringGeometry args={[0.7, 1.2, 64]} />
        <meshBasicMaterial color="#1fb6ff" transparent opacity={0.06} />
      </mesh>

      {/* Notch */}
      <RoundedBox args={[0.24, 0.04, 0.02]} radius={0.02} position={[0, 0.78, 0.046]}>
        <meshStandardMaterial color="#0b0f14" roughness={0.4} metalness={0.8} />
      </RoundedBox>

      {/* Side buttons */}
      <RoundedBox args={[0.02, 0.18, 0.02]} radius={0.01} position={[-0.4, 0.1, 0]}>
        <meshStandardMaterial color="#12151b" metalness={0.7} roughness={0.3} />
      </RoundedBox>
      <RoundedBox args={[0.02, 0.12, 0.02]} radius={0.01} position={[-0.4, -0.06, 0]}>
        <meshStandardMaterial color="#12151b" metalness={0.7} roughness={0.3} />
      </RoundedBox>

      {/* Camera isle at the back */}
      <group position={[0, 0, -0.041]}>
        <CameraIsle position={[0.2, 0.5, -0.001]} />
      </group>

      {/* Logo */}
      <mesh position={[0, -0.54, -0.04]}>
        <torusGeometry args={[0.04, 0.008, 16, 64]} />
        <meshStandardMaterial color="#81f5ff" emissive="#4ae3ff" emissiveIntensity={0.6} metalness={1} roughness={0.25} />
      </mesh>
    </group>
  )
}
