import { Root } from "index"
import { createWall_01, createAngleWall_01 } from "geometry/wall01"
import { createWall_01_door_window, IWallData_01_door_window  } from "geometry/wall01_door_window";
import { createWall_02, createAngleWall_02 } from 'geometry/wall02_down'
import { createWall_03, createAngleWall_03 } from "geometry/wall03";

import { tileMapWall } from "geometry/tileMapWall";
import { _M } from "geometry/_m";
import { ElemType, IHoleData } from 'types/GeomTypes'

import { createDoor_00 } from "geometry/door00/door00";
import { createWindow00 } from "geometry/window00/window00";
import { createHole00 } from "geometry/hole00/hole00";
import { createTopElem_00 } from "geometry/topElem/topElem_00";
import { createArea00 } from "geometry/area00/area00";
import { createCurb00 } from "geometry/bevel00/curb00";
import { createPilaster00 } from "geometry/pilaster00/pilastre00";
import { createPilaster01 } from "geometry/pilaster01/pilaster01";
import { createPilaster02 } from "geometry/pilaster02/pilaster02";
import { createPilaster03 } from "geometry/pilaster03/pilaster03";
import { createPilaster04 } from "geometry/pilaster04/pilaster04";
import { createPoias00 } from "geometry/poias00/poias00";
import { createPoias01 } from "geometry/poias01/poias01";
import { createColumn00 } from "geometry/column00/column00";

import { COLOR_BLUE } from "constants/CONSTANTS";


