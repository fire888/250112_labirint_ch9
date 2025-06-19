import { SegmentType } from "../types/GeomTypes";
import { _M } from "geometry/_m";

export const checkTypeSegment = (perimeter: [number, number][]) => {
    let isHouse = true
    for (let i = 0; i < perimeter.length; ++i) {
        const cur = perimeter[i]
        const prev = perimeter[i - 1] ? perimeter[i - 1] : perimeter[perimeter.length - 1]
        const angle = _M.angleFromCoords(cur[0] - prev[0], cur[1] - prev[1])
        if (Math.abs(angle) < .3) {
            isHouse = false 
            break
        }
    }
    
    let type = SegmentType.AREA_00
    if (isHouse) type = SegmentType.HOUSE_00

    return type
}