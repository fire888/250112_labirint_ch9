import { 
    PerspectiveCamera,
    Scene, 
    Fog,
    HemisphereLight,
    DirectionalLight,
    WebGLRenderer,
    Texture,
    EquirectangularReflectionMapping,
    SRGBColorSpace,
    Object3D,
    AxesHelper,
    SpotLight,
} from 'three'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { Root } from "../index"
import { Tween, Interpolation, Easing } from '@tweenjs/tween.js'

const params = {
    threshold: 0.65,
    strength: 0.2,
    radius: 0,

    focus: 500.0,
    aperture: 5,
    maxblur: 0.01
}

export class Studio {
    containerDom: HTMLElement
    camera: PerspectiveCamera
    scene: Scene
    fog: Fog
    hemiLight: HemisphereLight
    dirLight: DirectionalLight
    renderer: WebGLRenderer
    envMap: Texture
    composer: EffectComposer
    _root: Root
    spotLight: SpotLight
    amb: THREE.AmbientLight 

    init (root: Root) {
        this._root = root
        this.containerDom = document.getElementById('container-game')
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000)
        this.camera.position.set(1, 30, 70)
        this.camera.lookAt(150, 1, 150)

        this.spotLight = new SpotLight(0xffffff, 30)
        this.spotLight.position.set(0, 3, 5)
        this.spotLight.angle = Math.PI * .2
        this.spotLight.penumbra = 1
        this.spotLight.decay = 1
        this.spotLight.distance = 300
        const target = new Object3D()
        this.spotLight.target = target

        target.position.z = -50
        this.camera.add(this.spotLight.target)

        this.scene = new Scene()
        this.scene.add(this.spotLight)
        this.scene.add(this.camera)
        
        root.loader.assets.cubeSky.colorSpace = SRGBColorSpace;

        this.scene.background = root.loader.assets.cubeSky
        this.envMap = root.loader.assets.cubeSky
        this.fog = new THREE.Fog(0x0e2535, .2, 1000)
        this.addFog()

        //this.amb = new THREE.AmbientLight(0x5e4a8d, 4)
        this.amb = new THREE.AmbientLight(0x897fa0, 3) 
        this.scene.add(this.amb)

        this.dirLight = new DirectionalLight(0x97e6eb, 30)
        //this.dirLight = new DirectionalLight(0xffffff, 15)
        this.dirLight.position.set(-3, 3, -2)
        this.scene.add(this.dirLight)

        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.containerDom.appendChild(this.renderer.domElement)

    
        window.addEventListener( 'resize', this.onWindowResize.bind(this))
        this.onWindowResize()
    }

    render () {
        this.camera.getWorldPosition(this.spotLight.position)
        this.spotLight.position.y += .1
        this.renderer.render(this.scene, this.camera)
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    add (m: Object3D) {
        this.scene.add(m)
    }

    remove (m: Object3D) {
        this.scene.remove(m)
    }

    addAxisHelper (x = 0, y = 0, z = 0, size = 15) {
        const axesHelper = new AxesHelper(size)
        axesHelper.position.set(x, y, z)
        this.scene.add(axesHelper)
    }

    cameraFlyToLevel () {
        const { playerStartPosition } = this._root.appData

        const time = 5000

        const savedPos = new THREE.Vector3().fromArray([playerStartPosition[0], playerStartPosition[1], playerStartPosition[2] - 10])
        const targetPos = new THREE.Vector3().fromArray(playerStartPosition)

        const startFogFar = .5
        const endFogFar = 3

        this.camera.position.copy(savedPos)
        this.camera.lookAt(targetPos)
        const savedQ = new THREE.Quaternion().copy(this.camera.quaternion)
        this.camera.lookAt(new THREE.Vector3().copy(targetPos).setY(targetPos.y - 100000))
        const startQ = new THREE.Quaternion().copy(this.camera.quaternion) 
        const targetQ = new THREE.Quaternion().copy(savedQ)

        return new Promise(res => {
            this.camera.position.copy(savedPos)
            this.camera.lookAt(targetPos)

            const obj = { v: 0 }
            new Tween(obj)
                .easing(Easing.Linear.In)
                .to({ v: 1 }, time)
                .onUpdate(() => {
                    this.camera.position.lerpVectors(savedPos, targetPos, obj.v)
                    this.camera.quaternion.slerpQuaternions(startQ, targetQ, Math.min(1., obj.v * 1.3))
                    this.fog.far = startFogFar + (endFogFar - startFogFar) * obj.v
                })
                .onComplete(() => {
                    res(true)
                })
                .start()
        })
    }

    animateFogTo(far: number, color: THREE.Color, time: number) {
        const startFogFar = this.fog.far
        const endFogFar = far
        const startColor = new THREE.Color().copy(this.fog.color)
        
        return new Promise(res => {        
            const obj = { v: 0 }
            new Tween(obj)
                .easing(Easing.Exponential.InOut)
                .to({ v: 1 }, time)
                .onUpdate(() => {
                    this.fog.far = startFogFar + (endFogFar - startFogFar) * obj.v
                    this.fog.color.lerpColors(startColor, color, obj.v)
                })
                .onComplete(() => {
                    res(true)
                })
                .start()
        })
    } 

    addFog() {
        this.scene.fog = this.fog
    }

    removeFog() {
        this.scene.fog = null
    }

    setFogNearFar(near = .2, far = 100) {
        this.fog.near = near
        this.fog.far = far
    }
}
