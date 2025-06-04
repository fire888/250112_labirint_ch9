import { Root } from "../index"
import { IPerimeter, IDataForWall, ElemType } from "types/GeomTypes"
import { calculateLogicWall04 } from './logicWall04'
import { createArea00 } from "geometry/area00/area00"
import { _M } from '../geometry/_m'
import { COLOR_BLUE_D } from "constants/CONSTANTS"
import { tileMapWall } from "geometry/tileMapWall"

let n = 0

export const calculateLogicHouse00 = (root: Root, perimeter: IPerimeter) => {
    ++n

    //const H = Math.random() * 12 + 3 
    const H = Math.random() * 60 + 3 

    const v: number[] = [] 
    const uv: number[] = [] 
    const c: number[] = []

    const H_TOP_POIAS = 0.4 + Math.random()

    for (let i = 1; i < perimeter.length; ++i) {
        const prev = perimeter[i - 1]
        const cur =  perimeter[i]

        /** проверяем что следующая точка не лежит на предыдущей */
        if (cur[0] === prev[0] && cur[1] === prev[1]) {
            continue;
        }

        const d = _M.dist(prev, cur)

        const ranPilastreType = Math.random()
        let pilasterType: ElemType = ElemType.PILASTER_01
        if (ranPilastreType < 0.15) {
            pilasterType = ElemType.PILASTER_00
        } else if (ranPilastreType < 0.25) {
            pilasterType = ElemType.PILASTER_01
        } else if (ranPilastreType < 0.5) {
            pilasterType = ElemType.PILASTER_02
        } else if (ranPilastreType < 0.75) {
            pilasterType = ElemType.PILASTER_03
        } else {
            pilasterType = ElemType.PILASTER_04
        }


        const DATA_FOR_WALL: IDataForWall = {
            w: d,
            h: H,
            d: .3,
            H_TOP_POIAS,
            TYPE_SIDE_PILASTER: pilasterType,
        }

        const r =  calculateLogicWall04(root, DATA_FOR_WALL)
        const angle = _M.angleFromCoords(cur[0] - prev[0], cur[1] - prev[1])
        _M.rotateVerticesY(r.v, -angle)
        _M.translateVertices(r.v, prev[0], 0, prev[1])
        for (let j = 0; j < r.v.length; ++j) {
            v.push(r.v[j])
        }
        //v.push(...r.v)
        for (let j = 0; j < r.uv.length; ++j) {
            uv.push(r.uv[j])
        }
        //uv.push(...r.uv)
        for (let j = 0; j < r.c.length; ++j) {
            c.push(r.c[j])
        }
        //c.push(...r.c)
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