import { Root } from "../../index";
import * as THREE from "three";
import { _M, A3 } from "../../geometry/_m";
import { createScheme} from "./scheme"
import { createWall_01, createAngleWall_01 } from "geometry/wall01"
import { createWall_02, createAngleWall_02 } from 'geometry/wall02_down'
import { createWall_03, createAngleWall_03 } from "geometry/wall03";
import { createCurb00 } from "geometry/curb00";
import { createArea00 } from "geometry/area00";
import { offset, } from "./offset";
import { createExamplesAllWalls } from "./examplesWalls";
import { tileMapWall } from "geometry/tileMapWall";

const COLOR_FLOOR: A3 = _M.hexToNormalizedRGB('0b0421') 
console.log('HHH', COLOR_FLOOR)

const COLOR_PERIM = _M.hexToNormalizedRGB('1c1937')
const AREA_FOR_DOWN = 60

export class Lab {
    _root: Root
    constructor() {}
    async init (root: Root, params = {}) {
        this._root = root

        createExamplesAllWalls(root)

        
        const scheme = createScheme(root)

        const areasData = []

        for (let i = 0; i < scheme.length; ++i) {
            const random = Math.random() 
            const isDown = random < .2 

            const area = _M.area(scheme[i].area)
            const center = _M.center(scheme[i].area) 
            


            areasData.push({
                center,
                area,
                perimeter: scheme[i].area,
                perimeterInner: scheme[i].offset,
                isDown,
            })

            /** label */
            // const l = _M.createLabel(i + ':_' + area.toFixed(1), [1, 1, 1], 5)
            // l.position.set(center[0], 1, center[1])
            // root.studio.add(l)
            // console.log('perimeter:', i, JSON.stringify({
            //     center,
            //     area,
            //     perimeter: scheme[i].area,
            //     perimeterInner: scheme[i].offset,
            // }))
        }

        // const p0: [number, number][] =
        //     [[47.5068170931952,40.954869246100614],[49.35495133579947,50.28669379945678],[69.31320673659431,49.56875676984434],[69.91321808140812,48.479099662266876],[66.96852621022883,41.359869636973414],[55.805643071992485,36.709009938495576],[47.5068170931952,40.954869246100614]]

        //  const p01: [number, number][] = [[68.59407568095797,45.5307863279735],[68.83585260037971,46.24963718839549],[89.07093997376052,46.20276341983279],[91.85810725046277,36.05857565615229],[78.7059202233192,31.567298017156013],[73.41190441699894,32.7939119092836],[68.59407568095797,45.5307863279735]]
        // const p02: [number, number][] = [[0,31.499905342549102],[9.196230856895248,30.922536038745356],[0.12798325970139324,12.874530416066566],[0,12.780680513086763],[0,31.499905342549102]] 
        
        // const pInner: [number, number][] = [[0, 0]]   
        // const areasData = [
        //     {
        //         "center":[80.27200511526718,39.809324570276864],
        //         "area":257.36826082930475,
        //         "perimeter":p01,
        //         perimeterInner: pInner,
        //         isDown: false,
        //     },
        //     {
        //         "center":[3.0657687629986774,25.015538167748087],
        //         "area":86.80255071368364,
        //         "perimeter": p02,
        //         "perimeterInner": p02,
        //         isDown: false,
        //     }
        // ] 


        // /** walls */
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
            const c: number[] = [] 

            for (let i = 0; i < areasData.length; ++i) {
                if (areasData[i].isDown) { 
                    continue;
                }

                const areaData = areasData[i]

                const result = offset(areaData.perimeter, 2.1, this._root)
                const { offsetLines, existsLines, centerX, centerY } = result

                const r = this._fillRoad(offsetLines, existsLines)
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)
            }
            const m = _M.createMesh({ 
                v,
                uv,
                c,
                //material: root.materials.road
                material: root.materials.walls00,
            })
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
        const v: number[] = [] 
        const uv: number[] = [] 
        const c: number[] = []

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


