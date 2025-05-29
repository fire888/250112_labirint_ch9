import { Root } from "index"
import { createWall_01, createAngleWall_01 } from "geometry/wall01"
import { createWall_01_door_window, IWallData_01_door_window  } from "geometry/wall01_door_window";
import { createWall_02, createAngleWall_02 } from 'geometry/wall02_down'
import { createWall_03, createAngleWall_03 } from "geometry/wall03";
import { createCurb00 } from "geometry/bevel00/curb00";
import { tileMapWall } from "geometry/tileMapWall";
import { _M } from "geometry/_m";
import { ElemType } from 'types/GeomTypes'

import { createDoor_00 } from "geometry/door00/door00";
import { createWindow00 } from "geometry/window00/window00";
import { createHole00 } from "geometry/hole00/hole00";
import { createTopElem_00 } from "geometry/topElem/topElem_00";
import { createArea00 } from "geometry/area00/area00";


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
        const r = createWall_03(W, H)
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
        const area = createArea00([[-2, 5], [0, 5], [5, -5], [-5, -5]], [.5, .5, 1], tileMapWall.break)           
        _M.translateVertices(area.v, 100, 1, -10)
        v.push(...area.v)
        c.push(...area.c)
        uv.push(...area.uv)
    }

    {



        const windows = []
        const pilasters = []

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
                            h: .8,
                            d: .05,
                            offsetY: 0,
                            offsetX: 0,
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


    const m = _M.createMesh({ 
        v,
        uv,
        c, 
        material: root.materials.walls00,
    })
    root.studio.add(m)
}