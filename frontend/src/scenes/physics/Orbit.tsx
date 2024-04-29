"use client"

import { useFrame, useThree } from '@react-three/fiber'
import { Sphere, useTexture, useHelper } from '@react-three/drei'
import { useEffect, useState, useRef, useMemo } from 'react'
import * as THREE from 'three'
// import { DirectionalLightHelper } from 'three';
import { forwardRef } from 'react'

import useOrbitStore from '@/store/orbitstore'
import { State } from '@/types/types'

const Sat = forwardRef( function Sat({state, id, map, scale, type, size, speed, trackDraw, arrows}: State, ref: any) {
    // zustand store
    const addTrack = useOrbitStore((state) => state.setTrack)
    const chooseTrack = useOrbitStore((state) => state.chooseTrack)

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

    let objSize = .05
    if (size) {
        objSize = size
    }

    let objSpeed = 1
    if (speed) {
        objSpeed = speed
    }

    useEffect(() => {
        const fetchOrbit = () => {
            fetch(`${process.env.NEXT_PUBLIC_PROD_API}/orbit`, {
                body: JSON.stringify({state: state, type: type}),
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            })
                .then((response) => response.json())
                .then((data: number[][]) => {
                    setOrbit(data)
                })
                .catch((error) => console.log(error))
        }

        const data = fetchOrbit()
        setOrbit(data)
    }, [])
    
    // to-do: only draw orbital path for selected objects, or transfer orbits
    useEffect(() => {
        if (orbit) {
            const curvePoints = []
            const r = JSON.parse(orbit.state).r
            for (let i = 0; i < r.length; i++) {
                curvePoints.push(new THREE.Vector3(r[i][0], r[i][1], r[i][2]))
            }

            // construct curve
            const curve = new THREE.CatmullRomCurve3(curvePoints)
            setPath(curve)
            const points = curve.getSpacedPoints(r.length)
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            const material = new THREE.LineBasicMaterial({color: "white", opacity: .2, transparent: true})
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
    const earthRotation = ((Math.PI * 2) / (60 * 60 * 24)) * 875
    useFrame((state, delta) => {
        if (orbit && path && satRef.current) {
            t += .1 * delta // * objSpeed
            let point = path.getPoint(t)
            satRef.current.position.lerp(new THREE.Vector3(point.x, point.y, point.z), .5)

            ref.current.rotation.y += delta * earthRotation
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
            
                // attempt 2 ground track
                if (trackDraw) {
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
        } else if (trackDraw) {
            return "red"
        } 
        return "palegreen"
    }

    // let spherical = new THREE.Spherical()
    // let curr = 0
    // let inc = 20
    // useInterval(() => {
    //     if (satRef.current && orbit && path) {
    //         let r = JSON.parse(orbit.state).r
    //         let point = path.getPoint(curr)
    //         if (curr + inc >= r.length) {
    //             curr = 0
    //         }
    //         // for (let i = 1; i < inc; i++) {
    //         //     curr += i
    //         //     satRef.current.position.lerp(new THREE.Vector3(r[curr][0], r[curr][1], r[curr][2]), 1)
    //         //     // satRef.current.position.copy(new THREE.Vector3(point.x, point.y, point.z))
    //         // }
    //         curr += inc
    //         satRef.current.position.lerp(new THREE.Vector3(r[curr][0], r[curr][1], r[curr][2]), .5)
    //     }

    //     // draw ground track
    //     if (trackDraw && rayRef.current && satRef.current) {
    //         let satPos = new THREE.Vector3
    //         satPos.copy(satRef.current.position)
    //         let neg = new THREE.Vector3(-satPos.x, -satPos.y, -satPos.z)
    //         rayRef.current.set(satPos, neg)
    //         // let arrowHelper = new THREE.ArrowHelper(neg, satPos, 1, "red")
    //         // scene.add(arrowHelper)

    //         let intersection = rayRef.current.intersectObject(ref.current)[0]
    //         if (intersection && intersection.point) {
    //             let localIntersection = ref.current.worldToLocal(intersection.point)
    //             spherical.setFromVector3(localIntersection)
    
    //             let lat = THREE.MathUtils.radToDeg(Math.PI / 2 - spherical.phi)
    //             let long = THREE.MathUtils.radToDeg(spherical.theta)
    //             long = long - 90
    //             addTrack([long, lat])
    //         }
    //     }
    // }, 1)
    
    return (
        <group>
            <raycaster ref={rayRef}/>
            <mesh position={[0, 0, 0]} ref={satRef} onClick={() => chooseTrack(id)}>
                <sphereGeometry args={[objSize]}/>
                <meshLambertMaterial 
                    map={map} 
                    color={colorRender()} 
                    transparent={false}
                    // opacity={0.7}
                />
            </mesh>
        </group>
    )
})

function Orbit() {
    // get orbits from store
    const zOrbits = useOrbitStore((state) => state.orbits)

    const dirLight = useRef<any>()
    // useHelper(dirLight, DirectionalLightHelper, 4, "red")
    const earthTexture = useTexture('/earthday.jpg')
    const moonTexture = useTexture('/moon.jpeg')
    const earthRef = useRef<THREE.Mesh>(null)

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
                    // <Sat key={orbit.id} {...orbit} ref={earthRef} map={orbit.id === 5 ? moonTexture : undefined}/>
                ))
            }
        </group>
    )
}

export default Orbit