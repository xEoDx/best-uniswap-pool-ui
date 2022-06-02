export class PoolDayData {
    private readonly _tvl: number;
    private readonly _volume:number;

    constructor(tvl: number, volume: number) {
        this._tvl = tvl;
        this._volume = volume;
    }

    public get tvl(): number{
        return this._tvl;
    }

    public get volume():number{
        return this._volume;
    }
}