import { Root } from "../index"
import { IPerimeter } from "types/GeomTypes"
import { calculateLogicWall04 } from './logicWall04'
import { createArea00 } from "geometry/area00/area00"
import { _M } from '../geometry/_m'
import { COLOR_BLUE_D } from "constants/CONSTANTS"
import { tileMapWall } from "geometry/tileMapWall"

let n = 0

export const calculateLogicHouse00 = (root: Root, perimeter: IPerimeter) => {
    ++n

    // if (n > 5) {
    //     return
    // }

    const H = Math.random() * 12 + 3 

    const v: number[] = [] 
    const uv: number[] = [] 
    const c: number[] = []


    for (let i = 1; i < perimeter.length; ++i) {
        const prev = perimeter[i - 1]
        const cur =  perimeter[i]

        /** проверяем что следующая точка не лежит на предыдущей */
        if (cur[0] === prev[0] && cur[1] === prev[1]) {
            continue;
        }

        const d = _M.dist(prev, cur)
        const r =  calculateLogicWall04(root, Math.abs(d), H, .3)
        const angle = _M.angleFromCoords(cur[0] - prev[0], cur[1] - prev[1])
        _M.rotateVerticesY(r.v, -angle)
        _M.translateVertices(r.v, prev[0], 0, prev[1])
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)
    }

    const centerYOffset = 2
    const area = createArea00(perimeter, COLOR_BLUE_D, tileMapWall.linesTree, centerYOffset)           
    _M.translateVertices(area.v, 0, H, 0)
    v.push(...area.v)
    c.push(...area.c)
    uv.push(...area.uv)

    const m = _M.createMesh({ 
        v, 
        uv,
        c,
        material: root.materials.walls00,
    })
    root.studio.add(m)
}