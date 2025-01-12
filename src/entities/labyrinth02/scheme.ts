import { Voronoi } from "./rhill-voronoi-core";
import { Root } from "../../index";
import * as THREE from "three";
import { _M } from "../../geometry/_m";
var Offset = require('polygon-offset');

export const createScheme = (root: Root) => {

    const materialLine = new THREE.LineBasicMaterial({
        color: 0xffffff
    });


    const voronoi = new Voronoi();
    const S = 100
    const N = 100
    const bbox = {xl: 0, xr: S, yt: 0, yb: S }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
    const sites: { x: number, y: number }[] = []
    for (let i = 0; i < N; ++i) {
        sites.push({ x: Math.random() * S, y: Math.random() * S})
    }
    const diagram = voronoi.compute(sites, bbox);

    // draw edges
    //let 
    //edges = diagram.edges,
    //iEdge = edges.length

    // while (iEdge--) {
    //     const edge = edges[iEdge]
    //     const v1 = edge.va;
    //     const v2 = edge.vb;

    //     const points = [
    //         new THREE.Vector3( v1.x, 0, v1.y ),
    //         new THREE.Vector3( v2.x, 0, v2.y ),
    //     ]
    //     const geometry = new THREE.BufferGeometry().setFromPoints(points)
    //     const line = new THREE.Line(geometry, materialLine)
    //     root.studio.add(line)
    // }

    const arrAreas = []
    const arrOffsets = []

    for (let i = 0; i < diagram.cells.length; ++i) {
        const cell = diagram.cells[i]
        const halfedges = cell.halfedges
        const nHalfedges = halfedges.length

        if (nHalfedges <= 2) { 
            continue
        }

        const v = halfedges[0].getStartpoint()
        const pp = [{ x: v.x, y: v.y }] 
        for (let iHalfedge = 0; iHalfedge < nHalfedges; ++iHalfedge) {
            const v = halfedges[iHalfedge].getEndpoint()
            pp.push({ x: v.x, y: v.y })
        }

        arrAreas.push(pp)

        const ppp = pp.map(p => [p.x, p.y ])
        const offset = new Offset()
        var padding = offset.data(ppp).padding(1.5)

        if (!padding[0]) {
            console.log(padding)
            continue
        }

        arrOffsets.push(padding[0])

        const linePoints1 = []
        for (let i = 0; i < padding[0].length; ++i) {
            linePoints1.push(new THREE.Vector3(padding[0][i][0], 0, padding[0][i][1]))
        }
        const geometry1 = new THREE.BufferGeometry().setFromPoints(linePoints1)
        const line1 = new THREE.Line(geometry1, materialLine)
        root.studio.add(line1)
    }   

    return { arrAreas, arrOffsets }
}