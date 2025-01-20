import { _M } from "./_m";

const profileBottom: [number, number][] = [
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

const profileCenter: [number, number][] = [
    [0, .95],
    [.1, .95],
    [.1, .97],
    [.15, .97],
    [.15, 1.],
    [.17, 1.],
    [.17, 1.1],
    [0, 1.1],
]

const profileTop: [number, number][] = [
    [0, 5.8],
    [.1, 5.8],
    [.1, 6],
    [.5, 6],
    [.55, 6],
    [.55, 5.95],
    [.62, 5.95],
    [.62, 6.2],
]

const path: [number, number][] = [
    ...profileBottom,
    ...profileCenter,
    ...profileTop,
]

export const createWall_01 = (d: number) => {
    const v: number[] = []

    const profiles = [
        { path: profileBottom },
        { path: profileCenter },
        { path: profileTop },
    ]

    const fillPoligons = (path: [number, number][], l: number) => {
        for (let i = 1; i < path.length; ++i) {
            const b = path[i - 1]
            const c = path[i]
            v.push(..._M.createPolygon(
                [0, b[1], b[0]],
                [l, b[1], b[0]],
                [l, c[1], c[0]],
                [0, c[1], c[0]],
            ))
        }
    }

    const fillPoligonsV3 = (
        path1: number[],
        pathR: number[], 
        l: number
    ) => {
        const v = []
        const path2 = [...pathR]
        _M.translateVertices(path2, l, 0, 0)

        for (let i = 3; i < path1.length; i += 3) {
            v.push(..._M.createPolygon(
                [path1[i - 3], path1[i - 2], path1[i - 1]],
                [path2[i - 3], path2[i - 2], path2[i - 1]],
                [path2[i], path2[i + 1], path2[i + 2]],
                [path1[i], path1[i + 1], path1[i + 2]],
            ))
        }

        return v
    }

    const min = 5

    // fill full wall
    if (d < min) {
        fillPoligons(path, d)
        return { v, profiles }
    }

    // count columns and holes
    const RL = 1
    const dd = d - RL - RL
    const nCol = Math.floor(dd / 2)
    const nHol = nCol + 1
    const wColl = .2 + Math.random() * .5
    const wHoll = (dd - (wColl * nCol)) / nHol
    const g = .01 + Math.random()

    // make path
    const path0 = []
    for (let i = 0; i < path.length; ++i) {
        path0.push(0, path[i][1], path[i][0])
    }
    // make left and right pathes
    const pathL = [...path0] 
    const pathR = [...path0] 
    for (let i = 0; i < pathL.length; i += 3) {
        pathL[i] = -pathL[i + 2]
        pathR[i] = pathR[i + 2] 
    }

    // fill left start
    let currX = 0
    const r = fillPoligonsV3(path0, pathR, RL)
    v.push(...r)
    currX = RL

    // fill right end
    const rLast = fillPoligonsV3(pathL, path0, RL)
    _M.translateVertices(rLast, dd + RL, 0, 0)
    v.push(...rLast)

    for (let i = 0; i < nHol; ++i) {
        // fill hole
        const r = fillPoligonsV3(pathL, pathL, g)
        _M.rotateVerticesY(r, Math.PI / 2)
        _M.translateVertices(r, currX, 0, 0)
        v.push(...r)

        const r1 = fillPoligonsV3(pathR, pathL, wHoll)
        _M.translateVertices(r1, currX, 0, -g)
        v.push(...r1)

        currX += wHoll

        const r2 = fillPoligonsV3(pathR, pathR, g)
        _M.rotateVerticesY(r2, -Math.PI / 2)
        _M.translateVertices(r2, currX, 0, -g)
        v.push(...r2)

        // fill column (not fill in last itreration)
        if (i < nHol - 1) {
            const r = fillPoligonsV3(pathL, pathR, wColl)
            _M.translateVertices(r, currX, 0, 0)
            v.push(...r)
        }

        currX += wColl
    }

    return { v, profiles }
}