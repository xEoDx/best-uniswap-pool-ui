import { Component, OnInit } from '@angular/core';
import { Pool } from '../../models/pool';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Inject } from '@angular/core';  


@Component({
  selector: 'app-pool-info',
  templateUrl: './pool-info.component.html',
  styleUrls: ['./pool-info.component.css']
})
export class PoolInfoComponent implements OnInit {

  daysInterval: Array<number> = [1, 3, 7, 14, 20]; // TODO
  poolInfoTitle: string = "";
  pool: Pool;

  constructor( @Inject(MAT_DIALOG_DATA) public data: Pool) {
    console.log("Opened detailed info for pool: ", data);
    this.poolInfoTitle = data.token0.name + " - " + data.token1.name;
    this.pool = data;
  }

  ngOnInit(): void {
  }

  public getPoolVolume(pool: Pool, interval: number): number{
      if (pool === undefined || pool.volumes === undefined) {
          return 0;
      }
      const poolVolume = pool.volumes.find(v => v.interval === interval);
      if(poolVolume === undefined){
          return 0;
      }
      return poolVolume.volume;
  }

  public parseDollars(amount: number | undefined): string {
        if (amount === undefined) {
            return '0';
        }

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

}
