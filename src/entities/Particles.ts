import { 
    BufferGeometry, 
    SRGBColorSpace, 
    Float32BufferAttribute, 
    PointsMaterial,
    Points,
    AdditiveBlending,
} from 'three'
import { Root } from '../index'

export class Particles {
    _root: Root
    _geometry: BufferGeometry
    _vertices: number[]
    _speeds: number[]
    _timesLive: number[]
    m: Points
    init (root: Root) {
        this._root = root

        this._geometry = new BufferGeometry()
        this._speeds = []
        this._timesLive = []
        const sprite = root.loader.assets.sprite
        sprite.colorSpace = SRGBColorSpace;

        const _vertices = []

        for ( let i = 0; i < 500; i ++ ) {
            const x = Math.random() * 100 - 50
            const y = Math.random() * 15
            const z = Math.random() * 100 - 50
            _vertices.push(x, y, z)

            const sX = Math.random() * .01 - .005
            const sY = Math.random() * .01 - .005
            const sZ = Math.random() * .01 - .005
            this._speeds.push(sX, sY, sZ)

            this._timesLive.push(Math.floor(Math.random() * 1000))
        }
        this._geometry.setAttribute('position', new Float32BufferAttribute(_vertices, 3))
        // @ts-ignore
        this._vertices = this._geometry.attributes.position.array

        const material = new PointsMaterial({ 
            size: .5, 
            map: sprite, 
            blending: AdditiveBlending, 
            transparent: true 
        })
        this.m = new Points(this._geometry, material) 
        this.m.frustumCulled = false
    }

    update () {
        if (!this._root.studio.camera) {
            return
        }

        for (let i = 0; i < this._timesLive.length; ++i) {
            this._timesLive[i] -= 1
            if (this._timesLive[i] < 0) {
                this._timesLive[i] = 1000

                const pos = this._root.studio.camera.position
                this._vertices[i * 3] = pos.x + Math.random() * 100 - 50
                this._vertices[i * 3 + 1] = pos.y + Math.random() * 25
                this._vertices[i * 3 + 2] = pos.z + Math.random() * 100 - 50
            }
        }

        for (let i = 0; i < this._speeds.length; ++i) {
            if (Math.random() < .01) {
                this._speeds[i] *= -1
            }
        }

        for (let i = 0; i < this._speeds.length; i += 3) {
            this._vertices[i] += this._speeds[i]
            this._vertices[i + 1] += this._speeds[i + 1]
            this._vertices[i + 2] += this._speeds[i + 2]
        }

        this._geometry.attributes.position.needsUpdate = true
    }
}
