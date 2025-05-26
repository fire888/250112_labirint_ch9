interface IplaneWithHoles {
    d: number,
    h: number,
    holes: any[],
    color: number,
    uvTile: number[],
}

export const createPlaneWithHoles = (data: IplaneWithHoles) => { 
    const v: number[] = []
    const uv: number[] = []
    const c: number[] = []



    return { v, uv, c}
}