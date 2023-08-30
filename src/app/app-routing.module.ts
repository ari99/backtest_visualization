import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AllGridsWrapComponent} from "./components/all-grids-wrap/all-grids-wrap.component";
import {CombinedGridsComponent} from "./components/combined-grids/combined-grids.component";
import {AllChartsComponent} from "./components/all-charts/all-charts.component";
import {AllStockChartsComponent} from "./components/all-stock-charts/all-stock-charts.component";

const routes: Routes = [
  { path: 'all-grids-wrap-component', component: AllGridsWrapComponent },
  { path: 'combined-grids-component', component: CombinedGridsComponent },
  { path: 'all-charts-component', component: AllChartsComponent},
  { path: 'all-stock-charts-component', component: AllStockChartsComponent}


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
