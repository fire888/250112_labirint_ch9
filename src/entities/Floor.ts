import { MeshBasicMaterial, Mesh } from 'three'
import * as THREE from 'three'
import { Root } from "../index";
import { _M, A3 } from 'geometry/_m';
import { tileMapWall } from 'geometry/tileMapWall'

const COLOR_BLUE: A3 = _M.hexToNormalizedRGB('1a182d') 

export class Floor {
    mesh: Mesh
    constructor() {}

    init (root: Root) {

        const v: number[] = []
        const c: number[] = []
        const uv: number[] = []

        const S = 100

        /** заливаем квадраты поля кроме цнтрального */ 
        for (let j = -1; j < 2; ++j) {
            for (let i = -1; i < 2; ++i) {
                if (i === 0 && j === 0) {
                    continue;
                }
                v.push(..._M.createPolygon(
                    [i * S, 0, j * S],
                    [i * S, 0, (j + 1) * S],
                    [(i + 1) * S, 0, (j + 1) * S],
                    [(i + 1) * S, 0, j * S],
                ))
                uv.push(..._M.createUv(
                    [0, 0],
                    [1, 0],
                    [1, 1],
                    [0, 1],
                ))
            }
        }

        this.mesh = _M.createMesh({ v, c, uv, material: root.materials.desert })
        this.mesh.position.x = 0
        this.mesh.position.y = 0
        this.mesh.position.y = -.2

        { /** stone perimeter */
            const v: number[] = []
            const uv: number[] = []
            const c: number[] = []

            const N = 50
            const D = S / N
            const H = .4
            const H0 = -.2
            const Z1 = .1
            const Z2 = -.5
            for (let i = 0; i < N; ++i) {
                let startInner = i * D
                let startOuter = i * D
                let endInner = (i + 1) * D
                let endOuter = (i + 1) * D
                if (i === 0) {
                    startInner = Z1
                    startOuter = Z2
                }
                if (i === N - 1) {
                    endInner = endInner - Z1
                    endOuter = endOuter - Z2
                }
                /** inner */
                v.push(..._M.createPolygon(
                    [startInner, H, Z1],
                    [startInner, H0, Z1],
                    [endInner, H0, Z1],
                    [endInner, H, Z1],
                ))
                uv.push(...tileMapWall.noiseLong)
                c.push(..._M.fillColorFace(COLOR_BLUE))
                /** top */
                v.push(..._M.createPolygon(
                    [startOuter, H, Z2],
                    [startInner, H, Z1],
                    [endInner, H, Z1],
                    [endOuter, H, Z2],

                ))
                uv.push(...tileMapWall.noiseLong)
                c.push(..._M.fillColorFace(COLOR_BLUE))
                /** outer */
                v.push(..._M.createPolygon(
                    [endOuter, H, Z2],
                    [endOuter, H0, Z2],
                    [startOuter, H0, Z2],
                    [startOuter, H, Z2],
                ))
                c.push(..._M.fillColorFace(COLOR_BLUE))
                uv.push(...tileMapWall.noiseLong)
            }

            /** right */
            const copy1 = [...v]
            const vv = [...copy1]
            _M.rotateVerticesY(vv, -Math.PI / 2)
            _M.translateVertices(vv, S, 0, 0)
            v.push(...vv)
            uv.push(...uv)
            c.push(...c)

            /** bottom */
            const vvv = [...copy1]
            _M.rotateVerticesY(vvv, Math.PI)
            _M.translateVertices(vvv, S, 0, S)
            v.push(...vvv)
            uv.push(...uv)
            c.push(...c)

            /** left */
            _M.rotateVerticesY(copy1, Math.PI / 2)
            _M.translateVertices(copy1, 0, 0, S)
            v.push(...copy1)
            uv.push(...uv)
            c.push(...c)

            const m = _M.createMesh({ v, uv, c, material: root.materials.walls00 })
            this.mesh.add(m)
        }
    }
}
