"use client"

import { useFrame, useThree } from '@react-three/fiber'
import { Sphere, useTexture, useHelper } from '@react-three/drei'
import { useEffect, useState, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { DirectionalLightHelper } from 'three';
import { RefObject, forwardRef } from 'react'

import useOrbitStore from '@/store/orbitstore'
import { State } from '@/types/types'

type Earth = RefObject<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>>

const Sat = forwardRef(({state, map, scale, type, size, speed, track, arrows}: State, ref: any) => {
    // zustand store
    const addTrack = useOrbitStore((state) => state.setTrack)

    // state
    const [orbit, setOrbit] = useState<any>(null)
    const [path, setPath] = useState<any>(null)
    const [trackVisible, setTrackVisible] = useState<boolean>(false)

    // refs and init
    const satRef = useRef<THREE.Mesh>(null)
    const satId = `${state[0]} ${state[1]}`
    const rayRef = useRef<THREE.Raycaster>(null)

    // scene
    const { scene } = useThree()

    // set scale and size and speed
    let scaleFactor = 800
    if (scale == "solar") {
        scaleFactor = 5000
    }

    let objSize = .35
    if (size) {
        objSize = size
    }

    let objSpeed = 1
    if (speed) {
        objSpeed = speed
    }

    useEffect(() => {
        const fetchOrbit = () => {
            fetch('http://10.0.0.7:8080/orbit', {
                body: JSON.stringify({state: state, type: type}),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    setOrbit(data)
                })
                .catch((error) => console.log(error))
        }

        const data = fetchOrbit()
        setOrbit(data)
    }, [])
    
    useEffect(() => {
        if (orbit) {
            const curvePoints = []
            const r = JSON.parse(orbit.state).r
            for (let i = 0; i < r.length; i++) {
                curvePoints.push(new THREE.Vector3(r[i][0] / scaleFactor, r[i][1] / scaleFactor, r[i][2] / scaleFactor))
            }

            // construct curve
            const curve = new THREE.CatmullRomCurve3(curvePoints)
            setPath(curve)
            const points = curve.getSpacedPoints(r.length)
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            const material = new THREE.LineBasicMaterial({color: "white", opacity: .25, transparent: true})
            const curveObject = new THREE.Line(geometry, material)

            // name curve object to grab it from scene
            curveObject.name = satId
            scene.add(curveObject)

            // set initial position
            let init_point = curve.getPointAt(0)
            if (satRef.current) {
                satRef.current.position.set(init_point.x, init_point.y, init_point.z)
            }
        }
    }, [orbit])

    let t = 0.001

    let spherical = new THREE.Spherical()
    useFrame((state, delta) => {
        if (orbit && path) {
            t += 0.001 * objSpeed
            let point = path.getPoint(t)
            satRef.current && satRef.current.position.set(point.x, point.y, point.z)

            if (rayRef.current && satRef.current) {
                // let dirToOrigin = new THREE.Vector3(0, 0, 0)
                let satPos = satRef.current.position
                let neg = new THREE.Vector3(-satPos.x, -satPos.y, -satPos.z)
                rayRef.current.set(satPos, neg)
                neg.normalize()

                // note: this will draw arrows to earth
                if (arrows) {
                    let arrowHelper = new THREE.ArrowHelper(neg, satPos, 10, "red")
                    scene.add(arrowHelper)
                }
            

                // attempt 2 ground track
                if (track) {
                    let localIntersection = ref?.current.worldToLocal(point)
                    spherical.setFromVector3(localIntersection)

                    let lat = THREE.MathUtils.radToDeg(Math.PI / 2 - spherical.phi)
                    let long = THREE.MathUtils.radToDeg(spherical.theta)
                    long = long - 90
                    // console.log(lat, long)
                    addTrack([long, lat])
                }
            }
        }
    })

    const colorRender = () => {
        if (map) {
            return ""
        } else if (track) {
            return "red"
        } 
        return "palegreen"
    }
    
    return (
        <group>
            <raycaster ref={rayRef}/>
            <mesh position={[0, 3, 0]} ref={satRef} >
                <sphereGeometry args={[objSize]}/>
                <meshLambertMaterial 
                    map={map} 
                    color={colorRender()} 
                    transparent={true}
                    opacity={0.7}
                />
            </mesh>
        </group>
    )
})

const Orbit = () => {
    // get orbits from store
    const zOrbits = useOrbitStore((state) => state.orbits)
    console.log(zOrbits)

    const dirLight = useRef<any>()
    // useHelper(dirLight, DirectionalLightHelper, 4, "red")
    const earthTexture = useTexture('/earthday.jpg')
    const moonTexture = useTexture('/moon.jpeg')
    const earthRef = useRef<THREE.Mesh>(null)

    useFrame((state, delta) => {
        // rotate earth
        if (earthRef.current) {
            earthRef.current.rotation.y += (delta / Math.PI ) / 4
            // console.log(earthRef.current.worldToLocal)
        }
    })

    let euler = new THREE.Euler(0, 1, 0)
    return (
        <group>
            <directionalLight position={[0, 20, 5]} intensity={5} color={"white"} ref={dirLight}/>

            {/* Earth */}
            <Sphere args={[5, 64, 32]} ref={earthRef} rotation-x={Math.PI/2}>
                <meshStandardMaterial color="white" map={earthTexture}/>
            </Sphere>

            {/* Orbits */}
            {
                zOrbits?.map((orbit) => (
                    <Sat key={orbit.id} {...orbit} ref={earthRef} map={orbit.id === 5 ? moonTexture : undefined}/>
                ))
            }
        </group>
    )
}

export default Orbit