    _createArea (areaData: any) {
        const v: number[] = []
        const uv: number[] = []
        const c: number[] = []

        const { perimeter } = areaData

        const offsetPoints = offset(perimeter, 1.5, this._root)
        const offsetPoints2 = offset(perimeter, 1.7, this._root)

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

        const H = Math.random() * 5 -.2 

        {
            const r = createArea00(perimeter, COLOR_FLOOR, tileMapWall.stoneTree)
            _M.translateVertices(r.v, 0, -H, 0)
            v.push(...r.v)    
            uv.push(...r.uv)
            c.push(...r.c)
        }

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

            {
                const d = _M.dist([prev_I_X, prev_I_Z], [cur_I_X, cur_I_Z])
                const r = createWall_02(d, H - .2)
                const a = _M.angleFromCoords(cur_I_X - prev_I_X, cur_I_Z - prev_I_Z)
                _M.rotateVerticesY(r.v, -a + Math.PI)
                _M.translateVertices(r.v, cur_I_X, -H, cur_I_Z)
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)  
            }

            {
                const prev_I_X = offsetPoints2.offsetLines[i][0]
                const prev_I_Z = offsetPoints2.offsetLines[i][1]
                const cur_I_X =  offsetPoints2.offsetLines[i][2]
                const cur_I_Z =  offsetPoints2.offsetLines[i][3]

                const r = createCurb00(
                    [cur_I_X, cur_I_Z],
                    [prev_I_X, prev_I_Z],
                    [prev_O_X, prev_O_Z],
                    [cur_O_X, cur_O_Z],
                    tileMapWall.noiseLong,
                    .3,
                    5,
                    COLOR_FLOOR,
                )
                _M.translateVertices(r.v, 0, -.2, 0)
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)  
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

                {
                    const d = _M.dist([prev_I_X, prev_I_Z], [cur_I_X, cur_I_Z])
                    const r = createWall_02(d, H - .2)
                    const a = _M.angleFromCoords(cur_I_X - prev_I_X, cur_I_Z - prev_I_Z)
                    _M.rotateVerticesY(r.v, -a + Math.PI)
                    _M.translateVertices(r.v, cur_I_X, -H, cur_I_Z)
                    v.push(...r.v)
                    uv.push(...r.uv)
                    c.push(...r.c)  
                }

                {
                    const prev_O_X = offsetPoints2.existsLines[i][2]
                    const prev_O_Z = offsetPoints2.existsLines[i][3]
                    const prev_I_X = offsetPoints2.offsetLines[i][2]
                    const prev_I_Z = offsetPoints2.offsetLines[i][3]
    
                    const cur_O_X =  offsetPoints2.existsLines[0][2]
                    const cur_O_Z =  offsetPoints2.existsLines[0][3]
                    const cur_I_X =  offsetPoints2.offsetLines[0][2]
                    const cur_I_Z =  offsetPoints2.offsetLines[0][3]

                    const r = createCurb00(
                        [cur_I_X, cur_I_Z],
                        [prev_I_X, prev_I_Z],
                        [prev_O_X, prev_O_Z],
                        [cur_O_X, cur_O_Z],
                        tileMapWall.noiseLong,
                        .3,
                        5,
                        COLOR_FLOOR,
                    )
                    _M.translateVertices(r.v, 0, -.2, 0)
                    v.push(...r.v)
                    uv.push(...r.uv)
                    c.push(...r.c)  
                }
            } 
        }

        return { v, uv, c }
    }

    _fillRoad (inner: [number, number, number?, number?][], outer: [number, number, number, number][]) {
        if (!inner) {
            return
        }

        const v: number[] = [] 
        const uv: number[] = [] 
        const c: number[] = []

        for (let i = 0; i < outer.length; ++i) {
            const innerI = inner[i]
            const outerI = outer[i]

            if (innerI.length === 4) {
                const r = createCurb00(
                    [innerI[2], innerI[3]], 
                    [innerI[0], innerI[1]], 
                    [outerI[0], outerI[1]], 
                    [outerI[2], outerI[3]],


                    
                    tileMapWall.stoneLong,
                    null,
                    5,
                    COLOR_FLOOR,
                )
                v.push(...r.v)    
                uv.push(...r.uv)
                c.push(...r.c)
            }
        }
        return { v, uv, c }
    }
}

