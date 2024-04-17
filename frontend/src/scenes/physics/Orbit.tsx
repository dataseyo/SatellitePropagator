"use client"

import { useFrame, useThree } from '@react-three/fiber'
import { Sphere, useTexture, useHelper } from '@react-three/drei'
import { useEffect, useState, useRef, useMemo } from 'react'
import * as THREE from 'three'

import { DirectionalLightHelper } from 'three';

import { RefObject, forwardRef } from 'react'

interface State {
    id: number
    type: "element" | "state"
    state: number[],
    map?: THREE.Texture,
    scale?: "solar" | "sat", // scale down objects differently according to whether they're near earth satellites or celestial bodies
    size?: number,
    speed?: number
}

type Earth = RefObject<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>>

// a, e, i, O, w, F
const testData: State[] = [
    {
        id: 1,
        type: "element",
        state: [8000, 0.1, 30, 145, 120, 10, 0]
    },
    {
        id: 2,
        type: "element",
        state: [26600, .6418940, 64.2851, 137.5555, 271.9172, 21.0476]
    },
    {
        id: 3,
        type: "state",
        state: [-820.865,-1905.95,-7445.9, -6.75764,-1.85916,0.930651],
    },
    {
        id: 4,
        type: "element",
        state: [6798 , 0.00047, 51.6398, 18.4032, 66.3077, 18.4032]
    },
    {
        id: 5,
        type: "state",
        state: [-1.879628542537870e5,  3.473462794543137e5, 3.556398887633426e4, -8.915671556736201e-1, -4.215831961891819e-1, -1.595210201459024e-2],
        scale: "solar",
        size: 2,
        speed: .5
    }, 
]

const Sat = forwardRef(({state, map, scale, type, size, speed}: State, ref: any) => {
    const [orbit, setOrbit] = useState<any>(null)
    const [posInOrbit, setPosInOrbit] = useState(0)
    const [path, setPath] = useState<any>(null)

    const satRef = useRef<THREE.Mesh>(null)

    const satId = `${state[0]} ${state[1]}`
    const rayRef = useRef<THREE.Raycaster>(null)
    const testRef = useRef<any>(null)

    const { scene } = useThree()

    // set scale and size and speed
    let scaleFactor = 800
    if (scale == "solar") {
        console.log(scale)
        scaleFactor = 10000
    }

    let objSize = .5
    if (size) {
        objSize = size
    }

    let objSpeed = 1
    if (speed) {
        objSpeed = speed
    }

    useEffect(() => {
        const fetchOrbit = () => {
            fetch('http://127.0.0.1:8080/orbit', {
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
            console.log(JSON.parse(orbit.state))
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

    useFrame((state, delta) => {
        if (orbit && path) {
            t += 0.005 * objSpeed
            let point = path.getPoint(t)
            satRef.current && satRef.current.position.set(point.x, point.y, point.z)

            if (rayRef.current && satRef.current && testRef.current) {
                // let dirToOrigin = new THREE.Vector3(0, 0, 0)
                let satPos = satRef.current.position
                let neg = new THREE.Vector3(-satPos.x, -satPos.y, -satPos.z)
                rayRef.current.set(satPos, neg)
                neg.normalize()

                // note: this will draw arrows to earth
                // let arrowHelper = new THREE.ArrowHelper(neg, satPos, 10, "red")
                // scene.add(arrowHelper)

                let intersection = rayRef.current.intersectObject(testRef.current, false)[0].point
                let normedInt = intersection.normalize()

                let norm = 3
                let long = Math.atan2(normedInt.x, normedInt.z) * 180 / Math.PI
                let lat = Math.asin(normedInt.y) * 180 / Math.PI
                // console.log(lat, long)
                // console.log(intersection)
            }
        }
    })
    
    return (
        <group>
            <raycaster ref={rayRef}/>
            <Sphere args={[3]} visible={false} ref={testRef}></Sphere>
            <mesh position={[0, 3, 0]} ref={satRef} >
                <sphereGeometry args={[objSize]}/>
                <meshStandardMaterial map={map}/>
            </mesh>
        </group>
    )
})

const Orbit = () => {
    const [orbits, setOrbits] = useState<State[]>([
        {
            id: 1,
            type: "element",
            state: [8000, 0.1, 30, 145, 120, 10, 0]
        },
        {
            id: 2,
            type: "element",
            state: [26600, .6418940, 64.2851, 137.5555, 271.9172, 21.0476]
        },
        {
            id: 3,
            type: "state",
            state: [-820.865,-1905.95,-7445.9, -6.75764,-1.85916,0.930651],
        },
        {
            id: 4,
            type: "element",
            state: [6798 , 0.00047, 51.6398, 18.4032, 66.3077, 18.4032]
        },
        {
            id: 5,
            type: "state",
            state: [-1.879628542537870e5,  3.473462794543137e5, 3.556398887633426e4, -8.915671556736201e-1, -4.215831961891819e-1, -1.595210201459024e-2],
            scale: "solar",
            size: 2,
            speed: .5
        }, 
    ])

    const dirLight = useRef<any>()
    // useHelper(dirLight, DirectionalLightHelper, 4, "red")
    const earthTexture = useTexture('/earthday.jpg')
    const moonTexture = useTexture('/moon.jpeg')
    const earthRef = useRef<THREE.Mesh>(null)

    useFrame((state, delta) => {
        // rotate earth
        if (earthRef.current) {
            earthRef.current.rotation.y += delta / Math.PI
        }
    })

    return (
        <group>
            <directionalLight position={[0, 20, 5]} intensity={5} color={"white"} ref={dirLight}/>

            {/* Earth */}
            <Sphere args={[5]} ref={earthRef} rotation-x={Math.PI/2}>
                <meshStandardMaterial color="white" map={earthTexture}/>
            </Sphere>

            {/* Orbits */}
            {
                orbits?.map((orbit) => (
                    <Sat key={orbit.id} {...orbit} ref={earthRef}/>
                ))
            }
        </group>
    )
}

export default Orbit