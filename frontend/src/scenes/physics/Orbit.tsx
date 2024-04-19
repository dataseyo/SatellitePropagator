"use client"

import { useFrame, useThree } from '@react-three/fiber'
import { Sphere, useTexture, useHelper } from '@react-three/drei'
import { useEffect, useState, useRef, useMemo } from 'react'
import * as THREE from 'three'
import { DirectionalLightHelper } from 'three';
import { RefObject, forwardRef } from 'react'

import useOrbitStore from '@/store/orbitstore'

interface State {
    id: number
    type: "element" | "state"
    state: number[],
    map?: THREE.Texture,
    scale?: "solar" | "sat", // scale down objects differently according to whether they're near earth satellites or celestial bodies
    size?: number,
    speed?: number,
    track: boolean
}

type Earth = RefObject<THREE.Mesh<THREE.BufferGeometry<THREE.NormalBufferAttributes>, THREE.Material | THREE.Material[], THREE.Object3DEventMap>>

const Sat = forwardRef(({state, map, scale, type, size, speed, track}: State, ref: any) => {
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
            fetch('http://10.0.0.3:8080/orbit', {
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
            // console.log(JSON.parse(orbit.state))
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
            t += 0.005 * objSpeed
            let point = path.getPoint(t)
            satRef.current && satRef.current.position.set(point.x, point.y, point.z)


      

            if (rayRef.current && satRef.current) {
                // let dirToOrigin = new THREE.Vector3(0, 0, 0)
                let satPos = satRef.current.position
                let neg = new THREE.Vector3(-satPos.x, -satPos.y, -satPos.z)
                rayRef.current.set(satPos, neg)
                neg.normalize()

                // note: this will draw arrows to earth
                // let arrowHelper = new THREE.ArrowHelper(neg, satPos, 10, "red")
                // scene.add(arrowHelper)

                if (track ) {
                    // get intersection of ray between satellite and Earth center
                    let intersection = rayRef.current.intersectObject(ref.current, false)[0].point
                    // intersection.x + 5
                    // let axis = new THREE.Vector3(1, 0, 0)
                    // let angle = - Math.PI / 2
                    // intersection.applyAxisAngle(axis, angle)
                    let normedInt = intersection.normalize()

                    // convert to local coordinates
                    let localIntersection = ref.current.worldToLocal(normedInt)
                    
                    // let normedLocalInt = localIntersection.normalize()
                    // let normedInt = intersection.normalize()
                    let long = Math.atan2(localIntersection.y, localIntersection.z) * 180 / Math.PI
                    let lat = Math.asin(localIntersection.x) * 180 / Math.PI
                    // console.log(long, lat)
                    // addTrack([long, lat])
                }

                // attempt 2 ground track
                if (track) {
                    let localIntersection = ref?.current.worldToLocal(point)
                    spherical.setFromVector3(localIntersection)

                    let lat = THREE.MathUtils.radToDeg(Math.PI / 2 - spherical.phi)
                    let long = THREE.MathUtils.radToDeg(spherical.theta)
                    long = long - 90
                    console.log(lat, long)
                    addTrack([long, lat])
                }
            }
        }
    })
    
    return (
        <group>
            <raycaster ref={rayRef}/>
            <mesh position={[0, 3, 0]} ref={satRef} >
                <sphereGeometry args={[objSize]}/>
                <meshStandardMaterial map={map} color={track ? "red" : ""}/>
            </mesh>
        </group>
    )
})

const Orbit = () => {
    const [orbits, setOrbits] = useState<State[]>([
        // dummy data for now : a, e, i, O, w, F
        {
            id: 1,
            type: "element",
            state: [8000, 0.1, 30, 145, 120, 10, 0],
            track: false
        },
        {
            id: 2,
            type: "element",
            state: [26600, .6418940, 64.2851, 137.5555, 271.9172, 21.0476],
            track: true,
            speed: .08
        },
        {
            id: 3,
            type: "state",
            state: [-820.865,-1905.95,-7445.9, -6.75764,-1.85916,0.930651],
            track: false
        },
        {
            id: 4,
            type: "element",
            state: [6798 , 0.00047, 51.6398, 18.4032, 66.3077, 18.4032],
            track: false
        },
        {
            id: 5,
            type: "state",
            state: [-1.879628542537870e5,  3.473462794543137e5, 3.556398887633426e4, -8.915671556736201e-1, -4.215831961891819e-1, -1.595210201459024e-2],
            scale: "solar",
            size: 2,
            speed: .5,
            track: false
        }, 
        {
            id: 6,
            type: "element",
            state: [6498 , 0.00047, 89.0, 18.4032, 66.3077, 18.4032],
            track: false,
            speed: .5
        },
        {
            id: 7,
            type: "element",
            state: [35793, 0, .01, 1, 1, 1],
            track: false,
            speed: .08
        }
    ])

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

    // if (earthRef.current) {
    //     console.log("rotating")
    //     earthRef.current.geometry.rotateZ(Math.PI/4)
    // }

    // useEffect(() => {
    //     console.log('earth ref')
    //     earthRef.current?.geometry.rotateY(Math.PI/3)
    // }, [earthRef])

    const testLatLong = (point: THREE.Vector3) => {
        console.log(point)
        // let normedInt = point.normalize()
        if (earthRef.current) {
            let localIntersection = earthRef?.current.worldToLocal(point)
            let spherical = new THREE.Spherical()
            spherical.setFromVector3(localIntersection)
            console.log(spherical)
            let lat = THREE.MathUtils.radToDeg(Math.PI / 2 - spherical.phi)
            let long = THREE.MathUtils.radToDeg(spherical.theta)
            long = long - 90
            console.log(lat, long)
            // let long = Math.atan2(localIntersection.y, localIntersection.z) * 180 / Math.PI
            // let lat = Math.asin(localIntersection.x) * 180 / Math.PI
            // console.log(long, lat)
        }
   
    }

    let euler = new THREE.Euler(0, 1, 0)
    return (
        <group>
            <directionalLight position={[0, 20, 5]} intensity={5} color={"white"} ref={dirLight}/>

            {/* Earth */}
            {/* <mesh ref={earthRef}>
                <sphereGeometry args={[5, 64, 32]}/>
                <meshStandardMaterial color="white" map={earthTexture}/>
            </mesh> */}
            <Sphere 
                onClick={(intersection) => testLatLong(intersection.point)}
            
            args={[5, 64, 32]} ref={earthRef} rotation-x={Math.PI/2}>
                <meshStandardMaterial color="white" map={earthTexture}/>
            </Sphere>

            {/* Orbits */}
            {
                orbits?.map((orbit) => (
                    <Sat key={orbit.id} {...orbit} ref={earthRef} map={orbit.id === 5 ? moonTexture : undefined}/>
                ))
            }
        </group>
    )
}

export default Orbit