import { _M, A3 } from "../_m";
import { tileMapWall } from '../tileMapWall';
import { IArrayForBuffers } from "types/GeomTypes";
import { Root } from "index";

import { COLOR_BLUE_D, COLOR_BLUE } from "constants/CONSTANTS";

const C1 = COLOR_BLUE_D
const C2 = COLOR_BLUE


const TOP_PROFILE = 
[
    [0,0],
    [0,0],
    [0,0.1],
    [0,0.2],
    [0.1,0.3],
    [0,0.3],
    [0,0.9],
    [0.1,1],
    [0.15,1],
    [0.15,1.1],
    [0.2,1.1],
    [0.2,1.3],
    [0,1.3]
]

const n = []
for (let i = 0; i < TOP_PROFILE.length; ++i) {
    n.push([TOP_PROFILE[i][0] - .1, TOP_PROFILE[i][1]])
}

console.log(JSON.stringify(n))


export const createPoias01 = (root: Root, w: number, h: number = 1.3, d: number = 0): IArrayForBuffers => {
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []

    let profile = TOP_PROFILE
    if (h !== 1.3) {
        profile = []
        for (let i = 0; i < TOP_PROFILE.length; ++i) {
            if (i < 6) {
                profile.push([TOP_PROFILE[i][0], TOP_PROFILE[i][1]])
            } else {
                profile.push([TOP_PROFILE[i][0], TOP_PROFILE[i][1] - 1.3 + h])
            }
        }
    }

    if (d !== 0) {
        const profileD = []
        for (let i = 0; i < profile.length; ++i) {
            if (i === 0 || i === profile.length - 1) {
                profileD.push([profile[i][0], profile[i][1]])
            } else {
                profileD.push([profile[i][0] + d, profile[i][1]])
            }
        }
        profile = profileD
    }

    {
        const copy = [...profile]
        const converted = _M.convertSimpleProfileToV3(profile)
        const r = _M.fillPoligonsV3(converted, converted, w, tileMapWall.noise, COLOR_BLUE_D, .5, true)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }


    return { v, uv, c }
}
