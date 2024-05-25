"use client"

import BottomMenu from "../Config/BottomMenu"
import GroundTrack from "../GroundTrack/GroundTrack"
import TLE from "../TLE/TLE"
import useOrbitStore from "@/store/orbitstore"

const SceneInterface = () => {
    const menuOption = useOrbitStore((state) => state.menuOption)
 
    return (
        <div className="flex justify-between w-full h-100">
            <BottomMenu />
            {
                menuOption === "track" ?
                <GroundTrack /> :
                <TLE />
            }
        </div>
    )
}

export default SceneInterface