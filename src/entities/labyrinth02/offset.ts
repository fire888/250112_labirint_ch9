import { _M } from "geometry/_m" 
import {
    checkIntersection,
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
        const cr = points[i]
        existsLines.push([pr[0], pr[1], cr[0], cr[1]])

        if (i === points.length - 1) {
            const pr = points[i]
            const cr = points[0]
            if (pr[0] !== cr[0] || pr[1] !== cr[1]) {
                existsLines.push([pr[0], pr[1], cr[0], cr[1]])
            }
        }
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
    let isSckpPoint = false
    let pointPrev = null
    for (let i = 0; i < innerLines.length; ++i) {
        if (isSckpPoint) {
            intercepts.push(pointPrev)
            isSckpPoint = false
            continue;
        }
        const prev = innerLines[i - 1] ? innerLines[i - 1] : innerLines[innerLines.length - 1]
        const curr = innerLines[i]
        const next = innerLines[i + 1] ? innerLines[i + 1] : innerLines[0]

        const intersect = checkIntersection(...prev, ...curr)
        /* @ts-ignore */
        const int1 = intersect.point ? [intersect.point.x, intersect.point.y] : null

        //const int2: any = null 
        let intersect2 = checkIntersection(...prev, ...next)
        /* @ts-ignore */
        let int2 = intersect2.point ? [intersect2.point.x, intersect2.point.y] : null
        if (innerLines.length === 3) {
            int2 = null
        }

        /* @ts-ignore */
        if (!int1 && !int2) {
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
                int2 = intersect2.point ? [intersect2.point.x, intersect2.point.y] : null
                /* @ts-ignore */
                isIntercept2 = !!intersect2.point
                offset++
            }
        }

        let pointToInsert = int1
        let isPoint2 = false
        if (int1 && int2) {
            const d = Math.sqrt((int1[0] - cX) **2 + (int1[1] - cY) **2)
            const d2 = Math.sqrt((int2[0] - cX) **2 + (int2[1] - cY) **2)
            isPoint2 = d2 < d
        }
        if (!int1 && int2) {
            isPoint2 = true
        }
        if (isPoint2) {
            pointToInsert = int2
            isSckpPoint = true
            pointPrev = int2
        }
        intercepts.push(pointToInsert)
    }

    const innerLinesTrimmed: [number, number, number, number][] = []
    for (let i = 1; i < intercepts.length; ++i) {
        const prev = intercepts[i - 1]        
        const curr = intercepts[i] 
        if (prev && curr) innerLinesTrimmed.push([prev[0], prev[1], curr[0], curr[1]])
        if (i === intercepts.length - 1) {
            const prev = intercepts[i]        
            const curr = intercepts[0] 
            if (prev && curr) innerLinesTrimmed.push([prev[0], prev[1], curr[0], curr[1]])
        }
    }

    return { offsetLines: innerLinesTrimmed, existsLines, centerX: cX, centerY: cY }
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
    const existsLines: [number, number, number, number][] = []
    for (let i = 1; i < points.length; ++i) {
        const pr = points[i - 1]
        const cr = points[i]
        existsLines.push([pr[0], pr[1], cr[0], cr[1]])

        if (i === points.length - 1) {
            const pr = points[i]
            const cr = points[0]
            if (pr[0] !== cr[0] || pr[1] !== cr[1]) {
                existsLines.push([pr[0], pr[1], cr[0], cr[1]])
            }
        }
    }

    // /** draw exist lines */
    // for (let i = 0; i < existsLines.length; ++i) {
    //     const l = existsLines[i]
    //     const lp = _M.createLine([[l[0], l[1]], [l[2], l[3]]], [1, 0, 0])
    //     lp.position.y = -1 - (i * .1)
    //     root.studio.add(lp)
    //     // await _M.waitClickNext()
    // }


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


    // /** draw inners lines */
    for (let i = 0; i < innerLines.length; ++i) {
        const l = innerLines[i]
        const lp = _M.createLine([[l[0], l[1]], [l[2], l[3]]], [1, .5, 0])
        lp.position.y = -1 - (i * .1)
        root.studio.add(lp)
        // await _M.waitClickNext()
    }

        


    const intercepts = []
    let isSckpPoint = false
    let pointPrev = null
    for (let i = 0; i < innerLines.length; ++i) {
        if (isSckpPoint) {
            intercepts.push(pointPrev)
            isSckpPoint = false
            continue;
        }
        const prev = innerLines[i - 1] ? innerLines[i - 1] : innerLines[innerLines.length - 1]
        const curr = innerLines[i]
        const next = innerLines[i + 1] ? innerLines[i + 1] : innerLines[0]

        /** тестово рисуем линию чтоб понимать где она */
        // const lp = _M.createLine([[prev[0], prev[1]], [prev[2], prev[3]]], [1, 1, 1])
        // lp.position.y = -1
        // root.studio.add(lp)


        const intersect = checkIntersection(...prev, ...curr)
        /* @ts-ignore */
        const int1 = intersect.point ? [intersect.point.x, intersect.point.y] : null

        //const int2: any = null 
        let intersect2 = checkIntersection(...prev, ...next)
        /* @ts-ignore */
        let int2 = intersect2.point ? [intersect2.point.x, intersect2.point.y] : null
        if (innerLines.length === 4) {
            int2 = null
        }


        /* @ts-ignore */
        if (!int1 && !int2) {
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
                int2 = intersect2.point ? [intersect2.point.x, intersect2.point.y] : null
                /* @ts-ignore */
                isIntercept2 = !!intersect2.point
                offset++
            }
        }

        let pointToInsert = int1
        let isPoint2 = false
        if (int1 && int2) {
            const d = Math.sqrt((int1[0] - cX) **2 + (int1[1] - cY) **2)
            const d2 = Math.sqrt((int2[0] - cX) **2 + (int2[1] - cY) **2)
            isPoint2 = d2 < d

            // {
            //     const l1 = _M.createLabel('p1_' + i, [1, 1, 1], 7)
            //     l1.position.x = int1[0]
            //     l1.position.y = 1 + i * .5 
            //     l1.position.z = int1[1]
            //     root.studio.add(l1)
            // }
            // {
            //     const l1 = _M.createLabel('p2_' + i, [1, 1, 1], 7)
            //     l1.position.x = int2[0]
            //     l1.position.y = 1 + i * .5 
            //     l1.position.z = int2[1]
            //     root.studio.add(l1)
            // }    

        }
        if (!int1 && int2) {
            isPoint2 = true
        }
        if (isPoint2) {
            pointToInsert = int2
            isSckpPoint = true
            pointPrev = int2
        }
        intercepts.push(pointToInsert)

        // /** draw label int1 */
        // if (pointToInsert) {
        //     const l = _M.createLabel('.' + i, [1, .5, 0], 7)
        //     l.position.x = pointToInsert[0]
        //     l.position.y = 1
        //     l.position.z = pointToInsert[1]
        //     root.studio.add(l)
        //    // await _M.waitClickNext()
        // }


    }

    const innerLinesTrimmed: [number, number, number, number][] = []
    for (let i = 1; i < intercepts.length; ++i) {
        const prev = intercepts[i - 1]        
        const curr = intercepts[i] 
        if (prev && curr) innerLinesTrimmed.push([prev[0], prev[1], curr[0], curr[1]])
        if (i === intercepts.length - 1) {
            const prev = intercepts[i]        
            const curr = intercepts[0] 
            if (prev && curr) innerLinesTrimmed.push([prev[0], prev[1], curr[0], curr[1]])
        }
    }


    // /** draw lines trimmed inner */
    // for (let i = 0; i < innerLinesTrimmed.length; ++i) {
    //     // const l = innerLinesTrimmed[i]
    //     // const lp = _M.createLine([[l[0], l[1]], [l[2], l[3]]], [1, 1, 1])
    //     // const y = 1 + i
    //     // lp.position.y = y
    //     // root.studio.add(lp)

    //     // {
    //     //     const l1 = _M.createLabel('.' + i, [1, 1, 1], 7)
    //     //     l1.position.x = l[0]
    //     //     l1.position.y = y
    //     //     l1.position.z = l[1]
    //     //     root.studio.add(l1)
    //     // }
    //     // {
    //     //     const l1 = _M.createLabel('.' + i, [1, 1, 1], 7)
    //     //     l1.position.x = l[2]
    //     //     l1.position.y = y
    //     //     l1.position.z = l[3]
    //     //     root.studio.add(l1)
    //     // }      

    //     //await _M.waitClickNext()
    // }

        


    // for (let i = 0; i < innerLinesTrimmed.length; ++i) {
    //     const oL = existsLines[i]
    //     const iL = innerLinesTrimmed[i]
    //     const v = _M.createPolygon(
    //         [iL[0], -1 - i * .2, iL[1]], 
    //         [oL[0], -1 - i * .2, oL[1]], 
    //         [oL[2], -1 - i * .2, oL[3]], 
    //         [iL[2], -1 - i * .2, iL[3]], 
    //     )
    //     const m = _M.createMesh({ v })
    //     root.studio.add(m)
    //     //await _M.waitClickNext()
    // }

    return { offsetLines: innerLinesTrimmed, existsLines, centerX: cX, centerY: cY }
} 
