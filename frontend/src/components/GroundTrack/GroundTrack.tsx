"use client"

import { ComposableMap, Geographies, Geography, Line } from "react-simple-maps"
import { useState } from "react"

// import { geoEquirectangular } from 'd3-geo'

import useOrbitStore from "@/store/orbitstore"
import useInterval from "@/hooks/useInterval"

const GroundTrack = () => {
    // zustand
    const tracks = useOrbitStore((state) => state.track)

    // state
    const [track, setTrack] = useState<number[][]>([])

    // useInterval(() => {
    //     setTrack(prevTrack => prevTrack.slice(2))
    // }, 100)

    return (
        <div className="absolute right-4 bottom-0 z-10 w-1/2" >
            <ComposableMap 
                // width={100}
                // height={50}
                fill="white" 
                // projection={projection}
                projection="geoEqualEarth"
                projectionConfig={{center: [0, 45], scale: 125}}
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
                    coordinates={tracks.map(t => [t[0], t[1]])}
                    stroke="red"
                    strokeWidth={6}
                />
            </ComposableMap>
        </div>
    )
}

export default GroundTrack