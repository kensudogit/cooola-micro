import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { ReportsComponent } from './components/reports/reports.component';
import { InventoryManagementComponent } from './components/inventory-management/inventory-management.component';
import { ProductManagementComponent } from './components/product-management/product-management.component';
import { TransactionHistoryComponent } from './components/transaction-history/transaction-history.component';
import { SettingsComponent } from './components/settings/settings.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { ProductsComponent } from './components/products/products.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavigationComponent,
    ReportsComponent,
    InventoryManagementComponent,
    ProductManagementComponent,
    TransactionHistoryComponent,
    SettingsComponent,
    TransactionsComponent,
    InventoryComponent,
    ProductsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
