import { Root } from '../index'
import * as THREE from 'three'
import { LEVELS, COLOR_FOG_PLAY } from '../constants/CONSTANTS'
import { pause } from 'helpers/htmlHelpers'

export const pipelinePlay = async (root: Root, currentIndexLevel = 0) => {
    const {
        phisics,
        energySystem,
        antigravSystem,
        antigravLast,
        ticker,
        ui,
        controls,
        studio,
        particles,
        lab,
        audio,
    } = root

    // antigrav activity **********************************/
    let isNormalGravity = true
    const camPos = new THREE.Vector2(root.studio.camera.position.x, root.studio.camera.position.z)
    
    let isEnabledAntigrav = true
    const unsubscribeAntgrav = ticker.on((t: number) => {
        if (!isEnabledAntigrav) {
            return
        }

        camPos.set(root.studio.camera.position.x, root.studio.camera.position.z)
        
        let isNear = false
        for (let i = 0; i < antigravSystem.pointsV2.length; ++i) {
            const p = antigravSystem.pointsV2[i]
            if (p.distanceTo(camPos) < 3) {
                isNear = true
                break
            }
        }

        if (isNear && isNormalGravity) {
            phisics.switchToAntiGravity()
            isNormalGravity = false
        } else if (!isNear && !isNormalGravity) {
            phisics.switchToGravity()
            isNormalGravity = true
        }
    })

    let nextStepResolve = () => {}

    // energy get *******************************************/
    let isFullEnergy = false
    phisics.onCollision(energySystem.nameSpace, (name: string) => {
        audio.playEnergy()
        energySystem.animateMovieHide(name)
        setTimeout(() => phisics.removeMeshFromCollision(name), 50)
        
        if (isFullEnergy) {
             return
        }
        
        const percentageItemsGetted = energySystem.getPercentageItemsGetted()
        const { percentCompleteEnergy } = LEVELS[currentIndexLevel]
        const multipyPercentage = Math.min(1., percentageItemsGetted / percentCompleteEnergy)
        ui.setEnergyLevel(multipyPercentage)        
        
        if (multipyPercentage < 1) {
             return;
        }
        
        isFullEnergy = true
        antigravLast.activate()
        const p = antigravLast.getPosition()
        particles.startForcreMovieAntigrav(p)
        
        // final fly
        phisics.onCollision(antigravLast.nameSpaceTrigger, (name: string) => {
            isEnabledAntigrav = false
            audio.playFly()
            antigravLast.removeStonesFromPhisics()
            phisics.removeMeshFromCollision(name)
            controls.disableMove()
            phisics.switchToGravityGorizontalBoost()
            ui.toggleVisibleEnergy(false)
            unsubscribeAntgrav()

            let isStarted = false 
            const unsubscribe = ticker.on(() => {
                if (studio.camera.position.z < 230) {
                    return;
                }
                if (isStarted) {
                    return
                }
                isStarted = true
                unsubscribe()
                ui.toggleVisibleDark(true)
                setTimeout(() => {
                    audio.stopFly()
                    nextStepResolve()
                }, 300)
            })
        })
    })

    const waitLevelComplete = () => new Promise((resolve) => {
        // @ts-ignore:next-line
        nextStepResolve = resolve
    })

    await waitLevelComplete()
    lab.clear()
    antigravSystem.destroy()
    antigravLast.destroy()
    energySystem.destroy()

    const currentIndexLevelNext = currentIndexLevel + 1
    
    if (LEVELS[currentIndexLevelNext] === undefined) {
        return
    }

    await pause(200)

    const levelData = LEVELS[currentIndexLevelNext]

    await lab.build(levelData)
    energySystem.init(root, lab.positionsEnergy)
    antigravSystem.init(root, lab.positionsAntigravs)
    antigravLast.init(root, new THREE.Vector3(
        levelData.positionTeleporter[0], 0, levelData.positionTeleporter[1]
    ))
    studio.setFogNearFar(.2, 1)
    studio.setFogColor(COLOR_FOG_PLAY)
    ui.toggleVisibleDark(false)
    particles.startFlyPlayerAround()
    phisics.stopPlayerBody()
    ui.setEnergyLevel(0)
    phisics.switchToGravity()

    const startPos = [levelData.playerStartPosition[0], .7, levelData.playerStartPosition[1]]
    await studio.cameraFlyToLevel(startPos)
    phisics.setPlayerPosition(...startPos)
    studio.animateFogTo(levelData.fogFar, levelData.fogColor, 4000)
    controls.enableMove()
    ui.toggleVisibleEnergy(true)
    
    await pipelinePlay(root, currentIndexLevelNext)
}
