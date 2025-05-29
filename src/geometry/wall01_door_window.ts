import { _M, A3 } from "./_m";
import { tileMapWall } from './tileMapWall'
import { createDoor_00 } from "./door00/door00"
import { createWindow00 } from "./window00/window00";
import { createHole00 } from "./hole00/hole00";
import { createPilaster00 } from "./pilaster00/pilastre00";
import { createPoias00 } from "./poias00/poias00";
import { Root } from "index";
import { 
    IHoleData,
    IHoleEgesData,
    ElemType,
    IFloorData, 
    IArrayForBuffers,
} from "../types/GeomTypes"; 

import { COLOR_BLUE_D, COLOR_BLUE } from "constants/CONSTANTS";
 
const C1 = COLOR_BLUE_D
const C2 = COLOR_BLUE

const PR_BOTTOM: [number, number][] = [
    [0.25, 0],
    [0.25, .3],
    [0.15, .3],
    [.1, .4],
    [.12, .4],
    [.12, .45],
    [.1, .45],
    [.1, .5],
    [0, .5], 
]
const PR_CENTER: [number, number][] = [
    [0, .95],
    [.1, .95],
    [.1, .97],
    [.15, .97],
    [.15, 1.],
    [.17, 1.],
    [.17, 1.1],
    [0, 1.1],
]
const PR_TOP: [number, number][] = [
    [0,-0.4],
    [0.1,-0.4],
    [0.1,-0.2],
]

const PR_TOP_TOP: [number, number][] = [
    [0.5,-0.2],
    [0.55,-0.2],
    [0.55,-0.25],
    [0.62,-0.25],
    [0.62,0],
    [0, 0]
]  

export type IWallData_01_door_window = {
    w?: number
    d?: number
    h?: number
    floors?: IFloorData[] 
}


const D = .3
const DEFAULT_WALL_CONF: IWallData_01_door_window = {
    w: 50,
    h: 30,
    d: .3,
    floors: [{
        w: 50,
        h: 5,
        d: .3,
        doors: [
            {
                elemType: ElemType.DOOR_00,
                w: 1.5,
                h: 3,
                d: .3,
                offsetX: 10,
                offsetY: 0
            },
            {
                elemType: ElemType.DOOR_00,
                w: 1,
                h: 3.3,
                d: .3,
                offsetX: 20,
                offsetY: 0
            },
        ],
        windows: [
            {
                elemType: ElemType.WINDOW_00,
                w: 1.5,
                h: 2,
                d: .3,
                offsetX: 3,
                offsetY: 1.5
            },
            {
                elemType: ElemType.WINDOW_00,
                w: 1,
                h: 2.5,
                d: .3,
                offsetX: 15,
                offsetY: 1.5,
            },
        ], 
        pilasters: [
            {
                elemType: ElemType.PILASTER_00,
                w: 1,
                h: 2.5,
                d: .3,
                offsetX: 3,
                offsetY: 1.5,
            },
            {
                elemType: ElemType.PILASTER_00,
                w: 1,
                h: 2.5,
                d: .3,
                offsetX: 7,
                offsetY: 1.5,
            },
        ],
        poiases: [
            {
                elemType: ElemType.POIAS_00,
                w: 50,
                h: .3,
                d: .3,
                offsetY: 0,
            }
        ]
    }]
}

