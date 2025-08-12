import { Root } from "../index";
import { _M } from "geometry/_m";
import { Mesh, MeshBasicMaterial, Color } from 'three'
import { createEnergyV } from "../geometry/energy/energy"
import { Tween, Interpolation} from '@tweenjs/tween.js'
import * as THREE from 'three'

type Energy = {
    collisionName: string,
    m: Mesh,
    isActive: boolean,
    unsubscribe: () => void
}

export class EnergySystem {
    nameSpace: string = 'collision_energy_'
    _root: Root
    _v: number[] = []
    _collisionMaterial: MeshBasicMaterial
    _items: Energy[] = []

    init (root: Root, points: THREE.Vector3[]) {
        this._root = root

        if (!this._collisionMaterial) {
            this._collisionMaterial = new MeshBasicMaterial({ color: 0xFFFF00 })
        }

        let namePrefix = 0

        for (let i = 0; i < points.length; ++i) {
            const p = points[i]

            const { v, c } = createEnergyV({ 
                t: _M.ran(.5, 2),
                rad: _M.ran(.1, .2),
                l: _M.ran(.2, .3),
            })
            const m = _M.createMesh({ 
                v,
                c, 
                material: new MeshBasicMaterial({ 
                    color: new Color(
                        _M.ran(.8, 1.2),
                        _M.ran(.2, 1.2),
                        _M.ran(.2, 1.2),
                    ),
                    vertexColors: true
                }) 
            })
            m.scale.set(.3, .3, .3)
            m.position.x = p.x
            m.position.y = p.y + .4      
            m.position.z = p.z
            root.studio.add(m)
            const unsubscribe = root.ticker.on((t: number) => {
                m.rotation.y += t * 0.001
            })

            const vCol = _M.createPolygon(
                [p.x - .5, p.y + .2, p.z + .5],
                [p.x + .5, p.y + .2, p.z + .5],
                [p.x + .5, p.y + .2, p.z - .5],
                [p.x - .5, p.y + .2, p.z - .5],
            )
            const collisionM = _M.createMesh({
                v: vCol,
                material: this._collisionMaterial,
            })
            const collisionName = this.nameSpace + namePrefix
            collisionM.name = collisionName
            this._root.phisics.addMeshToCollision(collisionM)

            this._items.push({ collisionName, m, isActive: true, unsubscribe })

            ++namePrefix
        }
    }

    animateMovieHide (name: string) {
        let item = null
        for (let i = 0; i < this._items.length; ++i) {
            if (this._items[i].collisionName === name) {
                item = this._items[i] 
            }
        }
        if (!item) {
            console.log('not find to hide', name)
        }

        item.isActive = false

        const savedY = item.m.position.y

        const obj = { s: item.m.scale.x, y: 0 }
        new Tween(obj)
            .interpolation(Interpolation.Linear)
            .to({ s: 0, y: .1 }, 500)
            .onUpdate(() => {
                item.m.scale.set(obj.s, obj.s, obj.s)
                item.m.position.y = savedY + obj.y  

            })
            .onComplete(() => {
                this._root.studio.remove(item.m)
                item.m.geometry.dispose()
                // @ts-ignore:next-line
                item.m.material.dispose()
            })
            .start()
    }

    getPercentageItemsGetted () {
        let count = 0 
        for (let i = 0; i < this._items.length; ++i) {
            if (this._items[i].isActive) {
                continue;
            }
            ++count
        }
        return count / this._items.length
    }

    destroy () {
        for (let i = 0; i < this._items.length; ++i) {
            const { m, collisionName, unsubscribe } = this._items[i]
            unsubscribe()
            this._root.studio.remove(m)
            this._items[i].m.geometry.dispose()
            // @ts-ignore:next-line
            this._items[i].m.material.dispose()
            this._root.phisics.removeMeshFromCollision(collisionName)
        }
        this._items = []
    }
}