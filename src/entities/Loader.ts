import { Texture, TextureLoader, AudioLoader } from 'three'
import mapEnv from "../assets/env.webp"
import sky from '../assets/sky.webp'
import sprite from '../assets/sprite.webp'
import audioAmbient from '../assets/ambient.mp3'
import steps from '../assets/steps_metal.mp3'
import audioBzink from '../assets/bzink.mp3'
import audioDoor from '../assets/door.mp3'
import audioFly from '../assets/fly.mp3'
import roadImg from '../assets/road.jpg'
import lightMap from '../assets/tiles.jpg'
import wallTile from '../assets/tiles_wall.jpg'

type Assets = {
    mapEnv: Texture,
    sky: Texture,
    sprite: Texture,
    soundAmbient: any,
    soundStepsMetal: any,
    soundBzink: any, 
    soundDoor: any,
    soundFly: any,
    roadImg: Texture,
    lightMap: Texture,
    wallMap: Texture,
}
type ResultLoad = {
    key: keyof Assets,
    texture: Texture | any,
}

export class LoaderAssets {
    _textureLoader: TextureLoader = new TextureLoader()
    assets: Assets = {
        mapEnv: null,
        sky: null,
        sprite: null,
        soundAmbient: null,
        soundStepsMetal: null,
        soundBzink: null,
        soundDoor: null,
        soundFly: null,
        roadImg: null,
        lightMap: null,
        wallMap: null,
    }

    init () {}

    loadAssets (): Promise<void> {
        return new Promise(res => {

            const loadTexture = (key: keyof Assets, src: string) => {
                return new Promise<ResultLoad>(res => {
                    this._textureLoader.load(src, texture => {
                        res({ key, texture })
                    })
                })
            }

            const loadAudio = ( key: keyof Assets, src: string) => {
                return new Promise<ResultLoad>(res => {
                    const loader = new AudioLoader()
                    loader.load(src, buffer => {
                        res({ key, texture: buffer })
                    })
                })
            }

            const promises = [
                loadTexture('mapEnv', mapEnv),
                loadTexture('sky', sky),
                loadTexture('sprite', sprite),

                loadAudio('soundAmbient', audioAmbient),
                loadAudio('soundStepsMetal', steps),
                loadAudio('soundBzink', audioBzink),
                loadAudio('soundDoor', audioDoor),
                loadAudio('soundFly', audioFly),
                
                loadTexture('roadImg', roadImg),
                loadTexture('lightMap', lightMap),
                loadTexture('wallMap', wallTile),
            ]

            Promise.all(promises).then(result => {
                for (let i = 0; i < result.length; ++i) {
                     this.assets[result[i].key as keyof Assets] = result[i].texture
                }
                res()
            })
        })
    }
}
