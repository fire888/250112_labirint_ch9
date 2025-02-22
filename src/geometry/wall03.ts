import { Color } from "three";
import { _M, A3 } from "./_m";
import { tileMapWall } from './tileMapWall'

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
    //[0, 1.95],
    [0, 1.5],
    [.1, 1.6],
    [.1, 1.63],
    [.15, 1.64],
    [.15, 1.7],
    [.17, 1.7],
    [.17, 1.75],
    [0, 1.75],
]
const PR_TOP: [number, number][] = [
    [0,1.1],
    [0.1,1.1],
    [0.1,1.3],
    [0.5,1.3],
    [0.55,1.3],
    [0.55,1.25],
    [0.62,1.25],
    [0.62,1.5]
]

const PR_COLUMN = [
    [0.25, 0],
    [0.25, .3],
    [0.15, .3],
    [.1, .4],
    [.12, .4],
    [.12, .45],
    [.1, .45],
    [.1, .5],
    [0, .5], 
    [0, 1.2],
    [.1, 1.3],
    [.1, 1.4],
    [-.1, 1.4],
]


const TOP_PROFILE = [
    [-.7, 0,],
    [0, 0,],
    [.1, 0],
    [.1, .1],
    [.1, .2],
    // [.2, .2],
    [.2, .3],
    [.1, .3],
    [.1, .9],
    [.2, 1],
    [.25, 1],
    [.25, 1.1],
    [.3, 1.1],
    [.3, 1.3],
]

