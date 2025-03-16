import { createWall_02, createAngleWall_02 } from './wall02_down'
import { _M } from './_m'
import { tileMapWall } from "./tileMapWall";

const H = -Math.random() * 5 -.2 
const h = .1
const hG = -.2
const FLOOR_H = H - 2 + .3


const COLOR_PERIM = _M.hexToNormalizedRGB('1c1937')



export const createWall_02_full_profile = (
    prev_O_X: number,
    prev_O_Z: number,
    prev_I_X: number,
    prev_I_Z: number,
    cur_O_X: number,
    cur_O_Z: number,
    cur_I_X: number,
    cur_I_Z: number,
    center: [number, number],
    H: number,
    FLOOR_H: number,
) => {
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []

    if (prev_I_X === cur_I_X && prev_I_Z === cur_I_Z) {

        // если лежит то значит вертикальной стенки нет 
        // и надо залить пол и борбюр не четврехугольником а треугольником
        
        /** top */
        v.push( 
            prev_O_X, h, prev_O_Z,
            cur_O_X, h, cur_O_Z,  
            cur_I_X, h, cur_I_Z, 
        )
        uv.push(...tileMapWall.noiseTree)
        c.push(
            ...COLOR_PERIM,
            ...COLOR_PERIM,
            ...COLOR_PERIM,
        )

        /** floor */
        v.push(
            prev_O_X, FLOOR_H, prev_O_Z,
            cur_O_X, FLOOR_H, cur_O_Z,
            center[0], FLOOR_H, center[1],
        )
        uv.push(...tileMapWall.breakManyTree)
        c.push(...COLOR_PERIM)
        c.push(...COLOR_PERIM)
        c.push(...COLOR_PERIM)

        return { v, uv, c }

    }

    const angle = _M.angleFromCoords(cur_I_X - prev_I_X, cur_I_Z - prev_I_Z)
    const d = _M.dist([prev_I_X, prev_I_Z], [cur_I_X, cur_I_Z])
    
    const r = createWall_02(d, H)
    _M.rotateVerticesY(r.v, -angle + Math.PI)
    _M.translateVertices(r.v, cur_I_X, hG, cur_I_Z)
    v.push(...r.v)
    uv.push(...r.uv)
    c.push(...r.c)

    /** top */
    v.push(..._M.createPolygon(
        [prev_I_X, h, prev_I_Z], 
        [prev_O_X, h, prev_O_Z],
        [cur_O_X, h, cur_O_Z],  
        [cur_I_X, h, cur_I_Z], 

    ))
    uv.push(...tileMapWall.noiseLong)
    c.push(..._M.fillColorFace(COLOR_PERIM))

    /** outer */
    v.push(..._M.createPolygon( 
        [prev_O_X, h, prev_O_Z],
        [prev_O_X, 0, prev_O_Z],
        [cur_O_X, 0, cur_O_Z],  
        [cur_O_X, h, cur_O_Z], 

    ))
    uv.push(...tileMapWall.noiseLong)
    c.push(..._M.fillColorFace(COLOR_PERIM))

    /** inner */
    v.push(..._M.createPolygon( 
        [prev_I_X, hG, prev_I_Z],
        [prev_I_X, h, prev_I_Z],
        [cur_I_X, h, cur_I_Z],  
        [cur_I_X, hG, cur_I_Z], 

    ))
    uv.push(...tileMapWall.noiseLong)
    c.push(..._M.fillColorFace(COLOR_PERIM))

    /** fill floor */
    v.push(
        prev_O_X, FLOOR_H, prev_O_Z,
        cur_O_X, FLOOR_H, cur_O_Z,
        center[0], FLOOR_H, center[1],
    )
    uv.push(...tileMapWall.breakManyTree)
    c.push(...COLOR_PERIM)
    c.push(...COLOR_PERIM)
    c.push(...COLOR_PERIM)
    

    return { v, uv, c }

}