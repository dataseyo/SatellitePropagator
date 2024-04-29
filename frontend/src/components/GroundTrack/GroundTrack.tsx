"use client"

import { ComposableMap, Geographies, Geography, Line } from "react-simple-maps"
import { useState } from "react"

// import { geoEquirectangular } from 'd3-geo'

import useOrbitStore from "@/store/orbitstore"

const GroundTrack = () => {
    // type of map projection
    const [type, setType] = useState("")
    const [mapProjection, setMapProjection] = useState<string>("geoEqualEarth")
    const [test, setTest] = useState(true)
    
    // zustand store getter
    let { track } = useOrbitStore((state) => state)

    if (track.length > 10000) {
        track.splice(0, 5)
    } 

    return (
        <div className="absolute flex flex-col right-4 bottom-0 z-10 w-1/2 md:w-2/5">
            <select 
                className="select border-white-100 focus:border-blue-500 text-white-100 opacity-85 bg-black-700 dark relative self-end select-xs -mb-4 select-bordered bg-transparent" 
                onChange={(e) => setMapProjection(e.target.value)}
            >
                <option value="geoEqualEarth" className="text-white-100 opacity-85 bg-black-700">Equal Earth</option>
                <option value="geoAzimuthalEquidistant" className="text-white-100 opacity-85 bg-black-700">Azimuthal</option>
                <option value="geoConicEquidistant" className="text-white-100 opacity-85 bg-black-700">Conic</option>
            </select>
            <ComposableMap 
                // width={100}
                // height={50}
                fill="white" 
                // className=""
                // projections:
                projection={mapProjection}
                // projectionConfig={{center: [0, 45], scale: 125}}
            >
                <Geographies geography="/features.json">
                {({ geographies }) =>
                    geographies.map((geo) => (
                    <Geography key={geo.rsmKey} geography={geo} />
                    ))
                }
                </Geographies>

                {/* Ground Track Line(s) */}
                <Line
                    coordinates={track.map((t, index) => [t[0], t[1]])}
                    stroke="red"
                    strokeWidth={4}
                />
            </ComposableMap>
        </div>
    )
}

export default GroundTrack