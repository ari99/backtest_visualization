import {Component, Input, OnInit} from '@angular/core';
import {ChartState, StockSubChart} from "./chart-state/chart-state";
import {chartTypeOptions, customStatsOptions, oscillatorOptions, overlayOptions} from "../chart-options";
import {MatSelectChange} from "@angular/material/select";
import * as Highcharts from "highcharts/highstock";
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
// https://github.com/highcharts/highcharts-angular#to-load-a-module
import IndicatorsAll from "highcharts/indicators/indicators-all";
import {ChartManagerService} from "../chart-manager.service";
import {BacktestData} from "../../../services/backtest.service";
import {CustomStatChartService} from "../custom-stat-chart.service";
import {ChartUtils} from "./chart-utils";
import {OrdersSeriesService} from "../../../services/orders-series.service";
import {StateSaverService} from "./state-saver.service";
import {BacktestStatService} from "./backtest-stat.service";
import {SeriesOptionsType} from "highcharts/highstock";
import {StockChartService} from "../../../services/stock-chart.service";
import {StockData} from "../../../services/stock-data.service";
IndicatorsAll(Highcharts);

@Component({
  selector: 'app-stock-chart2',
  templateUrl: './stock-chart2.component.html',
  styleUrls: ['./stock-chart2.component.scss']
})
export class StockChart2Component implements OnInit {
  @Input() chartTitle: string = "";
  @Input() stockData: StockData = {path: "", show: false, ticker: ""};
  @Input() backtestData: BacktestData[] = [];

  //--------- start highcharts options
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {};
  //chartCallback: Highcharts.ChartCallbackFunction = function (chart) { ... } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false
  //----- end

  chartRef: Highcharts.Chart | undefined;

  public chartTypeOptions = chartTypeOptions;
  public customStatsOptions = customStatsOptions;
  public oscillatorOptions = oscillatorOptions;
  public overlayOptions = overlayOptions;
  public backtestStatsOptions: {[key: string]: string[]} | undefined = undefined;
  //public stockSubCharts: StockSubChart[] = [];
  public chartState: ChartState | undefined = undefined;
  private orderOptions:any = {};
  public isReady: boolean = false;


  constructor(
    private chartManagerService: ChartManagerService,
    private customStatChartService: CustomStatChartService,
    private orderSeriesService: OrdersSeriesService,
    private stateSaverService: StateSaverService,
    private backtestStatService: BacktestStatService,
    private stockService: StockChartService,
  ) {
  }

  ngOnInit(): void {
    console.log("+========= component inputs start  == ");
    console.log("Stock Data");
    console.log(this.stockData);
    console.log("Back Test Data")
    console.log(this.backtestData);
    console.log("+========= component inputs end  == ");

    if(this.backtestData.length > 0){
      // use the first backtest to determine the options
      this.backtestStatsOptions = this.backtestStatService.createChartOptions(this.backtestData[0]);

      console.log("backtest stats options");
      console.log(this.backtestStatsOptions);
    }

    this.chartState = new ChartState(this.stockData, this.stockService);
    this.chartOptions = this.chartState.getDefaultChartOptions();
    // this.orderOptions = ChartUtils.createOrderOptions(this.backtestData);

    this.isReady = true;
  }

  public saveState(): void {
    this.stateSaverService.saveState(this.chartState, this.stockData.ticker);
  }

  public loadState(): void {
    const savedChartState = this.stateSaverService.loadState(this.stockData.ticker);
    if(savedChartState != undefined){
      this.removeAllSubCharts(this.chartState?.stockSubCharts);
      this.chartState = savedChartState;
      this.addAllSubCharts(this.chartState?.stockSubCharts);
    }

    if (this.chartRef instanceof Highcharts.Chart && this.chartState != undefined) {
      this.chartManagerService.updateHeight(this.chartRef, this.chartState.calculateTotalHeight());
    }

  }

  private removeAllSubCharts(subcharts: StockSubChart[] | undefined) {
    if (this.chartRef instanceof Highcharts.Chart
      && this.chartState != undefined
      && subcharts != undefined) {
      for(const subchart of subcharts) {
        console.log(" removing subchart  " );
        console.log(subchart);
        this.removeSubChart(subchart)
      }
    }
  }


  private addAllSubCharts(subcharts: StockSubChart[] | undefined) {
    if (this.chartRef instanceof Highcharts.Chart
      && this.chartState != undefined
      && subcharts != undefined) {
      for(const subchart of subcharts) {
        console.log(" adding subchart  " );
        console.log(subchart);
        this.chartManagerService.addSubchart(this.chartRef, subchart);

      }
    }
  }

  public addCustomStat(event: MatSelectChange) {
    const statsKey: string = event.value;
    this.addBacktestStat(["securityStats", this.stockData.ticker, statsKey], statsKey);
  }

  public addBacktestStatClick(event: MatSelectChange) {
    const statsKey: string[] = event.value.value;
    const name: string = event.value.key;
    console.log("Array");
    console.log(statsKey);
    console.log("Name");
    console.log(name);
    this.addBacktestStat(statsKey, name,true);
  }

