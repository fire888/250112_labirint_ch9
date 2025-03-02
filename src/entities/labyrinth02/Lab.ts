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
            })
        }

        //console.log(areasData)

        //return;

        /** walls */
        {
            const v: number[] = []
            const uv: number[] = []
            const c: number[] = []
            for (let i = 0; i < areasData.length; ++i) {
                if (areasData[i].area < AREA_FOR_DOWN) { 
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
            const uv2: number[] = []


            for (let i = 0; i < areasData.length; ++i) {
                if (areasData[i].area < AREA_FOR_DOWN) { 
                    continue;
                }

                const areaData = areasData[i]

                /** draw index area */
                // const label = _M.createLabel(i + '', [1, 1, 1], 5)
                // label.position.set(areaData.center[0], -1, areaData.center[1])
                // this._root.studio.add(label)
                // console.log('perimeter:', i, JSON.stringify(areaData))


                const result = offset(areaData.perimeter, 2.1, this._root)
                //const result = offset(areaData.perimeter, 2.1, this._root)
                const { offsetLines, existsLines, centerX, centerY } = result

                const r = this._fillRoad(offsetLines, existsLines)
                v.push(...r.v)
                uv.push(...r.uv)
                //uv2.push(...r.uv2)
            }
            const m = _M.createMesh({ 
                v,
                uv,
                //uv2,
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
                if (areasData[i].area >= AREA_FOR_DOWN) { 
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
        const uv2: number[] = [] 

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
                uv2.push(
                    0, 0,
                    0, 0,
                    0, 0,
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
            uv2.push(...tyleLightMap.shadowR)
        }

        // for (let i = 0; i < inner.length; ++i) {
        //     if (!inner[i]) {
        //         continue
        //     }
        //     if (inner[i].length == 4) {
        //         if (inner[i][0] === inner[i][2] && inner[i][1] === inner[i][3]) {
        //             v.push(
        //                 inner[i][0], 0, inner[i][1],       
        //                 outer[i][0], 0, outer[i][1],
        //                 outer[i][2], 0, outer[i][3],        
        //             )
        //             uv.push(
        //                 0, 0,
        //                 1, 0,
        //                 .5, 1,
        //             )
        //             continue;
        //         }

        //         v.push(
        //             ..._M.createPolygon(
        //                 [inner[i][2], 0, inner[i][3]], 
        //                 [inner[i][0], 0, inner[i][1]], 
        //                 [outer[i][0], 0, outer[i][1]],  
        //                 [outer[i][2], 0, outer[i][3]],    
        //             )                     
        //         )    
        //         uv.push(
        //             ..._M.createUv(
        //                 [0, 0],
        //                 [1, 0],
        //                 [1, 1],
        //                 [0, 1],    
        //             )  
        //         )
        //     }
        // }
        return { v, uv }
    }

    _createArea (areaData: any) {
        const v: number[] = []
        const uv: number[] = []
        const c: number[] = []

        const { perimeter, center } = areaData
        const offsetPoints = offset(perimeter, .5, this._root)

        const H = -Math.random() * 5 -.2 
        const h = .1
        const hG = -.2
        const FLOOR_H = H - 2 + .3

        let savedStartAngle = null
        let savedPrevAngle = null

        for (let i = 1; i < offsetPoints.existsLines.length; ++i) {
            const prevO = offsetPoints.existsLines[i - 1]
            const prevI = offsetPoints.offsetLines[i - 1]
            const curO =  offsetPoints.existsLines[i]
            const curI =  offsetPoints.offsetLines[i]

            if (!prevO || !prevI || !curO || !curI) { continue }

            /** label */
            // const l = _M.createLabel(i + '', [1, 1, 1], 5)
            // l.position.set(prevI[0], 1, prevI[1])
            // this._root.studio.add(l)

            /** проверяем что следующая точка не лежит на предыдущей */
            if (prevI[2] === prevI[0] && prevI[3] === prevI[1]) {
                continue;
            }

            const angle = _M.angleFromCoords(prevI[2] - prevI[0], prevI[3] - prevI[1])

            const d = _M.dist([prevI[0], prevI[1]], [prevI[2], prevI[3]])
            
            const r = createWall_02(d, H)
            _M.rotateVerticesY(r.v, -angle + Math.PI)
            _M.translateVertices(r.v, prevI[2], hG, prevI[3])
            v.push(...r.v)
            uv.push(...r.uv)
            c.push(...r.c)

            if (savedPrevAngle) {
                const r = createAngleWall_02([prevI[0], hG, prevI[1]], -angle + Math.PI, -savedPrevAngle + Math.PI, H)
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)
            }
            savedPrevAngle = angle

            if (i === 1) {
                savedStartAngle = angle
            }


            /** top */
            v.push(..._M.createPolygon(
                [prevI[0], h, prevI[1]], 
                [prevO[0], h, prevO[1]],
                [curO[0], h, curO[1]],  
                [curI[0], h, curI[1]], 

            ))
            uv.push(...tileMapWall.noiseLong)
            c.push(..._M.fillColorFace(COLOR_PERIM))

            /** outer */
            v.push(..._M.createPolygon( 
                [prevO[0], h, prevO[1]],
                [prevO[0], 0, prevO[1]],
                [curO[0], 0, curO[1]],  
                [curO[0], h, curO[1]], 

            ))
            uv.push(...tileMapWall.noiseLong)
            c.push(..._M.fillColorFace(COLOR_PERIM))

            /** inner */
            v.push(..._M.createPolygon( 
                [prevI[0], hG, prevI[1]],
                [prevI[0], h, prevI[1]],
                [curI[0], h, curI[1]],  
                [curI[0], hG, curI[1]], 

            ))
            uv.push(...tileMapWall.noiseLong)
            c.push(..._M.fillColorFace(COLOR_PERIM))

            /** fill floor */
            v.push(
                prevO[0], FLOOR_H, prevO[1],
                curO[0], FLOOR_H, curO[1],
                center[0], FLOOR_H, center[1],
            )
            uv.push(...tileMapWall.breakManyTree)
            c.push(...COLOR_PERIM)
            c.push(...COLOR_PERIM)
            c.push(...COLOR_PERIM)

            /** last part connect to first */
            if (i === offsetPoints.existsLines.length - 1) {
                const prevO = offsetPoints.existsLines[i]
                const prevI = offsetPoints.offsetLines[i]
                const curO =  offsetPoints.existsLines[0]
                const curI =  offsetPoints.offsetLines[0]

                if (prevI[2] === prevI[0] && prevI[3] === prevI[1]) {
                    continue;
                }

                const angle = _M.angleFromCoords(prevI[2] - prevI[0], prevI[3] - prevI[1])
                const d = _M.dist([prevI[0], prevI[1]], [prevI[2], prevI[3]])
                
                const r = createWall_02(d, H)
                _M.rotateVerticesY(r.v, -angle + Math.PI)
                _M.translateVertices(r.v, prevI[2], hG, prevI[3])
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)

                /** top */
                v.push(..._M.createPolygon(
                    [prevI[0], h, prevI[1]], 
                    [prevO[0], h, prevO[1]],
                    [curO[0], h, curO[1]],  
                    [curI[0], h, curI[1]], 
                ))
                uv.push(...tileMapWall.noiseLong)
                c.push(..._M.fillColorFace(COLOR_PERIM))

                /** outer */
                v.push(..._M.createPolygon(
                    [prevO[0], h, prevO[1]], 
                    [prevO[0], 0, prevO[1]],
                    [curO[0], 0, curO[1]],  
                    [curO[0], h, curO[1]], 
                ))
                uv.push(...tileMapWall.noiseLong)
                c.push(..._M.fillColorFace(COLOR_PERIM))

                /** inner */
                v.push(..._M.createPolygon( 
                    [prevI[0], hG, prevI[1]],
                    [prevI[0], h, prevI[1]],
                    [curI[0], h, curI[1]],  
                    [curI[0], hG, curI[1]], 
                ))
                uv.push(...tileMapWall.noiseLong)
                c.push(..._M.fillColorFace(COLOR_PERIM))

                /** cap prev */
                {
                    const r = createAngleWall_02([prevI[0], hG, prevI[1]], -angle + Math.PI, -savedPrevAngle + Math.PI, H)
                    v.push(...r.v)
                    uv.push(...r.uv)
                    c.push(...r.c)
                }

                /** cap angle with next  */
                {
                    const r = createAngleWall_02([prevI[2], hG, prevI[3]], -savedStartAngle + Math.PI, -angle + Math.PI, H)
                    v.push(...r.v)
                    uv.push(...r.uv)
                    c.push(...r.c)
                }

                /** fill floor */
                v.push(
                    prevO[0], FLOOR_H, prevO[1],
                    curO[0], FLOOR_H, curO[1],
                    center[0], FLOOR_H, center[1],
                )
                uv.push(...tileMapWall.breakManyTree)
                c.push(...COLOR_PERIM)
                c.push(...COLOR_PERIM)
                c.push(...COLOR_PERIM)
            } 
        }

        return { v, uv, c }
    }
}

