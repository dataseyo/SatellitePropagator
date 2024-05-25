// Menu to interact with orbit simulator
import { IoIosAddCircle } from "react-icons/io";
import { IoInformationCircle } from "react-icons/io5";
import { FormEvent, useState } from "react";
import { randomBytes } from "crypto";

import useOrbitStore from '@/store/orbitstore'
import { State } from "@/types/types";
import { getOrbit } from "@/api/orbit";

const conditionalPlaceholder = (placeOne: string, placeTwo: string) => {
    if (window) {
        return window.innerWidth < 1000 ? placeOne : placeTwo
    }

    return placeOne
}

const OrbitConfig = ({setOpen}: {setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const addOrbit = useOrbitStore((state) => state.addOrbit)
    const chooseTrack = useOrbitStore((state) => state.chooseTrack)

    const [checked, setChecked] = useState(false)
    const [orbitInput, setOrbitInput] = useState({
        state: {
            x: 0,
            y: 0,
            z: 0,
            v_x: 0,
            v_y: 0,
            v_z: 0
        },
        element: {
            a: 0,
            e: 0,
            i: 0,
            O: 0,
            w: 0,
            F: 0
        }
    })

    const toggleInputType = () => {
        setOrbitInput({
            state: {
                x: 0,
                y: 0,
                z: 0,
                v_x: 0,
                v_y: 0,
                v_z: 0
            },
            element: {
                a: 0,
                e: 0,
                i: 0,
                O: 0,
                w: 0,
                F: 0
            }
        })

        setChecked(prevChecked => !prevChecked)
    }

    const updateStateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrbitInput(prevOrbitInput => ({
            ...prevOrbitInput,
            state: {
                ...prevOrbitInput.state,
                [e.target.name]: e.target.value
            }
        }))
    }

    const updateElementInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOrbitInput(prevOrbitInput => ({
            ...prevOrbitInput,
            element: {
                ...prevOrbitInput.element,
                [e.target.name]: e.target.value
            }
        }))
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault()

        let data = Object.values(checked ? orbitInput.state : orbitInput.element)
        data = data.map(d => typeof d === 'string' ? parseFloat(d) : d)
        let id = randomBytes(10).toString()
        
        let integratedData: any = await getOrbit(data, checked ? "state" : "element")
        const { r, period } = JSON.parse(integratedData.state)
        
        let newOrbit: State = {
            id: id,
            type: checked ? "state" : "element",
            state: data,
            trackDraw: false,
            data: r,
            period: period,
            nu: 0.001
        }

        addOrbit(newOrbit)
        setTimeout(() => {
            chooseTrack(id)
        }, 1)
        setOpen(false)
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
                {/* to-do: check that it's an elliptical orbit */}
                <form className="" onSubmit={onSubmit}>
                    {checked ?
                        // States
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center justify-between my-2 mx-2">
                                <input required={true} name="x" value={orbitInput.state.x || ""} onChange={(e) => updateStateInput(e)} placeholder="x" type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input required={true} name="y" value={orbitInput.state.y || ""} onChange={(e) => updateStateInput(e)} placeholder="y" type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input required={true} name="z" value={orbitInput.state.z || ""} onChange={(e) => updateStateInput(e)} placeholder="z" type="number" className="input input-bordered w-1/3"/>
                            </div>
                            <div className="flex flex-row items-center justify-between my-2 mx-2">
                                <input required={true} name="v_x" value={orbitInput.state.v_x || ""} onChange={(e) => updateStateInput(e)} placeholder="v_x" type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input required={true} name="v_y" value={orbitInput.state.v_y || ""} onChange={(e) => updateStateInput(e)} placeholder="v_y" type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input required={true} name="v_z" value={orbitInput.state.v_z || ""} onChange={(e) => updateStateInput(e)} placeholder="v_z" type="number" className="input input-bordered w-1/3"/>
                            </div>
                        </div>
                        :
                        // Elements
                        <div className="flex flex-col">
                            <div className="flex flex-row items-center justify-between my-2 mx-2">
                                <input required={true} name="a" value={orbitInput.element.a || ""} onChange={(e) => updateElementInput(e)} placeholder={conditionalPlaceholder("a", "semimajor axis")} type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input required={true} name="e" value={orbitInput.element.e || ""} onChange={(e) => updateElementInput(e)} placeholder={conditionalPlaceholder("e", "eccentricity")} type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input required={true} name="i" value={orbitInput.element.i || ""} onChange={(e) => updateElementInput(e)} placeholder={conditionalPlaceholder("i", "inclination")} type="number" className="input input-bordered w-1/3"/>
                            </div>
                            <div className="flex flex-row items-center justify-between my-2 mx-2">
                                <input required={true} name="O" value={orbitInput.element.O || ""} onChange={(e) => updateElementInput(e)} placeholder={"RAAN"} type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input required={true} name="w" value={orbitInput.element.w || ""} onChange={(e) => updateElementInput(e)} placeholder={conditionalPlaceholder("w", "arg of perigee")} type="number" className="input input-bordered w-1/3 mr-2"/>
                                <input required={true} name="F" value={orbitInput.element.F || ""} onChange={(e) => updateElementInput(e)} placeholder={conditionalPlaceholder("F", "true anomaly")} type="number" className="input input-bordered w-1/3"/>
                            </div>
                        </div>
                    }
                
                <button type="submit">
                    <IoIosAddCircle 
                        size={32} 
                        className="absolute text-white-100 bottom-2 right-2 hover:text-blue-500 hover:cursor-pointer"
                    />
                </button>
                </form>
            </div>
        </div>
    )
}

export default OrbitConfig