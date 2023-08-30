import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { AgGridModule } from 'ag-grid-angular';
import 'ag-grid-enterprise';
import { TableGridComponent } from './components/table-grid/table-grid.component';
import { ScalarGridComponent } from './components/scalar-grid/scalar-grid.component';
import { AllGridsComponent } from './components/all-grids/all-grids.component';
import { CombinedGridsComponent } from './components/combined-grids/combined-grids.component';
import {GridService} from "./services/grid.service";
import { AllGridsWrapComponent } from './components/all-grids-wrap/all-grids-wrap.component';
import { LineChartComponent } from './components/line-chart/line-chart.component';
import { AllChartsComponent } from './components/all-charts/all-charts.component';
import { AllStockChartsComponent } from './components/all-stock-charts/all-stock-charts.component';
import {FormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatExpansionModule} from "@angular/material/expansion";
import { StockChart2Component } from './components/stock-chart/stock-chart2/stock-chart2.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";

@NgModule({
  declarations: [
    AppComponent,
    TableGridComponent,
    ScalarGridComponent,
    AllGridsComponent,
    CombinedGridsComponent,
    AllGridsWrapComponent,
    LineChartComponent,
    AllChartsComponent,
    AllStockChartsComponent,
    StockChart2Component
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HighchartsChartModule,
        AgGridModule,
        FormsModule,
        BrowserAnimationsModule,
        MatSidenavModule,
        MatToolbarModule,
        MatButtonModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatIconModule,
        MatListModule,
        MatFormFieldModule,
        MatExpansionModule,
        MatGridListModule,
//.withComponents([]) https://www.ag-grid.com/archive/21.2.2/angular-getting-started/

    ],
  providers: [GridService],
  bootstrap: [AppComponent]
})
export class AppModule { }
