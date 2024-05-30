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
        if (elements[0] && elements[0].elem) {
            setKep({
                a: elements[0].elem[0],
                e: elements[0].elem[1],
                i: elements[0].elem[2],
                O: elements[0].elem[3],
                w: elements[0].elem[4],
                T: elements[0].period ? parseFloat(elements[0].period.toFixed(3)) : 0
            })
        } else {
            setKep({
                a: 0,
                e: 0,
                i: 0,
                O: 0,
                w: 0,
                T: 0
            })
        }
    }, [elements[0]])

    return (
        <div 
            className="absolute flex flex-col flex-grow-1 right-2 bottom-0 z-10"
        >
            <table className='table table-xs'>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody className="text-white-100">
                    {kep && Object.entries(kep).map((elem, key) => {
                        return  (
                            <tr key={key}>
                                <th>{elem[0]}</th>
                                <td>{elem[1]}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default TLE