export const createWall_03 = (d: number, h: number) => {
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []

    const min = 1 // max width without columns

    const prTopModify = []
    for (let i = 0; i < PR_TOP.length; ++i) {
        prTopModify.push([PR_TOP[i][0], PR_TOP[i][1] + h - .85])
    }
    const LEVELS = [
        { profile: _M.convertSimpleProfileToV3(PR_BOTTOM), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_BOTTOM), _M.convertSimpleProfileToV3(PR_CENTER)), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.convertSimpleProfileToV3(PR_CENTER), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_CENTER), _M.convertSimpleProfileToV3(prTopModify)), color: C2, uvTile: tileMapWall.break },
        //{ profile: _M.convertSimpleProfileToV3(prTopModify), color: C1, uvTile: tileMapWall.noise },
    ]


    const LEVELS_COLUMN = [
        { profile: _M.convertSimpleProfileToV3(PR_COLUMN), color: C1, uvTile: tileMapWall.noise },
    ]



    /** fill full wall */
    if (d < min) {
        LEVELS.forEach(e => {
                const r = _M.fillPoligonsV3(e.profile, e.profile, d, e.uvTile, e.color)
                v.push(...r.v)
                c.push(...r.c)
                uv.push(...r.uv)
        })
        return { v, uv, c }
    }

    // main wall
    const RL = .5
    const dd = d - RL - RL
    const nCol = Math.floor(dd / 2)
    const nHol = nCol + 1
    const wColl = .2 + Math.random() * .5
    const wHoll = (dd - (wColl * nCol)) / nHol
    const G = .4

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

        const r = _M.fillPoligonsV3(path0, pathR, RL, e.uvTile, e.color)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
    })

    currX = RL

    /** center */ 
    /** глубина */
    LEVELS.forEach(e => {
        const path0 = e.profile
        const pathL = [...e.profile] 
        const pathR = [...e.profile] 
        for (let i = 0; i < pathL.length; i += 3) {
            pathL[i] = -pathL[i + 2] // поворот под 45 градусов
            pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
        }
        const r = _M.fillPoligonsV3(pathR, pathL, d - RL - RL, e.uvTile, e.color)
        _M.translateVertices(r.v, RL, 0, -G)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
    })

    /** глубина лево */
    LEVELS.forEach(e => {
        const path0 = e.profile
        const pathL = [...e.profile] 
        const pathR = [...e.profile] 
        for (let i = 0; i < pathL.length; i += 3) {
            pathL[i] = -pathL[i + 2] // поворот под 45 градусов
            pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
        }
        const r = _M.fillPoligonsV3(pathL, pathL, G, e.uvTile, e.color)
        _M.rotateVerticesY(r.v, Math.PI * .5)
        _M.translateVertices(r.v, RL, 0, 0)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
    })

    /** глубина право */
    LEVELS.forEach(e => {
        const path0 = e.profile
        const pathL = [...e.profile] 
        const pathR = [...e.profile] 
        for (let i = 0; i < pathL.length; i += 3) {
            pathL[i] = -pathL[i + 2] // поворот под 45 градусов
            pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
        }
        const r = _M.fillPoligonsV3(pathR, pathR, G, e.uvTile, e.color)
        _M.rotateVerticesY(r.v, -Math.PI * .5)
        _M.translateVertices(r.v, d - RL, 0, -G)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
    })

    /** fill right end */
    LEVELS.forEach(e => {
        const path0 = e.profile
        const pathL = [...e.profile] 
        const pathR = [...e.profile]
        for (let i = 0; i < pathL.length; i += 3) {
            pathL[i] = -pathL[i + 2] // поворот под 45 градусов
            pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
        }
        const r = _M.fillPoligonsV3(pathL, path0, RL, e.uvTile, e.color)
        _M.translateVertices(r.v, dd + RL, 0, 0)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
    })


    { /** fill columns */
        const W_MIN = 2
        const colN = Math.floor((d - RL - RL) / W_MIN)
        const STEP = (d - RL - RL) / (colN)
        
        /** задник колонны */
        const PROF = [    
            [0.25, 0],
            [0.25, .3],
            [0.15, .3],
            [.1, .4],
            [.12, .4],
            [.12, .45],
            [.1, .45],
            [.1, .5],
            [0, .5], 
            [0, h + .4], 
        ]
        const convertedProf = _M.convertSimpleProfileToV3(PROF)
        const copyR = []
        for (let i = 0; i < convertedProf.length; i += 3) {
            copyR.push(convertedProf[i + 2], convertedProf[i + 1], convertedProf[i + 2])
        }
        const copyL = []
        for (let i = 0; i < convertedProf.length; i += 3) {
            copyL.push(-convertedProf[i + 2], convertedProf[i + 1], convertedProf[i + 2])
        }





        for (let i = 1; i < colN; ++i) {
            const x = STEP * i + RL

            {
                const r = _M.fillPoligonsV3(copyL, copyR, .8, tileMapWall.noise, COLOR_BLUE_D, 1, true)
                _M.translateVertices(r.v, x - .4, 0, -.2)
                v.push(...r.v)
                c.push(...r.c)
                uv.push(...r.uv)
            }

            {
                const r = _M.fillPoligonsV3(convertedProf, copyR, .3, tileMapWall.noise, COLOR_BLUE_D, 1, true)
                _M.rotateVerticesY(r.v, -Math.PI / 2)
                _M.translateVertices(r.v, x - .4, 0, -G -.1)
                v.push(...r.v)
                c.push(...r.c)
                uv.push(...r.uv)
            }

            {
                const r = _M.fillPoligonsV3(copyL, convertedProf, .3, tileMapWall.noise, COLOR_BLUE_D, 1, true)
                _M.rotateVerticesY(r.v, Math.PI / 2)
                _M.translateVertices(r.v, x + .4, 0, -.2)
                v.push(...r.v)
                c.push(...r.c)
                uv.push(...r.uv)
            }


            LEVELS_COLUMN.forEach(e => {
                const path0 = e.profile
                const pathL = [...e.profile] 
                const pathR = [...e.profile]
                for (let i = 0; i < pathL.length; i += 3) {
                    pathL[i] = -pathL[i + 2] // поворот под 45 градусов
                    pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
                }
                /** front */
                const r = _M.fillPoligonsV3(pathL, pathR, .3, e.uvTile, e.color)
                _M.translateVertices(r.v, x - .3 * .5, 0, 0)
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)
                /** left */
                {
                    const r = _M.fillPoligonsV3(path0, pathR, G, e.uvTile, e.color)
                    _M.rotateVerticesY(r.v, -Math.PI * .5)
                    _M.translateVertices(r.v, x - .3 * .5, 0, -G)
                    v.push(...r.v)
                    uv.push(...r.uv)
                    c.push(...r.c)
                }
                /** right */
                {
                    const r = _M.fillPoligonsV3(pathL, path0, G, e.uvTile, e.color)
                    _M.rotateVerticesY(r.v, Math.PI * .5)
                    _M.translateVertices(r.v, x + .3 * .5, 0, 0)
                    v.push(...r.v)
                    uv.push(...r.uv)
                    c.push(...r.c)
                }
            })
        
            {// bodycolumn
                const W = .15
                const r = _M.lathePath(
                    [
                        [W + .08, 1.3],
                        [W + .08, 1.5],
                        [W + .06, 1.53],
                        [W + .06, h],
                        [W + .15, h + 0.05],
                        [W + .15, h + .2],
                    ],
                    8,
                    COLOR_BLUE,
                    tileMapWall.white,
                )
                _M.translateVertices(r.v, x, 0, -0.2)
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)
            } 

        }
    }

    // top Profile
    {
        //
        // v.push(
        //     ...
        // )
        const copy = [...TOP_PROFILE]
        copy[0] = [-G, TOP_PROFILE[0][1]] 
        const converted = _M.convertSimpleProfileToV3(TOP_PROFILE)
        const r = _M.fillPoligonsV3(converted, converted, d, tileMapWall.noise, COLOR_BLUE_D, .5, true)
        _M.translateVertices(r.v, 0, h + .2, 0)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)

    }



    // for (let i = 0; i < nHol; ++i) {
    //     // fill hole
    //     LEVELS.forEach(e => {
    //         const path0 = e.profile
    //         const pathL = [...e.profile] 
    //         const pathR = [...e.profile]
    //         for (let i = 0; i < pathL.length; i += 3) {
    //             pathL[i] = -pathL[i + 2] // поворот под 45 градусов
    //             pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
    //         }

    //         const r = _M.fillPoligonsV3(pathL, pathL, g, e.uvTile, e.color)
    //         _M.rotateVerticesY(r.v, Math.PI / 2)
    //         _M.translateVertices(r.v, currX, 0, 0)
    //         v.push(...r.v)
    //         uv.push(...r.uv)
    //         c.push(...r.c)

    //         const r1 = _M.fillPoligonsV3(pathR, pathL, wHoll, e.uvTile, e.color)
    //         _M.translateVertices(r1.v, currX, 0, -g)
    //         v.push(...r1.v)
    //         uv.push(...r1.uv)
    //         c.push(...r1.c)

    //         const nX = currX + wHoll

    //         const r2 = _M.fillPoligonsV3(pathR, pathR, g, e.uvTile, e.color)
    //         _M.rotateVerticesY(r2.v, -Math.PI / 2)
    //         _M.translateVertices(r2.v, nX, 0, -g)
    //         v.push(...r2.v)
    //         uv.push(...r2.uv)
    //         c.push(...r2.c)

    //         if (i < nHol - 1) {
    //             const r = _M.fillPoligonsV3(pathL, pathR, wColl, e.uvTile, e.color)
    //             _M.translateVertices(r.v, nX, 0, 0)
    //             v.push(...r.v)
    //             uv.push(...r.uv)
    //             c.push(...r.c)
    //         }
    //     })

    //     currX += wColl + wHoll 
    // }

    return { v, uv, c }
}

