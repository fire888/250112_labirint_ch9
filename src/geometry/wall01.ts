import { Color } from "three";
import { _M, A3 } from "./_m";
import { tileMapWall } from './tileMapWall'


const COLOR_BROWN: A3 = _M.hexToNormalizedRGB('382912')
const COLOR_YELLOW: A3 = _M.hexToNormalizedRGB('7d3a19')
const COLOR_BLACK: A3 = [0,0,0]

const COLOR_BLUE: A3 = _M.hexToNormalizedRGB('3c3865') 
const COLOR_BLUE_D: A3 = _M.hexToNormalizedRGB('1c1937') 

const C1 = COLOR_BLUE_D
const C2 = COLOR_BLUE

const PR_BOTTOM: [number, number][] = [
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

const PR_CENTER: [number, number][] = [
    [0, .95],
    [.1, .95],
    [.1, .97],
    [.15, .97],
    [.15, 1.],
    [.17, 1.],
    [.17, 1.1],
    [0, 1.1],
]

const PR_TOP: [number, number][] = [
    [0, 5.8],
    [.1, 5.8],
    [.1, 6],
    [.5, 6],
    [.55, 6],
    [.55, 5.95],
    [.62, 5.95],
    [.62, 6.2],
]

const PATH: [number, number][] = [
    ...PR_BOTTOM,
    ...PR_CENTER,
    ...PR_TOP,
]


const LEVELS = [
    { profile: _M.convertSimpleProfileToV3(PR_BOTTOM), color: C1, uvTile: tileMapWall.noise },
    { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_BOTTOM), _M.convertSimpleProfileToV3(PR_CENTER)), color: C1, uvTile: tileMapWall.noise },
    { profile: _M.convertSimpleProfileToV3(PR_CENTER), color: C1, uvTile: tileMapWall.noise },
    { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_CENTER), _M.convertSimpleProfileToV3(PR_TOP)), color: C2, uvTile: tileMapWall.break },
    { profile: _M.convertSimpleProfileToV3(PR_TOP), color: C1, uvTile: tileMapWall.noise },
]


const MAX_H = 1.5
const fillPoligonsV3 = (
    path1: number[],
    pathR: number[], 
    l: number,
    uvData: number[] = tileMapWall.noise, 
    color: A3 = COLOR_BROWN,
) => {
    const v = []
    const uv = []
    const c = []
    const path2 = [...pathR]
    _M.translateVertices(path2, l, 0, 0)

    for (let i = 3; i < path1.length; i += 3) {
        const n = Math.floor((path1[i + 1] - path2[i - 2]) / MAX_H) + 1
        const d = (path1[i + 1] - path1[i - 2]) / n
        for (let j = 0; j < n; ++j) {
            v.push(..._M.createPolygon(
                [path1[i - 3], path1[i - 2] + j * d, path1[i - 1]],
                [path2[i - 3], path2[i - 2] + j * d, path2[i - 1]],
                //[path2[i], path2[i + 1], path2[i + 2]],
                //[path1[i], path1[i + 1], path1[i + 2]],
                [path2[i], path2[i - 2] + (j + 1) * d, path2[i + 2]],
                [path1[i], path1[i - 2] + (j + 1) * d, path1[i + 2]],
            ))
            uv.push(...uvData)
            c.push(..._M.fillColorFace(color))
        }
    }

    return { v, uv, c }
}

export const createWall_01 = (d: number) => {
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []

    const profiles = [
        { path: PR_BOTTOM },
        { path: PR_CENTER },
        { path: PR_TOP },
    ]

    const min = 2.1

    /** fill full wall */
    if (d < min) {
        LEVELS.forEach(e => {
                const r = fillPoligonsV3(e.profile, e.profile, d, e.uvTile, e.color)
                v.push(...r.v)
                c.push(...r.c)
                uv.push(...r.uv)
        })
        return { v, uv, c, profiles }
    }

    // count columns and holes
    const RL = 1
    const dd = d - RL - RL
    const nCol = Math.floor(dd / 2)
    const nHol = nCol + 1
    const wColl = .2 + Math.random() * .5
    const wHoll = (dd - (wColl * nCol)) / nHol
    const g = .01 + Math.random()

    let currX = 0

    /** start */ 
    LEVELS.forEach(e => {
        const path0 = e.profile
        const pathL = [...e.profile] 
        const pathR = [...e.profile] 
        for (let i = 0; i < pathL.length; i += 3) {
            pathL[i] = -pathL[i + 2] // поворот под 45 градусов
            pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
        }

        const r = fillPoligonsV3(path0, pathR, RL, e.uvTile, e.color)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
    })

    currX = RL

    /** fill right end */
    LEVELS.forEach(e => {
        const path0 = e.profile
        const pathL = [...e.profile] 
        const pathR = [...e.profile]
        for (let i = 0; i < pathL.length; i += 3) {
            pathL[i] = -pathL[i + 2] // поворот под 45 градусов
            pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
        }
        const r = fillPoligonsV3(pathL, path0, RL, e.uvTile, e.color)
        _M.translateVertices(r.v, dd + RL, 0, 0)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
    })

    for (let i = 0; i < nHol; ++i) {
        // fill hole
        LEVELS.forEach(e => {
            const path0 = e.profile
            const pathL = [...e.profile] 
            const pathR = [...e.profile]
            for (let i = 0; i < pathL.length; i += 3) {
                pathL[i] = -pathL[i + 2] // поворот под 45 градусов
                pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
            }

            const r = fillPoligonsV3(pathL, pathL, g, e.uvTile, e.color)
            _M.rotateVerticesY(r.v, Math.PI / 2)
            _M.translateVertices(r.v, currX, 0, 0)
            v.push(...r.v)
            uv.push(...r.uv)
            c.push(...r.c)

            const r1 = fillPoligonsV3(pathR, pathL, wHoll, e.uvTile, e.color)
            _M.translateVertices(r1.v, currX, 0, -g)
            v.push(...r1.v)
            uv.push(...r1.uv)
            c.push(...r1.c)

            const nX = currX + wHoll

            const r2 = fillPoligonsV3(pathR, pathR, g, e.uvTile, e.color)
            _M.rotateVerticesY(r2.v, -Math.PI / 2)
            _M.translateVertices(r2.v, nX, 0, -g)
            v.push(...r2.v)
            uv.push(...r2.uv)
            c.push(...r2.c)

            if (i < nHol - 1) {
                const r = fillPoligonsV3(pathL, pathR, wColl, e.uvTile, e.color)
                _M.translateVertices(r.v, nX, 0, 0)
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)
            }
        })

        currX += wColl + wHoll 
    }


    return { v, uv, c, profiles }
}