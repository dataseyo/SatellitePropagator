"use client"

import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei';

import Orbit from "@/scenes/physics/Orbit";

export default function Home() {

  return (
    <main className="flex h-full min-h-screen flex-col items-center justify-center">
      <div className="h-screen w-screen z-0">
        <Canvas
          camera={{
            fov: 45,
            position: [0, 50, 40],
            up: [0, 0, 1]
          }}
        >
          <color attach="background" args={["black"]}/>
          <OrbitControls rotation={[0, 2 * Math.PI, 0]} position={[100, -10, 0]}/>
          <Stars count={5000} radius={200}/>
          <ambientLight intensity={Math.PI / 8}/>
          <Orbit/>
        </Canvas>
      </div>
    </main>
  );
}
