import { Root } from "../../index";
import * as THREE from "three";
import { _M } from "../../geometry/_m";
import { createScheme} from "./scheme"
import { createWall_01 } from "geometry/wall01";
import { offset } from "./offset";

export class Lab {
    _root: Root
    constructor() {}
    async init (root: Root, params = {}) {
        this._root = root

        const scheme = createScheme(root)

        for (let a = 0; a < scheme.arrOffsets.length; ++a) {
            const offset = scheme.arrOffsets[a]
            this.createHome(offset)
        }

        this.createRoads(scheme.arrAreas)
    }

    createHome (perimiter: [number, number][]) {
        const verticies = []

        let saveStartPerimetrProfiles: number[][] | null = null
        let saveProfiles: number[][] | null  = null

        for (let i = 1; i < perimiter.length; ++i) {
            const prev = perimiter[i - 1]
            const cur =  perimiter[i]

            // create wall
            const d = _M.dist(prev, cur)
            const { v, profiles } = createWall_01(d)
            const angle = _M.angleFromCoords(cur[0] - prev[0], cur[1] - prev[1])
            _M.rotateVerticesY(v, -angle)
            _M.translateVertices(v, prev[0], 0, prev[1])
            verticies.push(...v)

            // cap angles
            const profileLeft = [] // current wall start profile
            const profileRigth = [] // save current wall end profile
            for (let j = 0; j < profiles.length; ++j) {
                const profilePath = profiles[j].path
                const vPr = []

                for (let k = 0; k < profilePath.length; ++k) {
                    vPr.push(0, profilePath[k][1], profilePath[k][0])
                }
                _M.rotateVerticesY(vPr, -angle)

                const copyForRigth = [...vPr]
                _M.translateVertices(copyForRigth, cur[0], 0, cur[1])
                profileRigth.push(copyForRigth)

                _M.translateVertices(vPr, prev[0], 0, prev[1])
                profileLeft.push(vPr)
            }

            if (i === 1) {
                saveStartPerimetrProfiles = profileLeft
            }

            // fill left angle with previous wall 
            if (saveProfiles !== null) {
                for (let k = 0; k < saveProfiles.length; ++k) {
                    const prevV = saveProfiles[k]
                    const cur = profileLeft[k]

                    for (let j = 3; j < prevV.length; j += 3) {
                        verticies.push(
                            ..._M.createPolygon(
                                [prevV[j - 3], prevV[j - 2], prevV[j - 1]],
                                [cur[j - 3], cur[j - 2], cur[j - 1]],
                                [cur[j], cur[j + 1], cur[j + 2]],
                                [prevV[j], prevV[j + 1], prevV[j + 2]],
                            )
                        )
                    }
                }
            }
            // save right profile for next
            saveProfiles = profileRigth

            // fill last angle with start wall 
            if (i === perimiter.length - 1 && saveStartPerimetrProfiles !== null) {
                for (let k = 0; k < saveStartPerimetrProfiles.length; ++k) {
                    const prevV = profileRigth[k]
                    const cur = saveStartPerimetrProfiles[k]

                    for (let j = 3; j < prevV.length; j += 3) {
                        verticies.push(
                            ..._M.createPolygon(
                                [prevV[j - 3], prevV[j - 2], prevV[j - 1]],
                                [cur[j - 3], cur[j - 2], cur[j - 1]],
                                [cur[j], cur[j + 1], cur[j + 2]],
                                [prevV[j], prevV[j + 1], prevV[j + 2]],
                            )
                        )
                    }
                }
            }     
        }
        const m = _M.createMesh({ v: verticies, material: new THREE.MeshPhongMaterial({ color: 0xaaaabb }) })
        this._root.studio.add(m)
    }

    createRoads (areas: [number, number][][]) {
        const v: number[] = []

        for (let i = 0; i < areas.length; ++i) {
            const area = areas[i]
            const areaOffsets = offset(area, 1.5)

            for (let j = 0; j < areaOffsets.length; ++j) {
                const outerNext = j === area.length - 1 ? area[0] : area[j + 1]
                const outer = area[j] 
                const offset = areaOffsets[j]

                if (offset.length <= 2) {
                    continue
                } 

                const l = _M.createLine(
                    [
                        [offset[0], offset[1]],
                        [offset[2], offset[3]],
                    ]
                )
                this._root.studio.add(l)
                l.position.y = 11

                v.push(
                    ..._M.createPolygon(
                        [outer[0], 0, outer[1]],
                        [outerNext[0], 0, outerNext[1]],
                        [offset[2], 0, offset[3]],
                        [offset[0], 0, offset[1]],
                    )
                )
            }
        }

        const m = _M.createMesh({ v, material: new THREE.MeshPhongMaterial({ color: 0x222288 }) })
        this._root.studio.add(m)
    }
}
