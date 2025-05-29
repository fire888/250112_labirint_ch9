export enum ElemType {
    WINDOW_00 = 'WINDOW_00',
    DOOR_00 = 'DOOR_00',
    PILASTER_00 = 'PILASTER_00',
    POIAS_00 = 'POIAS_00',
}

export interface IHoleData {
    elemType?: ElemType,
    offsetX?: number,
    offsetY?: number,
    w: number,
    h: number,
    d: number,
} 

export interface IHoleEgesData extends IHoleData {
    width: number,
    height: number
}

export type IFloorData = {
    windows?: IHoleData[]
    doors?: IHoleData[]
    pilasters?: IHoleData[]
    poiases?: IHoleData[]
    w: number
    d: number
    h: number
}

export type IArrayForBuffers = {
    v: number[]
    uv: number[]
    c: number[]
    w?: number 
    h?: number
    d?: number 
}
