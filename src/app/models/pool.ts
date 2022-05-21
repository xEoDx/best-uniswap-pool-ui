import { Blockchain } from "./blockchain";
import { Token } from "./token";
import { PoolVolumeInterval } from "./pool-volume-interval";

export class Pool {
    private static ScoreDollarsMultiplier = 100; 
    private _id: string;
    private _blockchain: Blockchain;
    private _feeTier: number;
    private _tvl: number;
    private _volumes: Array<PoolVolumeInterval>;
    private _token0: Token;
    private _token1: Token;

    constructor(id: string, blockchain: Blockchain, feeTier: number, tvl: number, volumes: Array<PoolVolumeInterval>, token0: Token, token1: Token) {
        this._id = id;
        this._blockchain = blockchain;
        this._feeTier = feeTier;
        this._tvl = tvl;
        this._token0 = token0;
        this._token1 = token1;
        this._volumes = volumes;
    }

    public get feeTier(): number {
        return this._feeTier / 10000;
    }

    public get token0(): Token {
        return this._token0;
    }

    public get token1(): Token {
        return this._token1;
    }

    public get volumes(): Array<PoolVolumeInterval> {
        return this._volumes;
    }

    public get tvl(): number {
        return this._tvl;
    }

    public score(dayInterval: number): number {
        const poolVolume = this._volumes.find(p => p.interval === dayInterval);
        if (poolVolume === undefined) {
            return 0;
        }
        return Pool.ScoreDollarsMultiplier * (this.feeTier * poolVolume.volume / this.tvl) / dayInterval;
    }

    public get blockChain(): Blockchain {
        return this._blockchain;
    }
}