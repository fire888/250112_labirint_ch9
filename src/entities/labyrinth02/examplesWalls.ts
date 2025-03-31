import { Root } from "index"
import { createWall_01, createAngleWall_01 } from "geometry/wall01"
import { createWall_01_door } from "geometry/wall01_door";
import { createWall_02, createAngleWall_02 } from 'geometry/wall02_down'
import { createWall_03, createAngleWall_03 } from "geometry/wall03";
import { createCurb00 } from "geometry/curb00";
import { tileMapWall } from "geometry/tileMapWall";
import { createDoor_00 } from "geometry/door00";
import { _M } from "geometry/_m";

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


    {
        const r = createDoor_00(root)

        const m = _M.createMesh({ 
            v: r.v,
            uv: r.uv,
            c: r.c, 
            material: root.materials.walls00,
        })
        m.position.z = -15
        root.studio.add(m)
        //_M.translateVertices(r.v)
    }

    {
        const r = createWall_01_door(
            root, 
            15, 
            10, 
            { width: 1.5, height: 4, offsetLeft: 5, offsetBottom: 0, depth: .5 },            
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