import { Root } from "../../index";
import * as THREE from "three";
import { _M } from "../../geometry/_m";
import { createScheme} from "./scheme"
import { createWall_01, createAngleWall_01 } from "geometry/wall01"
import { createWall_02, createAngleWall_02 } from 'geometry/wall02_down'
import { createWall_03, createAngleWall_03 } from "geometry/wall03";
import { offset, offsetDebugAsync } from "./offset";
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

            /** draw index area */
            const label = _M.createLabel(i + '', [1, 1, 1], 5)
            label.position.set(center[0], 2, center[1])
            this._root.studio.add(label)
            console.log('perimeter:', i, JSON.stringify({
                center,
                area,
                perimeter: scheme[i].area,
                perimeterInner: scheme[i].offset,
            }))
        }

        // const perimeter: [number, number][] =  
        //     [
        //         [20.600655518717495,43.01567717058814],
        //         [32.728059889327426,55.3385775905888],
        //         [38.181755227062396,54.73172192920582],
        //         [42.35139802255235,52.55646372315],
        //         [43.7556428735288,50.68057511474592],
        //         [41.32691313747409,43.90862741421412],
        //         [23.566908486768234,35.0568937172398],
        //         [22.959069425335358,35.429701639899115],
        //         [20.600655518717495,43.01567717058814]
        //     ]
        
        // const perimeterInner: [number, number][] = [[0,0]]
        // // [
        // //     [26.06278111966764,41.110844014424735],
        // //     [37.947916352707836,45.026130990695364],
        // //     [44.644873659330905,36.85945303475018],
        // //     [44.878249977634056,33.907818073863304],
        // //     [44.015648303434915,32.66774173501599],
        // //     [31.138369319547802,35.55167061443489],
        // //     [26.06278111966764,41.110844014424735]
        // // ]

        // const areasData = [
        //     {
        //         "isDown": true,
        //         "center":[32.10297559318662,45.881318467211045],
        //         "area":262.6921896219096,
        //         "perimeter":perimeter,
        //         "perimeterInner": perimeterInner,
        //     }
        // ]

        //console.log(areasData)

        //return;

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


        //const offsetPoints = offset(perimeter, .5, this._root)
        const offsetPoints = offset(perimeter, 1.5, this._root)

        let Y = 1
        for (let i = 0; i < offsetPoints.offsetLines.length; ++i) {
            const p = offsetPoints.offsetLines[i]
            const l = _M.createLabel(i + '', [1, 1, 1], 5)
            l.position.set(p[2], Y, p[3])
            Y += .3
            this._root.studio.add(l)
        }

        const H = -Math.random() * 5 -.2 
        const h = .1
        const hG = -.2
        const FLOOR_H = H - 2 + .3

        let savedStartAngle = null
        let savedPrevAngle = null

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

            const angle = _M.angleFromCoords(cur_I_X - prev_I_X, cur_I_Z - prev_I_Z)
            
            if (savedPrevAngle) {
                const r = createAngleWall_02([prev_I_X, hG, prev_I_Z], -angle + Math.PI, -savedPrevAngle + Math.PI, H)
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)
            }
            savedPrevAngle = angle

            if (i === 1) {
                savedStartAngle = angle
            }

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

                /** cap prev */
                // {
                //     const r = createAngleWall_02([prev_I_X, hG, prev_I_Z], -angle + Math.PI, -savedPrevAngle + Math.PI, H)
                //     v.push(...r.v)
                //     uv.push(...r.uv)
                //     c.push(...r.c)
                // }

                const newAngle = _M.angleFromCoords(cur_I_X - prev_I_X, cur_I_Z - prev_I_Z)

                {
                    const r = createAngleWall_02([prev_I_X, hG, prev_I_Z], -newAngle + Math.PI, -angle + Math.PI, H)
                    v.push(...r.v)
                    uv.push(...r.uv)
                    c.push(...r.c)
                }

                {
                    const label = _M.createLabel(i + '_ANGLE CAP', [1, .3, .3], 5)  
                    label.position.set(prev_I_X, 2, prev_I_Z)  
                    this._root.studio.add(label)
                }

                // /** cap angle with next  */
                {
                    const r = createAngleWall_02([cur_I_X, hG, cur_I_Z], -savedStartAngle + Math.PI, -newAngle + Math.PI, H)
                    v.push(...r.v)
                    uv.push(...r.uv)
                    c.push(...r.c)
                }
            } 
        }

        return { v, uv, c }
    }
}

