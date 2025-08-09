import { Root } from '../index'
import { pause } from '../helpers/htmlHelpers'
import * as THREE from 'three'

export const pipelinePlay = async (root: Root) => {
    const {
        phisics,
        energySystem,
        antigravSystem,
        ticker,
    } = root

    // energy get *******************************************/
    let isFullEnergy = false
    phisics.onCollision(energySystem.nameSpace, (name: string) => {

        // audio.playEnergy()
        energySystem.animateMovieHide(name)
        setTimeout(() => phisics.removeMeshFromCollision(name), 300)
        if (isFullEnergy) {
             return;
        }
        // const percentageItemsGetted = energySystem.getPercentageItemsGetted()
        // const multipyPercentage = Math.min(1., percentageItemsGetted / ENERGY_PERCENTAGE_MUST_GET)
        // if (multipyPercentage < 1) {
        //     return;
        // }
        // isFullEnergy = true
    })

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
    //     phisics.onCollision(antigravSystem.nameSpace, (name: string) => {

    //     // audio.playEnergy()
    //     energySystem.animateMovieHide(name)
    //     setTimeout(() => phisics.removeMeshFromCollision(name), 300)
    //     if (isFullEnergy) {
    //          return;
    //     }
    //     // const percentageItemsGetted = energySystem.getPercentageItemsGetted()
    //     // const multipyPercentage = Math.min(1., percentageItemsGetted / ENERGY_PERCENTAGE_MUST_GET)
    //     // if (multipyPercentage < 1) {
    //     //     return;
    //     // }
    //     // isFullEnergy = true
    // })

    await pause(10000000000000)
}
