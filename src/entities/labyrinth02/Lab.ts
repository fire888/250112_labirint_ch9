import { Voronoi } from "./rhill-voronoi-core";
import { Root } from "../../index";
import * as THREE from "three";

export class Lab {
    constructor() {}
    async init (root: Root, params = {}) {
        const voronoi = new Voronoi();
        const S = 200
        const N = 20
        const bbox = {xl: 0, xr: S, yt: 0, yb: S }; // xl is x-left, xr is x-right, yt is y-top, and yb is y-bottom
        const sites: { x: number, y: number }[] = []
        for (let i = 0; i < N; ++i) {
            sites.push({ x: Math.random() * S, y: Math.random() * S})
        }
        
        //const sites = [ {x: 50, y: 50}, {x: 80, y: 30}, {x: 120, y: 100} /* , ... */ ];
        
        // a 'vertex' is an object exhibiting 'x' and 'y' properties. The
        // Voronoi object will add a unique 'voronoiId' property to all
        // sites. The 'voronoiId' can be used as a key to lookup the associated cell
        // in diagram.cells.
        
        const diagram = voronoi.compute(sites, bbox);

        console.log('>>>>', diagram)

        //console.log(diagram.edges[0].va.x)

        // edges
        //ctx.beginPath();
        //ctx.strokeStyle = '#000';

        const material = new THREE.LineBasicMaterial({
            color: 0xffffff
        });
        
        //const line = new THREE.Line( geometry, material );
        //scene.add( line );

        let 
        edges = diagram.edges,
        iEdge = edges.length

        console.log('TTTTT', edges)
        while (iEdge--) {
            console.log(iEdge)
            const edge = edges[iEdge]
            const v1 = edge.va;
            const v2 = edge.vb;

            const points = [
                new THREE.Vector3( v1.x, 0, v1.y ),
                new THREE.Vector3( v2.x, 0, v2.y ),
            ]
            const geometry = new THREE.BufferGeometry().setFromPoints(points)
            const line = new THREE.Line(geometry, material)
            root.studio.add(line)
            //ctx.moveTo(v.x,v.y);
            //ctx.lineTo(v.x,v.y);
        }
        // ctx.stroke();
        // edges






    }
}

/*
        var ctx = this.canvas.getContext('2d');
        // background
        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.rect(0,0,this.canvas.width,this.canvas.height);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#888';
        ctx.stroke();
        // voronoi
        if (!this.diagram) {return;}
        // edges
        ctx.beginPath();
        ctx.strokeStyle = '#000';
        var edges = this.diagram.edges,
            iEdge = edges.length,
            edge, v;
        while (iEdge--) {
            edge = edges[iEdge];
            v = edge.va;
            ctx.moveTo(v.x,v.y);
            v = edge.vb;
            ctx.lineTo(v.x,v.y);
            }
        ctx.stroke();
        // edges
        ctx.beginPath();
        ctx.fillStyle = 'red';
        var vertices = this.diagram.vertices,
            iVertex = vertices.length;
        while (iVertex--) {
            v = vertices[iVertex];
            ctx.rect(v.x-1,v.y-1,3,3);
            }
        ctx.fill();
        // sites
        ctx.beginPath();
        ctx.fillStyle = '#44f';
        var sites = this.sites,
            iSite = sites.length;
        while (iSite--) {
            v = sites[iSite];
            ctx.rect(v.x-2/3,v.y-2/3,2,2);
            }
        ctx.fill();
        },
*/