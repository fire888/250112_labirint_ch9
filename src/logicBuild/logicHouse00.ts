import { Root } from "../index"
import { IPerimeter, IDataForWall, ElemType } from "types/GeomTypes"
import { calculateLogicWall04 } from './logicWall04'
import { createAnglePoias01 } from "geometry/poias01/poias01"
import { createArea00 } from "geometry/area00/area00"
import { _M } from '../geometry/_m'
import { COLOR_BLUE_D } from "constants/CONSTANTS"
import { tileMapWall } from "geometry/tileMapWall"
import * as THREE from "three" 

let n = 0

export const calculateLogicHouse00 = (root: Root, perimeter: IPerimeter): THREE.Mesh => {
    ++n

    const H = Math.random() * 12 + 3 
    //const H = Math.random() * 60 + 3 

    const v: number[] = [] 
    const uv: number[] = [] 
    const c: number[] = []

    const H_TOP_POIAS = 0.4 + Math.random()

    let prevWallAngle = null
    for (let i = 1; i < perimeter.length; ++i) {
        const prev = perimeter[i - 1]
        const cur =  perimeter[i]

        /** проверяем что следующая точка не лежит на предыдущей */
        if (cur[0] === prev[0] && cur[1] === prev[1]) {
            continue;
        }

        const d = _M.dist(prev, cur)

        const ranPilastreType = Math.random()
        let sidePilasterType: ElemType = ElemType.PILASTER_01
        if (ranPilastreType < 0.15) {
            sidePilasterType = ElemType.PILASTER_00
        } else if (ranPilastreType < 0.25) {
            sidePilasterType = ElemType.PILASTER_01
        } else if (ranPilastreType < 0.5) {
            sidePilasterType = ElemType.PILASTER_02
        } else if (ranPilastreType < 0.75) {
            sidePilasterType = ElemType.PILASTER_03
        } else {
            sidePilasterType = ElemType.PILASTER_04
        }

        const TYPE_TOP_POIAS = ElemType.POIAS_01

        const DATA_FOR_WALL: IDataForWall = {
            w: d,
            h: H,
            d: .3,
            H_TOP_POIAS,
            TYPE_TOP_POIAS,
            TYPE_SIDE_PILASTER: sidePilasterType,
        }

        const r = calculateLogicWall04(root, DATA_FOR_WALL)
        const angle = _M.angleFromCoords(cur[0] - prev[0], cur[1] - prev[1])
        _M.rotateVerticesY(r.v, -angle)
        _M.translateVertices(r.v, prev[0], 0, prev[1])
        for (let j = 0; j < r.v.length; ++j) {
            v.push(r.v[j])
        }
        for (let j = 0; j < r.uv.length; ++j) {
            uv.push(r.uv[j])
        }
        for (let j = 0; j < r.c.length; ++j) {
            c.push(r.c[j])
        }

        // ANGLE CONNECT TOP POIAS WITH PREVIOUS WALL 
        if (prevWallAngle !== null) {
            const poias = createAnglePoias01(root, -prevWallAngle, -angle, H_TOP_POIAS, .5)
            _M.translateVertices(poias.v, prev[0], H - H_TOP_POIAS, prev[1])
            for (let j = 0; j < poias.v.length; ++j) {
                v.push(poias.v[j])
            }
            for (let j = 0; j < poias.uv.length; ++j) {
                uv.push(poias.uv[j])
            }
            for (let j = 0; j < poias.c.length; ++j) {
                c.push(poias.c[j])
            }
        } 
        // FIRST CAP ANGLE TOP POIAS WITH LAST WALL
        if (i === 1) {
            const prev2 = perimeter[perimeter.length - 2]
            const prev1 = perimeter[perimeter.length - 1]
            const prevWallAngle = _M.angleFromCoords(prev1[0] - prev2[0], prev1[1] - prev2[1])

            const poias = createAnglePoias01(root, -prevWallAngle, -angle, H_TOP_POIAS, .5)
            _M.translateVertices(poias.v, prev[0], H - H_TOP_POIAS, prev[1])
            for (let j = 0; j < poias.v.length; ++j) {
                 v.push(poias.v[j])
            }
            for (let j = 0; j < poias.uv.length; ++j) {
                 uv.push(poias.uv[j])
            }
            for (let j = 0; j < poias.c.length; ++j) {
                 c.push(poias.c[j])
            }
        }

        prevWallAngle = angle
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

    return m
}