export const createExamplesAllWalls = (root: Root) => {
    const v = []
    const uv = []
    const c = []

    const label = _M.createLabel('H: 7 метров', [1, 1, 1], 5)
    label.position.set(0, 7, -10)
    root.studio.add(label)

    const W = 10
    const H = 7
    const Z = -10
    
    {        

        const r = createWall_01(W, H)
        _M.translateVertices(r.v, 0, 0, Z)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)

        {
            const r = createAngleWall_01([0, 0, -10], -Math.PI / 2, 0, H)
            v.push(...r.v)
            c.push(...r.c)
            uv.push(...r.uv)
        }
    }

    {        
        const r = createWall_03(root, W, H)
        _M.translateVertices(r.v, 12, 0, Z)
        v.push(...r.v)
        uv.push(...r.uv)
        c.push(...r.c)

        {
            const r = createAngleWall_03([12, 0, -10], -Math.PI / 2, 0, H)
            v.push(...r.v)
            c.push(...r.c)
            uv.push(...r.uv)
        }
    }

    {
        const X = 24
        const Z = -10
        const r = createWall_02(W, H)
        _M.translateVertices(r.v, X, 0, Z)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }

    // curb
    {
        const X = 36
        const Z = -10
        const D = -2
        const r = createCurb00([X, Z], [X + W, Z], [X + W, Z + D], [X, Z + D], tileMapWall.noiseLong, 1, 1)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }

    // curb triangle 1
    {
        const X = 48
        const Z = -10
        const D = -2
        const W = 3
        const r = createCurb00([X + W * .5, Z], [X + W * .5, Z], [X + W, Z + D], [X, Z + D], tileMapWall.noise, 1)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }

    // curb triangle 2
    {
        const X = 50
        const Z = -10
        const D = -2
        const W = 3
        const r = createCurb00([X, Z], [X + W, Z], [X + W * .5, Z + D], [X + W * .5, Z + D], tileMapWall.noise, 1)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }

    // door
    {
        const door = createDoor_00(root, { w: 1, h: 4, d: .3, offsetX: 0, offsetY: 0 })
        _M.translateVertices(door.v, 60, 0, -10)
        v.push(...door.v)
        c.push(...door.c)
        uv.push(...door.uv) 
    }

    // window 
    {
        const window = createWindow00(root, { w: 1, h: 2, d: .3, offsetX: 0, offsetY: 0 })        
        _M.translateVertices(window.v, 70, 0, -10)
        v.push(...window.v)
        c.push(...window.c)
        uv.push(...window.uv)
    }

    // hole 
    {
        const hole = createHole00(root, { w: 1, h: 2, d: .3, offsetX: 0, offsetY: 1, width: 2, height: 4 })        
        _M.translateVertices(hole.v, 80, 0, -10)
        v.push(...hole.v)
        c.push(...hole.c)
        uv.push(...hole.uv)
    }

    // top elem 
    {
        const topElem = createTopElem_00([.3, .3, 1])
        _M.translateVertices(topElem.v, 90, 0, -10)
        v.push(...topElem.v)
        c.push(...topElem.c)
        uv.push(...topElem.uv)
    }

    // area00 
    {
        const area = createArea00([[-2, 5], [0, 5], [5, -5], [-5, -5], [-2, 5]], COLOR_BLUE, tileMapWall.stoneTree)           
        _M.translateVertices(area.v, 100, 1, -10)
        v.push(...area.v)
        c.push(...area.c)
        uv.push(...area.uv)
    }

    // pilastre00
    {
        const pilaster00 = createPilaster00(root, 5, 5, 1)
        _M.translateVertices(pilaster00.v, 110, 0, -10)
        v.push(...pilaster00.v)
        c.push(...pilaster00.c)        
        uv.push(...pilaster00.uv) 
        root.studio.addAxisHelper(110, 0, -10, 1)
        root.studio.addAxisHelper(110, 5, -10, 1)
        root.studio.addAxisHelper(110, 0, -9, 1)
        root.studio.addAxisHelper(109, 0, -10, 1)
    }

    // pilaster01 
    {
        const pilaster01 = createPilaster01(root, .7, 5, 1)
        _M.translateVertices(pilaster01.v, 115, 0, -10)
        v.push(...pilaster01.v)
        c.push(...pilaster01.c)        
        uv.push(...pilaster01.uv) 
        root.studio.addAxisHelper(115, 0, -10, 5)
        root.studio.addAxisHelper(115, 5, -10, 5)
        root.studio.addAxisHelper(115, 0, -9, 5)
    }

    // pilaster02
    {
        const pilaster02 = createPilaster02(root, .7, 5, 1)
        _M.translateVertices(pilaster02.v, 117, 0, -10)
        v.push(...pilaster02.v)
        c.push(...pilaster02.c)        
        uv.push(...pilaster02.uv) 
        root.studio.addAxisHelper(117, 0, -10, 5)
        root.studio.addAxisHelper(117, 5, -10, 5)
        root.studio.addAxisHelper(116.65, 0, -9, 5)
    }
    // pilaster03
    {
        const pilaster03 = createPilaster03(root, .7, 5, 1)
        _M.translateVertices(pilaster03.v, 118, 0, -15)
        v.push(...pilaster03.v)
        c.push(...pilaster03.c)        
        uv.push(...pilaster03.uv)
    }
    // pilaster04
    {
        const pilaster04 = createPilaster04(root, .7, 5, 1)
        _M.translateVertices(pilaster04.v, 119, 0, -10)
        v.push(...pilaster04.v)
        c.push(...pilaster04.c)        
        uv.push(...pilaster04.uv)
        root.studio.addAxisHelper(119, 0, -10, 5)
        root.studio.addAxisHelper(119, 5, -10, 5)
        root.studio.addAxisHelper(118.65, 0, -9, 5)
    }

    // poias00 
    {
        const poias00 = createPoias00(root, 2.5, 2, 0)
        _M.translateVertices(poias00.v, 120, 0, -10)
        v.push(...poias00.v)
        c.push(...poias00.c)        
        uv.push(...poias00.uv)
        root.studio.addAxisHelper(120, 0, -10, 5)
        root.studio.addAxisHelper(120, 2, -10, 5)
    }
    // poias01 
    {
        const poias01 = createPoias01(root, 2.5, 2, .2)
        _M.translateVertices(poias01.v, 125, 0, -10)
        v.push(...poias01.v)
        c.push(...poias01.c)        
        uv.push(...poias01.uv)
        root.studio.addAxisHelper(125, 0, -10, 5)
        root.studio.addAxisHelper(125, 2, -10, 5)
        root.studio.addAxisHelper(125, 2, -9.7, 5)
    }

    // column 00
    {
        const col = createColumn00(root, .21, 5)
        _M.translateVertices(col.v, 130, 0, -10)
        v.push(...col.v)
        c.push(...col.c)        
        uv.push(...col.uv)
    }

    // wall 01 door window - WINDOW
    {
        const windows: IHoleData[] = []
        const pilasters: IHoleData[] = []

        const w = 20
        const n = 5
        const step = w / (n)
        const windowW = step * .3

        for (let i = 0; i < n; ++i) {
            windows.push({
                elemType: ElemType.WINDOW_00,
                w: windowW,
                h: 2,
                d: .3,
                offsetX: step * (i + .5),
                offsetY: 2,
            })
            if (i !== n - 1) {
                pilasters.push({
                    elemType: ElemType.PILASTER_00,
                    w: 1,
                    h: 5,
                    d: .3,
                    offsetX: step * (i + 1),
                    offsetY: 0,
                })                    
            } 
        }

        const wall: IWallData_01_door_window = {
            w,
            h: 5,
            d: .3,
            floors: [
                {
                    h: 5,
                    d: .3,
                    w,
                    windows,
                    pilasters,
                    poiases: [
                       {
                            elemType: ElemType.POIAS_00,
                            w,
                            h: 1.1,
                            d: .1,
                            offsetY: 0,
                            offsetX: 0,
                            offsetZ: 0,
                        },
                                               {
                        elemType: ElemType.POIAS_01,
                            w,
                            h: 1.1,
                            d: .5,
                            offsetY: 5,
                            offsetX: 0,
                            offsetZ: 0,
                        }
                    ]
                },
            ]
        }

        const r = createWall_01_door_window(
            root,
            wall,            
        )
        _M.translateVertices(r.v, 0, 0, -20)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }

    // wall 01 door window - DOOR
    {
        const windows: IHoleData[] = []
        const doors: IHoleData[] = []
        const pilasters: IHoleData[] = []

        const w = 20
        const n = 5
        const step = w / (n)
        const windowW = step * .3

        for (let i = 0; i < n; ++i) {
            if (i !== 2) {
                windows.push({
                    elemType: ElemType.WINDOW_00,
                    w: windowW,
                    h: 2,
                    d: .3,
                    offsetX: step * (i + .5),
                    offsetY: 2,
                })
            } else {
                doors.push({
                    elemType: ElemType.DOOR_00,
                    w: windowW,
                    h: 4,
                    d: .3,
                    offsetX: step * (i + .5),
                    offsetY: 0,
                })
            }
            if (i !== n - 1) {
                pilasters.push({
                    elemType: ElemType.PILASTER_00,
                    w: 1,
                    h: 5,
                    d: .3,
                    offsetX: step * (i + 1),
                    offsetY: 0,
                })                    
            }
        }

        const r = createWall_01_door_window(
            root,
            {
                w,
                h: 5,
                d: .3,
                floors: [
                    {
                        h: 5.6,
                        d: .3,
                        w,
                        windows,
                        doors,
                        pilasters,
                        poiases: [
                            {
                                elemType: ElemType.POIAS_00,
                                w,
                                h: 1.1,
                                d: .1,
                                offsetX: 0,
                                offsetY: 0,
                                offsetZ: 0,
                            },
                            {                            
                                elemType: ElemType.POIAS_01,
                                w,
                                h: 1.1,
                                d: .4,
                                offsetX: 0,
                                offsetY: 5.6,
                                offsetZ: 0,
                            },
                        ]
                    },
                ]
            }
        )
        _M.translateVertices(r.v, 0, 0, -30)
        v.push(...r.v)
        c.push(...r.c)
        uv.push(...r.uv)
    }


    const m = _M.createMesh({ 
        v,
        uv,
        c, 
        material: root.materials.walls00,
    })
    root.studio.add(m)
}