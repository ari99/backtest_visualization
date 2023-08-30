import {Injectable} from "@angular/core";
import {ChartState} from "./chart-state/chart-state";
import {ChartManagerService} from "../chart-manager.service";
import * as _ from "lodash";
import {StockChartService} from "../../../services/stock-chart.service";

/**
 * Allows the user to save and load the current start settings.
 */
@Injectable({
  providedIn: 'root'
})
export class StateSaverService {

  private chartState: ChartState | undefined;

  constructor(private chartManagerService: ChartManagerService, private stockService: StockChartService)
  { }

  saveState(chartState: ChartState | undefined, ticker: string): void {
    if(chartState != undefined) {
      this.chartState = _.cloneDeep(chartState);
      console.log("setting into localStorage");
      localStorage.setItem('state_'+ticker, JSON.stringify(this.chartState));
    } else {
      console.log("saving undefined state - this shouldn't happen");
    }
  }

  loadState(ticker: string): ChartState | undefined {
    if(this.chartState == undefined){
      const chartStateJson: string | null = localStorage.getItem('state_'+ticker);
      if(chartStateJson != null) {
        console.log("getting from localStorage");

        let chartStateFromStorage = JSON.parse(chartStateJson) as ChartState;

        this.chartState = new ChartState(chartStateFromStorage.stockData, this.stockService);
        Object.assign( this.chartState, chartStateFromStorage);
      } else {
        console.log("no state in localstorage");
      }
    } else {
      console.log("loading state from existing, no need for localstorage")
    }
    return this.chartState;
  }
}
