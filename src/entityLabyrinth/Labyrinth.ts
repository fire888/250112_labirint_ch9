import { Root } from "../index"
import { _M, A3 } from "../geometry/_m"
import { createScheme } from "./scheme"
import { buildHouse00 } from "./buildHouse00/buildHouse00"
import { buildHouse01 } from "./buildHouse01/buildHouse01"
import { checkTypeSegment } from "./logicSegment"
import { createArea00 } from "geometry/area00/area00"
import { buildExamples } from "./buildExamples"
import { tileMapWall } from "geometry/tileMapWall";

import { SegmentType } from "types/GeomTypes";

const COLOR_FLOOR: A3 = _M.hexToNormalizedRGB('000000') 

export class Labyrinth {
    _root: Root
    constructor() {}
    async init (root: Root, params = {}) {
        this._root = root

        let d = Date.now()

        console.log('[MESSAGE:] START EXAMPLES')
        buildExamples(root)
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
                    const m = buildHouse00(this._root, areasData[i].perimeterInner)
                    m.position.y = .1
                }
                if (areasData[i].typeSegment === SegmentType.HOUSE_01) {
                    const m = buildHouse01(this._root, areasData[i].perimeterInner)
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
                if (
                    areasData[i].typeSegment === SegmentType.HOUSE_00 ||
                    areasData[i].typeSegment === SegmentType.HOUSE_01
                ) {
                    isHouse = true
                }
                if (!isHouse) {
                    continue;
                }

                const areaData = areasData[i]

                const r = createArea00(areaData.perimeter, COLOR_FLOOR, tileMapWall.stoneTree)

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
    }
}

