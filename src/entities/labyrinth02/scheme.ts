import { Voronoi } from "./rhill-voronoi-core";
import { Root } from "../../index";
import * as THREE from "three";
import { _M } from "../../geometry/_m"; 
var Offset = require('polygon-offset');

export const createScheme = (root: Root) => {
    const voronoi = new Voronoi();
    //const S = 100
    const SX = 100
    const SY = 100
    const N = 50
    const bbox = { xl: 0, xr: SX, yt: 0, yb: SY }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
    const sites: { x: number, y: number }[] = []
    const RN = 10 
    for (let i = 0; i < N; ++i) {
       sites.push({ x: Math.random() * SX, y: Math.random() * SY })
    }
    // const START = SX / RN * .5
    // for (let i = 0; i < RN; ++i) {
    //     sites.push({ x: SX / (RN) * i + START, y: SY * .5 + Math.random() * 10 - 5})
    // }

    const diagram = voronoi.compute(sites, bbox);

    /** draw edges */
    // let 
    // edges = diagram.edges,
    // iEdge = edges.length
    // const matLine = new THREE.LineBasicMaterial( {
    //     color: 0xffffff,
    //     alphaToCoverage: true,
    // } );
    // while (iEdge--) {
    //     const edge = edges[iEdge]
    //     const v1 = edge.va;
    //     const v2 = edge.vb;

    //     const points = [
    //         new THREE.Vector3( v1.x, 1, v1.y ),
    //         new THREE.Vector3( v2.x, 1, v2.y ),
    //     ]
    //     const geometry = new THREE.BufferGeometry().setFromPoints(points)
    //     const line = new THREE.Line(geometry, matLine)
    //     line.position.y = .05
    //     root.studio.add(line)
    // }

    const arr: {
        area: [number, number][],
        offset: [number, number][]
    }[] = []

    for (let i = 0; i < diagram.cells.length; ++i) {
        const cell = diagram.cells[i]
        const halfedges = cell.halfedges
        const nHalfedges = halfedges.length

        if (nHalfedges <= 2) { 
            console.log('not Show: ')
            console.log('!!!', cell)
            continue;
        }


        if (nHalfedges <= 2) { 
            continue
        }

        const v = halfedges[0].getStartpoint()
        const points: [number, number][] = [[v.x, v.y]]
        for (let iHalfedge = 0; iHalfedge < nHalfedges; ++iHalfedge) {
            const v = halfedges[iHalfedge].getEndpoint()
            points.push([v.x, v.y])
        }

        const offset = new Offset()
        const padding = offset.data(points).padding(1.5)

        arr.push({
            area: points,
            offset: padding[0] || null
        })
    }   

    return arr
}