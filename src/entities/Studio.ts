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
import { Root } from "../index";
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { Saturate3 } from '../shaders/satutate'
import { SSAOPass } from 'three/examples/jsm/postprocessing/SSAOPass.js'

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
    renderPass: RenderPass
    shader: ShaderPass

    init (root: Root) {
        this._root = root
        this.containerDom = document.getElementById('container-game')
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000)
        //this.camera.position.set(1, 30, 70)
        this.camera.position.set(1, 30, 70)
        this.camera.lookAt(150, 1, 150)

        this.spotLight = new SpotLight(0xffffff, 10)
        this.spotLight.intensity = 20
        this.spotLight.position.set(0, 3, 5);
        this.spotLight.angle = Math.PI * .2;
        this.spotLight.penumbra = 1
        this.spotLight.decay = 1
        this.spotLight.distance = 30
        const target = new Object3D()
        this.spotLight.target = target

        target.position.z = -50
        this.camera.add(this.spotLight.target)

        this.scene = new Scene()
        this.scene.add(this.spotLight)
        this.scene.add(this.camera)
        
        //root.loader.assets.cubeSky.mapping = EquirectangularReflectionMapping;
        root.loader.assets.cubeSky.colorSpace = SRGBColorSpace;

        this.scene.background = root.loader.assets.cubeSky
        //this.envMap = root.loader.assets.noise00
        this.envMap = root.loader.assets.cubeSky
        this.fog = new THREE.Fog(0x2b2241, 1, 50)

        //this.amb = new THREE.AmbientLight(0xFFFFFF, 2)
        this.amb = new THREE.AmbientLight(0xFFFFFF, 4)
        this.scene.add(this.amb)

        this.dirLight = new DirectionalLight(0x2b2241, 15)
        this.dirLight.position.set(-3, 10, 2)
        
        this.scene.add(this.dirLight)

        this.renderer = new WebGLRenderer({ antialias: true })
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.containerDom.appendChild(this.renderer.domElement)

        this.composer = new EffectComposer(this.renderer)
        this.renderPass = new RenderPass(this.scene, this.camera)
        this.composer.addPass(this.renderPass)
        
        const ssaoPass = new SSAOPass(this.scene, this.camera, window.innerWidth, window.innerHeight)
        ssaoPass.kernelRadius = 5
		ssaoPass.minDistance = 0.001
		ssaoPass.maxDistance = .3
		ssaoPass.enabled = true
        this.composer.addPass(ssaoPass)

        this.shader = new ShaderPass(Saturate3)
        this.composer.addPass(this.shader)
    
        window.addEventListener( 'resize', this.onWindowResize.bind(this))
        this.onWindowResize()
    }

    render () {
        this.camera.getWorldPosition(this.spotLight.position)
        this.spotLight.position.y += .1
        //this.renderer.render(this.scene, this.camera)
        this.composer.render(140)
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
}
