import { Component, OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import { Gtag } from 'angular-gtag';

import {DonationDialogComponent} from '../components/donation-dialog/donation-dialog.component'


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(public dialog: MatDialog, public gtag: Gtag) { }

  ngOnInit(): void {
  }

  openDialog() {
    this.gtag.event('open_donation_dialog');

    const dialogRef = this.dialog.open(DonationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
