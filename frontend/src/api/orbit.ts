const getOrbit = async (data: number[], type: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_PROD_API}/orbit`, {
        body: JSON.stringify({state: data, type}),
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        // cache: "no-cache"
    })

    if (!res.ok) {
        throw new Error("Orbit fetch failed")
    }

    return res.json()
}

export {
    getOrbit
}