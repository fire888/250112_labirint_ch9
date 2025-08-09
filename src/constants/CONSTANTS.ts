import { _M, A3 } from "../geometry/_m"
import * as THREE from 'three'

const PHISICS_CONF = {
    IS_DEBUG: false
}

const PLAYER_START_POS_BIG_LEVEL: number[] = [30, .7, -200]
const PLAYER_START_POS_SMALL_LEVEL: number[] = [30, .7, -50]

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

export const IS_DEV_START_ORBIT = false

export const INNER_HOUSE_FORCE: number = 0
export const OUTER_HOUSE_FORCE: number = 1.5