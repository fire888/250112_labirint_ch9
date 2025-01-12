import { Root } from "../../index";
import * as THREE from "three";
import { _M } from "../../geometry/_m";
import { createScheme} from "./scheme"


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
        for (let i = 1; i < arr.length; ++i) {
            const prev = arr[i - 1]
            const cur =  arr[i]

            const d = _M.dist(prev, cur)

            const v = this.createWall(d, 5)
            const angle = _M.angleFromCoords(cur[0] - prev[0], cur[1] - prev[1])

            _M.rotateVerticesY(v, -angle)
            _M.translateVertices(v, prev[0], 0, prev[1])

            verticies.push(...v)
        }
        const m = _M.createMesh({ v: verticies, material: new THREE.MeshPhongMaterial({ color: 0xaaaabb }) })
        this._root.studio.add(m)
    }

    createWall (d: number, h: number) {
        const vv = _M.createPolygon(
            [0, 0, 0],
            [d, 0, 0],  
            [d, h, 0],  
            [0, h, 0]
        )

        return vv
    }
}
