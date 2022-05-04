import { Component, OnInit } from '@angular/core';
import { Sort } from '@angular/material/sort';
import { Pool } from '../../models/pool';
import { RiskFilter } from '../../models/risk-filter';
import { Blockchain } from '../../models/blockchain';
import { UniswapDataFetcherService } from '../../services/uniswap-data-fetcher.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-uniswap-table',
  templateUrl: './uniswap-table.component.html',
  styleUrls: ['./uniswap-table.component.css']
})
export class UniswapTableComponent implements OnInit {
  allPools: Array<Pool>;
  sortedData: Array<Pool>;

  selectedBlockchain: number = 0;
  blockchains = [{id: 0, name: 'Ethereum'}, {id: 1, name: 'Polygon'}];

  selectedRisk: number = 0;
  risks = [{id:0,name:'Low'}, {id:1,name:'Moderate'}, {id:2,name:'High'}];


  constructor(private uniswapService: UniswapDataFetcherService) { 
    this.allPools = new Array<Pool>();
    this.sortedData = new Array<Pool>();
  }

  ngOnInit(): void {
    this.uniswapService.getAll().then(pools => {
      this.allPools = pools;
      this.sortedData = this.allPools.slice();
      this.applyFilters();
    });
  }

  public parseDollars(amount: number): string {
    const billions = amount / 1000000000;
    const millions = amount / 1000000;
    const thousands = amount / 1000;
    if (billions > 1) {
        return '$' + this.truncate(billions, 2) + 'b';
    } else if (millions > 1) {
        return '$' + this.truncate(millions, 2) + 'm';
    } else if (thousands > 1) {
        return '$' + this.truncate(thousands, 2) + 'k';
    } else {
        return '$' + this.truncate(amount, 2);
    }
  }

  private truncate(number: number, decimals: number): number {
    const tmp = number + '';
    if (tmp.indexOf('.') > -1) {
        return +tmp.substr(0, tmp.indexOf('.') + decimals + 1);
    } else {
        return +number;
    }
  }

  sortData(sort: any) {

      const data = this.sortedData.slice();
      if (!sort.active || sort.direction === '') {
        this.sortedData = data;
        return;
      }

      this.sortedData = data.sort((a, b) => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'pool':
            return this.compare(a.token0.name, b.token0.name, isAsc);
          case 'fee':
            return this.compare(a.feeTier, b.feeTier, isAsc);
          case 'tvl':
            return this.compare(a.tvl, b.tvl, isAsc);
          case 'volume':
            return this.compare(a.volume, b.volume, isAsc);
          case 'score':
            return this.compare(a.score, b.score, isAsc);
          default:
            return 0;
      }
    }); 
  } 

  onBlockchainChanged($event:any){
    this.applyFilters();
  }

  onRiskChanged(risk:any){
   this.applyFilters(); 
  }

  private applyFilters(): void {
    this.sortedData = [];

    let blockChain: Blockchain = this.selectedBlockchain as Blockchain;
    let risk: RiskFilter = this.selectedRisk as RiskFilter;

    this.allPools.forEach(pool => {
        if(this.isFromBlockchain(pool,blockChain) && this.isWithinRisk(pool, risk)){
          this.sortedData.push(pool);
        }
    });

  }

  private isFromBlockchain(pool: Pool, blockchain: Blockchain): boolean {
    return pool.blockChain === blockchain;
  }

  private isWithinRisk(pool: Pool, risk:RiskFilter): boolean {
    const lowRiskTokens:Array<string> = environment.filter.low;
    const moderateRiskTokens:string[] = environment.filter.moderate;
    
    let token0Allowed = false;
    let token1Allowed = false;

    switch(risk) {
      case RiskFilter.Low:

        lowRiskTokens.forEach(value => {
          if(!token0Allowed && pool.token0.name.includes(value)){
            token0Allowed = true;            
          }
          if(!token1Allowed && pool.token1.name.includes(value)){
            token1Allowed = true;            
          }
        });
        
        return token0Allowed && token1Allowed;
      
      case RiskFilter.Moderate:
        

        moderateRiskTokens.forEach(value => {
          if(!token0Allowed && pool.token0.name.includes(value)){
            token0Allowed = true;            
          }
          if(!token1Allowed && pool.token1.name.includes(value)){
            token1Allowed = true;            
          }
        });
        
        return token0Allowed && token1Allowed;
      
      case RiskFilter.High:
        return true;
      
      default:
        return true;
    }
  }
  

  public compare(a: number | string, b: number | string, isAsc: boolean): number {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

}
