import { _M, A3 } from "../_m";
import { tileMapWall } from '../tileMapWall'
import { IArrayForBuffers } from "types/GeomTypes";
import { Root } from "index";
import { COLOR_BLUE_D, COLOR_BLUE } from "constants/CONSTANTS";

const C1 = COLOR_BLUE_D

const PR_COLUMN = [
    [-.1, 0],
    [0, 0],
    [0, 0],
    [0, .8],
    [.1, .85],
    [.1, 1],
]

export const createPilaster03 = (root: Root, w: number, h: number, d: number): IArrayForBuffers => {
    const v: number[] = []
    const c: number[] = []
    const uv: number[] = []


    let pr = PR_COLUMN
    if (h !== 1) {
        pr = []
        for (let i = 0; i < PR_COLUMN.length; ++i) {
            if (i < 3) {
                pr.push([PR_COLUMN[i][0], PR_COLUMN[i][1]])
            } else {
                pr.push([PR_COLUMN[i][0], PR_COLUMN[i][1] - 1 + h])   
            }
        }
    }

    const profile = _M.convertSimpleProfileToV3(pr)

    const path0 = profile
    const pathL = [...profile] 
    const pathR = [...profile]
    for (let i = 0; i < pathL.length; i += 3) {
        pathL[i] = -pathL[i + 2] // поворот под 45 градусов
        pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
    }
    /** front */
    const r = _M.fillPoligonsV3(
        pathL, 
        pathR, 
        w, 
        tileMapWall.noise, 
        C1
    )
    _M.translateVertices(r.v, -w * .5, 0, d)
    v.push(...r.v)
    uv.push(...r.uv)
    c.push(...r.c)
    /** left */
    {
        const r = _M.fillPoligonsV3(path0, pathR, d, tileMapWall.noise, C1)
        _M.rotateVerticesY(r.v, -Math.PI * .5)
        _M.translateVertices(r.v, -w * .5, 0, 0)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
    }
    /** right */
    {
        const r = _M.fillPoligonsV3(pathL, path0, d, tileMapWall.noise, C1)
        _M.rotateVerticesY(r.v, Math.PI * .5)
        _M.translateVertices(r.v, w * .5, 0, d)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
    }
      
    return { v, c, uv }
}