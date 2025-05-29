import { _M, A3 } from "../_m";
import { tileMapWall } from '../tileMapWall'
import { IArrayForBuffers } from "types/GeomTypes";

import { COLOR_BLUE_D, COLOR_BLUE } from "constants/CONSTANTS";
const C1 = COLOR_BLUE_D
const C2 = COLOR_BLUE


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

const LEVELS_COLUMN = [
    { profile: _M.convertSimpleProfileToV3(PR_COLUMN), color: C1, uvTile: tileMapWall.noise },
]

const G = .4

export const createPilaster00 = (h: number): IArrayForBuffers => {
    const v: number[] = []
    const c: number[] = []
    const uv: number[] = []
            
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
    
    
    {
        const r = _M.fillPoligonsV3(pilastreL, pilastreR, .8, tileMapWall.noise, COLOR_BLUE_D, 1, true)
        _M.translateVertices(r.v, -.4, 0, -.2)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }
    
    {
        const r = _M.fillPoligonsV3(pilastreProfV3, pilastreR, .3, tileMapWall.noise, COLOR_BLUE_D, 1, true)
        _M.rotateVerticesY(r.v, -Math.PI / 2)
        _M.translateVertices(r.v, -.4, 0, -G -.1)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }
    
    {
        const r = _M.fillPoligonsV3(pilastreL, pilastreProfV3, .3, tileMapWall.noise, COLOR_BLUE_D, 1, true)
        _M.rotateVerticesY(r.v, Math.PI / 2)
        _M.translateVertices(r.v, .4, 0, -.2)
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
        _M.translateVertices(r.v, - .3 * .5, 0, 0)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
        /** left */
        {
            const r = _M.fillPoligonsV3(path0, pathR, G, e.uvTile, e.color)
            _M.rotateVerticesY(r.v, -Math.PI * .5)
            _M.translateVertices(r.v, - .3 * .5, 0, -G)
            v.push(...r.v)
            uv.push(...r.uv)
            c.push(...r.c)
        }
        /** right */
        {
            const r = _M.fillPoligonsV3(pathL, path0, G, e.uvTile, e.color)
            _M.rotateVerticesY(r.v, Math.PI * .5)
            _M.translateVertices(r.v, + .3 * .5, 0, 0)
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
        _M.translateVertices(r.v, 0, 0, -0.2)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
    } 

    return { v, c, uv }
}