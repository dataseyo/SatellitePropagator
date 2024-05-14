"use client"

import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture, useHelper } from '@react-three/drei'
import { useEffect, useState, useRef, useMemo, forwardRef } from 'react'
import * as THREE from 'three'
// import { DirectionalLightHelper } from 'three';
import { meshBounds } from '@react-three/drei'

import useOrbitStore from '@/store/orbitstore'
import { State } from '@/types/types'

const Sat = forwardRef( function Sat({state, id, map, period, scale, type, size, speed, trackDraw, data, arrows}: State, ref: any) {
    // zustand store
    const addTrack = useOrbitStore((state) => state.setTrack)
    const chooseTrack = useOrbitStore((state) => state.chooseTrack)

    // state
    const [path, setPath] = useState<any>(null)

    // refs and init
    const satRef = useRef<THREE.Mesh>(null)
    const satId = `${state[0]} ${state[1]}`
    const rayRef = useRef<THREE.Raycaster>(null)
    const lineRef = useRef<any>(null)

    // set scale and size and speed
    let objSize = .05
    if (size) {
        objSize = size
    }

    useEffect(() => {
        if (data) {
            const curvePoints = []
            for (let i = 0; i < data.length; i++) {
                curvePoints.push(new THREE.Vector3(data[i][0], data[i][1], data[i][2]))
            }

            // construct curve
            const curve = new THREE.CatmullRomCurve3(curvePoints)
            setPath(curve)
            const points = curve.getSpacedPoints(data.length)
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            const material = new THREE.LineBasicMaterial({color: "white", opacity: .2, transparent: true})
            if (lineRef.current) {
                lineRef.current.geometry = geometry
                lineRef.current.material = material
                lineRef.current.name = satId
            }

            // set initial position
            let init_point = curve.getPointAt(0)
            if (satRef.current) {
                satRef.current.position.set(init_point.x, init_point.y, init_point.z)
            }
        }
    }, [])

    // animation loop
    let t = 0.001
    let spherical = new THREE.Spherical()
    useFrame((state, delta) => {
        if (path && satRef.current) {
            let p = 1
            if (period) {p = period}
            t += (.01 * delta) / p 
            let point = path.getPoint(t)
            satRef.current.position.lerp(new THREE.Vector3(point.x, point.y, point.z), .5)

            if (rayRef.current && satRef.current) {
                // let dirToOrigin = new THREE.Vector3(0, 0, 0)
                // let satPos = satRef.current.position
                // let neg = new THREE.Vector3(-satPos.x, -satPos.y, -satPos.z)
                // rayRef.current.set(satPos, neg)
                // neg.normalize()

                // note: this will draw arrows to earth
                // if (arrows) {
                //     let arrowHelper = new THREE.ArrowHelper(neg, satPos, 10, "red")
                //     scene.add(arrowHelper)
                // }
            
                if (trackDraw) {
                    let localIntersection = ref?.current.worldToLocal(point)
                    spherical.setFromVector3(localIntersection)

                    let lat = THREE.MathUtils.radToDeg(Math.PI / 2 - spherical.phi)
                    let long = THREE.MathUtils.radToDeg(spherical.theta)
                    long = long - 90
                    addTrack([long, lat])
                }
            }
        }
    })

    const colorRender = () => {
        if (map) {
            return ""
        } else if (trackDraw) {
            return "red"
        } 
        return "palegreen"
    }

    const ConditionalTexture = () => {
        let mapTexture = useTexture(map ?? `${map}`)
        return mapTexture
    }
    
    return (
        // onClick={() => setHover(true)} onPointerOver={(() => setHover(true))} onPointerLeave={() => setHover(false)}
        <group>
            <line ref={lineRef} />
            <raycaster ref={rayRef}/>
            <mesh 
                position={[0, 0, 0]} 
                ref={satRef} 
                onClick={() => chooseTrack(id)} 
            >
                <sphereGeometry args={[objSize]}/>
                {
                    map ?
                        <meshLambertMaterial 
                        map={ConditionalTexture()} 
                        color={colorRender()} 
                        transparent={false}
                        // opacity={0.7}
                        /> 
                        : 
                        <meshLambertMaterial 
                            color={colorRender()} 
                            transparent={true}
                            opacity={0.7}
                        />
                }
            </mesh>
        </group>
    )
})

export function Orbit() {
    // get orbits from store
    const zOrbits = useOrbitStore((state) => state.orbits)

    const dirLight = useRef<any>()
    const earthTexture = useTexture('/earthday.jpg')
    const earthRef = useRef<THREE.Mesh>(null)
    const earthRotation = ((Math.PI * 2) / (60 * 60 * 24)) * 4200

    useFrame((state, delta) => {
        if (earthRef.current) {
            earthRef.current.rotation.y += delta * earthRotation
        }
    })

    return (
        <group>
            <directionalLight position={[0, 20, 5]} intensity={5} color={"white"} ref={dirLight}/>

            {/* Earth */}
            <Sphere args={[.8, 64, 32]} ref={earthRef} rotation-x={Math.PI/2}>
                <meshStandardMaterial color="white" map={earthTexture}/>
            </Sphere>

            {/* Orbits */}
            {
                zOrbits?.map((orbit) => (
                    <Sat key={orbit.id} {...orbit} ref={earthRef}/>
                ))
            }
        </group>
    )
}
