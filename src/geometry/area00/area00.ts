import { _M, A3 } from "../_m"

export const createArea00 = (coords: [number, number][] = [], color: A3, uvTile: number[], centerYOffset: number = 0) => {

    const filtered = []
    for (let i = 1; i < coords.length; ++i) {          
        if (coords[i - 1][0] === coords[i][0] && coords[i - 1][1] === coords[i][1]) {
            continue;
        }
        filtered.push(coords[i])
    }

    const center = _M.center(filtered)

    const v: number[] = [] 
    const uv: number[] = [] 
    const c: number[] = []

    for (let i = 0; i < filtered.length; ++i) { 
        const prev = filtered[i - 1] || filtered[filtered.length - 1]
        const curr = filtered[i]
        const rV = [
            prev[0], 0, prev[1],
            curr[0], 0, curr[1],
            center[0], centerYOffset, center[1],
        ]
        v.push(...rV)    
        uv.push(...uvTile)
        c.push(
            ...color,
            ...color,
            ...color,
        )
    }

    return { v, uv, c }
}