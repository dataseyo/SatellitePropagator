"use client"

import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls, Html, useProgress } from '@react-three/drei'
import dynamic from 'next/dynamic';
import { State } from '@/types/types';
import { useEffect, Suspense } from 'react';
import useOrbitStore from '@/store/orbitstore';
import { Environment, useTexture, Preload } from '@react-three/drei';
import * as THREE from 'three'
import { useInView } from 'react-intersection-observer'
import usePageVisibility from '@/hooks/usePageVisibility';

const Orbit = dynamic(() => import('@/scenes/physics/Orbit').then((mod) => mod.Orbit), { 
    ssr: false,
})

const Loader = () => {
    const { progress } = useProgress()
    return (
        <Html center>
            <h1 className='text-white-100'>Progress {progress}</h1>
        </Html>
    )
}

const EnvironmentConfig = () => {
    const galaxy = useTexture('hdrgalaxy.jpg')
    return (
        <Environment 
            backgroundIntensity={1.3} 
            background 
            near={1} 
            far={1000} 
            resolution={1800}
            backgroundRotation={[-Math.PI*2/3, 0, -Math.PI*2/3]}
        >
            <mesh scale={1000}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial map={galaxy} side={THREE.BackSide} />
            </mesh>
        </Environment>
    )
}

export default function Scene({initial_data}: {initial_data: State[]}) {
    const addOrbit = useOrbitStore((state) => state.addOrbit)
    const orbits = useOrbitStore((state) => state.orbits)
    
    useEffect(() => {
        if (orbits.length === 0) {
            initial_data.map((orbit) => {
                addOrbit(orbit)
            }) 
        }
    }, [])

    const { ref, inView } = useInView()

    return (
        <div ref={ref} className="h-screen w-screen z-0">

            <Canvas
                camera={{
                    fov: 45,
                    position: [8, 12, 3],
                    up: [0, 0, 1]
                }}
                // frameloop={visible ? 'always' : 'never'}
            >
                {/* CONFIG */}
                <Preload all />
                <EnvironmentConfig />
                <OrbitControls 
                    rotation={[0, 2 * Math.PI, 0]} 
                    position={[0, 0, 0]}
                    minDistance={2}
                    maxDistance={50}
                />
                <Stars count={5000} radius={500}/>
                <ambientLight intensity={Math.PI / 8}/>

                {/* SCENE */}
                <Suspense fallback={<Loader/>}>
                    <Orbit />
                </Suspense>
            </Canvas>
        </div>
    )
}