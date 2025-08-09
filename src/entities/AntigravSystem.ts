import { Root } from "../index";
import { _M } from "geometry/_m";
import { Mesh, MeshBasicMaterial, MeshPhongMaterial, Color } from 'three'
import { createEnergyV } from "../geometry/energy/energy"
import { Tween, Interpolation} from '@tweenjs/tween.js'
import * as THREE from 'three'

type Energy = {
    collisionName: string,
    m: Mesh,
    isActive: boolean,
}

export class AntigravSystem {
    nameSpace: string = 'collision_antigrav_'
    _root: Root
    _v: number[] = []
    _collisionMaterial: MeshBasicMaterial
    _items: Energy[] = []
    pointsV2: THREE.Vector2[] = []

    init (root: Root, points: THREE.Vector3[]) {
        this._root = root

        let namePrefix = 0

        for (let i = 0; i < points.length; ++i) {
            const p = points[i]

            const { v } = createEnergyV({ 
                t: _M.ran(.5, 2),
                rad: _M.ran(.1, .2),
                l: _M.ran(.2, .3),
            })
            const m = _M.createMesh({ 
                v, 
                material: new MeshPhongMaterial({ 
                    color: new Color(
                        _M.ran(.8, 1),
                        _M.ran(.2, 1),
                        _M.ran(.2, 1),
                    ),
                    envMap: root.loader.assets.cubeSky,
                    reflectivity: _M.ran(.2, 1),
                }) 
            })
            m.scale.set(.3, .3, .3)
            m.position.x = p.x
            m.position.y = p.y + .1      
            m.position.z = p.z
            root.studio.add(m)
            root.ticker.on((t: number) => {
                m.rotation.y += t * 0.001
            })

            this.pointsV2.push(new THREE.Vector2(p.x, p.z))

            const collisionName = this.nameSpace + namePrefix

            this._items.push({ collisionName, m, isActive: true })

            ++namePrefix
        }
    }

    destroy () {
        for (let i = 0; i < this._items.length; ++i) {
            const { m, collisionName } = this._items[i]
            this._root.studio.remove(m)
            this._items[i].m.geometry.dispose()
            // @ts-ignore:next-line
            this._items[i].m.material.dispose()
        }
        this._items = []
    }
}