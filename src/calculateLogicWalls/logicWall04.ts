import { Root } from '../index';
import { IFloorData, IWallData, IHoleData } from 'types/GeomTypes';
import { createPilaster00 } from 'geometry/pilaster00/pilastre00';
//import { createPilaster01 } from 'geometry/pilaster01/pilaster01';
import { createPilaster02 } from 'geometry/pilaster02/pilaster02';
import { createPilaster04 } from 'geometry/pilaster04/pilaster04';
import { createPoias00 } from 'geometry/poias00/poias00';
import { createPoias01 } from 'geometry/poias01/poias01';
import { createDoor00 } from 'geometry/door00/door00';
import { createWindow00 } from 'geometry/window00/window00';
import { createHole00 } from 'geometry/hole00/hole00';
import { _M } from 'geometry/_m';


export const calculateLogicWall04 = (
    root: Root, 
    w: number = 20, 
    h: number = 20, 
    d: number = .3, 
    offsetZ: number = 0
): IWallData => {
    const W = Math.random() * 2 + 2
    const N = Math.floor(w / W)

    const SIDE_PILASTER_W = 0.3 + Math.random() * 0.5

    const WORK_WALL_W = w - SIDE_PILASTER_W * 2

    const INNER_PILASTER_W = 0.5 + Math.random() * 0.5
    const COUNT_INNER_PILASTERS = N - 1
    const FULL_W_INNER_PILASTERS = INNER_PILASTER_W * COUNT_INNER_PILASTERS

    const FULL_SECTIONS_W = WORK_WALL_W - FULL_W_INNER_PILASTERS
    const SINGLE_SECTION_W = FULL_SECTIONS_W / N

    const N_SECTION_DOOR = Math.floor(Math.random() * N)
    const W_DOOR = Math.min(SINGLE_SECTION_W - .6,  2 + Math.random() * 2)

    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []

    { // OUTER PILASTERS
        const leftP = createPilaster04(root, SIDE_PILASTER_W, h, .1)
        _M.translateVertices(leftP.v, SIDE_PILASTER_W * .5, 0, 0)
        v.push(...leftP.v)
        uv.push(...leftP.uv)
        c.push(...leftP.c)

        const rightP = createPilaster04(root, SIDE_PILASTER_W, h, .1)
        _M.translateVertices(rightP.v, w - SIDE_PILASTER_W * .5, 0, 0)
        v.push(...rightP.v)
        uv.push(...rightP.uv)
        c.push(...rightP.c)
    }

    { // INNER PILASTERS
        const r = Math.random() 
        let constr = null
        if (r < .33) {
            constr = createPilaster02
        } else if (r < .66) {
            constr = createPilaster04   
        } else {
            constr = createPilaster00    
        }
    
        for (let i = 0; i < COUNT_INNER_PILASTERS; i++) { 
            const innerP = constr(root, INNER_PILASTER_W, h, d + .25)
            _M.translateVertices(innerP.v, 
                SIDE_PILASTER_W + SINGLE_SECTION_W * (i + 1) + INNER_PILASTER_W * (i + .5), 
                0, 
                0
            )
            v.push(...innerP.v)
            uv.push(...innerP.uv)
            c.push(...innerP.c)
        }
    }

    const H_POIAS_BOTTOM = 0.5 + Math.random()
    { // POIAS BOTTOM

       // calculate Breaks By DOORS 
       const breakPoiasParts = [] 
       let START_POIAS_X = SIDE_PILASTER_W
       for (let i = 0; i < N; ++i) {
            if (i === N_SECTION_DOOR) { 

                const endX = 
                    SIDE_PILASTER_W + 
                    SINGLE_SECTION_W * (i) + 
                    INNER_PILASTER_W * (i) + 
                    SINGLE_SECTION_W * .5 - 
                    W_DOOR * .5

                breakPoiasParts.push({
                    startX: START_POIAS_X, 
                    endX,
                })
                START_POIAS_X = endX + W_DOOR
            }
       }   
       breakPoiasParts.push({
            startX: START_POIAS_X, 
            endX: w - SIDE_PILASTER_W,
        })

        // insert POIAS
        for (let i = 0; i < breakPoiasParts.length; ++i) { 
            const poiasPart = createPoias00(
                root, 
                breakPoiasParts[i].endX - breakPoiasParts[i].startX, 
                H_POIAS_BOTTOM, 
                d + .2
            )
            _M.translateVertices(poiasPart.v, 
                breakPoiasParts[i].startX, 
                0, 
                0
            )
            v.push(...poiasPart.v)
            uv.push(...poiasPart.uv)
            c.push(...poiasPart.c)
        }
    }

    // DRAW DOOR
    const H_DOOR = Math.min(h - 1.5, 1.8 + Math.random() * 2)
    {
        const door = createDoor00(root, {
            w: W_DOOR,
            h: H_DOOR,  
            d: d + .2,
        })
        _M.translateVertices(
            door.v, 
            SIDE_PILASTER_W + 
            N_SECTION_DOOR * SINGLE_SECTION_W + 
            N_SECTION_DOOR * INNER_PILASTER_W + 
            SINGLE_SECTION_W * .5, 
            0, 
            0
        )
        v.push(...door.v)
        uv.push(...door.uv)
        c.push(...door.c)

        // HOLE DOOR
        const holeDoor = createHole00(root, {
            w: W_DOOR,
            h: H_DOOR,  
            d: d + .2,
            offsetY: 0,
            offsetX: 0,
            width: SINGLE_SECTION_W,
            height: h - H_POIAS_BOTTOM,
        })
        _M.translateVertices(
            holeDoor.v, 
            SIDE_PILASTER_W + 
            N_SECTION_DOOR * SINGLE_SECTION_W + 
            N_SECTION_DOOR * INNER_PILASTER_W + 
            SINGLE_SECTION_W * .5, 
            H_POIAS_BOTTOM, 
            0
        )
        v.push(...holeDoor.v)
        uv.push(...holeDoor.uv)     
        c.push(...holeDoor.c)
    }

    // DRAW WINDOWS 
    {
        const wWindow = Math.min(SINGLE_SECTION_W - .6, 1 + Math.random() * 1.5)
        const hWindow = Math.min(h - H_POIAS_BOTTOM - .5, 1. + Math.random() * 2)
        const bottomOffsetY = Math.random() * (h - H_POIAS_BOTTOM - hWindow - 0.4) + .2
        for (let i = 0; i < N; ++i) {
            if (i === N_SECTION_DOOR) { 
                continue // пропускаем место двери
            }
            const window = createWindow00(root, {
                w: wWindow,
                h: hWindow,
                d,
            })
            _M.translateVertices(
                window.v, 
                SIDE_PILASTER_W +   
                i * SINGLE_SECTION_W + 
                i * INNER_PILASTER_W + 
                SINGLE_SECTION_W * .5, 
                H_POIAS_BOTTOM + bottomOffsetY, 
                0
            )
            v.push(...window.v)
            uv.push(...window.uv)
            c.push(...window.c)
        }

        // DRAW HOLE WINDOWS
        for (let i = 0; i < N; ++i) {
            if (i === N_SECTION_DOOR) { 
                continue // пропускаем место двери
            }
            const holeWindow = createHole00(root, {
                w: wWindow,
                h: hWindow,
                d,
                offsetY: bottomOffsetY,
                offsetX: 0,
                width: SINGLE_SECTION_W,
                height: h - H_POIAS_BOTTOM,
            })
            _M.translateVertices(
                holeWindow.v, 
                SIDE_PILASTER_W +   
                i * SINGLE_SECTION_W + 
                i * INNER_PILASTER_W + 
                SINGLE_SECTION_W * .5, 
                H_POIAS_BOTTOM, 
                0
            )
            v.push(...holeWindow.v)
            uv.push(...holeWindow.uv)     
            c.push(...holeWindow.c)
        }
    }



    const H_TOP_POIAS = 0.4 + Math.random()

    // TOP POIAS
    {
        const topPoias = createPoias01(root, w, H_TOP_POIAS, d + .2)
        _M.translateVertices(topPoias.v, 0, h, 0)
        v.push(...topPoias.v)
        uv.push(...topPoias.uv)
        c.push(...topPoias.c)
    }

    _M.translateVertices(v, 0, 0, -40 - offsetZ)

    const m = _M.createMesh({ 
        v, 
        uv,
        c,
        material: root.materials.walls00,
    })
    root.studio.add(m)

    return {
        w,
        h,
        d,
        floors: [],
    }
}
