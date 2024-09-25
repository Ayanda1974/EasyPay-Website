import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  cards = [
    { title: 'Registered Users', count: 1250, icon: 'people-outline' },
    { title: 'Registered Drivers', count: 350, icon: 'car-outline' },
    { title: 'Transactions', count: 5000, icon: 'cash-outline' },
    { title: 'Routes', count: 120, icon: 'map-outline' }
  ];

  constructor() { }

  ngOnInit() { }
}