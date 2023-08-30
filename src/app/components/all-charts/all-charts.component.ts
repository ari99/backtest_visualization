import {Component, OnInit} from '@angular/core';
import {DisplayOption} from "../all-grids/all-grids.component";
import {BacktestData, BacktestService} from "../../services/backtest.service";
import configJson from "../../../config.json";
import * as Highcharts from "highcharts/highstock";
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
// https://github.com/highcharts/highcharts-angular#to-load-a-module
import IndicatorsAll from "highcharts/indicators/indicators-all";
IndicatorsAll(Highcharts);

@Component({
  selector: 'app-all-charts',
  templateUrl: './all-charts.component.html',
  styleUrls: ['./all-charts.component.scss']
})
export class AllChartsComponent implements OnInit  {
  private fetchCache: any = {};

  //next https://stackoverflow.com/questions/60551424/how-do-i-redraw-a-series-on-highcharts
  //https://api.highcharts.com/class-reference/Highcharts.Series#update
  isReady = false;

  public chartDisplayOptions: { [key: string]: DisplayOption; } = {
    capacity: {label:"Strategy Capacity", show: false},
    equityLongRatio: {label:"Equity Long Ratio", show: false},
    equityShortRatio: {label:"Equity Short Ratio", show: false},
    benchmark: {label:"Benchmark", show: false},
    drawdown: {label:"Drawdown", show: false},
    strategyEquity: {label:"Strategy Equity", show: false},
    profitLoss: {label:"Profit Loss", show: false},
    holdingsValues: {label:"Holdings Values", show: false},
    statsProfits: {label:"Stats Profits", show: false},
    unrealizedProfitPercents: {label:"Unrealized Profit Percents", show: false},
    unrealizedProfits: {label:"Unrealized Profits", show: false},

    //TODO asset sales volumes chart - one for each asset
  };

  public capacitySeries: any[]= [];
  public equityLongRatioSeries: any[] = [];
  public equityShortRatioSeries: any[] = [];
  public benchmarkSeries: any[] = [];
  public drawdownSeries: any[] = [];
  public strategyEquitySeries: any[] = [];
  public profitLossSeries: any[] = [];
  public holdingsValuesSeries: any[] =[];
  public statsProfitsSeries: any[] = [];
  public unrealizedProfitPercentsSeries: any[] = [];
  public unrealizedProfitsSeries: any[] = [];
  public backtests: BacktestData[] = configJson.backtestData;

  constructor(private backtestService: BacktestService) {}

  ngOnInit(): void {
    this.setupBacktestData().then(() => {
      this.doAllData();
      console.log(" profit loss series");
      console.log(this.profitLossSeries);

      console.log(" holdings values series");
      console.log(this.holdingsValuesSeries);
      this.isReady=true;
    });
  }

  private async setupBacktestData(): Promise<void>{
    this.backtests = await this.backtestService.getAllBacktests();
  }

  private doAllData() {
    this.resetData();
    for (let i = 0; i < this.backtests.length ; i++) {
      let backtest = this.backtests[i];
      if(backtest.show) {
        this.appendData(backtest.data, backtest.label);
      }
    }
  }

  private resetData() {
    this.capacitySeries = [];
    this.equityLongRatioSeries = [];
    this.equityShortRatioSeries = [];
    this.benchmarkSeries = [];
    this.strategyEquitySeries = []
    this.drawdownSeries = [];
    this.profitLossSeries = [];
    this.holdingsValuesSeries = [];
    this.statsProfitsSeries = [];
    this.unrealizedProfitPercentsSeries = [];
    this.unrealizedProfitsSeries = [];
  }


  private appendData(jsonData: any, label: string) {
    console.log("appending from jsonData ");
    console.log(jsonData);
    // https://www.highcharts.com/docs/chart-concepts/series
    // https://www.highcharts.com/demo/stock/compare
     this.capacitySeries.push({"name":  label,
       dashStyle: "ShortDashDot",
       //'type': 'line',
      "data": this.convertChartData(jsonData["Charts"]["Capacity"]["Series"]["Strategy Capacity"]["Values"])});
    this.equityLongRatioSeries.push({"name":  label,
      //'type': 'line',
      "data": this.convertChartData(jsonData["Charts"]["Exposure"]["Series"]["Equity - Long Ratio"]["Values"])});
    this.equityShortRatioSeries.push({"name":  label,
      //'type': 'line',
      "data": this.convertChartData(jsonData["Charts"]["Exposure"]["Series"]["Equity - Short Ratio"]["Values"])});
    this.benchmarkSeries.push({"name":  label,
      //'type': 'line',
      "data": this.convertChartData(jsonData["Charts"]["Benchmark"]["Series"]["Benchmark"]["Values"])});

    this.drawdownSeries.push({"name":  label,
      //'type': 'line',
      "data": this.convertChartData(jsonData["Charts"]["Drawdown"]["Series"]["Equity Drawdown"]["Values"])});

    this.strategyEquitySeries.push({"name":  label,
      //'type': 'line',
      "data": this.convertChartData(jsonData["Charts"]["Strategy Equity"]["Series"]["Equity"]["Values"])});

    this.profitLossSeries.push({"name":  label,
      //'type': 'line',
      "data": this.convertUtcKeys(jsonData["ProfitLoss"])});

    this.holdingsValuesSeries.push({"name":  label,
      //'type': 'line',
      "data": jsonData["allCombinedStats"]["holdingsValues"]});
    this.statsProfitsSeries.push({"name":  label,
      //'type': 'line',
      "data": jsonData["allCombinedStats"]["profits"]});
    this.unrealizedProfitPercentsSeries.push({"name":  label,
      //dashStyle: "ShortDot",
      //'type': 'line',
      "data": jsonData["allCombinedStats"]["unrealizedProfitPercent"]});
    this.unrealizedProfitsSeries.push({"name":  label,
      //'type': 'line',
      "data": jsonData["allCombinedStats"]["unrealizedProfits"]});

  }

  private convertUtcKeys(jsonData: any) {
    const newData =  [];
    for(const dateKey of Object.keys(jsonData)){
      const val = jsonData[dateKey];
      const dateMillis: number = Date.parse(dateKey);
      newData.push([dateMillis, val]);
    }
    return newData;
  }

  private convertChartData(chartData: any) {
    // convert [
    //             {
    //               "x": 1391749200,
    //               "y": 0.1169
    //             },
    //             {
    //               "x": 1391835600,
    //               "y": 0.1171
    //             },
    // to two dimentional arrays as shown here https://api.highcharts.com/highcharts/series.line.data
    const newData = [];
    for(let point of chartData){
      newData.push([point.x*1000, point.y]);
    }

    return newData;
  }

  public closeAll(){
    for(let option in this.chartDisplayOptions){
      this.chartDisplayOptions[option].show = false;
    }
  }

  public closeAllBacktests(){
    for (let i = 0; i < this.backtests.length ; i++) {
      this.backtests[i].show = false;
    }
  }

  public openAllBacktests(){
    for (let i = 0; i < this.backtests.length ; i++) {
      this.backtests[i].show = true;
    }
  }

  public toggleDisplayOption(key: string) {
    this.chartDisplayOptions[key].show = !this.chartDisplayOptions[key].show;
  }

  public toggleBacktestDisplayOptions(index: number) {
    this.backtests[index].show = !this.backtests[index].show;
    this.doAllData();
  }

}
