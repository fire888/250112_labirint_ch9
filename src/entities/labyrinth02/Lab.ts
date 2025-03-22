import { Root } from "../../index";
import * as THREE from "three";
import { _M } from "../../geometry/_m";
import { createScheme} from "./scheme"
import { createWall_01, createAngleWall_01 } from "geometry/wall01"
import { createWall_02, createAngleWall_02 } from 'geometry/wall02_down'
import { createWall_03, createAngleWall_03 } from "geometry/wall03";
import { offset, } from "./offset";
import { tyleLightMap } from '../../geometry/tyleLightMap'
import { tileMapWall } from "geometry/tileMapWall";

import { createWall_02_full_profile } from "geometry/wall02_full_profile";

const COLOR_PERIM = _M.hexToNormalizedRGB('1c1937')
const AREA_FOR_DOWN = 60

export class Lab {
    _root: Root
    constructor() {}
    async init (root: Root, params = {}) {
        this._root = root

        const scheme = createScheme(root)

        const areasData = []

        for (let i = 0; i < scheme.length; ++i) {
            const random = Math.random() 
            const isDown = random < .2 

            const area = _M.area(scheme[i].area)
            const center = _M.center(scheme[i].area) 
            
            /** label */
            // const l = _M.createLabel(i + ':_' + area.toFixed(1), [1, 1, 1], 5)
            // l.position.set(center[0], 1, center[1])
            // root.studio.add(l)

            areasData.push({
                center,
                area,
                perimeter: scheme[i].area,
                perimeterInner: scheme[i].offset,
                isDown,
                //isDown: true,
            })

            // /** draw index area */
            // const label = _M.createLabel(i + '', [1, 1, 1], 5)
            // label.position.set(center[0], 2, center[1])
            // this._root.studio.add(label)
            // console.log('perimeter:', i, JSON.stringify({
            //     center,
            //     area,
            //     perimeter: scheme[i].area,
            //     perimeterInner: scheme[i].offset,
            // }))
        }

        // const perimeter1:[number, number][] = [[0,24.53072900296393],[11.597803858286005,11.073176953674057],[0.14598130219601124,0],[0,0],[0,24.53072900296393]]
        // const perimeter2:[number, number][] = [[55.93317693220055,48.07672873716901],[68.34847906165305,57.541862499387044],[75.80817560519182,51.84642184663147],[73.70664355767519,43.85818260971251],[55.95535217620788,47.94650865285302],[55.93317693220055,48.07672873716901]]
        // const perimeter3:[number, number][] = [[68.17718888485739,85.81629028218872],[71.19729037499089,100],[95.54370122560195,100],[83.44190402999253,85.13616225005406],[68.50360873993228,85.38399087618804],[68.17718888485739,85.81629028218872]]
        // const perimeter4:[number, number][] = [[24.102250638011064,87.59234887142235],[31.313097205019183,100],[38.20177167920267,100],[45.43294233772796,88.34313789073077],[45.20347574709807,83.85860699163533],[37.80814169070489,78.55843639015781],[30.29084441684774,78.861571766324],[24.102250638011064,87.59234887142235]]



        // const perimeterInner: [number, number][] = [[0,0]]
        // const areasData = [
        //     // {
        //     //     "center":[3.866209534571476,11.821771853269412],
        //     //     "area":143.0595301341438,
        //     //     perimeter: perimeter1,
        //     //    "perimeterInner": perimeterInner,
        //     //     "isDown": true
        //     // },
        //     {
        //         "center":[67.57534904194598,50.10690876121463],
        //         "area":147.19133523088203,
        //         "perimeter": perimeter2,
        //         "perimeterInner": perimeterInner,
        //         "isDown": true,
        //     },
        //     {

        //         "center":[79.88782273709418,93.18013999113882],
        //         "area":293.41118245017014,
        //         "perimeter":perimeter3,
        //         "perimeterInner": perimeterInner,
        //         "isDown": true,
        //     },

        //     {
        //         "center":[35.068508134898046,88.77600104064094],
        //         "area":319.1221883487283,
        //         "perimeter": perimeter4,
        //         "perimeterInner":perimeterInner,
        //         "isDown": true,
        //     },
        // ]

        // // B01
        // // {
        // // "center":[67.57534904194598,50.10690876121463],
        // // "area":147.19133523088203,
        // // "perimeter":[[55.93317693220055,48.07672873716901],[68.34847906165305,57.541862499387044],[75.80817560519182,51.84642184663147],[73.70664355767519,43.85818260971251],[55.95535217620788,47.94650865285302],[55.93317693220055,48.07672873716901]],
        // // "perimeterInner":[[59.25784009868855,48.72517632388863],[68.34781211479725,55.65515677302989],[74.10312560320816,51.26100397875306],[72.62602684851274,45.64632955920021],[59.25784009868855,48.72517632388863]]}
        // // BO2
        // // {"center":[79.88782273709418,93.18013999113882],"area":293.41118245017014,"perimeter":
        // [[68.17718888485739,85.81629028218872],[71.19729037499089,100],[95.54370122560195,100],[83.44190402999253,85.13616225005406],[68.50360873993228,85.38399087618804],[68.17718888485739,85.81629028218872]],
        // "perimeterInner":[[69.93315242834662,86.86048093631602],[72.41152582769264,98.5],[92.3881423327653,98.5],[82.7385451665962,86.64803749295083],[69.93315242834662,86.86048093631602]]}

        // const p01: [number, number][] =[[55.93317693220055,48.07672873716901],[68.34847906165305,57.541862499387044],[75.80817560519182,51.84642184663147],[73.70664355767519,43.85818260971251],[55.95535217620788,47.94650865285302],[55.93317693220055,48.07672873716901]]

        // // const perimeter: [number, number][] =  
        // // [
        // //     [-1.7763568394002505e-15,72.85891142127764],
        // //     [10.594787113789055,75.78999543204117],
        // //     [8.53184871416288,58.934492733245065],
        // //     [0,63.34405293417792],[0,72.85891142127764]
        // // ]
        // const perimeterInner: [number, number][] = [[0,0]]
        // const areasData = [ 
        //     {
        //         "isDown": true,
        //         "center":[5.245558186050693,67.86704444914776],
        //         "area":126.85657508995529,
        //         "perimeter": p01,
        //         "perimeterInner": perimeterInner,
        //     }
        // ]




        /** walls */
        {
            const v: number[] = []
            const uv: number[] = []
            const c: number[] = []
            for (let i = 0; i < areasData.length; ++i) {
                if (areasData[i].isDown) { 
                    continue;
                }
                const random = Math.random()
                if (random < .5) {
                    const r = this._createHome(areasData[i].perimeterInner)
                    v.push(...r.v)
                    uv.push(...r.uv)
                    c.push(...r.c)
                } else {
                    const r = this._createHome_03(areasData[i].perimeterInner)
                    v.push(...r.v)
                    uv.push(...r.uv)
                    c.push(...r.c)
                }
            }
            const m = _M.createMesh({ 
                v, 
                uv,
                c,
                material: root.materials.walls00,
            })
            this._root.studio.add(m)
        }

        /** roads */
        {
            const v: number[] = []
            const uv: number[] = [] 

            for (let i = 0; i < areasData.length; ++i) {
                if (areasData[i].isDown) { 
                    continue;
                }

                const areaData = areasData[i]

                // console.log('p', i, JSON.stringify(areaData))

                const result = offset(areaData.perimeter, 2.1, this._root)
                //const result = offset(areaData.perimeter, 2.1, this._root)
                const { offsetLines, existsLines, centerX, centerY } = result

                const r = this._fillRoad(offsetLines, existsLines)
                v.push(...r.v)
                uv.push(...r.uv)
            }
            const m = _M.createMesh({ 
                v,
                uv,
                material: root.materials.road
            })
           // m.position.y = -2
            this._root.studio.add(m)
        }

        /** areas */
        {
            const v: number[] = []
            const uv: number[] = []
            const c: number[] = []

            for (let i = 0; i < areasData.length; ++i) {
                if (!areasData[i].isDown) { 
                    continue;
                }

                const r = this._createArea(areasData[i])
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)
            }
            const m = _M.createMesh({ 
                v,
                uv,
                c, 
                material: root.materials.walls00,
            })
            this._root.studio.add(m)
        }
    }

    _createHome (perimiter: [number, number][]) {
        const v = []
        const uv = []
        const c = []

        let savedAngle = null
        let savedStartAngle = null 

        const H = Math.random() * 10

        for (let i = 1; i < perimiter.length; ++i) {
            const prev = perimiter[i - 1]
            const cur =  perimiter[i]

            /** проверяем что следующая точка не лежит на предыдущей */
            if (cur[0] === prev[0] && cur[1] === prev[1]) {
                continue;
            }

            // create wall
            const d = _M.dist(prev, cur)
            const r = createWall_01(d, H)
            const angle = _M.angleFromCoords(cur[0] - prev[0], cur[1] - prev[1])
            if (i === 1) {
                savedStartAngle = angle
            }
            _M.rotateVerticesY(r.v, -angle)
            _M.translateVertices(r.v, prev[0], 0, prev[1])
            v.push(...r.v)
            uv.push(...r.uv)
            c.push(...r.c)

            /** cap angles */
            if (savedAngle !== null) {
                const r = createAngleWall_01([prev[0], 0, prev[1]], -savedAngle, -angle, H)
                v.push(...r.v)
                c.push(...r.c)
                uv.push(...r.uv)
            }

            if (i === perimiter.length - 1 && savedStartAngle !== null) {
                const r = createAngleWall_01([cur[0], 0, cur[1]], -angle, -savedStartAngle, H)
                v.push(...r.v)
                c.push(...r.c)
                uv.push(...r.uv)
            }
        
            savedAngle = angle    
        }

        return { v, uv, c }
    }

    _createHome_03 (perimeterInner: [number, number][]) {
        const H = 1 + Math.random() * 5

        const v: number[] = [] 
        const uv: number[] = [] 
        const c: number[] = []

        let savedStartAngle = null
        let savedAngle = null

        for (let i = 1; i < perimeterInner.length; ++i) {
            const prev = perimeterInner[i - 1]
            const curr = perimeterInner[i]
            const a = _M.angleFromCoords(curr[0] - prev[0], curr[1] - prev[1])
            const d = _M.dist(curr, prev)
            const r = createWall_03(d, H)
            _M.rotateVerticesY(r.v, -a)
            _M.translateVertices(r.v, prev[0], 0, prev[1])
            v.push(...r.v)
            c.push(...r.c)
            uv.push(...r.uv)

            /** cap angles */
            if (savedAngle !== null) {
                const r = createAngleWall_03([prev[0], 0, prev[1]], -savedAngle, -a, H)
                v.push(...r.v)
                c.push(...r.c)
                uv.push(...r.uv)
            }

            if (i === perimeterInner.length - 1 && savedStartAngle !== null) {
                const r = createAngleWall_03([curr[0], 0, curr[1]], -a, -savedStartAngle, H)
                v.push(...r.v)
                c.push(...r.c)
                uv.push(...r.uv)
            }
            
            savedAngle = a
            if (i === 1) savedStartAngle = a

        }
        return { v, c, uv }
    }


    _fillRoad (inner: [number, number, number?, number?][], outer: [number, number, number, number][]) {
        if (!inner) {
            return
        }

        /** проверяем что следующая точка не лежит на предыдущей */
        if (inner[2] === inner[0] && outer[3] === outer[1]) {
            return;
        }
        
        const v: number[] = [] 
        const uv: number[] = [] 

        for (let i = 0; i < outer.length; ++i) {
            if (!inner[i]) {
                continue
            }
            if (inner[i].length === 2) {
                v.push(
                    inner[i][0], 0, inner[i][1],       
                    outer[i][0], 0, outer[i][1],
                    outer[i][2], 0, outer[i][3],        
                )
                uv.push(
                    0, 0,
                    1, 0,
                    .5, 1,
                )
            }
            if (inner[i].length == 4) {
                v.push(
                    ..._M.createPolygon(
                        [inner[i][2], 0, inner[i][3]], 
                        [inner[i][0], 0, inner[i][1]], 
                        [outer[i][0], 0, outer[i][1]],  
                        [outer[i][2], 0, outer[i][3]],    
                    )                     
                )    
                uv.push(
                    ..._M.createUv(
                        [0, 0],
                        [1, 0],
                        [1, 1],
                        [0, 1],    
                    )  
                )
            }
        }
        return { v, uv }
    }

    _createArea (areaData: any) {
        const v: number[] = []
        const uv: number[] = []
        const c: number[] = []

        const { perimeter, center } = areaData

        const offsetPoints = offset(perimeter, 1.5, this._root)

        //console.log('HHHHH', offsetPoints)

        // let Y = 1
        // for (let i = 0; i < offsetPoints.offsetLines.length; ++i) {
        //     const p = offsetPoints.offsetLines[i]

        //     // const l = _M.createLabel('s' + i + '', [1, 1, 1], 5)
        //     // l.position.set(p[0], Y, p[1])
        //     // this._root.studio.add(l)

        //     // const l1 = _M.createLabel('e' + i + '', [1, 1, 1], 5)
        //     // l1.position.set(p[2], Y, p[3])
        //     // Y += .5
        //     // this._root.studio.add(l1)
        // }

        // let YY = 1
        // for (let i = 0; i < offsetPoints.existsLines.length; ++i) {
        //     const p = offsetPoints.existsLines[i]

        //     // const l = _M.createLabel('s' + i, [1, .5, .5], 5)
        //     // l.position.set(p[0], YY, p[1])
        //     // this._root.studio.add(l)

        //     // const l1 = _M.createLabel("e" + i + '', [1, .5, 1], 5)
        //     // l1.position.set(p[2], YY, p[3])
        //     // YY += .6
        //     // this._root.studio.add(l1)
        // }

        // calculate angles
        const angles: number[] = []
        for (let i = 0; i < offsetPoints.offsetLines.length; ++i) {
            const prev_I_X = offsetPoints.offsetLines[i][0]
            const prev_I_Z = offsetPoints.offsetLines[i][1]
            const cur_I_X =  offsetPoints.offsetLines[i][2]
            const cur_I_Z =  offsetPoints.offsetLines[i][3]
            
            const angle = _M.angleFromCoords(cur_I_X - prev_I_X, cur_I_Z - prev_I_Z)
            angles.push(Number.isNaN(angle) ? 1000 : angle) 
        }

        const H = -Math.random() * 5 -.2 
        const h = .1
        const hG = -.2
        const FLOOR_H = H - 2 + .3

        let savedStartAngle = null
        let savedPrevAngle = null

        // DRAW WALLS //////////////////////////

        for (let i = 1; i < offsetPoints.existsLines.length; ++i) {
            const prev_O_X = offsetPoints.existsLines[i][0]
            const prev_O_Z = offsetPoints.existsLines[i][1]
            const prev_I_X = offsetPoints.offsetLines[i][0]
            const prev_I_Z = offsetPoints.offsetLines[i][1]
            const cur_O_X =  offsetPoints.existsLines[i][2]
            const cur_O_Z =  offsetPoints.existsLines[i][3]
            const cur_I_X =  offsetPoints.offsetLines[i][2]
            const cur_I_Z =  offsetPoints.offsetLines[i][3]

            const result = createWall_02_full_profile(
                prev_O_X,
                prev_O_Z,
                prev_I_X,
                prev_I_Z,
                cur_O_X,
                cur_O_Z,
                cur_I_X,
                cur_I_Z,
                center,
                H,
                FLOOR_H,
            )

            v.push(...result.v)
            c.push(...result.c)
            uv.push(...result.uv)   

            // const angle = _M.angleFromCoords(cur_I_X - prev_I_X, cur_I_Z - prev_I_Z)
            // if (!Number.isNaN(angle)) {
            //     if (savedPrevAngle) {
            //         const r = createAngleWall_02([prev_I_X, hG, prev_I_Z], -angle + Math.PI, -savedPrevAngle + Math.PI, H)
            //         v.push(...r.v)
            //         uv.push(...r.uv)
            //         c.push(...r.c)
            //     }
            //     savedPrevAngle = angle

            //     if (i > 0 && savedStartAngle === null) {
            //         savedStartAngle = angle
            //     }
            // }
            


            /** last part connect to first */
            if (i === offsetPoints.existsLines.length - 1) {
                const prev_O_X = offsetPoints.existsLines[i][2]
                const prev_O_Z = offsetPoints.existsLines[i][3]
                const prev_I_X = offsetPoints.offsetLines[i][2]
                const prev_I_Z = offsetPoints.offsetLines[i][3]

                const cur_O_X =  offsetPoints.existsLines[0][2]
                const cur_O_Z =  offsetPoints.existsLines[0][3]
                const cur_I_X =  offsetPoints.offsetLines[0][2]
                const cur_I_Z =  offsetPoints.offsetLines[0][3]

                const result = createWall_02_full_profile(
                    prev_O_X,
                    prev_O_Z,
                    prev_I_X,
                    prev_I_Z,
                    cur_O_X,
                    cur_O_Z,
                    cur_I_X,
                    cur_I_Z,
                    center,
                    H,
                    FLOOR_H,
                )
    
                v.push(...result.v)
                c.push(...result.c)
                uv.push(...result.uv)  

                // const newAngle = _M.angleFromCoords(cur_I_X - prev_I_X, cur_I_Z - prev_I_Z)

                // if (!Number.isNaN(newAngle)) {
                //     {
                //         const r = createAngleWall_02([prev_I_X, hG, prev_I_Z], -newAngle + Math.PI, -angle + Math.PI, H)
                //         v.push(...r.v)
                //         uv.push(...r.uv)
                //         c.push(...r.c)
                //     }

                //     // /** cap angle with next  */
                //     {
                //         //const r = createAngleWall_02([cur_I_X, hG, cur_I_Z], -savedStartAngle + Math.PI, -newAngle + Math.PI, H)
                //         const r = createAngleWall_02([cur_I_X, hG, cur_I_Z], -savedStartAngle + Math.PI, -newAngle + Math.PI, H)
                //         v.push(...r.v)
                //         uv.push(...r.uv)
                //         c.push(...r.c)
                //     }

                // }

                // {
                //     const label = _M.createLabel(i + '_ANGLE CAP', [1, .3, .3], 5)  
                //     label.position.set(prev_I_X, 2, prev_I_Z)  
                //     this._root.studio.add(label)
                // }
            } 
        }

        // CAP ANGLES
        {
            const wallsData: { angle: number, line: [number, number, number, number]}[] = []
            for (let i = 0; i < offsetPoints.offsetLines.length; ++i) {
                const prev_I_X = offsetPoints.offsetLines[i][0]
                const prev_I_Z = offsetPoints.offsetLines[i][1]
                const cur_I_X =  offsetPoints.offsetLines[i][2]
                const cur_I_Z =  offsetPoints.offsetLines[i][3]
                
                const angle = _M.angleFromCoords(cur_I_X - prev_I_X, cur_I_Z - prev_I_Z)
                if (Number.isNaN(angle)) {
                    continue;
                }
                wallsData.push({
                    angle,
                    line: [prev_I_X, prev_I_Z, cur_I_X, cur_I_Z]
                }) 
            }
    
            for (let i = 0; i < wallsData.length; ++i) {
                const wallPrev = wallsData[i - 1] || wallsData[wallsData.length - 1]
                const wallCurrent = wallsData[i]

                const cur_I_X =  wallCurrent.line[0]
                const cur_I_Z =  wallCurrent.line[1]
                const prevAngle = -wallPrev.angle - Math.PI
                const curAngle = -wallCurrent.angle + Math.PI
                
                const r = createAngleWall_02([cur_I_X, hG, cur_I_Z], prevAngle, curAngle, H)
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)
            }
        }


        return { v, uv, c }
    }
}

