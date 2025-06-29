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
export const COLOR_WHITE: A3 = _M.hexToNormalizedRGB('444444') 
export const COLOR_BLUE_L: A3 = _M.hexToNormalizedRGB('a6b8ba') 
export const COLOR_BLUE: A3 = _M.hexToNormalizedRGB('848e96') 
export const COLOR_BLUE_D: A3 = _M.hexToNormalizedRGB('5d6c77') 
export const COLOR_DARK: A3 = _M.hexToNormalizedRGB('040407') 
