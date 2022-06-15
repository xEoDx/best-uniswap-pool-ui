import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { GtagModule } from 'angular-gtag';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UniswapTableComponent } from './components/uniswap-table/uniswap-table.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DonationDialogComponent } from './components/donation-dialog/donation-dialog.component';
import { PoolInfoComponent } from './components/pool-info/pool-info.component';
import {MatSliderModule} from '@angular/material/slider';
import {MatIconModule} from '@angular/material/icon';

import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    UniswapTableComponent,
    DonationDialogComponent,
    PoolInfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatNativeDateModule,
    MatTableModule,
    MatSortModule,
    MatDialogModule,
    NgSelectModule,
    FormsModule,
    MatSliderModule,
    MatIconModule,
    ShareButtonsModule,
    ShareIconsModule,
    GtagModule.forRoot({ trackingId: 'G-LTLKGZLW9W', trackPageviews: true })

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