const createFloor = (root: Root, floorData: IFloorData): IArrayForBuffers => {
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []



    // РАССАВЛЯЕМ ЭЛЕМЕНТЫ НА СТЕНЕ ПО ПОРЯДКУ
    const lineElements: (IHoleData)[] = []

    if (floorData.doors) {
        for (let i = 0; i < floorData.doors.length; ++i) {
            lineElements.push(floorData.doors[i])
        }
    }
    if (floorData.windows) {
        for (let i = 0; i < floorData.windows.length; ++i) {
            lineElements.push(floorData.windows[i])
        }
    }

    const orderedLineElements = lineElements.sort((a, b) => a.offsetX - b.offsetX)

    let minWidth = Infinity
    let prevX = 0
    for (let i = 0; i < orderedLineElements.length; ++i) {
        const currElem = orderedLineElements[i]
        const currX = currElem.offsetX - currElem.w * .5
       
        const emplyWidth = currX - prevX
        if (emplyWidth < minWidth) {
            minWidth = emplyWidth
        }
        prevX = currX + currElem.w * .5
    }

    const holesOffsets = minWidth * .8
    const calculetedDataHoles: IHoleEgesData[] = []
    for (let i = 0; i < orderedLineElements.length; ++i) {
        calculetedDataHoles.push({
            ...orderedLineElements[i],
            width: holesOffsets * 2 + orderedLineElements[i].w,
            height: floorData.h,
        })
    }

    {
        for (let i = 0; i < calculetedDataHoles.length; ++i) {
            const holeData = calculetedDataHoles[i]
            const hole = createHole00(root, holeData)
            _M.translateVertices(hole.v, holeData.offsetX, 0, 0)
            v.push(...hole.v)
            uv.push(...hole.uv)
            c.push(...hole.c)

            if (holeData.elemType === ElemType.WINDOW_00) {
                const window = createWindow00(root, holeData)
                _M.translateVertices(window.v, holeData.offsetX, holeData.offsetY, 0)
                v.push(...window.v)
                uv.push(...window.uv)
                c.push(...window.c)
            }
            if (holeData.elemType === ElemType.DOOR_00) {
                const door = createDoor_00(root, holeData)
                _M.translateVertices(door.v, holeData.offsetX, holeData.offsetY, 0)
                v.push(...door.v)
                uv.push(...door.uv)
                c.push(...door.c)
            }
        }

    }

    {
        if (floorData.pilasters) {
            const r = createPilaster00(floorData.h + 1.2)
            for (let i = 0; i < floorData.pilasters.length; ++i) {
                const _v = [...r.v]
                _M.translateVertices(_v, floorData.pilasters[i].offsetX, floorData.pilasters[i].offsetY, .5)
                v.push(..._v)
                uv.push(...r.uv)
                c.push(...r.c)
            }
        }

    }

    {
        if (floorData.poiases) {
            for (let i = 0; i < floorData.poiases.length; ++i) {
                const { w, h, d, offsetX, offsetY } = floorData.poiases[i]
                const r = createPoias00(root, w, h)
                _M.translateVertices(r.v, offsetX, offsetY, d)
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)
            }
        }
    }

    return { v, uv, c}
}

