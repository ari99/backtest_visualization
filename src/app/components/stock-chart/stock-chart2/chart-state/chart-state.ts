import {SeriesOptionsType} from "highcharts/highstock";
import * as Highcharts from "highcharts/highstock";
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
import IndicatorsAll from "highcharts/indicators/indicators-all";
IndicatorsAll(Highcharts);
// https://github.com/highcharts/highcharts-angular#to-load-a-module
import {BacktestData} from "../../../../services/backtest.service";
import {OrdersSeriesService} from "../../../../services/orders-series.service";
import {StockChartService} from "../../../../services/stock-chart.service";
import {StockData} from "../../../../services/stock-data.service";
import {ChartCreator} from "./chart-creator";
import {ChartValues} from "./chart-values";
import {BacktestChartCreator} from "./backtest-chart-creator";
import {ChartStateUtils} from "./chart-state-utils";


export interface StockSubChart{
  yAxisOptions? : Highcharts.AxisOptions;
  series: any;
  subChartId: string;
  baseName: string;
  showChartTypeOption: boolean;
  showAddOrdersOption: boolean;
}

/**
 * Holds chart settings data.
 */
export class ChartState {

  public stockSubCharts: StockSubChart[] = [];
  public stockData: StockData;
  private chartCreator: ChartCreator;
  private chartValues: ChartValues;
  private backtestChartCreator: BacktestChartCreator;

  constructor(stockData: StockData, private stockService: StockChartService ) {
    this.stockData = stockData;
    this.chartValues = new ChartValues();
    this.chartCreator = new ChartCreator(this.chartValues, stockData);
    this.backtestChartCreator = new BacktestChartCreator(this.chartValues, stockData, stockService);
    this.defaultSubCharts();
  }

  public calculateTotalHeight(): number {
    console.log("Calculating total height");
    console.log(this.stockSubCharts)
    let height: number = 0;
    for(const sub of this.stockSubCharts) {
      if(sub.yAxisOptions) {
        console.log("adding " + sub.yAxisOptions.height);
        height += <number>sub.yAxisOptions.height;
      }
    }
    height = height+ 110;
    console.log("total height after adding 110 for zooom bar " + height);
    return height;
  }

  public getDefaultChartOptions(): Highcharts.Options {
    console.log("Calculating height in default chart options");
    const height: number = this.calculateTotalHeight();
    return {
      chart: {
        height: height,
        width: 1500
      },
      title: {
        text: this.stockData.ticker +' Historical'
      },
      subtitle: {
        text: 'All indicators'
      },
      accessibility: {
        series: {
          descriptionFormat: '{seriesDescription}.'
        },
        description: 'Use the dropdown menus above to display different indicator series on the chart.',
        screenReaderSection: {
          beforeChartFormat: '<{headingTagName}>{chartTitle}</{headingTagName}><div>{typeDescription}</div><div>{chartSubtitle}</div><div>{chartLongdesc}</div>'
        }
      },
      legend: {
        enabled: true,
      },
      navigator: { //https://api.highcharts.com/highstock/navigator
        enabled: true,
        //height: 50
      },
      rangeSelector: {
        enabled: true,
        floating: false,
        selected: 4,
        y: -60
      },
      plotOptions: {
        series: {
          showInLegend: true,
          accessibility: {
            exposeAsGroupOnly: true
          },
        },
      },
    };
  }

  private defaultSubCharts(): void {
    this.createStockChart();
    this.createVolumeChart();
    this.createOscillator("macd");
    this.createOverlay("sma");
    //this.stockSubCharts.push(this.createCustomStat());
  }

