import { Blockchain } from "./blockchain";
import { Token } from "./token";
import { PoolVolumeInterval } from "./pool-volume-interval";

export class Pool {
    private static ScoreDollarsMultiplier = 100; 
    private readonly _id: string;
    private readonly _blockchain: Blockchain;
    private readonly _feeTier: number;
    private readonly _volumes: Array<PoolVolumeInterval>;
    private readonly _token0: Token;
    private readonly _token1: Token;

    constructor(id: string, blockchain: Blockchain, feeTier: number, volumes: Array<PoolVolumeInterval>, token0: Token, token1: Token) {
        this._id = id;
        this._blockchain = blockchain;
        this._feeTier = feeTier;
        this._token0 = token0;
        this._token1 = token1;
        this._volumes = volumes;
    }

    public get id(): string{
        return this._id;
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

    public volume(dayInterval: number):number{
        const dayData = this.getDayData(dayInterval);
        if(dayData === undefined) {
            return 0;
        }

        return dayData.volume;
    }

    public tvl(dayInterval: number): number{
        const dayData = this.getDayData(dayInterval);
        if(dayData === undefined) {
            return 0;
        }

        return dayData.tvl;
    }

    public score(dayInterval: number): number {
        let aggregatedVolume = 0;
        let aggregatedTvl = 0;

        for(let i = 0; i <= dayInterval; i++){
            const dayData = this.getDayData(i);
            if(dayData !== undefined) {
                aggregatedVolume += dayData.volume;
                aggregatedTvl += dayData.tvl;
            }
        }
        if(aggregatedTvl === 0 || aggregatedVolume === 0){
            return 0;
        }

        const avgTvl = aggregatedTvl / dayInterval;
        return Pool.ScoreDollarsMultiplier * ((this.feeTier / 100) * (aggregatedVolume / avgTvl)) / dayInterval;
    }

    public aggregatedVolume(dayInterval: number): number{
        let aggregatedVolume = 0;

        for(let i = 0; i <= dayInterval; i++){
            const dayData = this.getDayData(i);
            if(dayData !== undefined) {
                aggregatedVolume += dayData.volume;
            }
        }
        return aggregatedVolume;
    }

    public avgTvl(dayInterval: number): number{
        let aggregatedTvl = 0;

        for(let i = 0; i <= dayInterval; i++){
            const dayData = this.getDayData(i);
            if(dayData !== undefined) {
                aggregatedTvl += dayData.tvl;
            }
        }
        return aggregatedTvl / dayInterval;
    }

    public get blockChain(): Blockchain {
        return this._blockchain;
    }

    private getDayData(dayInterval:number): PoolVolumeInterval | undefined{
        return this._volumes.find(p => p.interval === dayInterval);
    }
}