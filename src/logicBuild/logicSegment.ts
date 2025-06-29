import { SegmentType } from "../types/GeomTypes";
import { _M } from "geometry/_m";

export const checkTypeSegment = (perimeter: [number, number][]) => {
    let isWallShort = false
    for (let i = 1; i < perimeter.length; ++i) {
        const cur = perimeter[i]
        const prev = perimeter[i - 1]
        if (_M.dist(prev, cur) < 1.3) {
            isWallShort = true
            break
        }
    }

    const angles = []
    for (let i = 0; i < perimeter.length; ++i) {
        const cur = perimeter[i]
        const prev = perimeter[i - 1] ? perimeter[i - 1] : perimeter[perimeter.length - 1]
        const angle = _M.angleFromCoords(cur[0] - prev[0], cur[1] - prev[1])
        angles.push(angle)
    }

    let isSmallAngle = false
    for (let i = 0; i < angles.length; ++i) {
        const prev = angles[i - 1] ? angles[i - 1] : angles[angles.length - 1]
        const cur = angles[i]
        if (Math.abs(cur - prev) < Math.PI * .03) {
            isSmallAngle = true 
            break
        }
    }

    let type = SegmentType.HOUSE_00
    if (Math.random() < .2) {
        type = SegmentType.HOUSE_01
    }
    // if (isSmallAngle || isWallShort) { 
    //     type = SegmentType.AREA_00
    // }

    return type
}