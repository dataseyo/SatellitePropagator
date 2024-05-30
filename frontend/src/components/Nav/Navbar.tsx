"use client"

import { LiaAtomSolid } from "react-icons/lia";
import { IoIosMenu } from "react-icons/io";
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from "react";
import Link from "next/link";

import OrbitConfig from "../Config/OrbitConfig";
import { useWindowSize } from "@/hooks/useWindowSize";

type MenuButtonProps = {
    children?: JSX.Element | React.ReactNode,
    onClick?: () => void
}

const MenuButton = ({children, onClick}: MenuButtonProps) => {
    return (
        <div 
            onClick={onClick}
            className="flex flex-row hover:cursor-pointer hover:bg-blue-500 items-center justify-between text-white-100 bg-black-800 rounded-lg p-2 md:min-h-12"
        >
            {children}
        </div>
    )
}

export default function Navbar() {
    const [open, setOpen] = useState<boolean>(false)
    const [mobileOpen, setMobileOpen] = useState<boolean>(false)
    let windowSize = useWindowSize()

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
            width: `${windowSize < 768 ? "75%" : ""}`,
            transition: {
                duration: .65,
                type: "tween",
                ease: [.72, 0, 0.24, 1],
            }
        }
    }

    const subMenu = {
        closed: {
            opacity: "0%",
            translateY: -20,
        },
        open: {
            opacity: "100%",
            translateY: 0,
            transition: {
                delay: .3
            }
        }
    }

    const toggleMenu = () => {
        setOpen(prevOpen => !prevOpen)
    }

    const toggleMobileMenu = () => {
        setMobileOpen(prevMobileOpen => !prevMobileOpen)
    }
    
    return (
        <motion.div 
            className="absolute flex-col top-4 h-20 outline outline-white-500/30 outline-1 opacity-85 bg-black-700 w-52 md:w-1/2 min-w-60 z-10 backdrop-blur-md p-0 rounded-lg"
            variants={menu}
            animate={open ? "open" : "closed"}
            initial="closed"
        >
            <div className="flex h-20 flex-row items-center content-center">
                {/* mobile */}
                <div className="flex flex-1 items-center justify-between md:hidden text-white mx-4">
                    {/* <MenuButton onClick={toggleMobileMenu}>
                        <IoIosMenu size={35} className="text-white-100"/>
                        <h2 className="text-white-100">Menu</h2>
                    </MenuButton> */}
                    <Link href="/">
                        <MenuButton>
                            <h2 className="text-white-100">Home</h2>
                        </MenuButton>
                    </Link>

                    <MenuButton onClick={toggleMenu}>
                        <LiaAtomSolid color={"white"} size={35} className=""/>
                    </MenuButton>
                    
                </div>

                {/* desktop */}
                <div className="flex-1 items-center justify-between mx-8 hidden md:flex">
                    <Link href="/">
                        <MenuButton>
                            <h2 className="text-white-100">Home</h2>
                        </MenuButton>
                    </Link>

                    {/* <Link href="/physics">
                        <MenuButton>
                            <h2 className="text-white-100">
                                    The Physics
                            </h2> 
                        </MenuButton>
                    </Link> */}

                    <MenuButton onClick={toggleMenu}>                        
                        <LiaAtomSolid size={35} className="text-white-100"/>
                    </MenuButton>
                </div>
            </div>

            {/* Opened Menu */}
            <AnimatePresence>
                {open && 
                    <motion.div
                        variants={subMenu}
                        initial="closed"
                        className="flex-col mx-4"
                    >
                        <OrbitConfig setOpen={setOpen}/>
                    </motion.div>
                }
            </AnimatePresence>
        </motion.div>
    )
}