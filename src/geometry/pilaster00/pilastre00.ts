import { _M, A3 } from "../_m";
import { tileMapWall } from '../tileMapWall'
import { IArrayForBuffers } from "types/GeomTypes";
import { Root } from "index";
import { COLOR_BLUE_D, COLOR_BLUE } from "constants/CONSTANTS";
import { createPilaster01 } from "geometry/pilaster01/pilaster01";
import { createColumn00 } from "geometry/column00/column00";

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

export const createPilaster00 = (root: Root, w: number, h: number, d: number): IArrayForBuffers => {
    const v: number[] = []
    const c: number[] = []
    const uv: number[] = []
            
    const D_COLUMN_BASE = .2  // выдвижение вперед базы колонны
    const OFFSET_COLUMN = .3
    const OFFSET_COLUMN_BASE = .14

    const p = createPilaster01(root, w, h, d - D_COLUMN_BASE)
    v.push(...p.v)
    c.push(...p.c)
    uv.push(...p.uv)
    
    LEVELS_COLUMN.forEach(e => {
        const path0 = e.profile
        const pathL = [...e.profile] 
        const pathR = [...e.profile]
        for (let i = 0; i < pathL.length; i += 3) {
            pathL[i] = -pathL[i + 2] // поворот под 45 градусов
            pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
        }
        /** front */
        const r = _M.fillPoligonsV3(pathL, pathR, w - OFFSET_COLUMN_BASE - OFFSET_COLUMN_BASE, e.uvTile, e.color)
        _M.translateVertices(r.v, -(w - OFFSET_COLUMN_BASE - OFFSET_COLUMN_BASE) * .5, 0, d)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
        /** left */
        {
            const r = _M.fillPoligonsV3(path0, pathR, D_COLUMN_BASE, e.uvTile, e.color)
            _M.rotateVerticesY(r.v, -Math.PI * .5)
            _M.translateVertices(r.v, -w * .5 + OFFSET_COLUMN_BASE, 0, d - D_COLUMN_BASE)
            v.push(...r.v)
            uv.push(...r.uv)
            c.push(...r.c)
        }
        /** right */
        {
            const r = _M.fillPoligonsV3(pathL, path0, D_COLUMN_BASE, e.uvTile, e.color)
            _M.rotateVerticesY(r.v, Math.PI * .5)
            _M.translateVertices(r.v, w * .5 - OFFSET_COLUMN_BASE, 0, d)
            v.push(...r.v)
            uv.push(...r.uv)
            c.push(...r.c)
        }
    })
      
    // bodycolumn    
    {
        // если база широкая расставляем несколько колонн
        const H_BASE = 1.4

        const r = createColumn00(root, .38, h - H_BASE) // 1.4 - высота базы

        const _W = w - (OFFSET_COLUMN_BASE - .1) - (OFFSET_COLUMN_BASE - .1)
        const DIAM = (.15 + .1) * 2
        const count = Math.floor(_W / DIAM)
        const W_COL = DIAM * count

        for (let i = 0; i < count; ++i) {
            const copyV = [...r.v]
            _M.translateVertices(copyV, -W_COL * .5 + DIAM * .5 + i * DIAM, H_BASE, d - OFFSET_COLUMN * .6)
            v.push(...copyV)
            uv.push(...r.uv)
            c.push(...r.c)
        }
    } 

    return { v, c, uv }
}