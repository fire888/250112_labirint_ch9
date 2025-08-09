import { Root } from "../index"
import { _M, A3 } from "../geometry/_m"
import { createScheme } from "./scheme"
import { checkTypeSegment } from "./logicSegment"
import { createArea00 } from "geometry/area00/area00"
import { tileMapWall } from "geometry/tileMapWall"
import * as THREE from "three"

import { IArrayForBuffers, SegmentType, IArea } from "types/GeomTypes";
import { pause } from "helpers/htmlHelpers"
import { calculateHouses } from "./calculateHouses"

const COLOR_FLOOR: A3 = _M.hexToNormalizedRGB('090810') 

export class Labyrinth {
    _root: Root
    _houses: THREE.Mesh[] = []
    _roads: THREE.Mesh[] = []
    _stricts: THREE.Group[] = []

    constructor() {}
    async init (root: Root, params = {}) {
        this._root = root


        const iterate = async () => {
            await this.build()
            //setTimeout(iterate, 10000)
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
        const houses: IArrayForBuffers[] = calculateHouses(areasData)
        console.log('[TIME:] COMPLETE CALCULATE HOUSES', ((Date.now() - d) / 1000).toFixed(2))

        console.log('[MESSAGE:] START REMOVE PREV')
        d = Date.now()
        await this.clear()
        console.log('[TIME:] COMPLETE REMOVE PREV', ((Date.now() - d) / 1000).toFixed(2))

        const { isBigLevel } = this._root.appData

        console.log('[MESSAGE:] START ADD WALLS')
        d = Date.now()
        if (isBigLevel) {
            for (let i = 0; i < 2; ++i) {
                for (let j = 0; j < 2; ++j) {
                    this._buildStrict(houses, i * 152 - 152, j * 152 - 152)
                }    
            }
        } else {
            this._buildStrict(houses, 0, 0)
        }
        console.log('[TIME:] COMPLETE ADD WALLS:', ((Date.now() - d) / 1000).toFixed(2))

        console.log('[MESSAGE:] START ADD ROADS ')
        d = Date.now()
        if (isBigLevel) {
            for (let i = 0; i < 2; ++i) {
                for (let j = 0; j < 2; ++j) {
                    this._buildRoads(areasData, i * 152 - 152, j * 152 - 152)
                }    
            }
        } else {
            this._buildRoads(areasData, 0, 0)
        }
        console.log('[TIME:] COMPLETE ADD ROADS', ((Date.now() - d) / 1000).toFixed(2))
    }

    async clear () {
        this._houses.forEach(h => {
            h.parent.remove(h)
            h.geometry.dispose()
        })
        this._houses = []

        this._roads.forEach(h => {
            h.parent.remove(h)
            h.geometry.dispose()
        })
        this._roads = []

        await pause(100)
    }
    
    private _buildStrict (houses: IArrayForBuffers[], x: number, z: number) {
        const strict = new THREE.Group()
        strict.position.x = x
        strict.position.z = z
        this._root.studio.add(strict)
        {
            houses.forEach(h => {
                const { v, uv, c, forceMat = [], vCollide = [] } = h
                const m = _M.createMesh({ 
                    v, 
                    uv,
                    c,
                    forceMat,
                    material: this._root.materials.walls00,
                })
                strict.add(m)
                m.position.y = .1
                this._houses.push(m)

                const collisionMesh = _M.createMesh({
                    v: vCollide,
                    material: this._root.materials.collision
                })
                collisionMesh.position.add(strict.position) 
                this._root.phisics.addMeshToCollision(collisionMesh)
            })
        }
    }

    private _buildRoads(areasData: IArea[], x: number, z: number) {
        const strict = new THREE.Group()
        strict.position.x = x
        strict.position.z = z
        this._root.studio.add(strict)

        const v: number[] = [] 
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

            const r = createArea00(areaData.perimeter, COLOR_FLOOR, tileMapWall.stoneTree, 0, -2, tileMapWall.break)

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
        strict.add(m)
        this._roads.push(m)
    } 
}

