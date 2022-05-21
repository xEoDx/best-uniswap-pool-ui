import { Blockchain } from "./blockchain";
import { Token } from "./token";

export class Pool {
    private _id: string;
    private _blockchain: Blockchain;
    private _feeTier: number;
    private _tvl: number;
    private _volumes: Map<number, number>;
    private _token0: Token;
    private _token1: Token;

    constructor(id: string, blockchain: Blockchain, feeTier: number, tvl: number, volumes: Map<number, number>, token0: Token, token1: Token) {
        this._id = id;
        this._blockchain = blockchain;
        this._feeTier = feeTier;
        this._tvl = tvl;
        this._token0 = token0;
        this._token1 = token1;
        this._volumes = volumes;
    }

    public addVolume(volume: number, daysInterval:number): void {
        if(!this._volumes.has(daysInterval)) {
            this._volumes.set(daysInterval, volume);
        } else{
            const previousVolume: number = this._volumes.get(daysInterval) ?? 0;
            this._volumes.set(daysInterval, previousVolume + volume);
        }
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

    public get volumes(): Map<number, number> {
        return this._volumes;
    }

    public get tvl(): number {
        return this._tvl;
    }

    public score(dayInterval: number): number {
        if (!this._volumes.has(dayInterval)) {
            return 0;
        }
        return this.feeTier * (this._volumes.get(dayInterval) ?? 0) / this.tvl;
    }

    public get blockChain(): Blockchain {
        return this._blockchain;
    }

    public clearVolume(): void {
        this._volumes. clear();
    }
}