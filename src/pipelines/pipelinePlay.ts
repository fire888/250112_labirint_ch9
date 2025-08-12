import { Root } from '../index'
import * as THREE from 'three'

const LEVELS = [
    {
        percentCompleteEnergy: .2,
        //percentCompleteEnergy: .001,
    }
]

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
    } = root

    // antigrav activity **********************************/
    let isNormalGravity = true
    const camPos = new THREE.Vector2(root.studio.camera.position.x, root.studio.camera.position.z)
    ticker.on((t: number) => {
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
        // audio.playEnergy()
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
        
        phisics.onCollision(antigravLast.nameSpaceTrigger, (name: string) => {
            controls.disableMove()
            phisics.removeMeshFromCollision(name)
            phisics.switchToGravityGorizontalBoost()
            ui.toggleVisibleEnergy(false) 

            const unsubscribe = ticker.on(() => {
                if (studio.camera.position.z > 300) {
                    unsubscribe()
                    nextStepResolve()
                }
            })
        })
    })

    const waitLevelComplete = () => new Promise((resolve) => {
        // @ts-ignore:next-line
        nextStepResolve = resolve
    })

    await waitLevelComplete()
}
