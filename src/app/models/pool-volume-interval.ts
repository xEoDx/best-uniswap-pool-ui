export class PoolVolumeInterval {
    private readonly _interval: number;
    private readonly _volume: number;
    private readonly _tvl: number;

    constructor(volume: number, tvl: number, interval: number) {
        this._volume = volume;
        this._interval = interval;
        this._tvl = tvl;
    }

    public get interval(): number {
        return this._interval;
    }

    public get volume(): number {
        return this._volume;
    }

    public get tvl(): number {
        return this._tvl;
    }
}