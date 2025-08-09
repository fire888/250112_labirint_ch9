import { pause } from 'helpers/htmlHelpers'
import { Root } from '../index'
import { Tween, Interpolation, Easing, update } from '@tweenjs/tween.js'
import { COLOR_FOG_PLAY } from '../constants/CONSTANTS'
import { IS_DEV_START_ORBIT } from '../constants/CONSTANTS'

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
    
    if (!IS_DEV_START_ORBIT) {
        studio.setFogNearFar(.2, 1)
    }

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

    if (IS_DEV_START_ORBIT) {
        await ui.hideStartScreenForce()
    } else {
        await ui.hideStartScreen()
    }

    controls.init(root, IS_DEV_START_ORBIT)
    ticker.on(controls.update.bind(controls))

    await pause(100)

    if (!IS_DEV_START_ORBIT) {
        controls.disconnect()
        await studio.cameraFlyToLevel()
        phisics.setPlayerPosition(...root.appData.playerStartPosition)
        studio.animateFogTo(100, COLOR_FOG_PLAY, 4000)
        controls.connect()
    }

    //audio.playAmbient()
}
