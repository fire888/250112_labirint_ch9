import { Root } from "../index"
import { _M, A3 } from "../geometry/_m"
import { createScheme } from "./scheme"
import { calcDataAreas } from "./logicSegment"
import { createArea00 } from "geometry/area00/area00"
import { tileMapWall } from "geometry/tileMapWall"
import * as THREE from "three"
import { IArrayForBuffers, SegmentType, IArea, ILevelConf, TSchemeElem, TLabData } from "types/GeomTypes";
import { pause } from "helpers/htmlHelpers"
import { calculateHouses } from "./calculateHouses"

const COLOR_FLOOR: A3 = _M.hexToNormalizedRGB('090810')
const COLLISION_NAME_KEY = 'LAB_COLLISION'

export class Labyrinth {
    _root: Root
    _houses: THREE.Mesh[] = []
    _roads: THREE.Mesh[] = []
    _stricts: THREE.Group[] = []
    _collisionsNames: string[] = []
    _labSheme: TLabData = { areasData: [], positionsEnergy: [], positionsAntigravs: [] }

    constructor() {}
    async init (root: Root) {
        this._root = root
    }

    async build (conf: ILevelConf) {


        console.log('[MESSAGE:] START SCHEME')
        let d = Date.now()
        const scheme: TSchemeElem[] = createScheme(this._root, conf)
        this._labSheme = calcDataAreas(scheme, conf)
        console.log('[TIME:] COMPLETE SCHEME:', ((Date.now() - d) / 1000).toFixed(2))


        console.log('[MESSAGE:] START CALCULATE WALLS')
        d = Date.now()
        const houses: IArrayForBuffers[] = calculateHouses(this._labSheme.areasData)
        console.log('[TIME:] COMPLETE CALCULATE HOUSES', ((Date.now() - d) / 1000).toFixed(2))


        console.log('[MESSAGE:] START ADD WALLS')
        d = Date.now()
        for (let i = 0; i < conf.repeats.length; ++i) {
            const offset = conf.repeats[i]
            this._buildStrict(houses, offset[0], offset[1])  
        }
        console.log('[TIME:] COMPLETE ADD WALLS:', ((Date.now() - d) / 1000).toFixed(2))


        console.log('[MESSAGE:] START ADD ROADS ')
        d = Date.now()
        for (let i = 0; i < conf.repeats.length; ++i) {
            const offset = conf.repeats[i]
            this._buildRoads(this._labSheme.areasData, offset[0], offset[1])
        }
        console.log('[TIME:] COMPLETE ADD ROADS', ((Date.now() - d) / 1000).toFixed(2))
    }

    async clear () {
        this._houses.forEach(h => {
            h.parent.remove(h)
            h.geometry.dispose()
        })
        this._houses = []
        this._labSheme = {
            areasData: [],
            positionsEnergy: [],
            positionsAntigravs: []
        }

        this._collisionsNames.forEach(n => this._root.phisics.removeMeshFromCollision(n))
        this._collisionsNames = [] 

        this._roads.forEach(h => {
            h.parent.remove(h)
            h.geometry.dispose()
        })
        this._roads = []

        await pause(100)
    }

    get positionsEnergy () {
        return this._labSheme.positionsEnergy
    }

    get positionsAntigravs () {
        return this._labSheme.positionsAntigravs
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
                m.frustumCulled = false
                strict.add(m)
                m.position.y = .1
                this._houses.push(m)

                const collisionMesh = _M.createMesh({
                    v: vCollide,
                    material: this._root.materials.collision
                })
                collisionMesh.name = COLLISION_NAME_KEY + '_' + Math.floor(Math.random() * 1000)
                this._collisionsNames.push(collisionMesh.name)
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
                areasData[i].typeSegment === SegmentType.AREA_00 ||
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
        m.position.y = .05
        strict.add(m)
        this._roads.push(m)
    } 
}