  public createStockChart(): StockSubChart {
    const subchart: StockSubChart = this.chartCreator.createStockChart();
    this.stockSubCharts.push(subchart);
    return subchart;
  }
  public createVolumeChart(): StockSubChart {
    const subchart: StockSubChart = this.chartCreator.createVolumeChart();
    this.stockSubCharts.push(subchart);
    return subchart;
  }
  public createOscillator(oscillatorType: string): StockSubChart {
    const subchart: StockSubChart = this.chartCreator.createOscillator(oscillatorType);
    this.stockSubCharts.push(subchart);
    return subchart;
  }
  public createOverlay(overlayType: string): StockSubChart {
    const subchart: StockSubChart = this.chartCreator.createOverlay(overlayType);
    this.stockSubCharts.push(subchart);
    return subchart;
  }
  public createBacktestOrderSeries(bt: BacktestData, orderSeriesService: OrdersSeriesService,
                                   ticker: string, onSeriesId: string): StockSubChart {
    const subchart: StockSubChart = this.backtestChartCreator.createBacktestOrderSeries(bt, orderSeriesService,
                                                                                        ticker, onSeriesId);
    this.stockSubCharts.push(subchart);
    return  subchart;
  }
  public createBacktestStat( seriesOptions: SeriesOptionsType,
                             yAxisOptions: Highcharts.AxisOptions | undefined,
                                                  name: string): StockSubChart {
    const subchart: StockSubChart = this.backtestChartCreator.createBacktestStat(seriesOptions, yAxisOptions, name)
    this.stockSubCharts.push(subchart);
    return subchart;
  }

  public createBacktestStatSeries( keyPath: string[],
                                            chartType: string,
                                            indicatorParamKey: string,
                                            indicatorParams: any,
                                            yAxisId:  string,
                                            backtestData: BacktestData,
                                            name: string,
                                            convertValues: boolean): SeriesOptionsType {
    return this.backtestChartCreator.createBacktestStatSeries(keyPath, chartType,indicatorParamKey, indicatorParams, yAxisId,
                                                              backtestData, name, convertValues);

  }

  public createYaxisOptions(): Highcharts.AxisOptions {
    let yAxisOptions: Highcharts.AxisOptions;
      const yAxisId = this.chartValues.createYAxisId();

      yAxisOptions = {
        top: this.chartValues.getTop(),
        height: this.chartValues.incrementTop(200),
        id: yAxisId
      };
      return yAxisOptions;
  }

  public removeSubChart(subChartId: string): void {
    const newSubCharts: StockSubChart[] = [];
    let top: number = 0;
    for(const sub of this.stockSubCharts){
      if(sub.subChartId != subChartId) {
        newSubCharts.push(sub);
      } else if (sub.subChartId == subChartId && sub.series.id == this.chartValues.getStockChartSeriesId()) {
        this.chartValues.setHasStockChart(false);
        this.chartValues.setStockChartSeriesId("");
        this.chartValues.setStockChartYAxisId("");
      }
    }
    this.stockSubCharts = newSubCharts;
    this.resetTops();

  }

  public resetTops(): void {
    const newSubCharts: StockSubChart[] = [];

    this.chartValues.setTop(0);
    for (const sub of this.stockSubCharts) {
      if(sub.yAxisOptions) {
        sub.yAxisOptions.top = this.chartValues.getTop();
        this.chartValues.incrementTop( <number>sub.yAxisOptions.height);
      }
      newSubCharts.push(sub);
    }

    this.stockSubCharts = newSubCharts;
  }

  public updateSubChart(subChartId: string, updatedSubChart: StockSubChart): void {
    const newSubCharts: StockSubChart[] = [];
    for(const sub of this.stockSubCharts){
      if(sub.subChartId == subChartId) {
        newSubCharts.push(updatedSubChart);
      } else {
        newSubCharts.push(sub);
      }
    }
    this.stockSubCharts = newSubCharts;
    this.resetTops();
  }

  public updateName(subChartId: string): void {
    const subchart: StockSubChart | undefined = ChartStateUtils.getSubChart(subChartId, this.stockSubCharts);
    if(subchart != undefined && "params" in subchart.series){
      if("period" in subchart.series["params"]){
        console.log("Setting name to  "+subchart.baseName + " " + subchart.series.params.period)
        subchart.series.name = subchart.baseName + " " + subchart.series.params.period
      } else {
        console.log("no period in subchart");
      }
    } else {
      console.log("no subchart or no period");
    }
  }

  public getHasStockChart(): boolean {
    return this.chartValues.getHasStockChart();
  }
}
