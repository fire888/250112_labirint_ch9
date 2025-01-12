import { _M } from "./_m";

const profileBottom = [
    [0.25, 0],
    [0.25, .3],
    [0.15, .3],
    [.1, .4],
    [.12, .4],
    [.12, .45],
    [.1, .45],
    [.1, .5],
    [0, .5], 
]

const profileCenter = [
    [0, .95],
    [.1, .95],
    [.1, .97],
    [.15, .97],
    [.15, 1.],
    [.17, 1.],
    [.17, 1.1],
    [0, 1.1],
]

const profileTop = [
    [0, 5.8],
    [.1, 5.8],
    [.1, 6],
    [.5, 6],
    [.55, 6],
    [.55, 5.95],
    [.62, 5.95],
    [.62, 6.2],
]


const path = [
    ...profileBottom,
    ...profileCenter,
    ...profileTop,
]


export const createWall_01 = (d: number, h: number) => {
    const v = []
    for (let i = 1; i < path.length; ++i) {
        const b = path[i - 1]
        const c = path[i]
        v.push(..._M.createPolygon(
            [0, b[1], b[0]],
            [d, b[1], b[0]],
            [d, c[1], c[0]],
            [0, c[1], c[0]],
        ))
    }

    const profiles = [
        { path: profileBottom },
        { path: profileCenter },
        { path: profileTop },
    ]

    return { v, profiles }
}