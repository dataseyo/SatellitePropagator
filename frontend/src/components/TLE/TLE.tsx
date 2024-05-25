"use client"

import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from "react";

import useOrbitStore from "@/store/orbitstore";
import { State } from "@/types/types";

interface Kep {
    a: number,
    e: number,
    i: number,
    O: number,
    w: number,
    T: number | undefined
}

const TLE = () => {
    const activeOrbit = useOrbitStore((state) => state.activeOrbit)
    const elements = useOrbitStore((state) => state.orbits.filter(orbit => orbit.id === activeOrbit))
    const [kep, setKep] = useState({
        a: 0,
        e: 0,
        i: 0,
        O: 0,
        w: 0,
        T: 0
    })

    useEffect(() => {
        if (elements) {
            setKep({
                a: elements[0].state[0],
                e: elements[0].state[1],
                i: elements[0].state[2],
                O: elements[0].state[3],
                w: elements[0].state[4],
                T: elements[0].period ? elements[0].period : 0
            })
        }
    }, [elements[0].state])

    const subItems = {
        closed: {
            opacity: "0%",
        },
        open: {
            opacity: "100%",
            translateY: 0,
            transition: {
                delay: .35
            }
        }
    }

    return (
        <motion.div 
            className="absolute flex flex-col flex-grow-1 right-2 bottom-0 z-10"
            // variants={subItems}
            // initial="closed"
        >
            <p className="text-white-100">a: {kep.a}</p>
            <p className="text-white-100">e: {kep.e}</p>
            <p className="text-white-100">i: {kep.i}</p>
            <p className="text-white-100">Ω: {kep.O}</p>
            <p className="text-white-100">ω: {kep.w}</p>
            
            {/* to-do: translate this back from canonical to seconds */}
            {/* <p className="text-white-100">T: {kep.T}</p> */}
        </motion.div>
    )
}

export default TLE