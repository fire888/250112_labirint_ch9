// import { _M, A3 } from "../geometry/_m";
// import { tileMapWall } from '../geometry/tileMapWall'

// const COLOR_BLUE: A3 = _M.hexToNormalizedRGB('3c3865') 
// const COLOR_BLUE_D: A3 = _M.hexToNormalizedRGB('1c1937') 
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


// export const createWall_01 = (d: number, h: number) => {
//     const v: number[] = []
//     const uv: number[] = []
//     const c: number[] = []

//     const min = 2.1 // max width without columns

//     const prTopModify = []
//     for (let i = 0; i < PR_TOP.length; ++i) {
//         prTopModify.push([PR_TOP[i][0], PR_TOP[i][1] + h])
//     }
//     const LEVELS = [
//         { profile: _M.convertSimpleProfileToV3(PR_BOTTOM), color: C1, uvTile: tileMapWall.noise },
//         { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_BOTTOM), _M.convertSimpleProfileToV3(PR_CENTER)), color: C1, uvTile: tileMapWall.noise },
//         { profile: _M.convertSimpleProfileToV3(PR_CENTER), color: C1, uvTile: tileMapWall.noise },
//         { profile: _M.getLastAndFirstCoordsPath(_M.convertSimpleProfileToV3(PR_CENTER), _M.convertSimpleProfileToV3(prTopModify)), color: C2, uvTile: tileMapWall.break },
//         { profile: _M.convertSimpleProfileToV3(prTopModify), color: C1, uvTile: tileMapWall.noise },
//     ]

//     /** fill full wall */
//     if (d < min) {
//         LEVELS.forEach(e => {
//                 const r = _M.fillPoligonsV3(e.profile, e.profile, d, e.uvTile, e.color)
//                 v.push(...r.v)
//                 c.push(...r.c)
//                 uv.push(...r.uv)
//         })
//         const pr_top_top = _M.convertSimpleProfileToV3([[0, PR_TOP_TOP[0][1]], ...PR_TOP_TOP])
//         const topLevel = _M.fillPoligonsV3(pr_top_top, pr_top_top, d, tileMapWall.noise, C1)
//         _M.translateVertices(topLevel.v, 0, h, 0)
//         v.push(...topLevel.v)
//         uv.push(...topLevel.uv)
//         c.push(...topLevel.c)
//         return { v, uv, c }
//     }

//     // count columns and holes
//     const RL = 1
//     const dd = d - RL - RL
//     const nCol = Math.floor(dd / 2)
//     const nHol = nCol + 1
//     const wColl = .2 + Math.random() * .5
//     const wHoll = (dd - (wColl * nCol)) / nHol
//     const g = .01 + Math.random()

//     let currX = 0

//     /** start */ 
//     LEVELS.forEach(e => {
//         const path0 = e.profile
//         const pathL = [...e.profile] 
//         const pathR = [...e.profile] 
//         for (let i = 0; i < pathL.length; i += 3) {
//             pathL[i] = -pathL[i + 2] // поворот под 45 градусов
//             pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
//         }

//         const r = _M.fillPoligonsV3(path0, pathR, RL, e.uvTile, e.color)
//         v.push(...r.v)
//         uv.push(...r.uv)
//         c.push(...r.c)
//     })

//     currX = RL

//     /** fill right end */
//     LEVELS.forEach(e => {
//         const path0 = e.profile
//         const pathL = [...e.profile] 
//         const pathR = [...e.profile]
//         for (let i = 0; i < pathL.length; i += 3) {
//             pathL[i] = -pathL[i + 2] // поворот под 45 градусов
//             pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
//         }
//         const r = _M.fillPoligonsV3(pathL, path0, RL, e.uvTile, e.color)
//         _M.translateVertices(r.v, dd + RL, 0, 0)
//         v.push(...r.v)
//         uv.push(...r.uv)
//         c.push(...r.c)
//     })

//     for (let i = 0; i < nHol; ++i) {
//         // fill hole
//         LEVELS.forEach(e => {
//             const path0 = e.profile
//             const pathL = [...e.profile] 
//             const pathR = [...e.profile]
//             for (let i = 0; i < pathL.length; i += 3) {
//                 pathL[i] = -pathL[i + 2] // поворот под 45 градусов
//                 pathR[i] = pathR[i + 2]  // поворот пол 45 градусов
//             }

//             const r = _M.fillPoligonsV3(pathL, pathL, g, e.uvTile, e.color)
//             _M.rotateVerticesY(r.v, Math.PI / 2)
//             _M.translateVertices(r.v, currX, 0, 0)
//             v.push(...r.v)
//             uv.push(...r.uv)
//             c.push(...r.c)

//             const r1 = _M.fillPoligonsV3(pathR, pathL, wHoll, e.uvTile, e.color)
//             _M.translateVertices(r1.v, currX, 0, -g)
//             v.push(...r1.v)
//             uv.push(...r1.uv)
//             c.push(...r1.c)

//             const nX = currX + wHoll

//             const r2 = _M.fillPoligonsV3(pathR, pathR, g, e.uvTile, e.color)
//             _M.rotateVerticesY(r2.v, -Math.PI / 2)
//             _M.translateVertices(r2.v, nX, 0, -g)
//             v.push(...r2.v)
//             uv.push(...r2.uv)
//             c.push(...r2.c)

//             if (i < nHol - 1) {
//                 const r = _M.fillPoligonsV3(pathL, pathR, wColl, e.uvTile, e.color)
//                 _M.translateVertices(r.v, nX, 0, 0)
//                 v.push(...r.v)
//                 uv.push(...r.uv)
//                 c.push(...r.c)
//             }
//         })

//         currX += wColl + wHoll 
//     }

//     // fill top profile
//     {
//         const pr_top_top = _M.convertSimpleProfileToV3([[-g, PR_TOP_TOP[0][1]], ...PR_TOP_TOP])
//         const topLevel = _M.fillPoligonsV3(pr_top_top, pr_top_top, d, tileMapWall.noise, C1)
//         _M.translateVertices(topLevel.v, 0, h, 0)
//         v.push(...topLevel.v)
//         uv.push(...topLevel.uv)
//         c.push(...topLevel.c)
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