// export const createAngleWall_03 = (pos: A3, angleStart: number, angleEnd: number, h: number) => {
//     const v: number[] = []
//     const c: number[] = []
//     const uv: number[] = []

//     const prTopModify = []
//     for (let i = 0; i < PR_TOP.length; ++i) {
//         prTopModify.push([PR_TOP[i][0], PR_TOP[i][1] + h])
//     }
//     const LEVELS = [
//         { profile: _M.convertSimpleProfileToV3(PR_BOTTOM), color: C1, uvTile: tileMapWall.noise },
//         { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_BOTTOM), _M.convertSimpleProfileToV3(PR_CENTER)), color: C1, uvTile: tileMapWall.noise },
//         { profile: _M.convertSimpleProfileToV3(PR_CENTER), color: C1, uvTile: tileMapWall.noise },
//         { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_CENTER), _M.convertSimpleProfileToV3(prTopModify)), color: C2, uvTile: tileMapWall.break },
//         { profile: _M.convertSimpleProfileToV3(prTopModify), color: C1, uvTile: tileMapWall.noise },
//     ]

//     LEVELS.forEach(e => {
//         const pathL = [...e.profile] 
//         const pathR = [...e.profile]
//         _M.rotateVerticesY(pathL, angleStart)
//         _M.rotateVerticesY(pathR, angleEnd)

//         const r = _M.fillPoligonsV3(pathL, pathR, 0, e.uvTile, e.color, 1.5, false)
//         _M.translateVertices(r.v, ...pos)
//         v.push(...r.v)
//         c.push(...r.c)
//         uv.push(...r.uv)
//     })

//     return { v, c, uv }
// }