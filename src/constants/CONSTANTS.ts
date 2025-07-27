import { _M, A3 } from "../geometry/_m"

const PHISICS_CONF = {
    IS_DEBUG: false
}

const PLAYER_START_POS: number[] = [30, 3, -50]

export const CONSTANTS = {
    PHISICS_CONF, 
    PLAYER_START_POS,
}

export const COLOR_WINDOW_INNER_D: A3 = [.25, .25, .5]
export const COLOR_WHITE: A3 = _M.hexToNormalizedRGB('222222') 
export const COLOR_BLUE_L: A3 = _M.hexToNormalizedRGB('5f6569') 
export const COLOR_BLUE: A3 = _M.hexToNormalizedRGB('555f67') 
export const COLOR_BLUE_D: A3 = _M.hexToNormalizedRGB('5d6c77') 
export const COLOR_DARK: A3 = _M.hexToNormalizedRGB('000000') 
export const COLOR_DARK_INTERIOR: A3 = _M.hexToNormalizedRGB('000000') 
