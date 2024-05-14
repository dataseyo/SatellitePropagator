"use client"

import { ComposableMap, Geographies, Geography, Line } from "react-simple-maps"
import { useState } from "react"
import { ProjectionConfig } from "react-simple-maps"

import useOrbitStore from "@/store/orbitstore"
import { useMemo } from "react"

const GroundTrack = () => {
    // type of map projection
    const [type, setType] = useState("")
    const [mapProjection, setMapProjection] = useState<string>("geoEqualEarth")
    
    // zustand store getter
    let { track } = useOrbitStore((state) => state)

    if (track.length > 10000) {
        track.splice(0, 5)
    } 

    const scaleConfig = (mapProjection: string): ProjectionConfig | undefined => {
        switch (mapProjection) {
            case 'geoEqualEarth':
                return {scale: 180, center: [0, 20]}
            case 'geoAzimuthalEquidistant':
                return {scale: 100, center: [0, -4]}
            case 'geoConicEquidistant':
                return {scale: 130, center: [0, 40]}
        }
    }

    const config = useMemo(() => {
        return scaleConfig(mapProjection)
    }, [mapProjection])
    
    return (
        <div className="absolute flex flex-col flex-grow-1 right-2 bottom-0 z-10 w-1/2 md:w-2/5">
            <select 
                className="select select-sm md:select-md -mb-2 md:-mb-12 lg:-mb-20 w-25 md:w-40 text-md md:text-lg border-white-100 focus:border-blue-500 text-white-100 opacity-85 bg-black-700 dark relative self-end select-bordered bg-transparent" 
                onChange={(e) => setMapProjection(e.target.value)}
            >
                <option value="geoEqualEarth" className="text-white-100 text-md md:text-lg opacity-85 bg-black-700">Equal Earth</option>
                <option value="geoAzimuthalEquidistant" className="text-white-100 text-md md:text-lg opacity-85 bg-black-700">Azimuthal</option>
                <option value="geoConicEquidistant" className="text-white-100 text-md md:text-lg opacity-85 bg-black-700">Conic</option>
            </select>
            <ComposableMap 
                fill="white" 
                projection={mapProjection}
                projectionConfig={config}
            >
                <Geographies geography="/features.json">
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography 
                                fill="#E0E1DD"
                                stroke="#000000"
                                key={geo.rsmKey} 
                                geography={geo} 
                            />
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