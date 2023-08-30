import {BacktestData} from "../../../../services/backtest.service";
import {OrdersSeriesService} from "../../../../services/orders-series.service";
import {StockSubChart} from "./chart-state";
import {ChartValues} from "./chart-values";
import {StockData} from "../../../../services/stock-data.service";
import {SeriesOptionsType} from "highcharts/highstock";
import * as Highcharts from "highcharts/highstock";
import {CustomStatChartService} from "../../custom-stat-chart.service";
import {StockChartService} from "../../../../services/stock-chart.service";

export class BacktestChartCreator {
  private chartValues: ChartValues;

  public constructor(chartValues: ChartValues, private  stockData: StockData,
                     private stockService: StockChartService ) {
    this.chartValues = chartValues;
  }

  public createBacktestOrderSeries(bt: BacktestData, orderSeriesService: OrdersSeriesService,
                                   ticker: string, onSeriesId: string): StockSubChart {

    const orderFlagsSeriesId: string = this.chartValues.createSeriesId();//"order_flags_" + bt.label;
    console.log("bt data orders");
    console.log(bt.data.Orders);
    const orderSeries = orderSeriesService.createOrdersSeries(bt.label + " Orders", bt.data.Orders,
      orderFlagsSeriesId, ticker, onSeriesId);
    console.log("orderSeries is ");
    console.log(orderSeries);

    const subchart: StockSubChart = {
      series: orderSeries,
      subChartId: this.chartValues.createChartId(),
      showAddOrdersOption: false,
      showChartTypeOption: false,
      baseName: bt.label + " Orders"
    };

    return subchart;

  }


  public createBacktestStat(
    seriesOptions: SeriesOptionsType,
    yAxisOptions: Highcharts.AxisOptions | undefined,
    name: string): StockSubChart {

    const subchart: StockSubChart =  {
      series: seriesOptions,
      subChartId: this.chartValues.createChartId(),
      showAddOrdersOption: true,
      showChartTypeOption: true,
      baseName: name};

    if(yAxisOptions) {
      subchart.yAxisOptions = yAxisOptions;
    }

    console.log(subchart);
    return subchart;

  }

  public createBacktestStatSeries( keyPath: string[],
                                   chartType: string,
                                   indicatorParamKey: string,
                                   indicatorParams: any,
                                   yAxisId:  string,
                                   backtestData: BacktestData,
                                   name: string,
                                   convertValues: boolean): SeriesOptionsType{
    let seriesData: any[] = [];
    let toSearch: any = backtestData.data;
    for(const key of keyPath){
      toSearch = toSearch[key];
      console.log(" key: " + key);
      console.log(toSearch);
    }
    seriesData = toSearch;

    console.log(" setting series data  for " + keyPath.toString() + " to ");
    console.log(seriesData);
    if(convertValues) {
      seriesData = this.convertSeries(seriesData);
    }
    console.log(" --- after convert --setting series data  for " + keyPath.toString() + " to ");
    console.log(seriesData);

    return  this.stockService.createDataSeriesOptions(this.chartValues.createSeriesId(),
      yAxisId,
      backtestData.label +" "+ name,
      indicatorParamKey, // i think this is the key to lookup oscillaor/overlay params,
      // setting it to anything random should be fine so it wont find the params
      chartType,
      seriesData,
      indicatorParams);
  }
  public createCustomStatSeriesOptions(yAxisId: string, customStat: string,
                                       backtestData: BacktestData,
                                       customStatChartService: CustomStatChartService): SeriesOptionsType{

    // this is the options for the series
    const seriesOptions: SeriesOptionsType = customStatChartService.createCustomStatOptions(customStat,
      "line",
      this.stockData.ticker,
      {},
      this.chartValues.createSeriesId(),
      backtestData
    );
    seriesOptions.id = this.chartValues.createSeriesId();
    seriesOptions.yAxis = yAxisId;
    return seriesOptions;
  }
  private convertSeries (values: any[]){
    const result: number[][] = [];
    for(const val of values){
      result.push([val["x"]*1000, val["y"]]);
    }
    return result;
  }
}
