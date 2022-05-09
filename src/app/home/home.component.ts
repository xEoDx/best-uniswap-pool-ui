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
    const openedDate: Date = new Date();

    const dialogRef = this.dialog.open(DonationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      const closeDate: Date = new Date();
      const elapsedTime: number = (closeDate.getTime() - openedDate.getTime()) / 1000;

      this.gtag.event('close_donation_dialog', {
        elapsed_time: elapsedTime
      });
    });
  }
}
