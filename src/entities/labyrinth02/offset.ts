import { _M } from "geometry/_m" 
import {
    checkIntersection,
    colinearPointWithinSegment,
    IntersectionCheckResult
} from 'line-intersect';
import { Root } from "index";
import * as THREE from 'three'


export const offset = (points: [number, number][], d: number, root: Root): { 
    offsetLines: [number, number, number?, number?][], 
    existsLines: [number, number, number, number][],
    centerX: number, 
    centerY: number,
} => {
    const existsLines: [number, number, number, number][] = []
    for (let i = 1; i < points.length; ++i) {
        const pr = points[i - 1]
        const cr = i === points.length - 1 ? points[0] : points[i]
        existsLines.push([pr[0], pr[1], cr[0], cr[1]])

        const lp = _M.createLine([pr, cr], [1, 0, 0])
        lp.position.y = -1
        root.studio.add(lp)
    }

    const [ cX, cY ] = _M.center(points) 

    const innerLines: [number, number, number, number][] = []

    // create lines offset no trim
    for (let i = 0; i < existsLines.length; ++i) {
        let angle = _M.angleFromCoords(existsLines[i][0] - existsLines[i][2], existsLines[i][1] - existsLines[i][3])
        angle += Math.PI * .5

        const xNewPR = existsLines[i][0] + d * Math.cos(angle)
        const yNewPR = existsLines[i][1] + d * Math.sin(angle)
        const xNewCR = existsLines[i][2] + d * Math.cos(angle)
        const yNewCR = existsLines[i][3] + d * Math.sin(angle)

        innerLines.push([xNewPR, yNewPR, xNewCR, yNewCR])
    }

    const intercepts = []
    for (let i = 0; i < innerLines.length; ++i) {
        const prev = innerLines[i - 1] ? innerLines[i - 1] : innerLines[innerLines.length - 1]
        const curr = innerLines[i]
        const next = innerLines[i + 1] ? innerLines[i + 1] : innerLines[0]

        /** тестово рисуем линию чтоб понимать где она */
        const lp = _M.createLine([[prev[0], prev[1]], [prev[2], prev[3]]], [1, 1, 1])
        lp.position.y = -1
        root.studio.add(lp)


        const intersect = checkIntersection(...prev, ...curr)
        let intersect2 = checkIntersection(...prev, ...next)

        /* @ts-ignore */
        if (!intersect.point && !intersect2.point) {
            let isIntercept2 = false
            let offset = 2
            while (!isIntercept2 && offset < innerLines.length) {
                let ind = i - offset
                if (ind < 0) {
                    ind = innerLines.length + ind
                }
                const prevPrev = innerLines[ind]
                intersect2 = checkIntersection(...prevPrev, ...curr)
                /* @ts-ignore */
                isIntercept2 = !!intersect2.point
                offset++
            }
        }

        /* @ts-ignore */
        if (intersect.point) {
            /* @ts-ignore */
            if (intersect2.point) {
                const d = Math.sqrt(
                    /* @ts-ignore */    
                    (intersect.point.x - cX) **2 +
                    /* @ts-ignore */    
                    (intersect.point.y - cY) **2  
                )
                const d2 = Math.sqrt(
                    /* @ts-ignore */    
                    (intersect2.point.x - cX) **2 +
                    /* @ts-ignore */    
                    (intersect2.point.y - cY) **2  
                )
                if (d < d2) {
                    intercepts.push(intersect)
                } else {
                    intercepts.push(intersect2)
                }
            } else {
                intercepts.push(intersect)
            }
        } else {
            /* @ts-ignore */ 
            if (intersect2.point) {
                intercepts.push(intersect2)
            } else {
                intercepts.push(null)
            }
        }
    }

    const offsetLines: [number, number, number?, number?][] = []
    for (let i = 0; i < intercepts.length; ++i) {
        const prev = intercepts[i]        
        const curr = intercepts[i + 1] ? intercepts[i + 1] : intercepts[0] 
        if (prev && curr) {
            /* @ts-ignore */  
            offsetLines.push([prev.point.x, prev.point.y, curr.point.x, curr.point.y])
        } else {
            offsetLines.push(null)
        }
    }



    return { offsetLines, existsLines, centerX: cX, centerY: cY }
} 



