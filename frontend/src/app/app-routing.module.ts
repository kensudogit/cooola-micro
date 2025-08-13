import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { InventoryManagementComponent } from './components/inventory-management/inventory-management.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { ReportsComponent } from './components/reports/reports.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products', component: ProductManagementComponent },
  { path: 'inventory', component: InventoryManagementComponent },
  { path: 'transactions', component: TransactionHistoryComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '**', redirectTo: '/dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
