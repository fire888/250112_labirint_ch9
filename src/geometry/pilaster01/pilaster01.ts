import { _M, A3 } from "../_m";
import { tileMapWall } from '../tileMapWall'
import { IArrayForBuffers } from "types/GeomTypes";
import { Root } from "index";

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

export const createPilaster01 = (root: Root, w: number, h: number, d: number = .3): IArrayForBuffers => {
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
        const r = _M.fillPoligonsV3(pilastreL, pilastreR, w, tileMapWall.noise, COLOR_BLUE_D, 1, true)
        //_M.translateVertices(r.v, -.4, 0, -.2)
        _M.translateVertices(r.v, -w * .5, 0, d)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }
    
    {
        const r = _M.fillPoligonsV3(pilastreProfV3, pilastreR, d, tileMapWall.noise, COLOR_BLUE_D, 1, true)
        _M.rotateVerticesY(r.v, -Math.PI / 2)
        _M.translateVertices(r.v, -w * .5, 0, 0)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }
    
    {
        const r = _M.fillPoligonsV3(pilastreL, pilastreProfV3, d, tileMapWall.noise, COLOR_BLUE_D, 1, true)
        _M.rotateVerticesY(r.v, Math.PI / 2)
        _M.translateVertices(r.v, w * .5, 0, d)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }
    
    return { v, c, uv }
}