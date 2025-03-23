import { _M, A3 } from "./_m";
import { tileMapWall } from './tileMapWall'
import { createTopElem_00 } from './topElem_00'

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
    [0, 1.5],
    [.1, 1.6],
    [.1, 1.63],
    [.15, 1.64],
    [.15, 1.7],
    [.17, 1.7],
    [.17, 1.75],
    [0, 1.75],
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
    // [-.7, 0,],
    // [0, 0,],
    // [.1, 0],
    // [.1, .1],
    // [.1, .2],
    // [.2, .3],
    // [.1, .3],
    // [.1, .9],
    // [.2, 1],
    // [.25, 1],
    // [.25, 1.1],
    // [.3, 1.1],
    // [.3, 1.3],

    [-0.7,-1.3],
    [0,-1.3],
    [0.1,-1.3],
    [0.1,-1.2],
    [0.1,-1.1],
    [0.2,-1],
    [0.1,-1],
    [0.1,-0.4],
    [0.2,-0.3],
    [0.25,-0.3],
    [0.25,-0.2],
    [0.3,-0.2],
    [0.3,0],
    [0,0],
]

export const createWall_03 = (d: number, h: number) => {
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []

    const min = 1 // max width without columns

    const LEVELS = [
        { profile: _M.convertSimpleProfileToV3(PR_BOTTOM), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_BOTTOM), _M.convertSimpleProfileToV3(PR_CENTER)), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.convertSimpleProfileToV3(PR_CENTER), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_CENTER), [0, h - 1.3, 0]), color: C1, uvTile: tileMapWall.noise },
    ]

    const LEVELS_INNER = [
        { profile: _M.convertSimpleProfileToV3(PR_BOTTOM), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_BOTTOM), _M.convertSimpleProfileToV3(PR_CENTER)), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.convertSimpleProfileToV3(PR_CENTER), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_CENTER), [0, h - 1.3, 0]), color: C2, uvTile: tileMapWall.lines },
    ]

    const LEVELS_COLUMN = [
        { profile: _M.convertSimpleProfileToV3(PR_COLUMN), color: C1, uvTile: tileMapWall.noise },
    ]

    /* top top */
    const topTopElem = createTopElem_00(COLOR_BLUE_D)

    // top Profile
    const G = .4
    {
        const copy = [...TOP_PROFILE]
        copy[0] = [-G, TOP_PROFILE[0][1]] 
        const converted = _M.convertSimpleProfileToV3(TOP_PROFILE)
        const r = _M.fillPoligonsV3(converted, converted, d, tileMapWall.noise, COLOR_BLUE_D, .5, true)
        _M.translateVertices(r.v, 0, h, 0)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)

    }

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

    {/** totTop Elem */
        const _v = [...topTopElem.v]
        _M.translateVertices(_v, RL * .5, h, -.2)
        v.push(..._v)
        c.push(...topTopElem.c)
        uv.push(...topTopElem.uv)
    }


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
    LEVELS_INNER.forEach(e => {
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
        const PILASTRE_PROF_V2 = [    
            [0.25, 0],
            [0.25, .3],
            [0.15, .3],
            [.1, .4],
            [.12, .4],
            [.12, .45],
            [.1, .45],
            [.1, .5],
            [0, .5], 
            [0, h - 1.3], 
        ]
        const pilastreProfV3 = _M.convertSimpleProfileToV3(PILASTRE_PROF_V2)
        const pilastreR = []
        for (let i = 0; i < pilastreProfV3.length; i += 3) {
            pilastreR.push(pilastreProfV3[i + 2], pilastreProfV3[i + 1], pilastreProfV3[i + 2])
        }
        const pilastreL = []
        for (let i = 0; i < pilastreProfV3.length; i += 3) {
            pilastreL.push(-pilastreProfV3[i + 2], pilastreProfV3[i + 1], pilastreProfV3[i + 2])
        }

        for (let i = 1; i < colN; ++i) {
            const x = STEP * i + RL

            {/** totTop Elem */
                const _v = [...topTopElem.v]
                _M.translateVertices(_v, x, h, -.2)
                v.push(..._v)
                c.push(...topTopElem.c)
                uv.push(...topTopElem.uv)
            }

            {
                const r = _M.fillPoligonsV3(pilastreL, pilastreR, .8, tileMapWall.noise, COLOR_BLUE_D, 1, true)
                _M.translateVertices(r.v, x - .4, 0, -.2)
                v.push(...r.v)
                c.push(...r.c)
                uv.push(...r.uv)
            }

            {
                const r = _M.fillPoligonsV3(pilastreProfV3, pilastreR, .3, tileMapWall.noise, COLOR_BLUE_D, 1, true)
                _M.rotateVerticesY(r.v, -Math.PI / 2)
                _M.translateVertices(r.v, x - .4, 0, -G -.1)
                v.push(...r.v)
                c.push(...r.c)
                uv.push(...r.uv)
            }

            {
                const r = _M.fillPoligonsV3(pilastreL, pilastreProfV3, .3, tileMapWall.noise, COLOR_BLUE_D, 1, true)
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
                        [W + .06, h - .2 - 1.3],
                        [W + .15, h - .15 - 1.3],
                        [W + .15, h - 1.3],
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
    return { v, uv, c }
}

export const createAngleWall_03 = (pos: A3, angleStart: number, angleEnd: number, h: number) => {
    const v: number[] = []
    const c: number[] = []
    const uv: number[] = []

    const topProfile = _M.convertSimpleProfileToV3(TOP_PROFILE)
    for (let i = 0; i < topProfile.length; i += 3) {
        //topProfile[i + 1] += h + .2 
        topProfile[i + 1] += h
    }

    const LEVELS = [
        { profile: _M.convertSimpleProfileToV3(PR_BOTTOM), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_BOTTOM), _M.convertSimpleProfileToV3(PR_CENTER)), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.convertSimpleProfileToV3(PR_CENTER), color: C1, uvTile: tileMapWall.noise },
        //{ profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_CENTER), [0, h + .2, 0]), color: C2, uvTile: tileMapWall.break },
        { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_CENTER), [0, h, 0]), color: C2, uvTile: tileMapWall.break },
        { profile: topProfile, color: C1, uvTile: tileMapWall.noise },
    ]

    LEVELS.forEach(e => {
        const pathL = [...e.profile] 
        const pathR = [...e.profile]
        _M.rotateVerticesY(pathL, angleStart)
        _M.rotateVerticesY(pathR, angleEnd)

        const r = _M.fillPoligonsV3(pathL, pathR, 0, e.uvTile, e.color, 1.5, false)
        _M.translateVertices(r.v, ...pos)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    })
    return { v, c, uv }
}