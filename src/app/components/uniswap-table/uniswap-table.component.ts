import { Component, OnInit } from '@angular/core';
import { Pool } from '../../models/pool';
import { RiskFilter } from '../../models/risk-filter';
import { Blockchain } from '../../models/blockchain';
import { UniswapDataFetcherService } from '../../services/uniswap-data-fetcher.service';
import { environment } from '../../../environments/environment';
import { Gtag } from 'angular-gtag';
import { MatDialog } from '@angular/material/dialog';
import { PoolInfoComponent } from '../pool-info/pool-info.component'

@Component({
    selector: 'app-uniswap-table',
    templateUrl: './uniswap-table.component.html',
    styleUrls: ['./uniswap-table.component.css']
})
export class UniswapTableComponent implements OnInit {
    allPools: Array<Pool>;
    sortedData: Array<Pool>;
    selectedInterval: number;

    nameFilter: string = '';

    selectedBlockchain: Blockchain = Blockchain.Ethereum;
    blockchains = [{id: Blockchain.Ethereum, name: 'Ethereum', icon: 'ethereum.png'}, {
        id: Blockchain.Polygon,
        name: 'Polygon',
        icon: 'polygon.png'
    }];

    selectedRisk: number = 0;
    risks = [{id: 0, name: 'Low'}, {id: 1, name: 'Moderate'}, {id: 2, name: 'High'}];

    constructor(private uniswapService: UniswapDataFetcherService, public gtag: Gtag, public dialog: MatDialog) {
        this.allPools = new Array<Pool>();
        this.sortedData = new Array<Pool>();
        this.selectedInterval = 1;
    }

    ngOnInit(): void {
        this.uniswapService.getAll().then(pools => {
            this.allPools = pools;
            this.sortedData = this.allPools.slice();
            this.applyFilters();
        });
    }


