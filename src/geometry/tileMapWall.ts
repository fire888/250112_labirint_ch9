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
    'break': [
        1 * D, 0,
        2 * D, 0,
        2 * D, 1 * D,
        1 * D, 0,
        2 * D, 1 * D,
        1 * D, 1 * D,
    ],
} 