// import { _M, A3 } from "../geometry/_m";
// import { tileMapWall } from '../geometry/tileMapWall'
// import { createDoor00 } from "../geometry/door00/door00"
// import { createWindow00 } from "../geometry/window00/window00";
// import { createHole00 } from "../geometry/hole00/hole00";
// import { createPilaster00 } from "../geometry/pilaster00/pilastre00";
// import { createPilaster01 } from "../geometry/pilaster01/pilaster01";
// import { createPoias00 } from "../geometry/poias00/poias00";
// import { createPoias01 } from "../geometry/poias01/poias01";
// import { Root } from "index";
// import { 
//     IHoleData,
//     IHoleEgesData,
//     ElemType,
//     IFloorData, 
//     IArrayForBuffers,
// } from "../types/GeomTypes"; 

// import { COLOR_BLUE_D, COLOR_BLUE } from "constants/CONSTANTS";
 
// const C1 = COLOR_BLUE_D
// const C2 = COLOR_BLUE

// const PR_BOTTOM: [number, number][] = [
//     [0.25, 0],
//     [0.25, .3],
//     [0.15, .3],
//     [.1, .4],
//     [.12, .4],
//     [.12, .45],
//     [.1, .45],
//     [.1, .5],
//     [0, .5], 
// ]
// const PR_CENTER: [number, number][] = [
//     [0, .95],
//     [.1, .95],
//     [.1, .97],
//     [.15, .97],
//     [.15, 1.],
//     [.17, 1.],
//     [.17, 1.1],
//     [0, 1.1],
// ]
// const PR_TOP: [number, number][] = [
//     [0,-0.4],
//     [0.1,-0.4],
//     [0.1,-0.2],
// ]

// const PR_TOP_TOP: [number, number][] = [
//     [0.5,-0.2],
//     [0.55,-0.2],
//     [0.55,-0.25],
//     [0.62,-0.25],
//     [0.62,0],
//     [0, 0]
// ]  

// export type IWallData_01_door_window = {
//     w?: number
//     d?: number
//     h?: number
//     floors?: IFloorData[] 
// }


// const D = .3
// const DEFAULT_WALL_CONF: IWallData_01_door_window = {
//     w: 50,
//     h: 30,
//     d: .3,
//     floors: [{
//         w: 50,
//         h: 5,
//         d: .3,
//         doors: [
//             {
//                 elemType: ElemType.DOOR_00,
//                 w: 1.5,
//                 h: 3,
//                 d: .3,
//                 offsetX: 10,
//                 offsetY: 0
//             },
//             {
//                 elemType: ElemType.DOOR_00,
//                 w: 1,
//                 h: 3.3,
//                 d: .3,
//                 offsetX: 20,
//                 offsetY: 0
//             },
//         ],
//         windows: [
//             {
//                 elemType: ElemType.WINDOW_00,
//                 w: 1.5,
//                 h: 2,
//                 d: .3,
//                 offsetX: 3,
//                 offsetY: 1.5
//             },
//             {
//                 elemType: ElemType.WINDOW_00,
//                 w: 1,
//                 h: 2.5,
//                 d: .3,
//                 offsetX: 15,
//                 offsetY: 1.5,
//             },
//         ], 
//         pilasters: [
//             {
//                 elemType: ElemType.PILASTER_00,
//                 w: 1,
//                 h: 2.5,
//                 d: .3,
//                 offsetX: 3,
//                 offsetY: 1.5,
//             },
//             {
//                 elemType: ElemType.PILASTER_00,
//                 w: 1,
//                 h: 2.5,
//                 d: .3,
//                 offsetX: 7,
//                 offsetY: 1.5,
//             },
//         ],
//         poiases: [
//             {
//                 elemType: ElemType.POIAS_00,
//                 w: 50,
//                 h: .3,
//                 d: .3,
//                 offsetY: 0,
//             }
//         ]
//     }]
// }

