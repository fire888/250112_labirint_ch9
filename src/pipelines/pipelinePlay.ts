import { Root } from '../index'
import { pause } from '../helpers/htmlHelpers'

export const pipelinePlay = async (root: Root) => {
    const {
        phisics,
        energySystem
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

    await pause(10000000000000)



}
