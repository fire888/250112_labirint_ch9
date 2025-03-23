import { _M, A3 } from './_m'
import { tileMapWall } from './tileMapWall'

const PROFILE: [number, number][] = [
    [.25, 0],
    [.25, .2],
    [.22, .2],
    [.22, .3],
    [.24, .3],
    [.18, 1.3],
    [0, 1.4],
]

export const createTopElem_00 = (color: A3) => {
    const v: number[] = [] 
    const uv: number[] = [] 
    const c: number[] = []

    const r = _M.lathePath(PROFILE, 4, color, tileMapWall.noise)
    v.push(...r.v)
    c.push(...r.c)
    uv.push(...r.uv)
    
    return { v, c, uv }
}