import { _M } from "geometry/_m" 
import {
    checkIntersection,
    colinearPointWithinSegment,
    IntersectionCheckResult
  } from 'line-intersect';


export const offset = (points: [number, number][], d: number): [number, number, number?, number?][] => {
    const lines: [number, number, number, number][] = []

    let cX = 0
    let cY = 0
    for (let i = 0; i < points.length; ++i) {
        cX += points[i][0]
        cY += points[i][1]
    }
    cX /= points.length
    cY /= points.length



    for (let i = 1; i < points.length; ++i) {
        const pr = points[i - 1]
        const cr = points[i]

        const dx = cr[0] - pr[0]
        const dy = cr[1] - pr[1]

        let angle = _M.angleFromCoords(dx, dy)
        angle -= Math.PI * .5

        const xNewPR = pr[0] + d * Math.cos(angle)
        const yNewPR = pr[1] + d * Math.sin(angle)
        const xNewCR = cr[0] + d * Math.cos(angle)
        const yNewCR = cr[1] + d * Math.sin(angle)

        lines.push([xNewPR, yNewPR, xNewCR, yNewCR])
    }

    const intercepts = []
    for (let i = 0; i < lines.length; ++i) {
        const prev = i === 0 
            ? lines[lines.length - 1] 
            : lines[i - 1]
        const curr = lines[i]
        const next = lines[(i + 1) % lines.length]

        const intersect = checkIntersection(...prev, ...curr)
        const intersect2 = checkIntersection(...prev, ...next)

        /* @ts-ignore */
        if (!intersect.point) {
            intercepts.push(null)
        } else {
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
        }
    }

    const offsetLines: [number, number, number?, number?][] = []
    for (let i = 0; i < intercepts.length; ++i) {
        const prev = i === 0        
            ? intercepts[intercepts.length - 1] 
            : intercepts[i - 1]
        const curr = intercepts[i]
        if (prev && curr) {
            /* @ts-ignore */  
            offsetLines.push([prev.point.x, prev.point.y, curr.point.x, curr.point.y])
        } else {
            if (prev) {
                /* @ts-ignore */  
                offsetLines.push([prev.point.x, prev.point.y])
            } 
            if (curr) {
                /* @ts-ignore */  
                offsetLines.push([curr.point.x, curr.point.y])
            }
        }
    }

    //console.log('!!!! lines:', lines)
    //console.log('!!!! intercepts:', offsetLines)

    return offsetLines
} 