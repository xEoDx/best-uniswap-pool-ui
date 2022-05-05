import { Blockchain } from "./blockchain";
import { Token } from "./token";

export class Pool {
    private _id: string;
    private _blockchain: Blockchain;
    private _feeTier: number;
    private _tvl: number;
    private _volume: number;
    private _token0: Token;
    private _token1: Token;

    constructor(id: string, blockchain: Blockchain, feeTier: number, tvl: number, volume: number, token0: Token, token1: Token) {
        this._id = id;
        this._blockchain = blockchain;
        this._feeTier = feeTier;
        this._tvl = tvl;
        this._token0 = token0;
        this._token1 = token1;
        this._volume = volume;
    }

    public addVolume(volume: number): void {
        this._volume += volume;
    }

    public get feeTier(): number {
        return this._feeTier;
    }

    public get token0(): Token {
        return this._token0;
    }

    public get token1(): Token {
        return this._token1;
    }

    public get volume(): number {
        return this._volume;
    }

    public get tvl(): number {
        return this._tvl;
    }

    public get score(): number {
        if (this.volume <= 0) {
            return 0;
        }
        return Math.round(this.feeTier * this.volume / this.tvl);
    }

    public get blockChain(): Blockchain {
        return this._blockchain;
    }

    public clearVolume(): void {
        this._volume = 0;
    }
}