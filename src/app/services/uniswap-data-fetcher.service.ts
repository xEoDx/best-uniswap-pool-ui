import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pool } from '../models/pool';
import { PoolVolumeInterval } from "../models/pool-volume-interval";
import { Token } from '../models/token';
import { Blockchain } from '../models/blockchain';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UniswapDataFetcherService {
  private _pools: Array<Pool>;

  constructor(private http: HttpClient) { 
    this._pools = new Array<Pool>();
  }

  public getAll() : Promise<Array<Pool>> {
  
    if(this._pools === null || this._pools.length === 0){
      if(environment.isLocalEnv) {
        this.getDummyData().pools.forEach((p:any) => {
            this.addPool(p);
        });
        return new Promise<Array<Pool>>(resolve => {resolve(this._pools)});

      } else {
        return new Promise<Array<Pool>>((resolve, reject) => {
          const url = environment.apiEndpoint + '/pools';
          this.http.get(url).subscribe({
            next: (res: any) => {

            res.pools.forEach((p:any) => {
              this.addPool(p);
            });
            resolve(this._pools);
            },
            error: (err: any) => {
              reject(err);
            },
            complete: () => {
            },
          
          });
        });
      }
        
    } else{
      return new Promise<Array<Pool>>(resolve => {resolve(this._pools)});
    }    
  }

  private addPool(p:any): void{

    if(p._volumes === undefined){
      return;
    }

    const poolVolumes: Array<PoolVolumeInterval> = p._volumes;

    let token0: Token = new Token(p._token0._name);
    let token1: Token = new Token(p._token1._name);

    let pool: Pool = new Pool(p._id, p._blockchain, p._feeTier, p._tvl, poolVolumes, token0, token1);
    this._pools.push(pool);
  }

  private getDummyData(): any{
    console.log("DUMMY DATA!");
    return {"pools":[{"_id":"0x8c54aa2a32a779e6f6fbea568ad85a19e0109c26","_blockchain":"Ethereum","_feeTier":"500","_tvl":6713300,"_token0":{"_name":"WETH"},"_token1":{"_name":"USDC"},"_volume":3103015.258621318},{"_id":"0x4c54ff7f1c424ff5487a32aad0b48b19cbaf087f","_blockchain":"Ethereum","_feeTier":"3000","_tvl":7608132,"_token0":{"_name":"NEXO"},"_token1":{"_name":"WETH"},"_volumes":[{"_interval":1,"_volume":20000},{"_interval":3,"_volume":30000},{"_interval":7,"_volume":50000},{"_interval":14,"_volume":1000000},{"_interval":20,"_volume":200000}]},{"_id":"0x92560c178ce069cc014138ed3c2f5221ba71f58a","_blockchain":"Ethereum","_feeTier":"3000","_tvl":9148665,"_token0":{"_name":"WETH"},"_token1":{"_name":"ENS"}},{"_id":"0xac4b3dacb91461209ae9d41ec517c2b9cb1b7daf","_blockchain":"Ethereum","_feeTier":"3000","_tvl":45620558,"_token0":{"_name":"APE"},"_token1":{"_name":"WETH"},"_volumes":[{"_interval":1,"_volume":10000},{"_interval":3,"_volume":20000},{"_interval":7,"_volume":60000},{"_interval":14,"_volume":700000},{"_interval":20,"_volume":2100000}]}]};
  }
}
