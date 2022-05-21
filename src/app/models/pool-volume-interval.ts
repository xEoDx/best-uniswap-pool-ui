export class PoolVolumeInterval {
	private readonly _interval: number;
	private readonly _volume: number;

	constructor(volume: number, interval: number){
		this._volume = volume;
		this._interval = interval;
	}

	public get interval(): number{
		return this._interval;
	}

	public get volume(): number{
		return this._volume;
	}
}