"use client"

import { MdGpsFixed } from "react-icons/md";
import { BsClipboardData } from "react-icons/bs";
import { CgMenuGridO } from "react-icons/cg";
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
            className="flex p-2 w-full flex-col items-start justify-center"
            variants={subItems}
            initial="closed"
        >
            <p className="text-white-100">a: {a}</p>
            <p className="text-white-100">e: {e}</p>
            <p className="text-white-100">i: {i}</p>
            <p className="text-white-100">Ω: {O}</p>
            <p className="text-white-100">ω: {w}</p>
            <p className="text-white-100">T: {T}</p>
        </motion.div>
    )
}

const Menu = () => {
    return (
        <motion.div
            className="flex flex-col z-10"
            initial={{  scale: 0.5, opacity: 0, y: 20}}
            animate={{ scale: 1, opacity: 1, y:0 }}
            exit={{ scale: 0.5, opacity: 0, y:20 }}
        >
            <MenuItem />
            <MenuItem />
            <MenuItem />
        </motion.div>
    )
}

const MenuItem = () => {
    return (
        <motion.div
            initial={{  scale: 0.5, opacity: 0}}
            animate={{ scale: 1, opacity: 1}}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring" }}
            className="h-8 w-8 mb-2 outline outline-1 outline-white-500/30 hover:cursor-pointer flex items-center justify-center opacity-85 bg-black-700 z-10 backdrop-blur-md rounded-lg">
            <MdGpsFixed size={28} className="text-white-100 outline-white-500/30"/>
        </motion.div>
    )
}  

const TLE = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    const [data, setData] = useState<Kep>({
        a: 0,
        e: 0,
        i: 0,
        O: 0,
        w: 0,
        T: 0
    })
    // const activeOrbit = useOrbitStore((state) => state.activeOrbit)
    // const orbit: any = useOrbitStore(state => state.orbits.filter(orbit => orbit.trackDraw === true))

    // useEffect(() => {
    //     if (orbit.state) {
    //         let props: Kep = {
    //             a: orbit.state[0],
    //             e: orbit.state[1],
    //             i: orbit.state[2],
    //             O: orbit.state[3],
    //             w: orbit.state[4],
    //             T: orbit.period
    //         }

    //         setData(props)
    //     }
        
    // }, [orbit.state])

    const menu = {
        closed: {
            height: "50px",
            width: "50px",
            transition: {
                duration: .65,
                type: "tween",
                ease: [.72, 0, 0.24, 1],
            }
        },
        open: {
            height: "200px",
            width: `50px`,
            transition: {
                duration: .65,
                type: "tween",
                ease: [.72, 0, 0.24, 1],
            }
        }
    }

    return (
        <div className="absolute flex flex-col z-10 left-3 bottom-3">
            {/* Sub Menu */}
            <AnimatePresence>
                {menuOpen &&
                    <Menu />
                    // <motion.div
                    //     initial={{opacity:0, y: 10}}
                    //     animate={{opacity:1, y:0}}
                    //     exit={{opacity:0, y:10}}
                    // >
                    //     <div className="text-white-100">Hey</div>
                    // </motion.div>
                }
            </AnimatePresence>

            {/* Menu */}
            <div 
                // onClick={() => console.log(orbit)} 
                className="h-8 w-8 outline outline-1 outline-white-500/30 hover:cursor-pointer flex items-center justify-center opacity-85 bg-black-700 z-10 backdrop-blur-md rounded-lg"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <CgMenuGridO size={28} className="text-white-100 outline-white-500/30"/>
                {/* <AnimatePresence>
                    {showData &&
                        <Kep {...data} />
                    }
                </AnimatePresence> */}
            </div>
        </div>
    )
}

export default TLE