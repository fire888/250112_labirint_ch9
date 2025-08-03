import { pause } from 'helpers/htmlHelpers'
import { Root } from '../index'
import { Tween, Interpolation, Easing, update } from '@tweenjs/tween.js'
import { COLOR_FOG_PLAY } from '../constants/CONSTANTS'

export const pipelineInit = async (root: Root) => {
    const {
        CONSTANTS,
        studio,
        controls,
        ui,
        ticker,
        floor,
        loader,
        phisics,
        lab,
        audio,
        materials,
        deviceData,
    } = root

    if (deviceData.isMobileDevice) {
        root.appData.isBigLevel = false
        root.appData.playerStartPosition = [...CONSTANTS.PLAYER_START_POS_SMALL_LEVEL]
    }

    loader.init()
    await loader.loadAssets()

    ticker.start()

    ticker.on((t: number) => {
        update()
    })

    materials.init(root)

    studio.init(root)
    //studio.addAxisHelper()
    ticker.on(studio.render.bind(studio))

    phisics.init(root)
    ticker.on(phisics.update.bind(phisics))
    phisics.createPlayerPhisicsBody(root.appData.playerStartPosition)

    floor.init(root)
    studio.add(floor.mesh)

    await lab.init(root)




    //studio.add(lab.mesh)

    //energySystem.init(root, lab.posesSleepEnds)

    // smallTriangles.init()
    // studio.add(smallTriangles.m)
    // smallTriangles.m.position.x = 3 * 5
    // smallTriangles.m.position.z = 3 * 5

    // particles.init(root)
    // ticker.on(particles.update.bind(particles))
    // studio.add(particles.m)

    //audio.init(root)
    //ticker.on(audio.update.bind(audio))

    //phisics.stopPlayerBody()
    ui.init(root)

    await ui.hideStartScreen()
    controls.init(root)
    ticker.on(controls.update.bind(controls))

    await pause(100)

    controls.disconnect()
    await studio.cameraFlyToLevel()
    phisics.setPlayerPosition(...root.appData.playerStartPosition)
    studio.animateFogTo(100, COLOR_FOG_PLAY, 4000)
    controls.connect()
    
    //await studio.cameraFlyToLevel()
    //controls.init(root)
    //controls.enablePointer()
    //controls.disconnect()
    //ticker.on(controls.update.bind(controls))

    //controls.connect()

    //audio.playAmbient()
}
