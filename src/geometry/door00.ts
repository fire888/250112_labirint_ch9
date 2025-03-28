import { _M, A3 } from "./_m"
import { tileMapWall } from './tileMapWall'
import { createCurb00 } from "./curb00"

import { Root } from "index"

const COLOR_WHITE: A3 = _M.hexToNormalizedRGB('444444') 

export const createDoor_00 = (
    root: Root, 
    w: number = 2, 
    d: number = .8, 
    h: number = 4, 
    hStairs: number = .5
) => {
    const v: number[] = [] 
    const uv: number[] = [] 
    const c: number[] = []


    const R = w * .5
    const DS = .1

    { // проем внутренний

        // порог нижний
        {
            const r = createCurb00([0, 0], [R, 0], [R, -d], [0, -d], tileMapWall.noise, .1, 100, COLOR_WHITE)
            v.push(...r.v)
            uv.push(...r.uv)
            c.push(...r.c)
        }


        v.push(
            ..._M.createPolygon(
                [R, 0, -d - DS],
                [R, 0, DS],
                [R, h, DS],
                [R, h, -d - DS],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))

        v.push(
            ..._M.createPolygon(
                [R, h, -d - DS],
                [R, h, DS],
                [0, h, DS],
                [0, h, -d - DS],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))
    }

    { // передний внутренний профиль
        const ws = .2
        v.push(
            ..._M.createPolygon(
                [R, 0, DS],
                [R + ws, 0, ws * .3 + DS],
                [R + ws, h + ws, ws * .3 + DS],
                [R, h, DS],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))

        v.push(
            ..._M.createPolygon(
                [0, h, DS],
                [R, h, DS],
                [R + ws, h + ws, ws * .3 + DS],
                [0, h + ws, ws * .3 + DS],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))

        // закрываем сверху внутренний профиль
        v.push(
            ..._M.createPolygon(
                [0, h + ws, ws * .3 + DS],
                [R + ws, h + ws, ws * .3 + DS],
                [R + ws, h + ws, DS],
                [0, h + ws, DS],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))

        const HN = .5
        // квадрат над дверью
        v.push(
            ..._M.createPolygon(
                [0, h + ws, DS],
                [R + ws, h + ws, DS],
                [R + ws, h + ws + HN, DS],
                [0, h + ws + HN, DS],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))
    }

    { // передняя пилястра
        const R1 = R + .2
        const R2 = R1 + .3
        const D = .2
        const H = h + .2 + .5

        // перед
        v.push(
            ..._M.createPolygon(
                [R1, 0, D],
                [R2, 0, D],
                [R2, H, D],
                [R1, H, D],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))

        // лево
        v.push(
            ..._M.createPolygon(
                [R1, 0, 0],
                [R1, 0, D],
                [R1, H, D],
                [R1, H, 0],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))

        // право
        v.push(
            ..._M.createPolygon(
                [R2, 0, D],
                [R2, 0, 0],
                [R2, H, 0],
                [R2, H, D],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))
    }

    { // низ пилястры
        const R1 = R
        const R2 = R + .2 + .3 + .05
        const D = .25
        const H = .5

        // перед
        v.push(
            ..._M.createPolygon(
                [R1, 0, D],
                [R2, 0, D],
                [R2, H, D],
                [R1, H, D],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))

        // лево
        v.push(
            ..._M.createPolygon(
                [R1, 0, 0],
                [R1, 0, D],
                [R1, H, D],
                [R1, H, 0],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))

        // право
        v.push(
            ..._M.createPolygon(
                [R2, 0, D],
                [R2, 0, 0],
                [R2, H, 0],
                [R2, H, D],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))

        // верх
        v.push(
            ..._M.createPolygon(
                [R, H, D],
                [R2, H, D],
                [R2, H, 0],
                [R, H, 0],
            )
        )
        uv.push(...tileMapWall.white)
        c.push(..._M.fillColorFace(COLOR_WHITE))
    }

    return { v, uv, c }
}