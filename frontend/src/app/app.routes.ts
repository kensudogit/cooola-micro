import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent)
  },
  {
    path: 'inventory',
    loadComponent: () => import('./components/inventory/inventory.component').then(m => m.InventoryComponent)
  },
  {
    path: 'transactions',
    loadComponent: () => import('./components/transactions/transactions.component').then(m => m.TransactionsComponent)
  },
  {
    path: 'reports',
    loadComponent: () => import('./components/reports/reports.component').then(m => m.ReportsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./components/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
]; 