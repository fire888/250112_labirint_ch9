import { Root } from "../index"
import { _M, A3 } from "../geometry/_m"
import { createScheme } from "./scheme"
import { checkTypeSegment } from "./logicSegment"
import { createArea00 } from "geometry/area00/area00"
import { tileMapWall } from "geometry/tileMapWall"
import * as THREE from "three"

import { IArrayForBuffers, SegmentType, IArea } from "types/GeomTypes";

const COLOR_FLOOR: A3 = _M.hexToNormalizedRGB('090810') 


const workerHouses = new Worker(
    // @ts-ignore
    new URL('./calculateHouses.ts', import.meta.url), 
    { type: 'module' }
)




export class Labyrinth {
    _root: Root
    _houses: THREE.Mesh[] = []
    _roads: THREE.Mesh[] = []

    constructor() {}
    async init (root: Root, params = {}) {
        this._root = root


        const iterate = async () => {
            await this.build()
            setTimeout(iterate, 3000)
        }

        iterate()
    }


    async build () {
        let d = Date.now()
        
        console.log('[MESSAGE:] START SCHEME')
        d = Date.now()
        const scheme = createScheme(this._root)

        const areasData: IArea[] = []

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
        }
        console.log('[TIME:] COMPLETE SCHEME:', ((Date.now() - d) / 1000).toFixed(2))

        // /** walls */
        console.log('[MESSAGE:] START CALCULATE WALLS')
        d = Date.now()

        const createPromiseWorker = (areasData: IArea[]) => new Promise((resolve) => {
            workerHouses.onmessage = (e) => {
                resolve(e.data.houses)
            }
            workerHouses.postMessage({ areasData: areasData })
        })

        console.log('[MESSAGE:] START WORKER HOUSES')
        d = Date.now()
        // @ts-ignore
        const houses: IArrayForBuffers[] = await createPromiseWorker(areasData)
        console.log('[TIME:] COMPLETE WORKER HOUSES', ((Date.now() - d) / 1000).toFixed(2))


        console.log('[MESSAGE:] START REMOVE PREV')
        d = Date.now()
        await this.clear()
        console.log('[TIME:] COMPLETE REMOVE PREV', ((Date.now() - d) / 1000).toFixed(2))

        console.log('[MESSAGE:] START ADD WALLS')
        d = Date.now()
        {
            houses.forEach(h => {
                const { v, uv, c } = h
                const m = _M.createMesh({ 
                     v, 
                     uv,
                     c,
                     material: this._root.materials.walls00,
                 })
                this._root.studio.add(m)
                m.position.y = .1
                this._houses.push(m)
            })
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
                material: this._root.materials.road
            })
            m.position.y = .1
            this._root.studio.add(m)
            this._roads.push(m)
        }
        console.log('[TIME:] COMPLETE ROADS', ((Date.now() - d) / 1000).toFixed(2))
    }


    async clear () {
        this._houses.forEach(h => {
            this._root.studio.remove(h)
            h.geometry.dispose
        })
        this._houses = []

        this._roads.forEach(h => {
            this._root.studio.remove(h)
            h.geometry.dispose
        })
        this._roads = []
    } 
}

