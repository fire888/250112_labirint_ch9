import { Root } from "../../index";
import * as THREE from "three";
import { _M } from "../../geometry/_m";
import { createScheme} from "./scheme"
import { createWall_01 } from "geometry/wall01";


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
    }

    createHome (arr: [number, number][]) {
        const verticies = []

        const H = Math.random() * 30 + 5

        let prevProfiles: number[][] | null  = null

        for (let i = 1; i < arr.length; ++i) {
            const prev = arr[i - 1]
            const cur =  arr[i]

            const d = _M.dist(prev, cur)

            const { v, profiles } = createWall_01(d, H)
            const angle = _M.angleFromCoords(cur[0] - prev[0], cur[1] - prev[1])

            _M.rotateVerticesY(v, -angle)
            _M.translateVertices(v, prev[0], 0, prev[1])

            verticies.push(...v)

            const profileVS = []
            const copyProfilesVS = []
            for (let j = 0; j < profiles.length; ++j) {
                const profilePath = profiles[j].path
                const vPr = []

                for (let k = 0; k < profilePath.length; ++k) {
                    vPr.push(0, profilePath[k][1], profilePath[k][0])
                }
                _M.rotateVerticesY(vPr, -angle)
                copyProfilesVS.push([...vPr])
                _M.translateVertices(vPr, prev[0], 0, prev[1])

                profileVS.push(vPr)
            }

            if (prevProfiles !== null) {
                for (let k = 0; k < prevProfiles.length; ++k) {
                    const prevV = prevProfiles[k]
                    const cur = profileVS[k]

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

            for (let j = 0; j < profiles.length; ++j) {
                const profilePath = profiles[j].path

                const vPr = []
                for (let k = 0; k < profilePath.length; ++k) {
                    vPr.push(0, profilePath[k][1], profilePath[k][0])
                }
                _M.rotateVerticesY(vPr, -angle)
                _M.translateVertices(vPr, prev[0], 0, prev[1])

                profileVS.push(vPr)
            }


            for (let j = 0; j < copyProfilesVS.length; ++j) {
                _M.translateVertices(copyProfilesVS[j], cur[0], 0, cur[1])
            }
            prevProfiles = copyProfilesVS
        }
        const m = _M.createMesh({ v: verticies, material: new THREE.MeshPhongMaterial({ color: 0xaaaabb }) })
        this._root.studio.add(m)
    }
}