  public addBacktestStat(statsKey: string[], name: string,  convertValues = false){

    // TODO remove duplication with addcustomstat
    if (this.chartRef instanceof Highcharts.Chart && this.chartState != undefined) {
      //let yAxisId: string | undefined = undefined;
      let count: number = 0;

      const yAxisOptions: Highcharts.AxisOptions = this.chartState.createYaxisOptions();
      const yAxisId: string = <string>yAxisOptions.id;
      for(const bt of this.backtestData) {
        console.log("Y-axis ID " + yAxisOptions.id + " --- " + yAxisId);
        const seriesOptions: SeriesOptionsType = this.chartState.createBacktestStatSeries(
          statsKey, "line", statsKey.toString(), {},
          yAxisId, bt, name, convertValues);
        let options: StockSubChart;
        if(count == 0 ) {
          options = this.chartState.createBacktestStat(seriesOptions, yAxisOptions, name);
        } else{
           options = this.chartState.createBacktestStat(seriesOptions, undefined, name);
        }

        this.chartManagerService.addSubchart(this.chartRef, options);

        count = count + 1;
      }

      this.chartManagerService.updateHeight(this.chartRef, this.chartState.calculateTotalHeight())

    }

  }


  public addCandlestickSubChart() {
    if (this.chartRef instanceof Highcharts.Chart && this.chartState != undefined) {
      const options: StockSubChart = this.chartState.createStockChart();
      this.chartManagerService.updateHeight(this.chartRef, this.chartState.calculateTotalHeight())
      this.chartManagerService.addSubchart(this.chartRef, options);
    }
  }

  public addOscillator(event: MatSelectChange) {
    if (this.chartRef instanceof Highcharts.Chart && this.chartState != undefined) {
      const options: StockSubChart = this.chartState.createOscillator(event.value);
      this.chartManagerService.addSubchart(this.chartRef, options);
      this.chartManagerService.updateHeight(this.chartRef, this.chartState.calculateTotalHeight())

    }
  }

  public addOverlay(overlaykey: string): void {
    if (this.chartRef instanceof Highcharts.Chart && this.chartState != undefined) {

      const options: StockSubChart = this.chartState.createOverlay(overlaykey);//event.value);
      this.chartManagerService.addSubchart(this.chartRef, options);
    }
  }

  public addOrders(event: MatSelectChange, onSeriesId: string): void {
    console.log(" in add orders");
    if (this.chartRef instanceof Highcharts.Chart && this.chartState != undefined) {
      const btId: number = event.value;

      const bt: BacktestData | undefined = ChartUtils.getBacktest(btId, this.backtestData);
      if(bt) {
        console.log(btId + " adding subchart to " + onSeriesId);
        const options: StockSubChart = this.chartState.createBacktestOrderSeries(bt, this.orderSeriesService,
          this.stockData.ticker, onSeriesId);
        this.chartManagerService.addSubchart(this.chartRef, options);
      } else {
        console.log("bt doesnt exist " + btId)
      }
    }else {
      console.log(" chart ref ");
      console.log(this.chartRef);
      console.log(" chart state ");
      console.log(this.chartState);
    }

  }

  public removeSubChart(subChart: StockSubChart, removeFromState =  true): void {
    if (this.chartRef instanceof Highcharts.Chart && this.chartState != undefined) {
      this.chartManagerService.removeSubchart(this.chartRef, subChart);
      if(removeFromState) {
        this.chartState.removeSubChart(subChart.subChartId);
      }
      this.chartManagerService.updateTops(this.chartRef, this.chartState.stockSubCharts);
      this.chartManagerService.updateHeight(this.chartRef, this.chartState.calculateTotalHeight())

    }
  }


  public updateSubChart(subChart: StockSubChart): void {
    if (this.chartRef instanceof Highcharts.Chart && this.chartState != undefined) {
      this.chartState.resetTops();
      this.chartState.updateName(subChart.subChartId);
      console.log("Updating subchart to ");
      console.log(subChart);
      const yAxisId: string = subChart.series.yAxis;
      const linkedSubCharts: StockSubChart[] = ChartUtils.makeLinkedSubCharts(this.chartState, subChart);
      this.chartManagerService.updateSubChart(this.chartRef, subChart, linkedSubCharts);
      //this.chartState.updateSubChart();// i dont think this is necessary because the edits to the forms
      // are linked to chartstate already through ngmodel
      this.chartManagerService.updateTops(this.chartRef, this.chartState.stockSubCharts);
      this.chartManagerService.updateHeight(this.chartRef, this.chartState.calculateTotalHeight())

    }
  }

  private finishSetup(): void {
    if (this.chartRef instanceof Highcharts.Chart && this.chartState != undefined) {
      console.log(" Adding all default subcharts");
      console.log(this.chartState.stockSubCharts);
      this.addAllSubCharts(this.chartState.stockSubCharts);

    }
  }

  chartCallback: Highcharts.ChartCallbackFunction = (chart: Highcharts.Chart): void => {
    console.log("Setting chart");
    this.chartRef = chart;
    this.finishSetup();

  };

  //https://stackoverflow.com/questions/62991681/angular-typescript-how-to-type-casting-in-html-file
  public castToString(obj: any): string {
    return obj as string;
  }

  hasProp(obj: any, name: string) {
    return obj.hasOwnProperty(name);
  }


  //this function was created and two way binding turned off because every change was causing
  // input to lose focus
  //https://github.com/angular/angular.js/issues/13327   https://github.com/angular/material/issues/5798
 public onValueUpdate(event: Event, subchart: StockSubChart, subchartId: string, paramKey: string): void {

   const target = event.target as HTMLSelectElement;
   const value: string = target.value;
    console.log("Value is " + paramKey);
    console.log(value);
    console.log("Subcharts ");
    console.log(this.chartState?.stockSubCharts);
    //const subchart: StockSubChart | undefined = this.chartState?.getSubChart(subchartId);
    console.log("Subchart is ");
    console.log(subchart);
    console.log("param key " + paramKey);
    if(subchart && this.chartState) {
      console.log(subchart.series.params);
      this.chartState.updateSubChart(subchartId, subchart);
      subchart.series.params[paramKey] = value;
    }
 }
}