    formatLabel(value: number) {
        return value + ' D';
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

    sortData(sort: any) {
        const data = this.sortedData.slice();
        if (!sort.active || sort.direction === '') {
            this.sortedData = data;
            return;
        }

        this.sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';

            if (sort.active.includes('score')) {
                return this.compare(a.score(this.selectedInterval), b.score(this.selectedInterval), isAsc);
            } else if (sort.active.includes('tvl')) {
                const Atvl: number = a.volumes.find(v => v.interval === this.selectedInterval)?.tvl ?? 0;
                const Btvl: number = b.volumes.find(v => v.interval === this.selectedInterval)?.tvl ?? 0;
                return this.compare(Atvl, Btvl, isAsc);

            } else if (sort.active.includes('volume')) {
                const Avol: number = a.volumes.find(v => v.interval === this.selectedInterval)?.volume ?? 0;
                const Bvol: number = b.volumes.find(v => v.interval === this.selectedInterval)?.volume ?? 0;
                return this.compare(Avol, Bvol, isAsc);
            } else {
                switch (sort.active) {
                    case 'pool':
                        return this.compare(a.token0.name, b.token0.name, isAsc);
                    case 'fee':
                        return this.compare(a.feeTier, b.feeTier, isAsc);
                    default:
                        return 0;
                }
            }            
        });
    }

    onBlockchainChanged($event: any) {
        this.applyFilters();
        const blockChainTrackingData: string = 'blockchain-' + this.selectedBlockchain;
        console.log("Blockchain changed: ",$event, " blockchain is: ", this.selectedBlockchain);
        this.gtag.event('filter_pools', {
            method: 'blockchain',
            specific: blockChainTrackingData,
            daysInterval: this.selectedInterval
        });
    }

    onRiskChanged(risk: any) {
        this.applyFilters();
        const riskTrackingData: string = 'risk-' + this.selectedRisk;
        this.gtag.event('filter_pools', {method: 'risk', specific: riskTrackingData, daysInterval: this.selectedInterval});
    }

    private applyFilters(): void {
        this.sortedData = [];

        let risk: RiskFilter = this.selectedRisk as RiskFilter;
        this.allPools.forEach(pool => {
            if (this.isFromBlockchain(pool, this.selectedBlockchain) && this.isWithinRisk(pool, risk) && this.poolHasTokensName(pool, this.nameFilter)) {
                this.sortedData.push(pool);
            }
        });

        this.sortData({active: 'score', direction: 'desc'});

    }

    private isFromBlockchain(pool: Pool, blockchain: Blockchain): boolean {
        return (pool.blockChain + '') === Blockchain[blockchain];
    }

    private parseBlockchain(blockchain: Blockchain): number {
        switch (blockchain) {
            case Blockchain.Ethereum:
                return 0;
            case Blockchain.Polygon:
                return 1;
            default:
                return -1;
        }
    }

    private isWithinRisk(pool: Pool, risk: RiskFilter): boolean {
        const lowRiskTokens: Array<string> = environment.filter.low;
        const moderateRiskTokens: string[] = environment.filter.moderate;

        let token0Allowed = false;
        let token1Allowed = false;

        switch (risk) {
            case RiskFilter.Low:

                lowRiskTokens.forEach(value => {
                    if (!token0Allowed && pool.token0.name.includes(value)) {
                        token0Allowed = true;
                    }
                    if (!token1Allowed && pool.token1.name.includes(value)) {
                        token1Allowed = true;
                    }
                });

                return token0Allowed && token1Allowed;

            case RiskFilter.Moderate:


                moderateRiskTokens.forEach(value => {
                    if (!token0Allowed && pool.token0.name.includes(value)) {
                        token0Allowed = true;
                    }
                    if (!token1Allowed && pool.token1.name.includes(value)) {
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

    private poolHasTokensName(pool: Pool, filterName: string): boolean {
        if (filterName === '') {
            return true;
        }

        const poolFilterTrackingData: string = 'pool-name-' + filterName;
        this.gtag.event('filter_pools', {method: 'name', specific: poolFilterTrackingData, daysInterval: this.selectedInterval});

        const token0Name = pool.token0.name.toLowerCase();
        const token1Name = pool.token1.name.toLowerCase();
        const filter = filterName.toLowerCase();

        const spaceSplitFilter = filter.split(' ');
        if (spaceSplitFilter.length > 1) {
            return token0Name.includes(spaceSplitFilter[0]) && token1Name.includes(spaceSplitFilter[1]);
        }

        const dashSplitFilter = filter.split('-');
        if (dashSplitFilter.length > 1) {
            return token0Name.includes(dashSplitFilter[0]) && token1Name.includes(dashSplitFilter[1]);
        }

        const slashSplitFilter = filter.split('/');
        if (slashSplitFilter.length > 1) {
            return token0Name.includes(slashSplitFilter[0]) && token1Name.includes(slashSplitFilter[1]);
        }


        return token0Name.includes(filter) || token1Name.includes(filter);
    }

    public onSearchChanged(event: any) {
        this.applyFilters();
    }


    public compare(a: number | string, b: number | string, isAsc: boolean): number {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    openPoolDetailedView(pool: Pool) {
        const dialogRef = this.dialog.open(PoolInfoComponent, {
               width      : '100%',
               maxWidth   : '720px',
               height     : 'auto',
               hasBackdrop: true,
               maxHeight  : '700px',
               data       : pool,});

        dialogRef.afterClosed().subscribe(result => {
            
        });
    }

    public getPoolScore(pool: Pool): string{
        if(!this.poolHasIntervalData(pool)){
            return '0';
        }

        const poolScore: number = pool.score(this.selectedInterval);
        if(poolScore > 0){
            return '$'+poolScore.toFixed(6);
        }
        else {
            return "-";
        }
    }

    getPoolTvl(pool: Pool): string {
        if(!this.poolHasIntervalData(pool)){
            return "-";
        }
        return this.parseDollars(pool.avgTvl(this.selectedInterval));
    }
    getPoolVolume(pool: Pool): string {
        if(!this.poolHasIntervalData(pool)){
            return "-";
        }
        return this.parseDollars(pool.aggregatedVolume(this.selectedInterval));
    }
    poolHasIntervalData(pool: Pool): boolean {
        return pool.volumes !== undefined &&
            pool.volumes.length >= this.selectedInterval &&
            pool.volumes[this.selectedInterval] !== undefined &&
            pool.volumes[this.selectedInterval].tvl !== undefined &&
            pool.volumes[this.selectedInterval].volume !== undefined;
    }
}