// const createFloor = (root: Root, floorData: IFloorData): IArrayForBuffers => {
//     const v: number[] = []
//     const uv: number[] = []
//     const c: number[] = []

//     // РАССАВЛЯЕМ ЭЛЕМЕНТЫ НА СТЕНЕ ПО ПОРЯДКУ
//     const lineElements: (IHoleData)[] = []

//     if (floorData.doors) {
//         for (let i = 0; i < floorData.doors.length; ++i) {
//             lineElements.push(floorData.doors[i])
//         }
//     }
//     if (floorData.windows) {
//         for (let i = 0; i < floorData.windows.length; ++i) {
//             lineElements.push(floorData.windows[i])
//         }
//     }

//     const orderedLineElements = lineElements.sort((a, b) => a.offsetX - b.offsetX)

//     let minWidth = Infinity
//     let prevX = 0
//     for (let i = 0; i < orderedLineElements.length; ++i) {
//         const currElem = orderedLineElements[i]
//         const currX = currElem.offsetX - currElem.w * .5
       
//         const emplyWidth = currX - prevX
//         if (emplyWidth < minWidth) {
//             minWidth = emplyWidth
//         }
//         prevX = currX + currElem.w * .5
//     }

//     const holesOffsets = minWidth * .8
//     const calculetedDataHoles: IHoleEgesData[] = []
//     for (let i = 0; i < orderedLineElements.length; ++i) {
//         calculetedDataHoles.push({
//             ...orderedLineElements[i],
//             width: holesOffsets * 2 + orderedLineElements[i].w,
//             height: floorData.h,
//         })
//     }

//     {
//         for (let i = 0; i < calculetedDataHoles.length; ++i) {
//             const holeData = calculetedDataHoles[i]
//             const hole = createHole00(root, holeData)
//             _M.translateVertices(hole.v, holeData.offsetX, 0, 0)
//             v.push(...hole.v)
//             uv.push(...hole.uv)
//             c.push(...hole.c)

//             if (holeData.elemType === ElemType.WINDOW_00) {
//                 const window = createWindow00(root, holeData)
//                 _M.translateVertices(window.v, holeData.offsetX, holeData.offsetY, 0)
//                 v.push(...window.v)
//                 uv.push(...window.uv)
//                 c.push(...window.c)
//             }
//             if (holeData.elemType === ElemType.DOOR_00) {
//                 const door = createDoor00(root, holeData)
//                 _M.translateVertices(door.v, holeData.offsetX, holeData.offsetY, 0)
//                 v.push(...door.v)
//                 uv.push(...door.uv)
//                 c.push(...door.c)
//             }
//         }
//     }

//     {
//         if (floorData.pilasters) {
//             const r = createPilaster00(root, .7, floorData.h, .5)
//             for (let i = 0; i < floorData.pilasters.length; ++i) {
//                 const _v = [...r.v]
//                 _M.translateVertices(_v, floorData.pilasters[i].offsetX, floorData.pilasters[i].offsetY, 0)
//                 v.push(..._v)
//                 uv.push(...r.uv)
//                 c.push(...r.c)
//             }
//         }

//     }

//     // poiases
//     {
//         if (floorData.poiases) {
//             for (let i = 0; i < floorData.poiases.length; ++i) {
//                 const { w, h, d, offsetX, offsetY, offsetZ, elemType } = floorData.poiases[i]

//                 let parts = []
//                 let startX = 0
//                 for (let i = 0; i < orderedLineElements.length; ++i) {
//                     if (
//                         orderedLineElements[i].offsetY <= offsetY &&
//                         orderedLineElements[i].offsetY + orderedLineElements[i].h >= offsetY
//                     ) {
//                         parts.push({
//                             startX,
//                             endX: orderedLineElements[i].offsetX - orderedLineElements[i].w * .5,
//                         })
//                         startX = orderedLineElements[i].offsetX + orderedLineElements[i].w * .5
//                     }
//                 }

//                 parts.push({
//                     startX,
//                     endX: floorData.w
//                 })   

