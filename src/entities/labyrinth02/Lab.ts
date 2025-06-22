import { Root } from "../../index";
import * as THREE from "three";
import { _M, A3 } from "../../geometry/_m";
import { createScheme } from "./scheme"
import { 
    createWall_02, 
} from 'geometry/wall02_down'
import { calculateLogicHouse00 } from "logicBuild/logicHouse00/logicHouse00";
import { calculateLogicHouse01 } from "logicBuild/logicHouse01/logicHouse01";
import { createCurb00 } from "geometry/bevel00/curb00";
import { createArea00 } from "geometry/area00/area00";
import { offset, } from "./offset";
import { createExamplesAllWalls } from "./examplesWalls";
import { tileMapWall } from "geometry/tileMapWall";
import { log, STYLE_KEYS } from "helpers/logger";
import { checkTypeSegment } from "logicBuild/logicSegment";
import { SegmentType } from "types/GeomTypes";
import { COLOR_BLUE_D } from "constants/CONSTANTS";

//const COLOR_FLOOR: A3 = _M.hexToNormalizedRGB('0b0421') 
const COLOR_FLOOR: A3 = _M.hexToNormalizedRGB('000000') 

export class Lab {
    _root: Root
    constructor() {}
    async init (root: Root, params = {}) {
        this._root = root

        let d = Date.now()

        console.log('[MESSAGE:] START EXAMPLES')
        //createExamplesAllWalls(root)
        console.log('[TIME:] COMPLETE EXAMPLES:', ((Date.now() - d) / 1000).toFixed(2))
        
        console.log('[MESSAGE:] START SCHEME')
        d = Date.now()
        const scheme = createScheme(root)

        const areasData = []

        for (let i = 0; i < scheme.length; ++i) {
            const area = _M.area(scheme[i].area)
            const center = _M.center(scheme[i].area) 
            const typeSegment = checkTypeSegment(scheme[i].offset)

            areasData.push({
                center,
                area,
                perimeter: scheme[i].area,
                perimeterInner: scheme[i].offset,
                typeSegment,
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
        console.log('[TIME:] COMPLETE SCHEME:', ((Date.now() - d) / 1000).toFixed(2))

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
        console.log('[MESSAGE:] START WALLS')
        d = Date.now()
        {
            for (let i = 0; i < areasData.length; ++i) {
                if (areasData[i].typeSegment === SegmentType.HOUSE_00) {
                    const m = calculateLogicHouse00(this._root, areasData[i].perimeterInner)
                    m.position.y = .1
                }
                if (areasData[i].typeSegment === SegmentType.HOUSE_01) {
                    const m = calculateLogicHouse01(this._root, areasData[i].perimeterInner)
                    m.position.y = .1
                }
            }
        }
        console.log('[TIME:] COMPLETE WALLS:', ((Date.now() - d) / 1000).toFixed(2))

        /** roads */
        console.log('[MESSAGE:] START ROADS ')
        d = Date.now()
        {
            const v: number[] = []
            const uv: number[] = [] 
            const c: number[] = [] 

            for (let i = 0; i < areasData.length; ++i) {
                let isHouse = false
                if (areasData[i].typeSegment === SegmentType.HOUSE_00) {
                    isHouse = true
                }
                if (areasData[i].typeSegment === SegmentType.HOUSE_01) {
                    isHouse = true
                }
                if (!isHouse) {
                    continue;
                }

                const areaData = areasData[i]

                const result = offset(areaData.perimeter, 2.1, this._root)
                const { offsetLines, existsLines, centerX, centerY } = result

                const r = this._fillRoad(offsetLines, existsLines)
                v.push(...r.v)
                c.push(...r.c)
            }

            const uv1 = _M.fillUvByPositionsXZ(v)
            const m = _M.createMesh({ 
                v,
                uv: uv1,
                c,
                material: root.materials.road
            })
            m.position.y = .1
            this._root.studio.add(m)
        }
        console.log('[TIME:] COMPLETE ROADS', ((Date.now() - d) / 1000).toFixed(2))

        /** areas */
        // console.log('[MESSAGE:] START AREAS')
        // d = Date.now()
        // {
        //     const v: number[] = []
        //     const uv: number[] = []
        //     const c: number[] = []

        //     for (let i = 0; i < areasData.length; ++i) {
        //         if (areasData[i].typeSegment !== SegmentType.AREA_00) {
        //             continue;
        //         }
        //         const r = this._createArea(areasData[i])
        //         v.push(...r.v)
        //         uv.push(...r.uv)
        //         c.push(...r.c)
        //     }
        //     const m = _M.createMesh({ 
        //         v,
        //         uv,
        //         c, 
        //         material: root.materials.walls00,
        //     })
        //     this._root.studio.add(m)
        // }
        //console.log('[TIME:] COMPLETE AREAS',((Date.now() - d) / 1000).toFixed(2))


        /** empty areas */
        console.log('[MESSAGE:] START AREAS EMPTY')
        d = Date.now()
        {
            const v: number[] = []
            const uv: number[] = []
            const c: number[] = []

            for (let i = 0; i < areasData.length; ++i) {
                if (areasData[i].typeSegment !== SegmentType.AREA_00) {
                   continue;
                }
                const r = createArea00(areasData[i].perimeter, COLOR_FLOOR, tileMapWall.stoneTree)
                v.push(...r.v)
            }

            const uv1 = _M.fillUvByPositionsXZ(v) 
            uv.push(...uv1)

            const m = _M.createMesh({ 
                v,
                uv,
                c, 
                material: root.materials.desert,
            })
            this._root.studio.add(m)
        }
        console.log('[TIME:] COMPLETE AREAS EMPTY', ((Date.now() - d) / 1000).toFixed(2))
    }

    _createArea (areaData: any) {
        const v: number[] = []
        const uv: number[] = []
        const c: number[] = []

        const { perimeter } = areaData

        const offsetPoints = offset(perimeter, 1.5, this._root)
        const offsetPoints2 = offset(perimeter, 1.7, this._root)

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
            if (!offsetPoints.offsetLines[i]) {
                log('[ERROR]: WRONG OFFSET_LINES NOT CORRESPONDING EXISTS LINES:', STYLE_KEYS.RED, offsetPoints)
                continue;
            }
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

            if (!innerI || !outerI) {
                continue;
            }

            if (innerI.length === 4) {
                const r = createCurb00(
                    [innerI[2], innerI[3]], 
                    [innerI[0], innerI[1]], 
                    [outerI[0], outerI[1]], 
                    [outerI[2], outerI[3]],
                    [
                        0, 0, 1, 0, 1, 1,
                        0, 0, 1, 1, 0, 1,
                    ],
                    0,
                    5,
                    COLOR_FLOOR,
                )
                v.push(...r.v)    
                //uv.push(...r.uv)
                c.push(...r.c)
            }

            // create side road
            v.push(
                ..._M.createPolygon(
                    [outerI[0], 0, outerI[1]],
                    [outerI[0], -.1, outerI[1]],
                    [outerI[2], -.1, outerI[3]],
                    [outerI[2], 0, outerI[3]],
                )
            )
            c.push(
                ..._M.fillColorFace(COLOR_FLOOR)
            )
        }
        return { v, uv, c }
    }
}