// same function with async debug
export const offsetDebugAsync = async (points: [number, number][], d: number, root: Root): Promise<
{ 
    offsetLines: [number, number, number?, number?][], 
    existsLines: [number, number, number, number][],
    centerX: number, 
    centerY: number,
}
> => {
    console.log('data:', points, d)
    const existsLines: [number, number, number, number][] = []
    for (let i = 1; i < points.length; ++i) {
        const pr = points[i - 1]
        const cr = i === points.length - 1 ? points[0] : points[i]
        existsLines.push([pr[0], pr[1], cr[0], cr[1]])

        const lp = _M.createLine([pr, cr], [1, 0, 0])
        lp.position.y = .7
        root.studio.add(lp)
    }

    const [ cX, cY ] = _M.center(points) 

    const innerLines: [number, number, number, number][] = []

    // create lines offset no trim
    for (let i = 0; i < existsLines.length; ++i) {
        let angle = _M.angleFromCoords(existsLines[i][0] - existsLines[i][2], existsLines[i][1] - existsLines[i][3])
        angle += Math.PI * .5

        const xNewPR = existsLines[i][0] + d * Math.cos(angle)
        const yNewPR = existsLines[i][1] + d * Math.sin(angle)
        const xNewCR = existsLines[i][2] + d * Math.cos(angle)
        const yNewCR = existsLines[i][3] + d * Math.sin(angle)

        innerLines.push([xNewPR, yNewPR, xNewCR, yNewCR])
    }

    const intercepts = []
    for (let i = 0; i < innerLines.length; ++i) {
        const prev = innerLines[i - 1] ? innerLines[i - 1] : innerLines[innerLines.length - 1]
        const curr = innerLines[i]
        const next = innerLines[i + 1] ? innerLines[i + 1] : innerLines[0]

        /** тестово рисуем линию чтоб понимать где она */
        const lp = _M.createLine([[curr[0], curr[1]], [curr[2], curr[3]]], [1, 1, 1])
        lp.position.y = 1
        root.studio.add(lp)


        const intersect = checkIntersection(...prev, ...curr)

        root.studio.camera.lookAt(new THREE.Vector3(0, 0, 0))
        /* @ts-ignore */
        /** label */
        /* @ts-ignore */
        if (intersect.point) {
            /* @ts-ignore */
            const l = _M.createLabel(i + '', [1, 0, 1], 5)
            /* @ts-ignore */
            l.position.set(intersect.point.x, 1, intersect.point.y)
            root.studio.add(l)
            /* @ts-ignore */
            //root.studio.camera.position.x = intersect.point.x
            /* @ts-ignore */
            //root.studio.camera.lookAt(new THREE.Vector3(intersect.point.x, 0, intersect.point.y))
            await _M.waitClickNext('!! 1')
        }


        let intersect2 = null

        if (points.length > 2) {
            intersect2 = checkIntersection(...prev, ...next)
        }



        /* @ts-ignore */
        if (intersect2 && intersect2.point) {
            /* @ts-ignore */
            const l = _M.createLabel(i + 'n', [1, 0, 1], 5)
            /* @ts-ignore */
            l.position.set(intersect2.point.x, 1.5, intersect2.point.y)
            root.studio.add(l)
            /* @ts-ignore */
            /* @ts-ignore */
            //root.studio.camera.lookAt(new THREE.Vector3(intersect2.point.x, 0, intersect2.point.y))
            //alert('UUU')
            await _M.waitClickNext('!! 2')
        }




        /* @ts-ignore */
        if (!intersect.point && (!intersect2 && !intersect2.point)) {
            let isIntercept2 = false
            let offset = 2
            while (!isIntercept2 && offset < innerLines.length) {
                let ind = i - offset
                if (ind < 0) {
                    ind = innerLines.length + ind
                }
                const prevPrev = innerLines[ind]
                intersect2 = checkIntersection(...prevPrev, ...curr)
                /* @ts-ignore */
                isIntercept2 = !!intersect2.point
                offset++
            }
        }

        /* @ts-ignore */
        if (intersect.point) {
            /* @ts-ignore */
            if (intersect2 && intersect2.point) {
                const d = Math.sqrt(
                    /* @ts-ignore */    
                    (intersect.point.x - cX) **2 +
                    /* @ts-ignore */    
                    (intersect.point.y - cY) **2  
                )
                const d2 = Math.sqrt(
                    /* @ts-ignore */    
                    (intersect2.point.x - cX) **2 +
                    /* @ts-ignore */    
                    (intersect2.point.y - cY) **2  
                )
                if (d < d2) {
                    intercepts.push(intersect)
                } else {
                    intercepts.push(intersect2)
                }
            } else {
                intercepts.push(intersect)
            }
        } else {
            /* @ts-ignore */ 
            if (intersect2.point) {
                intercepts.push(intersect2)
            } else {
                intercepts.push(null)
            }
        }
    }

    const offsetLines: [number, number, number?, number?][] = []
    for (let i = 0; i < intercepts.length; ++i) {
        const prev = intercepts[i]        
        const curr = intercepts[i + 1] ? intercepts[i + 1] : intercepts[0] 
        if (prev && curr) {
            /* @ts-ignore */  
            offsetLines.push([prev.point.x, prev.point.y, curr.point.x, curr.point.y])
        } else {
            offsetLines.push(null)
        }
    }



    return { offsetLines, existsLines, centerX: cX, centerY: cY }
} 