export const createWall_01_door_window = (root: Root, wallData: IWallData_01_door_window) => {
    const { w, d, h } = { ...DEFAULT_WALL_CONF, ...wallData }
    
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []

    {
        if (wallData.floors) {
            for (let i = 0; i < wallData.floors.length; ++i) {
                const floorData = wallData.floors[i]
                const floor = createFloor(root, floorData)
                v.push(...floor.v)
                uv.push(...floor.uv)
                c.push(...floor.c)
            }
        }
    }


    // const prTopModify = []
    // for (let i = 0; i < PR_TOP.length; ++i) {
    //     prTopModify.push([PR_TOP[i][0], PR_TOP[i][1] + h])
    // }
    // const LEVELS = [
    //     { profile: _M.convertSimpleProfileToV3(PR_BOTTOM), color: C1, uvTile: tileMapWall.noise },
    //     { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_BOTTOM), _M.convertSimpleProfileToV3(PR_CENTER)), color: C1, uvTile: tileMapWall.noise },
    //     { profile: _M.convertSimpleProfileToV3(PR_CENTER), color: C1, uvTile: tileMapWall.noise },
    //     //{ profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_CENTER), _M.convertSimpleProfileToV3(prTopModify)), color: C2, uvTile: tileMapWall.break },
    //     { profile: _M.convertSimpleProfileToV3(prTopModify), color: C1, uvTile: tileMapWall.noise },
    // ]

    //const doorAddToWall = .3 

    // { // left wall 
    //     const dL = doorData.offsetLeft - (doorData.width * .5) - doorAddToWall
    //     LEVELS.forEach(e => {
    //         const r = _M.fillPoligonsV3(e.profile, e.profile, dL, e.uvTile, e.color)
    //         v.push(...r.v)
    //         c.push(...r.c)
    //         uv.push(...r.uv)
    //     })
    // }

    // { // right wall 
    //     const dR = d - doorData.offsetLeft - (doorData.width * .5) - doorAddToWall
    //     LEVELS.forEach(e => {
    //         const r = _M.fillPoligonsV3(e.profile, e.profile, dR, e.uvTile, e.color)
    //         _M.translateVertices(r.v, doorData.offsetLeft + (doorData.width * .5) + doorAddToWall, 0, 0)
    //         v.push(...r.v)
    //         c.push(...r.c)
    //         uv.push(...r.uv)
    //     })

    // }

    // { // top part
    //     const pr_top_top = _M.convertSimpleProfileToV3([[0, PR_TOP_TOP[0][1]], ...PR_TOP_TOP])
    //     const topLevel = _M.fillPoligonsV3(pr_top_top, pr_top_top, d, tileMapWall.noise, C1)
    //     _M.translateVertices(topLevel.v, 0, h, 0)
    //     v.push(...topLevel.v)
    //     uv.push(...topLevel.uv)
    //     c.push(...topLevel.c)
    // }

    // if (wallData.doors) {
    //     for (let i = 0; i < wallData.doors.length; ++i) {
    //         const doorData = wallData.doors[i].doorData
    //         const door = createDoor_00(root, doorData)
    //         _M.translateVertices(door.v, wallData.doors[i].offsetLeft, wallData.doors[i].offsetBottom, 0)
    //         v.push(...door.v)
    //         uv.push(...door.uv)
    //         c.push(...door.c)
    //     }
    // }

    // if (wallData.windows) {
    //     for (let i = 0; i < wallData.windows.length; ++i) {
    //         const windowData = wallData.windows[i].windowData
    //         const window = createWindow00(root, windowData)
    //         _M.translateVertices(window.v, wallData.windows[i].offsetLeft, wallData.windows[i].offsetBottom, 0)
    //         v.push(...window.v)
    //         uv.push(...window.uv)
    //         c.push(...window.c)
    //     }  
    // }
 

    // { // door 
    //     const doorData: IDoorData = { w: 1.5, h: 4, d: .5 }
    //     const doorDataForWall: IDoorDataForWall = { doorData, offsetLeft:  }    

    //     const door = createDoor_00(root, doorData)
    //     _M.translateVertices(door.v, doorData.offsetLeft, doorData.offsetBottom, 0)
    //     v.push(...door.v)
    //     uv.push(...door.uv)
    //     c.push(...door.c)
    // }


    // LEVELS.forEach(e => {
    //     const r = _M.fillPoligonsV3(e.profile, e.profile, d, e.uvTile, e.color)
    //     v.push(...r.v)
    //     c.push(...r.c)
    //     uv.push(...r.uv)
    // })
    // const pr_top_top = _M.convertSimpleProfileToV3([[0, PR_TOP_TOP[0][1]], ...PR_TOP_TOP])
    // const topLevel = _M.fillPoligonsV3(pr_top_top, pr_top_top, d, tileMapWall.noise, C1)
    // _M.translateVertices(topLevel.v, 0, h, 0)
    // v.push(...topLevel.v)
    // uv.push(...topLevel.uv)
    // c.push(...topLevel.c)
    return { v, uv, c }

    //////////////////////////////////////////////////////////////

    // // count columns and holes
    // const RL = 1
    // const dd = d - RL - RL
    // const nCol = Math.floor(dd / 2)
    // const nHol = nCol + 1
    // const wColl = .2 + Math.random() * .5
    // const wHoll = (dd - (wColl * nCol)) / nHol
    // const g = .01 + Math.random()

    // let currX = 0

    // /** start */ 
    // LEVELS.forEach(e => {
    //     const path0 = e.profile
    //     const pathL = [...e.profile] 
    //     const pathR = [...e.profile] 
    //     for (let i = 0; i < pathL.length; i += 3) {
    //         pathL[i] = -pathL[i + 2] // поворот под 45 градусов
    //         pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
    //     }

    //     const r = _M.fillPoligonsV3(path0, pathR, RL, e.uvTile, e.color)
    //     v.push(...r.v)
    //     uv.push(...r.uv)
    //     c.push(...r.c)
    // })

    // currX = RL

    // /** fill right end */
    // LEVELS.forEach(e => {
    //     const path0 = e.profile
    //     const pathL = [...e.profile] 
    //     const pathR = [...e.profile]
    //     for (let i = 0; i < pathL.length; i += 3) {
    //         pathL[i] = -pathL[i + 2] // поворот под 45 градусов
    //         pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
    //     }
    //     const r = _M.fillPoligonsV3(pathL, path0, RL, e.uvTile, e.color)
    //     _M.translateVertices(r.v, dd + RL, 0, 0)
    //     v.push(...r.v)
    //     uv.push(...r.uv)
    //     c.push(...r.c)
    // })

    // for (let i = 0; i < nHol; ++i) {
    //     // fill hole
    //     LEVELS.forEach(e => {
    //         const path0 = e.profile
    //         const pathL = [...e.profile] 
    //         const pathR = [...e.profile]
    //         for (let i = 0; i < pathL.length; i += 3) {
    //             pathL[i] = -pathL[i + 2] // поворот под 45 градусов
    //             pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
    //         }

    //         const r = _M.fillPoligonsV3(pathL, pathL, g, e.uvTile, e.color)
    //         _M.rotateVerticesY(r.v, Math.PI / 2)
    //         _M.translateVertices(r.v, currX, 0, 0)
    //         v.push(...r.v)
    //         uv.push(...r.uv)
    //         c.push(...r.c)

    //         const r1 = _M.fillPoligonsV3(pathR, pathL, wHoll, e.uvTile, e.color)
    //         _M.translateVertices(r1.v, currX, 0, -g)
    //         v.push(...r1.v)
    //         uv.push(...r1.uv)
    //         c.push(...r1.c)

    //         const nX = currX + wHoll

    //         const r2 = _M.fillPoligonsV3(pathR, pathR, g, e.uvTile, e.color)
    //         _M.rotateVerticesY(r2.v, -Math.PI / 2)
    //         _M.translateVertices(r2.v, nX, 0, -g)
    //         v.push(...r2.v)
    //         uv.push(...r2.uv)
    //         c.push(...r2.c)

    //         if (i < nHol - 1) {
    //             const r = _M.fillPoligonsV3(pathL, pathR, wColl, e.uvTile, e.color)
    //             _M.translateVertices(r.v, nX, 0, 0)
    //             v.push(...r.v)
    //             uv.push(...r.uv)
    //             c.push(...r.c)
    //         }
    //     })

    //     currX += wColl + wHoll 
    // }

    // // fill top profile
    // {
    //     const pr_top_top = _M.convertSimpleProfileToV3([[-g, PR_TOP_TOP[0][1]], ...PR_TOP_TOP])
    //     const topLevel = _M.fillPoligonsV3(pr_top_top, pr_top_top, d, tileMapWall.noise, C1)
    //     _M.translateVertices(topLevel.v, 0, h, 0)
    //     v.push(...topLevel.v)
    //     uv.push(...topLevel.uv)
    //     c.push(...topLevel.c)
    // }

    // return { v, uv, c }
}

