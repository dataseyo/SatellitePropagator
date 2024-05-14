import { useState, useEffect } from 'react'

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState(0)

    useEffect(() => {
        const updateWindowSize = () => {
            setWindowSize(window.innerWidth);
        };

        updateWindowSize()

        window.addEventListener('resize', updateWindowSize)

        return () => {
            window.removeEventListener('resize', updateWindowSize)
        }
    }, [])

    return windowSize
};