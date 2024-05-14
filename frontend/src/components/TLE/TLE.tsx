"use client"

import { MdGpsFixed } from "react-icons/md";
import { BsClipboardData } from "react-icons/bs";
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

const Kep = ({a, e, i, O, w, T}: Kep) => {
    return (
        <div className="flex flex-col">
            <p className="text-white-100">a: {a}</p>
            <p className="text-white-100">e: {e}</p>
            <p className="text-white-100">i: {i}</p>
            <p className="text-white-100">Ω: {O}</p>
            <p className="text-white-100">ω: {w}</p>
            <p className="text-white-100">T: {T}</p>
        </div>
    )
}

const TLE = () => {
    const [showData, setShowData] = useState(true)
    const [data, setData] = useState<Kep>({
        a: 0,
        e: 0,
        i: 0,
        O: 0,
        w: 0,
        T: 0
    })
    const activeOrbit = useOrbitStore((state) => state.activeOrbit)
    const orbit: any = useOrbitStore(state => state.orbits.filter(orbit => orbit.trackDraw === true))

    useEffect(() => {
        if (orbit.state) {
            let props: Kep = {
                a: orbit.state[0],
                e: orbit.state[1],
                i: orbit.state[2],
                O: orbit.state[3],
                w: orbit.state[4],
                T: orbit.period
            }

            setData(props)
        }
        
    }, [orbit.state])

    const menu = {
        closed: {
            height: "5rem",
            width: "",
            transition: {
                duration: .65,
                type: "tween",
                ease: [.72, 0, 0.24, 1],
            }
        },
        open: {
            height: "21rem",
            width: `20rem`,
            transition: {
                duration: .65,
                type: "tween",
                ease: [.72, 0, 0.24, 1],
            }
        }
    }

    return (
        <motion.div onClick={() => console.log(orbit)} className="absolute opacity-85 z-10 backdrop-blur-md rounded-lg p-3 flex flex-row flex-grow-1 left-2 bottom-2 bg-black-700">
            <div className="flex flex-col">
                <BsClipboardData size={28} className="text-white-100 mb-4" />
                <MdGpsFixed size={28} className="text-white-100 outline-white-500/30 outline-1"/>
            </div>

            <AnimatePresence>
                {showData && orbit.state &&
                    <Kep {...data} />
                }
            </AnimatePresence>
        </motion.div>
    )
}

export default TLE