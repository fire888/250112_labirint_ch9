export enum ElemType {
    WINDOW_00 = 'WINDOW_00',
    DOOR_00 = 'DOOR_00',
    PILASTER_00 = 'PILASTER_00',
    PILASTER_01 = 'PILASTER_01',
    PILASTER_02 = 'PILASTER_02',
    PILASTER_03 = 'PILASTER_03',
    PILASTER_04 = 'PILASTER_04',
    POIAS_00 = 'POIAS_00',
    POIAS_01 = 'POIAS_01',
}

export interface IHoleData {
    elemType?: ElemType,
    offsetX?: number,
    offsetY?: number,
    offsetZ?: number,
    w: number,
    h: number,
    d: number,
} 

export interface IHoleEgesData extends IHoleData {
    width: number,
    height: number,
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

// TODO: REMOVE
export type IWallData = {
    w: number,
    h: number,
    d: number,
    floors: IFloorData[],
}

export type IDataForWall = {
    w: number,
    h: number,
    d: number,
    H_TOP_POIAS: number,
    TYPE_SIDE_PILASTER: ElemType,
}

export type IArrayForBuffers = {
    v: number[]
    uv: number[]
    c: number[]
    w?: number 
    h?: number
    d?: number 
}

export type IPerimeter = [number, number][]
