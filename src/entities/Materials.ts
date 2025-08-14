import * as THREE from 'three'
import { Root } from 'index'

export class Materials {
    walls00: THREE.MeshPhongMaterial | THREE.MeshStandardMaterial
    road: THREE.MeshStandardMaterial
    desert: THREE.MeshPhongMaterial | THREE.MeshStandardMaterial
    collision: THREE.MeshBasicMaterial


    constructor() {}
    
    init (root: Root) {
        //this.walls00 =  new THREE.MeshPhongMaterial({ 
        this.walls00 =  new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            map: root.loader.assets.mapWall_01,
            bumpMap: root.loader.assets.mapWall_01,
            bumpScale: 3,
            //specular: 0x5c7974,
            vertexColors: true,
            envMap: root.loader.assets.cubeSky,
            //reflectivity: .6 
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
            map.repeat.set(50, 50)
        }
        //this.desert = new THREE.MeshPhongMaterial({
        this.desert = new THREE.MeshStandardMaterial({
            color: 0x323341,
            //specular: 0x733d8a,
            map: root.loader.assets.noise00,
            bumpMap: root.loader.assets.noise00,
            bumpScale: 4,
        })

        this.collision = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    }

    changeWallMaterial(data: { color: number[], emissive: number[], specular: number[] }) {
        // data.emissive.forEach((element, i) => {
        //     data.emissive[i] = element * .4
        // })
        // data.color.forEach((element, i) => {
        //     data.color[i] = element * 1.2
        // })
        this.walls00.color = new THREE.Color(data.color[0], data.color[1], data.color[2])
        this.walls00.emissive = new THREE.Color(data.emissive[0], data.emissive[1], data.emissive[2])
        //this.walls00.specular = new THREE.Color(data.specular[0], data.specular[1], data.specular[2])
        this.walls00.needsUpdate = true
    }

    changeRoadMaterial(data: { color: number[], emissive: number[] }) {
        // data.emissive.forEach((element, i) => {
        //     data.emissive[i] = element * .4
        // })
        // data.color.forEach((element, i) => {
        //     data.color[i] = element * 1.2
        // })
        this.road.color = new THREE.Color(data.color[0], data.color[1], data.color[2])
        this.road.emissive = new THREE.Color(data.emissive[0], data.emissive[1], data.emissive[2])
        this.road.needsUpdate = true
    }

    changeDesertMaterial(data: { color: number[], emissive: number[], specular: number[] }) {
        // data.emissive.forEach((element, i) => {
        //     data.emissive[i] = element * .4
        // })
        // data.color.forEach((element, i) => {
        //     data.color[i] = element * 1.2
        // })
        this.desert.color = new THREE.Color().fromArray(data.color)
        this.desert.emissive = new THREE.Color().fromArray(data.emissive)
        //this.desert.specular = new THREE.Color().fromArray(data.specular)
        this.desert.needsUpdate = true
    }
}