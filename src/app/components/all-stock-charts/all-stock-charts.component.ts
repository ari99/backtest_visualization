import {Component, OnInit} from '@angular/core';
import configJson from 'src/config.json';
import {StockData, StockDataService} from "../../services/stock-data.service";
import {BacktestData, BacktestService} from "../../services/backtest.service";

@Component({
  selector: 'app-all-stock-charts',
  templateUrl: './all-stock-charts.component.html',
  styleUrls: ['./all-stock-charts.component.scss']
})
export class AllStockChartsComponent implements OnInit {
  constructor(private stockService: StockDataService,
              private backtestService: BacktestService) {}

  // TODO generate config from same noteboook you generate history

  public backtestData: BacktestData[] = configJson.backtestData;

  public stockDatas: StockData[] =[];

  public isReady: boolean = false;

  ngOnInit(): void {
    this.stockService.getStockDatas().then((val: StockData[]) => {
      this.backtestService.getAllBacktests().then(backtests => {
        this.backtestData = backtests;
        console.log("  back tests ");
        console.log(backtests);
        this.stockDatas = val;
        //this.chartOptions = this.getComplexChartOptions(this.stockDatas[0]);
        this.isReady = true;
      });
    });
  }

  public toggleChartDisplay(index: number): void {
    this.stockDatas[index].show = !this.stockDatas[index].show;
  }

  public closeAll(): void {
    for(let stockData of this.stockDatas){
      stockData.show = false;
    }
  }

}
