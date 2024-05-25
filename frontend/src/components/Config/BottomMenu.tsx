"use client"

import { MdGpsFixed } from "react-icons/md";
import { BsClipboardData } from "react-icons/bs";
import { CgMenuGridO } from "react-icons/cg";
import { IoSettingsOutline } from "react-icons/io5";
import { FaRegMap } from "react-icons/fa6";
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from "react";

import useOrbitStore from "@/store/orbitstore";

const Menu = () => {
    const changeMenuOption = useOrbitStore((state) => state.changeMenuOption)
    
    return (
        <motion.div
            className="flex flex-col z-10"
            initial={{  scale: 0.5, opacity: 0, y: 20}}
            animate={{ scale: 1, opacity: 1, y:0 }}
            exit={{ scale: 0.5, opacity: 0, y:20 }}
        >
            <MenuItem><IoSettingsOutline size={28} className="text-white-100 outline-white-500/30"/></MenuItem>
            <MenuItem><FaRegMap onClick={() => changeMenuOption("track")} size={28} className="text-white-100 outline-white-500/30"/></MenuItem>
            <MenuItem><BsClipboardData onClick={() => changeMenuOption("TLE")} size={28} className="text-white-100 outline-white-500/30"/></MenuItem>
        </motion.div>
    )
}

const MenuItem = ({children}: {children: React.ReactNode}) => {
    return (
        <motion.div
            initial={{  scale: 0.5, opacity: 0}}
            animate={{ scale: 1, opacity: 1}}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: "spring" }}
            className="h-8 w-8 mb-2 outline outline-1 outline-white-500/30 hover:cursor-pointer flex items-center justify-center opacity-85 bg-black-700 z-10 backdrop-blur-md rounded-lg"
        >
            {children}
        </motion.div>
    )
}  

const BottomMenu = () => {
    const [menuOpen, setMenuOpen] = useState(false)
    return (
        <div className="absolute flex flex-col z-10 left-3 bottom-3">
            {/* Sub Menu */}
            <AnimatePresence>
                {menuOpen &&
                    <Menu />
                }
            </AnimatePresence>

            {/* Menu */}
            <div 
                className="h-8 w-8 outline outline-1 outline-white-500/30 hover:cursor-pointer flex items-center justify-center opacity-85 bg-black-700 z-10 backdrop-blur-md rounded-lg"
                onClick={() => setMenuOpen(!menuOpen)}
            >
                <CgMenuGridO size={28} className="text-white-100 outline-white-500/30"/>
            </div>
        </div>
    )
}

export default BottomMenu