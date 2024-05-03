"use client"

import { Canvas } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import dynamic from 'next/dynamic';
import { State } from '@/types/types';
import { useEffect } from 'react';
import useOrbitStore from '@/store/orbitstore';

const Orbit = dynamic(() => import('@/scenes/physics/Orbit').then((mod) => mod.Orbit), { ssr: false })

export default function Scene({initial_data}: {initial_data: State[]}) {
    const addOrbit = useOrbitStore((state) => state.addOrbit)
    const orbits = useOrbitStore((state) => state.orbits)
    
    useEffect(() => {
        console.log(orbits.length)
        if (orbits.length === 0) {
            initial_data.map((orbit) => {
                addOrbit(orbit)
            }) 
        }
    }, [])

    return (
        <Canvas
            camera={{
            fov: 45,
            position: [8, 12, 3],
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
            <Orbit />
        </Canvas>
    )
}