//                 for (let i = 0; i < parts.length; ++i) {
//                     const part = parts[i]
//                     let r = null
//                     if (elemType === ElemType.POIAS_00) {
//                         r = createPoias00(root, part.endX - part.startX, h, d)
//                     }
//                     if (elemType === ElemType.POIAS_01) {
//                         r = createPoias01(root, part.endX - part.startX, h, d)
//                     }
//                     if (r) {
//                         _M.translateVertices(r.v, part.startX, offsetY, offsetZ)
//                         v.push(...r.v)
//                         uv.push(...r.uv)
//                         c.push(...r.c)
//                     }
//                 }
//             }
//         }
//     }

//     // left pilaster
//     {
//         const r = createPilaster01(root, .3, floorData.h , .4)
//         _M.translateVertices(r.v, .3 * .5, 0, 0)
//         v.push(...r.v)
//         uv.push(...r.uv)
//         c.push(...r.c)
//     }

//     // right pilaster
//     {
//         const r = createPilaster01(root, .3, floorData.h, .4)
//         _M.translateVertices(r.v, floorData.w - .3 * .5, 0, 0)
//         v.push(...r.v)
//         uv.push(...r.uv)
//         c.push(...r.c)
//     }

//     return { v, uv, c}
// }

// export const createWall_01_door_window = (root: Root, wallData: IWallData_01_door_window) => {
//     const { w, d, h } = { ...DEFAULT_WALL_CONF, ...wallData }
    
//     const v: number[] = []
//     const uv: number[] = []
//     const c: number[] = []

//     {
//         if (wallData.floors) {
//             for (let i = 0; i < wallData.floors.length; ++i) {
//                 const floorData = wallData.floors[i]
//                 const floor = createFloor(root, floorData)
//                 v.push(...floor.v)
//                 uv.push(...floor.uv)
//                 c.push(...floor.c)
//             }
//         }
//     }

//     return { v, uv, c }
// }

// export const createAngleWall_01 = (pos: A3, angleStart: number, angleEnd: number, h: number) => {
//     const v: number[] = []
//     const c: number[] = []
//     const uv: number[] = []

//     const prTopModify = []
//     for (let i = 0; i < PR_TOP.length; ++i) {
//         prTopModify.push([PR_TOP[i][0], PR_TOP[i][1] + h])
//     }
//     const prTopTopModify = [[0, PR_TOP_TOP[0][1] + h]]
//     for (let i = 0; i < PR_TOP_TOP.length; ++i) {
//         prTopTopModify.push([PR_TOP_TOP[i][0], PR_TOP_TOP[i][1] + h])
//     }

//     const LEVELS = [
//         { profile: _M.convertSimpleProfileToV3(PR_BOTTOM), color: C1, uvTile: tileMapWall.noise },
//         { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_BOTTOM), _M.convertSimpleProfileToV3(PR_CENTER)), color: C1, uvTile: tileMapWall.noise },
//         { profile: _M.convertSimpleProfileToV3(PR_CENTER), color: C1, uvTile: tileMapWall.noise },
//         { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_CENTER), _M.convertSimpleProfileToV3(prTopModify)), color: C2, uvTile: tileMapWall.break },
//         { profile: _M.convertSimpleProfileToV3(prTopModify), color: C1, uvTile: tileMapWall.noise },
//         { profile: _M.convertSimpleProfileToV3(prTopTopModify), color: C1, uvTile: tileMapWall.noise },
//     ]

//     LEVELS.forEach(e => {
//         const pathL = [...e.profile] 
//         const pathR = [...e.profile]
//         _M.rotateVerticesY(pathL, angleStart)
//         _M.rotateVerticesY(pathR, angleEnd)

//         const r = _M.fillPoligonsV3(pathL, pathR, 0, e.uvTile, e.color, 1.5, false)
//         _M.translateVertices(r.v, ...pos)
//         v.push(...r.v)
//         c.push(...r.c)
//         uv.push(...r.uv)
//     })

//     return { v, c, uv }
// }