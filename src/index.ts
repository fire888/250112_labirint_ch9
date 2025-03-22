import "./stylesheets/controls.css"
import { CONSTANTS } from "constants/CONSTANTS"
import { Studio } from "./entities/Studio"
import { ControlsSystem } from "./entities/controls/ControlsSystem"
import { Ticker } from "./entities/Ticker"
import { Floor } from "./entities/Floor"
import { Particles } from './entities/Particles'
import { LoaderAssets } from "./entities/Loader";
import { DeviceData } from "./entities/DeviceData"
import { Ui } from "./entities/Ui"
import { Phisics } from "./entities/Phisics"
import { Lab } from './entities/labyrinth02/Lab'
import { AudioManager } from "./entities/AudioManager"
import { Materials } from "./entities/Materials"

import { pipelineInit } from "./pipelines/pipelineInit"
import { pipelinePlay } from "./pipelines/pipelinePlay"
import { pipelineEnd } from "./pipelines/pipelineEnd"

export type Root = {
    CONSTANTS: typeof CONSTANTS,
    ticker: Ticker,
    studio: Studio,
    controls: ControlsSystem,
    floor: Floor,
    // smallTriangles: SmallTriangles,
    particles: Particles,
    loader: LoaderAssets,
    deviceData: DeviceData,
    ui: Ui,
    phisics: Phisics,
    lab: Lab,
    audio: AudioManager,
    materials: Materials,
}


window.addEventListener("DOMContentLoaded", async () => {
    // @ts-ignore:next-line
    console.log("branch:" + __GIT_CURRENT_BRANCH__ + ' commit:' + __HASH_COMMIT__)

    const root: Root = {
        CONSTANTS,
        ticker: new Ticker(),
        studio: new Studio(),
        controls: new ControlsSystem(),
        ui: new Ui(),
        floor: new Floor(),
        particles: new Particles(),
        loader: new LoaderAssets(),
        deviceData: new DeviceData(),
        phisics: new Phisics(),
        lab: new Lab(),
        audio: new AudioManager(),
        materials: new Materials(),
    }

    await pipelineInit(root)
    await pipelinePlay(root)
    //await pipelineEnd(root)
})
