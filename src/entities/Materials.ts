import * as THREE from 'three'
import { Root } from 'index'

export class Materials {
    walls00: THREE.MeshPhongMaterial
    road: THREE.MeshPhongMaterial
    desert: THREE.MeshPhongMaterial


    constructor() {}
    
    init (root: Root) {
        this.walls00 =  new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            map: root.loader.assets.mapWall_01,
            bumpMap: root.loader.assets.mapWall_01,
            bumpScale: 3,
            //shininess: 5,
            //shininess: .5,
            specular: 0x5c7974,
            vertexColors: true,
            envMap: root.loader.assets.cubeSky,
            reflectivity: .6 
        }) 

        {
            const map = root.loader.assets.roadImg
            map.wrapS = THREE.RepeatWrapping
            map.wrapT = THREE.RepeatWrapping
            map.repeat.set(40, 40)
        }

        this.road = new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            //emissive: 0x221a33,
            map: root.loader.assets.roadImg,
            //envMap: root.loader.assets.cubeSky,
            //map: this._root.loader.assets.lightMap,
            bumpMap: root.loader.assets.roadImg,
            bumpScale: 7,
            //shininess: 3,
            shininess: 50.,
            specular: 0x555566,
            //aoMap: this._root.loader.assets.roadImg,
            //aoMapIntensity: 100,
            vertexColors: true,
            reflectivity: .6, 
        })

        {
            const map = root.loader.assets.noise00
            map.wrapS = THREE.RepeatWrapping
            map.wrapT = THREE.RepeatWrapping
            map.repeat.set(12, 25)
        }
        this.desert = new THREE.MeshPhongMaterial({
            color: 0x323341,
            specular: 0x733d8a,
            map: root.loader.assets.noise00,
            bumpMap: root.loader.assets.noise00,
            bumpScale: 2,
        })
    }
}