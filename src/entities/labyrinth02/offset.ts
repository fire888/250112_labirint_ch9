import { _M } from "geometry/_m" 
import {
    checkIntersection,
    colinearPointWithinSegment,
    IntersectionCheckResult
} from 'line-intersect';
import { Root } from "index";


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

        // const lp = _M.createLine([pr, cr], [1, 0, 0])
        // lp.position.y = -1
        // root.studio.add(lp)
    }

    // find center
    let cX = 0
    let cY = 0
    for (let i = 0; i < points.length; ++i) {
        cX += points[i][0]
        cY += points[i][1]
    }
    cX /= points.length
    cY /= points.length


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

        // const lp = _M.createLine([[prev[0], prev[1]], [prev[2], prev[3]]], [1, 1, 1])
        // lp.position.y = -1
        // root.studio.add(lp)

        const curr = innerLines[i]
        const next = innerLines[i + 1] ? innerLines[i + 1] : innerLines[0]

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