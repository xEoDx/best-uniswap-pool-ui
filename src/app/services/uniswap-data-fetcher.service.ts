import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Pool } from '../models/pool';

import { Token } from '../models/token';
import { Blockchain } from '../models/blockchain';
import { environment } from '../../../environments/environment';

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
        this._pools = this.getDummyData();
      } else {
        const url = environment.apiEndpoint + '/pools';
        this.http.get<Array<Pool>>(url).pipe(map(response => {
          this._pools = response;  
        }));
      }
    }

    return new Promise(resolve => {resolve(this._pools)});
  }

  private getDummyData(): Array<Pool> {
    let p =  new Array<Pool>();
    p.push(new Pool('0x01', Blockchain.Ethereum, 30000, 10000, 20000, new Token('BTC'), new Token('USDT')));
    p.push(new Pool('0x02', Blockchain.Ethereum, 30000, 12000, 40000, new Token('WETH'), new Token('USDT')));
    p.push(new Pool('0x03', Blockchain.Polygon, 30000, 2000, 1000, new Token('MATIC'), new Token('USDT')));
    p.push(new Pool('0x04', Blockchain.Polygon, 30000, 100, 400, new Token('MATIC'), new Token('WETH')));

    return p;
  }
}
