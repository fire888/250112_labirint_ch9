import * as THREE from 'three'
import { Root } from 'index'

export class Materials {
    walls00: THREE.MeshPhongMaterial
    road: THREE.MeshStandardMaterial
    desert: THREE.MeshPhongMaterial
    collision: THREE.MeshBasicMaterial


    constructor() {}
    
    init (root: Root) {
        this.walls00 =  new THREE.MeshPhongMaterial({ 
            color: 0xffffff,
            map: root.loader.assets.mapWall_01,
            bumpMap: root.loader.assets.mapWall_01,
            bumpScale: 3,
            specular: 0x5c7974,
            vertexColors: true,
            envMap: root.loader.assets.cubeSky,
            reflectivity: .6 
        })
        
        this.walls00.onBeforeCompile = (shader) => {
            shader.vertexShader =
                `attribute float forcemat;
                varying float vForceMat;
                ` + shader.vertexShader

            shader.vertexShader = shader.vertexShader.replace(
                '#include <begin_vertex>',
                `
                #include <begin_vertex>
                vForceMat = forcemat;
                `
            )

            shader.fragmentShader =
                `varying float vForceMat;
                ` + shader.fragmentShader;

            shader.fragmentShader = shader.fragmentShader.replace(
                '#include <tonemapping_fragment>',
                `
                gl_FragColor.rgb *= (vForceMat - .5);
                #include <tonemapping_fragment>
                `
            )
        }

        {
            const map = root.loader.assets.roadImg
            map.wrapS = THREE.RepeatWrapping
            map.wrapT = THREE.RepeatWrapping
            map.repeat.set(40, 40)
        }

        this.road = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            map: root.loader.assets.roadImg,
            bumpMap: root.loader.assets.roadImg,
            //bumpScale: 7,
            bumpScale: 17,
            vertexColors: true,
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

        this.collision = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    }
}