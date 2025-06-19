export enum SegmentType {
    HOUSE_00 = 'HOUSE_00',
    AREA_00 = 'AREA_00',
    STRUCTURE_00 = 'STRUCTURE_00',
}

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
    TYPE_TOP_POIAS: ElemType,
    TYPE_SIDE_PILASTER: ElemType,
    SIDE_PILASTER_W: number,
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

export type IdataForFillWall = {
    buffer: number[],
    w: number,
    h: number,
    d: number,
    angle: number,
    TYPE_TOP_POIAS: ElemType,
    H_TOP_POIAS: number,
    TYPE_SIDE_PILASTER: ElemType,
    SIDE_PILASTER_W: number,
    indicies: {
        [key: string]: number
    }
}
export type IdataForFillWall_TMP = Partial<IdataForFillWall>


const isFullIdataForFillWall = (x: Partial<IdataForFillWall>): x is IdataForFillWall => {
  return Array.isArray(x.buffer) &&
         typeof x.w === 'number' &&
         typeof x.h === 'number' &&
         typeof x.d === 'number';
}

export const addTypeFullIdataForFillWall = (draft: Partial<IdataForFillWall>): IdataForFillWall => {
    if (isFullIdataForFillWall(draft)) {
        const wall: IdataForFillWall = draft;
        return wall
    } else {
        throw new Error('wall draft is incomplete');
    }
} 

