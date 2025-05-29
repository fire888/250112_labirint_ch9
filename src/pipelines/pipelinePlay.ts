import { Root } from '../index'
import { pause } from '../helpers/htmlHelpers'

let indexLevel = 0

export const pipelinePlay = async (root: Root) => {
    const {
        CONSTANTS,
        studio,
        controls,
        ui,
        phisics,
        lab,
        audio,
    } = root


    // energy get *******************************************/
    //let isFullEnergy = false
    //phisics.onCollision(energySystem.nameSpace, (name: string) => {
        // phisics.removeMeshFromCollision(name)
        // audio.playEnergy()
        // energySystem.animateMovieHide(name)
        // if (isFullEnergy) {
        //     return;
        // }
        // const percentageItemsGetted = energySystem.getPercentageItemsGetted()
        // const multipyPercentage = Math.min(1., percentageItemsGetted / ENERGY_PERCENTAGE_MUST_GET)
        // if (multipyPercentage < 1) {
        //     return;
        // }
        // isFullEnergy = true
    //})
}
