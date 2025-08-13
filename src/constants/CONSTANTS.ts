import { _M, A3 } from "../geometry/_m"
import { ILevelConf } from "types/GeomTypes"
import * as THREE from 'three'

// DEBUG FLAGS ************************************* / 
export const IS_DEV_START_ORBIT = false
// export const IS_DEV_START_ORBIT = true
const PHISICS_CONF = {
    IS_DEBUG: false
}

const PLAYER_START_POS_BIG_LEVEL: number[] = [-1, .7, -200]
const PLAYER_START_POS_SMALL_LEVEL: number[] = [-1, .7, -50]

export const CONSTANTS = {
    PHISICS_CONF, 
    PLAYER_START_POS_BIG_LEVEL,
    PLAYER_START_POS_SMALL_LEVEL,
}

export const COLOR_FOG_START = new THREE.Color().setHex(0x0e2535) 
export const COLOR_FOG_PLAY = new THREE.Color().setHex(0x2b2241) 

export const COLOR_WINDOW_INNER_D: A3 = [.25, .25, .5]
export const COLOR_WHITE: A3 = _M.hexToNormalizedRGB('222222') 
export const COLOR_BLUE_L: A3 = _M.hexToNormalizedRGB('5f6569') 
export const COLOR_BLUE: A3 = _M.hexToNormalizedRGB('555f67') 
export const COLOR_BLUE_D: A3 = _M.hexToNormalizedRGB('5d6c77') 
export const COLOR_DARK: A3 = _M.hexToNormalizedRGB('000000') 
export const COLOR_DARK_INTERIOR: A3 = _M.hexToNormalizedRGB('000000') 

export const INNER_HOUSE_FORCE: number = 0
export const OUTER_HOUSE_FORCE: number = 1.5

const PERCENT_ENERGY: number = 0.2

export const LEVELS: ILevelConf[] = [
    {
        playerStartPosition: [-1, -30],
        SX: 18,
        SY: 18,
        N: 3,
        repeats: [
            [-19, -15],           
            // [1, 0],                      
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
    {
        playerStartPosition: [-1, -30],
        SX: 20,
        SY: 40,
        N: 7,
        repeats: [
            [-21, -15],           
            [1, -15],                      
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
    {
        playerStartPosition: [-1, -200],
        SX: 150,
        SY: 150,
        N: 70,
        repeats: [
            [-151, -151],           
            [1, -151],           
            [1, 1],           
            [-151, 1],           
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },


        {
        playerStartPosition: [-1, -30],
        SX: 20,
        SY: 20,
        N: 7,
        repeats: [
            [-21, -15],           
            // [1, 0],                      
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
    {
        playerStartPosition: [-1, -30],
        SX: 20,
        SY: 40,
        N: 7,
        repeats: [
            [-21, -15],           
            [1, -15],                      
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
    {
        playerStartPosition: [-1, -200],
        SX: 150,
        SY: 150,
        N: 70,
        repeats: [
            [-151, -151],           
            [1, -151],           
            [1, 1],           
            [-151, 1],           
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },

        {
        playerStartPosition: [-1, -30],
        SX: 20,
        SY: 20,
        N: 7,
        repeats: [
            [-21, -15],           
            // [1, 0],                      
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
    {
        playerStartPosition: [-1, -30],
        SX: 20,
        SY: 40,
        N: 7,
        repeats: [
            [-21, -15],           
            [1, -15],                      
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
    {
        playerStartPosition: [-1, -200],
        SX: 150,
        SY: 150,
        N: 70,
        repeats: [
            [-151, -151],           
            [1, -151],           
            [1, 1],           
            [-151, 1],           
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },

        {
        playerStartPosition: [-1, -30],
        SX: 20,
        SY: 20,
        N: 7,
        repeats: [
            [-21, -15],           
            // [1, 0],                      
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
    {
        playerStartPosition: [-1, -30],
        SX: 20,
        SY: 40,
        N: 7,
        repeats: [
            [-21, -15],           
            [1, -15],                      
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
    {
        playerStartPosition: [-1, -200],
        SX: 150,
        SY: 150,
        N: 70,
        repeats: [
            [-151, -151],           
            [1, -151],           
            [1, 1],           
            [-151, 1],           
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },

        {
        playerStartPosition: [-1, -30],
        SX: 20,
        SY: 20,
        N: 7,
        repeats: [
            [-21, -15],           
            // [1, 0],                      
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
    {
        playerStartPosition: [-1, -30],
        SX: 20,
        SY: 40,
        N: 7,
        repeats: [
            [-21, -15],           
            [1, -15],                      
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
    {
        playerStartPosition: [-1, -200],
        SX: 150,
        SY: 150,
        N: 70,
        repeats: [
            [-151, -151],           
            [1, -151],           
            [1, 1],           
            [-151, 1],           
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },

        {
        playerStartPosition: [-1, -30],
        SX: 20,
        SY: 20,
        N: 7,
        repeats: [
            [-21, -15],           
            // [1, 0],                      
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
    {
        playerStartPosition: [-1, -30],
        SX: 20,
        SY: 40,
        N: 7,
        repeats: [
            [-21, -15],           
            [1, -15],                      
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
    {
        playerStartPosition: [-1, -200],
        SX: 150,
        SY: 150,
        N: 70,
        repeats: [
            [-151, -151],           
            [1, -151],           
            [1, 1],           
            [-151, 1],           
        ],
        positionTeleporter: [0, 0],
        percentCompleteEnergy: PERCENT_ENERGY,
    },
]