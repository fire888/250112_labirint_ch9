// import { _M, A3 } from "../geometry/_m";
// import { tileMapWall } from '../geometry/tileMapWall'
// import { COLOR_BLUE, COLOR_BLUE_D } from "constants/CONSTANTS";
 
// const C1 = COLOR_BLUE_D
// const PR_BOTTOM: [number, number][] = [
//     // [-.2, -1.5],
//     // [-.2, -1.3],
//     // [-.3, -1.2],
//     [.1, 0],
//     [.1, .2],
//     [0, .3],
// ]
// const PR_TOP: [number, number][] = [
//     [0, -.2],
//     [.2, 0]
// ]

// export const createWall_02 = (d: number, h: number) => {
//     const v: number[] = []
//     const uv: number[] = []
//     const c: number[] = []

//     const min = 2.1 // max width without columns

//     const copyT = []
//     for (let i = 0; i < PR_TOP.length; ++i) {
//         copyT.push([PR_TOP[i][0], PR_TOP[i][1] + h])
//     } 

//     const LEVELS = [
//         { profile: _M.convertSimpleProfileToV3(PR_BOTTOM), color: C1, uvTile: tileMapWall.noise },
//         { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_BOTTOM), _M.convertSimpleProfileToV3(copyT)), color: C1, uvTile: tileMapWall.break },
//         { profile: _M.convertSimpleProfileToV3(copyT), color: C1, uvTile: tileMapWall.noise },
//     ]

//     /** fill full wall */
//     LEVELS.forEach(e => {
//         const r = _M.fillPoligonsV3(e.profile, e.profile, d, e.uvTile, e.color)
//         v.push(...r.v)
//         c.push(...r.c)
//         uv.push(...r.uv)
//     })
//     return { v, uv, c }
// }

// let HH = 0
// export const createAngleWall_02 = (pos: A3, angleStart: number, angleEnd: number, h: number) => {
//     const v: number[] = []
//     const c: number[] = []
//     const uv: number[] = []

//     const copyB = []
//     for (let i = 0; i < PR_BOTTOM.length; ++i) {
//         copyB.push([PR_BOTTOM[i][0], PR_BOTTOM[i][1] + h])
//     } 
//     const LEVELS = [
//         { profile: _M.convertSimpleProfileToV3(copyB), color: C1, uvTile: tileMapWall.noise },
//         { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(copyB), _M.convertSimpleProfileToV3(PR_TOP)), color: C1, uvTile: tileMapWall.break },
//         { profile: _M.convertSimpleProfileToV3(PR_TOP), color: C1, uvTile: tileMapWall.noise },
//     ]

//     LEVELS.forEach(e => {
//         const pathL = [...e.profile] 
//         const pathR = [...e.profile]
//         _M.rotateVerticesY(pathL, angleStart)
//         _M.rotateVerticesY(pathR, angleEnd)

//         const r = _M.fillPoligonsV3(pathR, pathL, 0, e.uvTile, e.color, 1.5, false)
//         _M.translateVertices(r.v, ...pos)
//         v.push(...r.v)
//         c.push(...r.c)
//         uv.push(...r.uv)
//     })

//     let isValid = true
//     v.forEach(e => { 
//         if (Number.isNaN(e)) {
//             isValid = false
//         }
//     })
//     if (!isValid) {
//         console.log('NOT VALID', pos, angleStart, angleEnd, h)
//     }

//     // for (let i = 0; i < v.length; i += 3) {
//     //     v[i + 1] += HH
//     // }
//     // HH += 2

//     return { v, c, uv }
// }