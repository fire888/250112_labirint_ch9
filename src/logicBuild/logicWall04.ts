import { Root } from '../index';
import { IFloorData, IWallData, IHoleData, IArrayForBuffers, ElemType, IDataForWall } from 'types/GeomTypes';
import { createPilaster00 } from 'geometry/pilaster00/pilastre00';
import { createPilaster01 } from 'geometry/pilaster01/pilaster01';
import { createPilaster02 } from 'geometry/pilaster02/pilaster02';
import { createPilaster03 } from 'geometry/pilaster03/pilaster03';
import { createPilaster04 } from 'geometry/pilaster04/pilaster04';
import { createPoias00 } from 'geometry/poias00/poias00';
import { createPoias01 } from 'geometry/poias01/poias01';
import { createPoias02 } from 'geometry/poias02/poias02';
import { createDoor00 } from 'geometry/door00/door00';
import { createWindow00 } from 'geometry/window00/window00';
import { createHole00 } from 'geometry/hole00/hole00';
import { createTopElem_00 } from 'geometry/topElem00/topElem_00';
import { _M } from 'geometry/_m';
import { COLOR_BLUE_D, COLOR_DARK } from 'constants/CONSTANTS';

type ISingleFloorData = {
    w: number,
    h: number, 
    d: number,
    N: number,
    SIDE_PILASTER_W: number,
    WORK_WALL_W: number,
    INNER_PILASTER_W: number,
    COUNT_INNER_PILASTERS: number,
    FULL_W_INNER_PILASTERS: number,
    FULL_SECTIONS_W: number,
    SINGLE_SECTION_W: number,
    N_SECTION_DOOR: number,
    W_DOOR: number,
}

