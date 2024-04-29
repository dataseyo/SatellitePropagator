"use client"

import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei';

import Orbit from "@/scenes/physics/Orbit";
import GroundTrack from '../components/GroundTrack/GroundTrack';

export default function Home() {
  return (
    <div className="flex h-full min-h-screen w-full flex-col items-center justify-center">
      <div className="h-screen w-screen z-0">
        <Canvas
          camera={{
            fov: 45,
            position: [10, 14, 5],
            up: [0, 0, 1]
          }}
        >
          {/* CONFIG */}
          <color attach="background" args={["black"]}/>
          <OrbitControls 
            rotation={[0, 2 * Math.PI, 0]} 
            position={[0, 0, 0]}
            minDistance={2}
            maxDistance={50}
          />
          <Stars count={5000} radius={200}/>
          <ambientLight intensity={Math.PI / 8}/>
          {/* <axesHelper args={[10]}/> */}

          {/* SCENE */}
          <Orbit/>
        </Canvas>
      </div>

      <GroundTrack />
    </div>
  );
}
