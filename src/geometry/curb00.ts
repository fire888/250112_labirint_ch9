import { tileMapWall } from 'geometry/tileMapWall'
import { _M, A3 } from 'geometry/_m'

const COLOR_BLUE: A3 = _M.hexToNormalizedRGB('1a182d') 

export enum TYPE_TEXTURE {
    NOISE_LONG = "NOISE_LONG",
    STONE_LONG = "STONE_LONG",
}

export const createCurb00 = (
    frontStart: [number, number],
    frontEnd: [number, number],
    backEnd: [number, number],
    backStart: [number, number],
    typeTexture: TYPE_TEXTURE = TYPE_TEXTURE.NOISE_LONG,
    h: number = 0,
    repeatWidth: number = 100,
) => {
    const v: number[] = []
    const c: number[] = []
    const uv: number[] = []

    let isCollapseFront = false 
    if (frontStart[0] === frontEnd[0] && frontStart[1] === frontEnd[1]) {
        isCollapseFront = true
    }
    let isCollapseBack = false 
    if (backStart[0] === backEnd[0] && backStart[1] === backEnd[1]) {
        isCollapseBack = true
    }

    const dFront = _M.dist(frontStart, frontEnd)
    const n = Math.floor(dFront / repeatWidth) + 1
    const frontXStep = (frontEnd[0] - frontStart[0]) / n
    const frontZStep = (frontEnd[1] - frontStart[1]) / n
    const backXStep = (backEnd[0] - backStart[0]) / n
    const backZStep = (backEnd[1] - backStart[1]) / n
    /** top */
    if (isCollapseFront) {
                v.push(
            backStart[0], h, backStart[1],
            frontStart[0], h, frontStart[1],
            backEnd[0], h, backEnd[1],
        )
        if (typeTexture === TYPE_TEXTURE.NOISE_LONG) {
            uv.push(...tileMapWall.noiseTree)
        }
        c.push(
            ...COLOR_BLUE,
            ...COLOR_BLUE,
            ...COLOR_BLUE,
        )
    } if (isCollapseBack) {
        v.push(
            frontEnd[0], h, frontEnd[1],
            backStart[0], h, backStart[1],
            frontStart[0], h, frontStart[1],
        )
        if (typeTexture === TYPE_TEXTURE.NOISE_LONG) {
            uv.push(...tileMapWall.noiseTree)
        }
        c.push(
            ...COLOR_BLUE,
            ...COLOR_BLUE,
            ...COLOR_BLUE,
        )
    } else {
        for (let i = 0; i < n; ++i) {
            v.push(..._M.createPolygon(
                [backStart[0] + i * backXStep, h, backStart[1] + i * backZStep],
                [frontStart[0] + i * frontXStep, h, frontStart[1] + i * frontZStep],
                [frontStart[0] + (i + 1) * frontXStep, h, frontStart[1] + (i + 1) * frontZStep],
                [backStart[0] + (i + 1) * backXStep, h, backStart[1] + (i + 1) * backZStep],
            ))
            if (typeTexture === TYPE_TEXTURE.NOISE_LONG) {
                uv.push(...tileMapWall.noiseLong)
            }
            c.push(..._M.fillColorFace(COLOR_BLUE))
        }
    }


    if (h !== 0) {
        // front
        if (!isCollapseFront) {
            for (let i = 0; i < n; ++i) {
                v.push(..._M.createPolygon(
                    [frontStart[0] + i * frontXStep, h, frontStart[1] + i * frontZStep],
                    [frontStart[0] + i * frontXStep, 0, frontStart[1] + i * frontZStep],
                    [frontStart[0] + (i + 1) * frontXStep, 0, frontStart[1] + (i + 1) * frontZStep],
                    [frontStart[0] + (i + 1) * frontXStep, h, frontStart[1] + (i + 1) * frontZStep],
                ))
                if (typeTexture === TYPE_TEXTURE.NOISE_LONG) {
                    uv.push(...tileMapWall.noiseLong)
                }
                c.push(..._M.fillColorFace(COLOR_BLUE))
            }
        }

        // back
        if (!isCollapseBack) {
            for (let i = 0; i < n; ++i) {
                v.push(..._M.createPolygon(
                    [backStart[0] + (i + 1) * backXStep, h, backStart[1] + (i + 1) * backZStep],
                    [backStart[0] + (i + 1) * backXStep, 0, backStart[1] + (i + 1) * backZStep],
                    [backStart[0] + i * backXStep, 0, backStart[1] + i * backZStep],
                    [backStart[0] + i * backXStep, h, backStart[1] + i * backZStep],
                ))
                if (typeTexture === TYPE_TEXTURE.NOISE_LONG) {
                    uv.push(...tileMapWall.noiseLong)
                }
                c.push(..._M.fillColorFace(COLOR_BLUE))
            }
        }
    }
 
    return { v, c, uv }
}