const createFloor = (root: Root, floorData: ISingleFloorData, N_FLOOR: number): IArrayForBuffers => {
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []

    const { 
        w, 
        h, 
        d, 
        N,
        SIDE_PILASTER_W, 
        WORK_WALL_W, 
        INNER_PILASTER_W, 
        COUNT_INNER_PILASTERS, 
        FULL_W_INNER_PILASTERS, 
        FULL_SECTIONS_W, 
        SINGLE_SECTION_W, 
        N_SECTION_DOOR, 
        W_DOOR 
    } = floorData
    
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

    let H_POIAS_BOTTOM = 0.5 + Math.random()
    if (N_FLOOR > 0) {
        H_POIAS_BOTTOM = 0.15 + Math.random() * 1
    }
    { // POIAS BOTTOM

       // calculate Breaks By DOORS 
        const breakPoiasParts = [] 
        let START_POIAS_X = SIDE_PILASTER_W
        for (let i = 0; i < N; ++i) {
            if (i === N_SECTION_DOOR && N_FLOOR === 0) { 
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
        let constructorPoiasBottom = createPoias00
        let poiasD = d + .2
        if (N_FLOOR > 0) {
            constructorPoiasBottom = createPoias02
            poiasD = 0
        }

        for (let i = 0; i < breakPoiasParts.length; ++i) { 
            const poiasPart = constructorPoiasBottom(
                root, 
                breakPoiasParts[i].endX - breakPoiasParts[i].startX, 
                H_POIAS_BOTTOM, 
                poiasD,
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
    if (N_FLOOR === 0) {
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
    }


    // DRAW WINDOWS 
    {
        const wWindow = Math.min(SINGLE_SECTION_W - .6, 1 + Math.random() * 1.5)
        const hWindow = Math.min(h - H_POIAS_BOTTOM - .5, 1. + Math.random() * 2)
        const bottomOffsetY = Math.random() * (h - H_POIAS_BOTTOM - hWindow - 0.4) + .2
        for (let i = 0; i < N; ++i) {
            if (i === N_SECTION_DOOR && N_FLOOR === 0) {
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
            if (i === N_SECTION_DOOR && N_FLOOR === 0) {
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

    return { v, uv, c }
}


export const calculateLogicWall04 = (
    root: Root, 
    dataForBuldWall: IDataForWall
): IArrayForBuffers => {
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []


    /** CONSTANTS */
    const { w, h, d, TYPE_SIDE_PILASTER, H_TOP_POIAS } = dataForBuldWall

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

    const floorData: ISingleFloorData = {
        w,
        h, 
        d,
        N,
        SIDE_PILASTER_W,
        WORK_WALL_W,
        INNER_PILASTER_W,
        COUNT_INNER_PILASTERS,
        FULL_W_INNER_PILASTERS,
        FULL_SECTIONS_W,
        SINGLE_SECTION_W,
        N_SECTION_DOOR,
        W_DOOR,
    }

    if (N > 0) {
        let currentH_Level = 0
        let i = 0


        while (currentH_Level < h - H_TOP_POIAS) {
            
            let floorH = 2.2 + Math.random() * 3

            if (h - H_TOP_POIAS - currentH_Level - floorH < 3) {
                floorH = h - H_TOP_POIAS - currentH_Level
            }

            floorData.h = floorH
        
            const r = createFloor(root, floorData, i)
            _M.translateVertices(r.v, 0, currentH_Level, 0)

            for (let j = 0; j < r.v.length; ++j) {
                v.push(r.v[j])
            }
            for (let j = 0; j < r.uv.length; ++j) {
                uv.push(r.uv[j])
            }
            for (let j = 0; j < r.c.length; ++j) {
                c.push(r.c[j])
            }
            currentH_Level += floorH
            ++i
        }
    }


    { // OUTER PILASTERS

        let constrPilaster = null
        if (TYPE_SIDE_PILASTER === ElemType.PILASTER_00) {
            constrPilaster = createPilaster00
        } else if (TYPE_SIDE_PILASTER === ElemType.PILASTER_01) {
            constrPilaster = createPilaster01
        } else if (TYPE_SIDE_PILASTER === ElemType.PILASTER_02) {
            constrPilaster = createPilaster02
        } else if (TYPE_SIDE_PILASTER === ElemType.PILASTER_03) {
            constrPilaster = createPilaster03
        } else if (TYPE_SIDE_PILASTER === ElemType.PILASTER_04) {
            constrPilaster = createPilaster04
        }

        if (constrPilaster) {
            const leftP = constrPilaster(root, SIDE_PILASTER_W, h - H_TOP_POIAS, .3)
            _M.translateVertices(leftP.v, SIDE_PILASTER_W * .5, 0, 0)
            v.push(...leftP.v)
            uv.push(...leftP.uv)
            c.push(...leftP.c)

            const rightP = constrPilaster(root, SIDE_PILASTER_W, h - H_TOP_POIAS, .3)
            _M.translateVertices(rightP.v, w - SIDE_PILASTER_W * .5, 0, 0)
            v.push(...rightP.v)
            uv.push(...rightP.uv)
            c.push(...rightP.c)
        }
    }

    // TOP POIAS
    {
        const topPoias = createPoias01(root, w, H_TOP_POIAS, d + .2)
        _M.translateVertices(topPoias.v, 0, h - H_TOP_POIAS, 0)
        v.push(...topPoias.v)
        uv.push(...topPoias.uv)
        c.push(...topPoias.c)
    }

    // TOP ELEMS 
    {
        for (let i = 0; i < COUNT_INNER_PILASTERS; ++i) {
            const topElem = createTopElem_00(COLOR_BLUE_D, INNER_PILASTER_W, .9)
            _M.translateVertices(
                topElem.v, 
                SIDE_PILASTER_W + 
                ((1 + i) * SINGLE_SECTION_W) + 
                INNER_PILASTER_W * (i + .5), 
                h, 
                0
            )
            v.push(...topElem.v)
            uv.push(...topElem.uv)
            c.push(...topElem.c)
        }
    }

    // BACK PART
    {
        const b = _M.createPolygon(
            [w, 0, -d],
            [0, 0, -d],
            [0, h, -d],
            [w, h, -d],
        )
        v.push(...b)
        uv.push(
            ..._M.createUv([0, 0], [0, 0], [0, 0], [0, 0]),
        )
        c.push(..._M.fillColorFace(COLOR_DARK))
    }

    return { v, uv, c }
}
