import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dashboardData = {
    totalProducts: 1250,
    lowStockItems: 15,
    todayTransactions: 45,
    monthlyRevenue: 1250000
  };

  constructor() { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // ダッシュボードデータの読み込み
    console.log('Loading dashboard data...');
  }
} 