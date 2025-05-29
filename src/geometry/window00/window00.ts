import { _M, A3 } from "../_m"
import { tileMapWall } from '../tileMapWall'
import { COLOR_BLUE_L } from "../../constants/CONSTANTS"

import { Root } from "index"
import { IHoleData } from "../../types/GeomTypes"

const DEFAULT_WINDOW_DATA: IHoleData = {
    w: .7,
    h: 1.5,
    d: .3,
}

export const createWindow00 = (root: Root, windowData: IHoleData) => {
    const { w, h, d } = { ...DEFAULT_WINDOW_DATA, ...windowData }

    const hW = -w * .5

    const v: number[] = [] 
    const uv: number[] = [] 
    const c: number[] = []

    // window inner
    v.push(
        // bottom
        ..._M.createPolygon(
            [hW, 0, 0],
            [0, 0, 0],
            [0, 0, -d],
            [hW, 0, -d],
        ),
        // top
        ..._M.createPolygon(
            [0, h, 0],
            [hW, h, 0],
            [hW, h, -d],
            [0, h, -d],
        ),
        // left 
        ..._M.createPolygon(
            [hW, 0, 0],
            [hW, 0, -d],
            [hW, h, -d],
            [hW, h, 0],
        )
    )

    uv.push(
        ...tileMapWall.noise,
        ...tileMapWall.noise,
        ...tileMapWall.noise
    )

    c.push(
        ..._M.fillColorFace(COLOR_BLUE_L),
        ..._M.fillColorFace(COLOR_BLUE_L),
        ..._M.fillColorFace(COLOR_BLUE_L),
    )

    // window bottom
    const R = .3
    const D0 = .3
    const D1 = D0 + .3
    const B = -.3
    v.push(
        ..._M.createPolygon(
            [hW - R, 0, D0],
            [0, 0, D1],
            [0, 0, 0],
            [hW - R, 0, 0],
        ),

        ..._M.createPolygon(
            [hW - R, 0, D0],
            [hW - R, B, D0],
            [0, B, D1],
            [0, 0, D1],
        ),

        ..._M.createPolygon(
            [0, B, D1],
            [hW - R, B, D0],
            [hW - R, B, 0],
            [0, B, 0],
        ), 
    )
    uv.push(
        ...tileMapWall.noise,
        ...tileMapWall.noise,
        ...tileMapWall.noise,
    )
    c.push(
        ..._M.fillColorFace(COLOR_BLUE_L),
        ..._M.fillColorFace(COLOR_BLUE_L),
        ..._M.fillColorFace(COLOR_BLUE_L),
    )




    _M.appendMirrorX(v, c, uv)

    return { v, c, uv }
}