const D = .25

export const tileMapWall = {
    'noise': [
        0, 0,
        1 * D, 0,
        1 * D, 1 * D,
        0, 0,
        1 * D, 1 * D,
        0, 1 * D,
    ],
    'noiseTree': [
        0, 0,
        1 * D, 0,
        .5 * D, 1 * D,
    ],
    'noiseLong': [
        0, 1 * D,
        1 * D, 1 * D,
        1 * D, 2 * D,
        0, 1 * D,
        1 * D, 2 * D,
        0, 2 * D,
    ],
    'break': [
        1 * D, 0,
        2 * D, 0,
        2 * D, 1 * D,
        1 * D, 0,
        2 * D, 1 * D,
        1 * D, 1 * D,
    ],
    'breakManyTree': [
        1 * D, 1 * D,
        2 * D, 1 * D,
        1.5 * D, 2 * D,
    ],
    'lines': [
        1 * D, 2 * D,
        2 * D, 2 * D,
        2 * D, 3 * D,
        1 * D, 2 * D,
        2 * D, 3 * D,
        1 * D, 3 * D,
    ],
    'white': [
        D * 3.7, D * 3.7, 
        D * 4, D * 3.7, 
        D * 4, D * 4, 
        D * 3.7, D * 3.7, 
        D * 4, D * 4, 
        D * 3.7, D * 4, 
    ],
} 