export const createAngleWall_01 = (pos: A3, angleStart: number, angleEnd: number, h: number) => {
    const v: number[] = []
    const c: number[] = []
    const uv: number[] = []

    const prTopModify = []
    for (let i = 0; i < PR_TOP.length; ++i) {
        prTopModify.push([PR_TOP[i][0], PR_TOP[i][1] + h])
    }
    const prTopTopModify = [[0, PR_TOP_TOP[0][1] + h]]
    for (let i = 0; i < PR_TOP_TOP.length; ++i) {
        prTopTopModify.push([PR_TOP_TOP[i][0], PR_TOP_TOP[i][1] + h])
    }

    const LEVELS = [
        { profile: _M.convertSimpleProfileToV3(PR_BOTTOM), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_BOTTOM), _M.convertSimpleProfileToV3(PR_CENTER)), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.convertSimpleProfileToV3(PR_CENTER), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_CENTER), _M.convertSimpleProfileToV3(prTopModify)), color: C2, uvTile: tileMapWall.break },
        { profile: _M.convertSimpleProfileToV3(prTopModify), color: C1, uvTile: tileMapWall.noise },
        { profile: _M.convertSimpleProfileToV3(prTopTopModify), color: C1, uvTile: tileMapWall.noise },
    ]

    LEVELS.forEach(e => {
        const pathL = [...e.profile] 
        const pathR = [...e.profile]
        _M.rotateVerticesY(pathL, angleStart)
        _M.rotateVerticesY(pathR, angleEnd)

        const r = _M.fillPoligonsV3(pathL, pathR, 0, e.uvTile, e.color, 1.5, false)
        _M.translateVertices(r.v, ...pos)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    })

    return { v, c, uv }
}