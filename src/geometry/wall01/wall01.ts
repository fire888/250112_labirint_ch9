import { Root } from '../../index';
import { IArrayForBuffers, ElemType, IDataForWall } from 'types/GeomTypes';
import { createPilaster00 } from 'geometry/pilaster00/pilastre00';
import { createPilaster01 } from 'geometry/pilaster01/pilaster01';
import { createPilaster02 } from 'geometry/pilaster02/pilaster02';
import { createPilaster03 } from 'geometry/pilaster03/pilaster03';
import { createPilaster04 } from 'geometry/pilaster04/pilaster04';
import { createPoias01 } from 'geometry/poias01/poias01';
import { createTopElem_00 } from 'geometry/topElem00/topElem_00';
import { _M, A2, A3 } from '../_m';
import { COLOR_BLUE_D } from 'constants/CONSTANTS';
import { tileMapWall } from "../tileMapWall"

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
    INNER_WALL_START_OFFSET: number,
    INNER_WALL_END_OFFSET: number,
}

const createFloor = (root: Root, floorData: ISingleFloorData, N_FLOOR: number): IArrayForBuffers => {
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []

    const BACK_WALL_START_OFFSET = 3 

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
        W_DOOR,
        INNER_WALL_START_OFFSET,
        INNER_WALL_END_OFFSET,
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
            const copryV = [...innerP.v]
            _M.rotateVerticesY(copryV, Math.PI)
            innerP.v.push(...copryV)
            _M.translateVertices(innerP.v, 
                SIDE_PILASTER_W + SINGLE_SECTION_W * (i + 1) + INNER_PILASTER_W * (i + .5), 
                0, 
                0
            )
            v.push(...innerP.v)
            uv.push(...innerP.uv)
            uv.push(...innerP.uv)
            c.push(...innerP.c)
            c.push(...innerP.c)
        }
    }

    // let H_POIAS_BOTTOM = 0.5 + Math.random()
    // if (N_FLOOR > 0) {
    //     H_POIAS_BOTTOM = 0.15 + Math.random() * 1
    // }
    // { // POIAS BOTTOM
    //    // calculate Breaks By DOORS 
    //     const breakPoiasParts = [] 
    //     let START_POIAS_X = SIDE_PILASTER_W
    //     for (let i = 0; i < N; ++i) {
    //         if (i === N_SECTION_DOOR && N_FLOOR === 0) { 
    //             const endX = 
    //                 SIDE_PILASTER_W + 
    //                 SINGLE_SECTION_W * (i) + 
    //                 INNER_PILASTER_W * (i) + 
    //                 SINGLE_SECTION_W * .5 - 
    //                 W_DOOR * .5

    //             breakPoiasParts.push({
    //                 startX: START_POIAS_X, 
    //                 endX,
    //             })
    //             START_POIAS_X = endX + W_DOOR
    //         }
    //     }   
    //     breakPoiasParts.push({
    //         startX: START_POIAS_X, 
    //         endX: w - SIDE_PILASTER_W,
    //     })

    //     // insert POIAS
    //     let constructorPoiasBottom = createPoias00
    //     let poiasD = d + .2
    //     if (N_FLOOR > 0) {
    //         constructorPoiasBottom = createPoias02
    //         poiasD = 0
    //     }

    //     for (let i = 0; i < breakPoiasParts.length; ++i) { 
    //         const poiasPart = constructorPoiasBottom(
    //             root, 
    //             breakPoiasParts[i].endX - breakPoiasParts[i].startX, 
    //             H_POIAS_BOTTOM, 
    //             poiasD,
    //         )
    //         _M.translateVertices(poiasPart.v, 
    //             breakPoiasParts[i].startX, 
    //             0, 
    //             0
    //         )
    //         v.push(...poiasPart.v)
    //         uv.push(...poiasPart.uv)
    //         c.push(...poiasPart.c)
    //     }
    // }

    return { v, uv, c }
}


export const wall01 = (
    root: Root, 
    dataForBuldWall: IDataForWall
): IArrayForBuffers => {
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []

    const { 
        w, 
        h, 
        d, 
        TYPE_SIDE_PILASTER, 
        H_TOP_POIAS, 
        TYPE_TOP_POIAS,
        SIDE_PILASTER_W,
        INNER_WALL_START_OFFSET,
        INNER_WALL_END_OFFSET,
    } = dataForBuldWall

    const W = Math.random() * 2 + 2
    const N = Math.floor(w / W)

    const WORK_WALL_W = w - SIDE_PILASTER_W * 2

    const INNER_PILASTER_W = 0.5 + Math.random() * 0.5
    const COUNT_INNER_PILASTERS = N - 1
    const FULL_W_INNER_PILASTERS = INNER_PILASTER_W * COUNT_INNER_PILASTERS

    const FULL_SECTIONS_W = WORK_WALL_W - FULL_W_INNER_PILASTERS
    const SINGLE_SECTION_W = FULL_SECTIONS_W / N

    const N_SECTION_DOOR = SINGLE_SECTION_W < 2 ? 500 :Math.floor(Math.random() * N)
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
        INNER_WALL_START_OFFSET,
        INNER_WALL_END_OFFSET,
    }

    // TOP POIAS
    {
        let topPoiasConstructor = null
        if (TYPE_TOP_POIAS === ElemType.POIAS_01) {
            topPoiasConstructor = createPoias01
        }
        if (topPoiasConstructor) {
            const topPoias = topPoiasConstructor(root, w, H_TOP_POIAS, d + .2)

            const copyV = [...topPoias.v]
            _M.rotateVerticesY(copyV, Math.PI)
            _M.translateVertices(copyV, w, 0, 0)
            topPoias.v.push(...copyV) 
            _M.translateVertices(topPoias.v, 0, h - H_TOP_POIAS, 0)
            v.push(...topPoias.v)
            uv.push(...topPoias.uv)
            uv.push(...topPoias.uv)
            c.push(...topPoias.c)
            c.push(...topPoias.c)
        } else {
            console.log('NO TOP POIAS CONSTRUCTOR')
        }
    }


    // FILL VERY SHORT SECTION 
    if (N === 0) {
        return { v, uv, c }
    }

    if (N > 0) {
        let currentH_Level = 0
        let i = 0

        while (currentH_Level < h - H_TOP_POIAS) {
            
            let floorH = 2.2 + Math.random() * 3

            if (h - H_TOP_POIAS - currentH_Level - floorH < 3) {
                floorH = h - H_TOP_POIAS - currentH_Level
            }
            if (i === 0 && floorH < 3) { // remove door
                floorData.N_SECTION_DOOR = 500
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
            const copyV = [...leftP.v]
            _M.rotateVerticesY(copyV, Math.PI)
            //v.push(...copyV)
            leftP.v.push(...copyV)

            _M.translateVertices(leftP.v, SIDE_PILASTER_W * .5, 0, 0)
            v.push(...leftP.v)

            uv.push(...leftP.uv)
            c.push(...leftP.c)


            uv.push(...leftP.uv)
            c.push(...leftP.c)

            // const rightP = constrPilaster(root, SIDE_PILASTER_W, h - H_TOP_POIAS, .3)
            // _M.translateVertices(rightP.v, w - SIDE_PILASTER_W * .5, 0, 0)
            // v.push(...rightP.v)
            // uv.push(...rightP.uv)
            // c.push(...rightP.c)
        }
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

    return { v, uv, c }
}
