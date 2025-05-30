import { _M, A3 } from "../_m";
import { tileMapWall } from '../tileMapWall';
import { IArrayForBuffers } from "types/GeomTypes";
import { Root } from "index";

import { COLOR_BLUE_D, COLOR_BLUE } from "constants/CONSTANTS";

const C1 = COLOR_BLUE_D
const C2 = COLOR_BLUE


const TOP_PROFILE = [
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

export const createPoias01 = (root: Root, w: number, h: number = 1.5, d: number = .3): IArrayForBuffers => {
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []

    const G = .4
    {
        const copy = [...TOP_PROFILE]
        copy[0] = [-G, TOP_PROFILE[0][1]] 
        const converted = _M.convertSimpleProfileToV3(TOP_PROFILE)
        const r = _M.fillPoligonsV3(converted, converted, w, tileMapWall.noise, COLOR_BLUE_D, .5, true)
        _M.translateVertices(r.v, 0, h, 0)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }


    return { v, uv, c }
}
