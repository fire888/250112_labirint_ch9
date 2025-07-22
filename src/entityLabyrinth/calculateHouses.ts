import { IArea, IArrayForBuffers, SegmentType } from "types/GeomTypes";
import { buildHouse00 } from "./buildHouse00/buildHouse00"
import { buildHouse01 } from "./buildHouse01/buildHouse01"

export const calculateHouses = (areasData: IArea[]): IArrayForBuffers[] => {
    const houses: IArrayForBuffers[] = []

    for (let i = 0; i < areasData.length; ++i) {
        if (areasData[i].typeSegment === SegmentType.HOUSE_00) {
            //const houseData: IArrayForBuffers = buildHouse00(this._root, areasData[i].perimeterInner)
            const houseData: IArrayForBuffers = buildHouse00(areasData[i].perimeterInner)
            houses.push(houseData) 
        }
        if (areasData[i].typeSegment === SegmentType.HOUSE_01) {
            //const houseData: IArrayForBuffers = buildHouse01(this._root, areasData[i].perimeterInner)
            const houseData: IArrayForBuffers = buildHouse01(areasData[i].perimeterInner)
            houses.push(houseData)                    
        }
    }

    return houses
}