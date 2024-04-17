// Menu to interact with orbit simulator
import { IoIosAddCircle } from "react-icons/io";
import { IoInformationCircle } from "react-icons/io5";

import { useState } from "react";

type OrbitInput = {

}

const conditionalPlaceholder = (placeOne: string, placeTwo: string) => {
    return window.innerWidth < 1000 ? placeOne : placeTwo
}

const OrbitConfig = () => {
    const [checked, setChecked] = useState(true)
    const [orbitInput, setOrbitInput] = useState({
        state: [],
    })

    const updateInput = () => {

    }

    const toggleInputType = () => {
        console.log("toggle")
        setOrbitInput({state: []})
        setChecked(prevChecked => !prevChecked)
    }
    
    return (
        <div className="flex flex-col">
            {/* Orbit Config */}
            <div className="relative flex flex-col h-56 outline outline-1 outline-offset-2 outline-blue-500/80 rounded-lg">
                {/* Orbit Adder */}
                <div className="flex flex-row ml-2 justify-between w-100 mr-2 mb-4 mt-2">
                    {/* <div className="flex lex-row items-center"> */}
                        <h3 className="text-white-100 font-bold ml-2 text-xl mr-2">Add Orbit</h3>
                        {/* <IoInformationCircle className="text-white-100" size={20}/> */}
                    {/* </div> */}
                    <div className="flex flex-row form-control">
                        <label className="mr-3">
                            <input readOnly type="radio" className="mr-1 " checked={checked} onClick={toggleInputType}/>
                            <span className="label-text text-white-100">State</span>
                        </label>

                        <label className="">
                            <input readOnly type="radio" className="mr-1" checked={!checked} onClick={toggleInputType}/>
                            <span className="label-text text-white-100">Elements</span>
                        </label>
                    </div>
                </div>

                {/* State or Elements */}
                <form className="">
                    {checked ?
                        // States
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center justify-between my-2 mx-2">
                                <input placeholder="x" type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input placeholder="y" type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input placeholder="z" type="number" className="input input-bordered w-1/3"/>
                            </div>
                            <div className="flex flex-row items-center justify-between my-2 mx-2">
                                <input placeholder="v_x" type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input placeholder="v_y" type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input placeholder="v_z" type="number" className="input input-bordered w-1/3"/>
                            </div>
                        </div>
                        :
                        // Elements
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center justify-between my-2 mx-2">
                                <input placeholder={conditionalPlaceholder("a", "semimajor axis")} type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input placeholder={conditionalPlaceholder("e", "eccentricity")} type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input placeholder={conditionalPlaceholder("i", "inclination")} type="number" className="input input-bordered w-1/3"/>
                            </div>
                            <div className="flex flex-row items-center justify-between my-2 mx-2">
                                <input placeholder={"RAAN"} type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input placeholder={conditionalPlaceholder("w", "arg of perigee")} type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input placeholder={conditionalPlaceholder("F", "true anomaly")} type="number" className="input input-bordered w-1/3"/>
                            </div>
                        </div>
                    }
                </form>

                <IoIosAddCircle 
                    size={32} 
                    className="absolute text-white-100 bottom-2 right-2 hover:text-blue-500 hover:cursor-pointer"
                />

                {/* Orbit Modifier - clear, delete */}
            </div>

            {/* Config Bottom Bar */}
            <div className="flex flex-col h-8 mt-4">
                <h3 className="text-white-100 font-bold ml-2 text-xl mr-2">Config</h3>
                {/* Modify Orbits */}
                <div className="flex flex-row mx-4 mt-3 justify-between">
                    <button className="btn w-1/3 btn-outline outline-green-500 mr-2 md:w-1/4 lg:w-1/5">
                        Tracks
                    </button>

                    <button className="btn w-1/3 btn-outline outline-green-500 mr-2 md:w-1/4 lg:w-1/5">
                        Clear
                    </button>

                    <button className="btn w-1/3 btn-outline btn-green mr-2 md:w-1/4 lg:w-1/5">
                        Elements
                    </button>
                </div>

                {/* Ground Tracks */}

                {/* Elements, Energy, etc. */}
            </div>
        </div>
    )
}

export default OrbitConfig