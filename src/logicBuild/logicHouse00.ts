import { Root } from "../index"
import { IPerimeter, IDataForWall, ElemType } from "types/GeomTypes"
import { calculateLogicWall04 } from './logicWall04'
import { createAnglePoias01 } from "geometry/poias01/poias01"
import { createArea00 } from "geometry/area00/area00"
import { _M, A3 } from '../geometry/_m'
import { COLOR_BLUE_D, COLOR_DARK } from "constants/CONSTANTS"
import { tileMapWall, } from "geometry/tileMapWall"
import * as THREE from "three" 
import { 
    IdataForFillWall, 
    IdataForFillWall_TMP, 
    addTypeFullIdataForFillWall 
} from "types/GeomTypes"

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

    const INNER_WALLS_OFFSET = 1 

    const wallsData: IdataForFillWall[] = []

    for (let i = 1; i < perimeter.length; ++i) {
        const prev = perimeter[i - 1]
        const cur =  perimeter[i]

        /** проверяем что следующая точка не лежит на предыдущей */
        if (cur[0] === prev[0] && cur[1] === prev[1]) {
            continue;
        }

        const wallDataSheme_tmp: IdataForFillWall_TMP = {
            buffer: [],
            w: 0,
            h: 0,
            d: 0,
            indicies: {}
        }

        const d = _M.dist(prev, cur)
        wallDataSheme_tmp.w = d

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
        const SIDE_PILASTER_W = 0.3 + Math.random() * 0.5

        // SAVE TO SCHEME
        wallDataSheme_tmp.buffer.push(0, 0, 0)
        wallDataSheme_tmp.indicies[`field_wall_start`] = 0
        wallDataSheme_tmp.buffer.push(d, 0, 0)
        wallDataSheme_tmp.indicies[`field_wall_end`] = 1
        wallDataSheme_tmp.buffer.push(INNER_WALLS_OFFSET + .8, 0, -.5)
        wallDataSheme_tmp.indicies[`field_wall_innerStart`] = 2
        wallDataSheme_tmp.buffer.push(d - INNER_WALLS_OFFSET - .8, 0, -.5)
        wallDataSheme_tmp.indicies[`field_wall_innerEnd`] = 3

        const TYPE_TOP_POIAS = ElemType.POIAS_01
        wallDataSheme_tmp.TYPE_TOP_POIAS = ElemType.POIAS_01
        wallDataSheme_tmp.H_TOP_POIAS = H_TOP_POIAS
        wallDataSheme_tmp.TYPE_SIDE_PILASTER = sidePilasterType
        wallDataSheme_tmp.SIDE_PILASTER_W = SIDE_PILASTER_W

        const DATA_FOR_WALL: IDataForWall = {
            w: d,
            h: H,
            d: .3,
            H_TOP_POIAS,
            TYPE_TOP_POIAS,
            TYPE_SIDE_PILASTER: sidePilasterType,
            SIDE_PILASTER_W,
            INNER_WALL_START_OFFSET: INNER_WALLS_OFFSET,
            INNER_WALL_END_OFFSET: INNER_WALLS_OFFSET,
        }

        const r = calculateLogicWall04(root, DATA_FOR_WALL)
        const angle = _M.angleFromCoords(cur[0] - prev[0], cur[1] - prev[1])

        wallDataSheme_tmp.angle = angle

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
        _M.rotateVerticesY(wallDataSheme_tmp.buffer, -angle)
        _M.translateVertices(wallDataSheme_tmp.buffer, prev[0], 0, prev[1])

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

        const wallData1: IdataForFillWall = addTypeFullIdataForFillWall(wallDataSheme_tmp)
        wallsData.push(wallData1)

        // CAP INNER CORNERS
        if (wallsData.length > 1) {
            const prevWall = wallsData[wallsData.length - 2] 
            const currWall = wallsData[wallsData.length - 1]
            
            const p1: A3 = [
                prevWall.buffer[prevWall.indicies[`field_wall_innerEnd`] * 3],
                0,
                prevWall.buffer[prevWall.indicies[`field_wall_innerEnd`] * 3 + 2],
            ]
            const p0: A3 = [
                currWall.buffer[currWall.indicies[`field_wall_innerStart`] * 3],
                0,
                currWall.buffer[currWall.indicies[`field_wall_innerStart`] * 3 + 2],
            ]
            const p2: A3 = [...p1]
            p2[1] = H

            const p3: A3 = [...p0]
            p3[1] = H

            v.push(..._M.createPolygon(p0, p1, p2, p3))
            uv.push(..._M.createUv([0, 0], [0, 0], [0, 0], [0, 0]))
            c.push(..._M.fillColorFace(COLOR_DARK))

            if (i === perimeter.length - 1) {
                const prevWall = wallsData[wallsData.length - 1] 
                const currWall = wallsData[0]
                
                const p1: A3 = [
                    prevWall.buffer[prevWall.indicies[`field_wall_innerEnd`] * 3],
                    0,
                    prevWall.buffer[prevWall.indicies[`field_wall_innerEnd`] * 3 + 2],
                ]
                const p0: A3 = [
                    currWall.buffer[currWall.indicies[`field_wall_innerStart`] * 3],
                    0,
                    currWall.buffer[currWall.indicies[`field_wall_innerStart`] * 3 + 2],
                ]
                const p2: A3 = [...p1]
                p2[1] = H

                const p3: A3 = [...p0]
                p3[1] = H

                v.push(..._M.createPolygon(p0, p1, p2, p3))
                uv.push(..._M.createUv([0, 0], [0, 0], [0, 0], [0, 0]))
                c.push(..._M.fillColorFace(COLOR_DARK))
            }
        }

        prevWallAngle = angle
    }

    // roof
    const centerYOffset = 2
    const area = createArea00(perimeter, COLOR_BLUE_D, tileMapWall.linesTree, centerYOffset)           
    _M.translateVertices(area.v, 0, H, 0)
    v.push(...area.v)
    c.push(...area.c)
    uv.push(...area.uv)

    // roof bottom side
    {
        const perimeterReverse = perimeter.slice().reverse()
        const area = createArea00(perimeterReverse, COLOR_DARK, tileMapWall.emptyTree, 0)           
        _M.translateVertices(area.v, 0, H, 0)
        v.push(...area.v)
        c.push(...area.c)
        uv.push(...area.uv)
    }

    // first floor
    {
        const area = createArea00(perimeter, COLOR_DARK, tileMapWall.emptyTree, 0)           
        _M.translateVertices(area.v, 0, .01, 0)
        v.push(...area.v)
        c.push(...area.c)
        uv.push(...area.uv)
    }

    const m = _M.createMesh({ 
        v, 
        uv,
        c,
        material: root.materials.walls00,
    })
    root.studio.add(m)

    return m
}