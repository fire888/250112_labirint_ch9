import { Root } from "../../index";
import * as THREE from "three";
import { _M } from "../../geometry/_m";
import { createScheme} from "./scheme"
import { createWall_01 } from "geometry/wall01";
import { offset } from "./offset";
import { tyleLightMap } from '../../geometry/tyleLightMap'
import { tileMapWall } from "geometry/tileMapWall";

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
            
            const l = _M.createLabel(i + ':_' + area.toFixed(1), [1, 1, 1], 5)
            l.position.set(center[0], 1, center[1])
            root.studio.add(l)

            areasData.push({
                center,
                area,
                perimeter: scheme[i].area,
                perimeterInner: scheme[i].offset,
            })
        }

        /** walls */
        {
            const v: number[] = []
            const uv: number[] = []
            const c: number[] = []
            for (let i = 0; i < areasData.length; ++i) {
                if (areasData[i].area < 60) { 
                    continue;
                }
                const r = this._createHome(areasData[i].perimeterInner)
                v.push(...r.v)
                uv.push(...r.uv)
                c.push(...r.c)
            }
            const m = _M.createMesh({ 
                v, 
                uv,
                c,
                material: new THREE.MeshPhongMaterial({ 
                    color: 0xffffff,
                    map: this._root.loader.assets.mapWall_01,
                    //map: this._root.loader.assets.lightMap,
                    bumpMap: this._root.loader.assets.mapWall_01,
                    bumpScale: 3,
                    shininess: 5,
                    specular: 0x5c7974,
                    vertexColors: true,
                    //aoMap: this._root.loader.assets.roadImg,
                    //aoMapIntensity: 100,
                }) 
            })
            this._root.studio.add(m)
        }

        /** roads */
        {
            const v: number[] = []
            const uv: number[] = [] 
            const uv2: number[] = []

            for (let i = 0; i < areasData.length; ++i) {
                if (areasData[i].area < 60) { 
                    continue;
                }

                const areaData = areasData[i]
                const result = offset(areaData.perimeter, 2.1, this._root)
                const { offsetLines, existsLines, centerX, centerY } = result

                const r = this._fillRoad(offsetLines, existsLines)
                v.push(...r.v)
                uv.push(...r.uv)
                uv2.push(...r.uv2)
            }
            const m = _M.createMesh({ 
                v,
                uv,
                uv2,
                material: new THREE.MeshPhongMaterial({ 
                    color: 0x333377,
                    //color: 0x333333,
                    map: this._root.loader.assets.roadImg,
                    //map: this._root.loader.assets.lightMap,
                    bumpMap: this._root.loader.assets.roadImg,
                    bumpScale: 3,
                    shininess: 10,
                    specular: 0x5c7974,
                    //aoMap: this._root.loader.assets.roadImg,
                    //aoMapIntensity: 100,
                }) 
            })
            this._root.studio.add(m)
        }

        /** areas */
        {
            const v: number[] = []

            for (let i = 0; i < areasData.length; ++i) {
                if (areasData[i].area >= 60) { 
                    continue;
                }

                const { perimeter, center } = areasData[i]

                for (let j = 1; j < perimeter.length; ++j) {
                    const prev = perimeter[j - 1]
                    const cur =  perimeter[j]
                    v.push(
                        center[0], 0, center[1],
                        prev[0], 0, prev[1],
                        cur[0], 0, cur[1],
                    )     
                }
            }
            const m = _M.createMesh({ v, material: new THREE.MeshPhongMaterial({ color: 0x228888 }) })
            this._root.studio.add(m)

        }
    }

    _createHome (perimiter: [number, number][]) {
        const v = []
        const uv = []
        const c = []

        let saveStartPerimetrProfiles: number[][] | null = null
        let saveProfiles: number[][] | null  = null

        for (let i = 1; i < perimiter.length; ++i) {
            const prev = perimiter[i - 1]
            const cur =  perimiter[i]

            // create wall
            const d = _M.dist(prev, cur)
            const r = createWall_01(d)
            const angle = _M.angleFromCoords(cur[0] - prev[0], cur[1] - prev[1])
            _M.rotateVerticesY(r.v, -angle)
            _M.translateVertices(r.v, prev[0], 0, prev[1])
            v.push(...r.v)
            uv.push(...r.uv)
            c.push(...r.c)

            /** cap angles */
            // const profileLeft = [] // current wall start profile
            // const profileRigth = [] // save current wall end profile
            // for (let j = 0; j < r.profiles.length; ++j) {
            //     const profilePath = r.profiles[j].path
            //     const vPr = []

            //     for (let k = 0; k < profilePath.length; ++k) {
            //         vPr.push(0, profilePath[k][1], profilePath[k][0])
            //     }
            //     _M.rotateVerticesY(vPr, -angle)

            //     const copyForRigth = [...vPr]
            //     _M.translateVertices(copyForRigth, cur[0], 0, cur[1])
            //     profileRigth.push(copyForRigth)

            //     _M.translateVertices(vPr, prev[0], 0, prev[1])
            //     profileLeft.push(vPr)
            // }

            // if (i === 1) {
            //     saveStartPerimetrProfiles = profileLeft
            // }

            /** fill left angle with previous wall */ 
            // if (saveProfiles !== null) {
            //     for (let k = 0; k < saveProfiles.length; ++k) {
            //         const prevV = saveProfiles[k]
            //         const cur = profileLeft[k]

            //         for (let j = 3; j < prevV.length; j += 3) {
            //             v.push(
            //                 ..._M.createPolygon(
            //                     [prevV[j - 3], prevV[j - 2], prevV[j - 1]],
            //                     [cur[j - 3], cur[j - 2], cur[j - 1]],
            //                     [cur[j], cur[j + 1], cur[j + 2]],
            //                     [prevV[j], prevV[j + 1], prevV[j + 2]],
            //                 )
            //             )
            //             uv.push(..._M.createUv([0, 0], [1, 0], [1, 1], [0, 1]))
            //             c.push(..._M.fillColorFace([0, 0, 0]))
            //         }
            //     }
            // }
            // save right profile for next
            //saveProfiles = profileRigth

            /** fill last angle with start wall */ 
            // if (i === perimiter.length - 1 && saveStartPerimetrProfiles !== null) {
            //     for (let k = 0; k < saveStartPerimetrProfiles.length; ++k) {
            //         const prevV = profileRigth[k]
            //         const cur = saveStartPerimetrProfiles[k]

            //         for (let j = 3; j < prevV.length; j += 3) {
            //             v.push(
            //                 ..._M.createPolygon(
            //                     [prevV[j - 3], prevV[j - 2], prevV[j - 1]],
            //                     [cur[j - 3], cur[j - 2], cur[j - 1]],
            //                     [cur[j], cur[j + 1], cur[j + 2]],
            //                     [prevV[j], prevV[j + 1], prevV[j + 2]],
            //                 )
            //             )
            //             uv.push(...tileMapWall.noise)
            //             c.push(..._M.fillColorFace([0, 0, 0]))
            //         }
            //     }
            // }     
        }

        return { v, uv, c }
    }


    _fillRoad (inner: [number, number, number?, number?][], outer: [number, number, number, number][]) {
        if (!inner) {
            return
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
                //uv.push(...tyleLightMap.shadowR)
                uv2.push(...tyleLightMap.shadowR)
             }
        }
        return { v, uv, uv2 }
    }
}

