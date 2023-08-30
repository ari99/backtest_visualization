import {StockSubChart} from "./chart-state";
import {ChartValues} from "./chart-values";
import {Chart} from "highcharts";
import {StockData} from "../../../../services/stock-data.service";
import {ChartStateUtils} from "./chart-state-utils";

export class ChartCreator {
  private chartValues: ChartValues;
  private stockData: StockData;
  public constructor(chartValues: ChartValues, stockData: StockData) {
    this.chartValues = chartValues;
    this.stockData = stockData;
  }

  public createStockChart(): StockSubChart {
    this.chartValues.setStockChartYAxisId(this.chartValues.createYAxisId());
    this.chartValues.setStockChartSeriesId(this.chartValues.createSeriesId());
    this.chartValues.setHasStockChart(true);
    console.log("Stock data in chart state");
    console.log(this.stockData);
    const subchart: StockSubChart =  {
      yAxisOptions: {
        top: this.chartValues.getTop(),
        height: this.chartValues.incrementTop(400),
        id: this.chartValues.getStockChartYAxisId()
      },
      series: {
        type: 'candlestick',
        id: this.chartValues.getStockChartSeriesId(),
        name: this.stockData.ticker,
        data: this.stockData.ohlc,
        yAxis: this.chartValues.getStockChartYAxisId(),
        showInNavigator: true,   //https://api.highcharts.com/highstock/series.candlestick.showInNavigator
      },
      baseName: this.stockData.ticker,
      subChartId: this.chartValues.createChartId(),
      showAddOrdersOption: true,
      showChartTypeOption: true
    };

    console.log(subchart);

    return subchart;
  }


  public createVolumeChart(): StockSubChart {
    const axisId: string = this.chartValues.createYAxisId();
    this.chartValues.setVolumeSeriesId(this.chartValues.createSeriesId());
    const subchart: StockSubChart =   {
      yAxisOptions: {
        top: this.chartValues.getTop(),
        height: this.chartValues.incrementTop(300),
        id: axisId
      },
      series: {
        type: 'line',
        id: this.chartValues.getVolumeSeriesId(),
        name: "Volume",
        data: this.stockData.volume,
        yAxis: axisId,
        showInNavigator: false
      },
      baseName: "Volume",
      subChartId: this.chartValues.createChartId(),
      showAddOrdersOption: true,
      showChartTypeOption: true
    };
    console.log(subchart);

    return subchart;
  }


  public createOscillator(oscillatorType: string): StockSubChart {
    const axisId: string = this.chartValues.createYAxisId();
    const params = ChartStateUtils.createParams(oscillatorType);
    if("volumeSeriesID" in params){
      console.log(oscillatorType + " setting volume series id to " + this.chartValues.getVolumeSeriesId());
      params.volumeSeriesID = this.chartValues.getVolumeSeriesId();
    } else {
      console.log(oscillatorType + " NOT setting volume sereis id to " + this.chartValues.getVolumeSeriesId());
      console.log(Object.keys(params));
    }

    const subchart: StockSubChart =  {
      yAxisOptions: {
        top: this.chartValues.getTop(),
        height: this.chartValues.incrementTop(200),
        id: axisId
      },
      series: {
        //@ts-ignore
        type: oscillatorType,
        id: this.chartValues.createSeriesId(),
        linkedTo: this.chartValues.getStockChartSeriesId(),
        params: params,
        yAxis: axisId,
        name: "Oscillator " + oscillatorType +" " + Math.floor(Math.random() * 20),
        showInNavigator: false

      },
      baseName: "Oscillator " + oscillatorType,
      subChartId: this.chartValues.createChartId(),
      showAddOrdersOption: true,
      showChartTypeOption: false
    };


    console.log(subchart);

    return subchart;
  }


  public createOverlay(overlayType: string): StockSubChart {
    //const axisId: string = this.createYAxisId();
    const params = ChartStateUtils.createParams(overlayType);

    const subchart: StockSubChart =  {
      series: {
        //@ts-ignore
        type: overlayType,
        id: this.chartValues.createSeriesId(),
        linkedTo: this.chartValues.getStockChartSeriesId(),
        params: params,
        yAxis: this.chartValues.getStockChartYAxisId(),
        name: "Overlay " + overlayType +" " + this.createPeriodStr(params),//Math.floor(Math.random() * 20),
        showInNavigator: false,
        marker: {
          enabled: false
        },
      },
      baseName: "Overlay " + overlayType,
      subChartId: this.chartValues.createChartId(),
      showAddOrdersOption: true,
      showChartTypeOption: false
    };

    console.log(subchart);

    return subchart;
  }

  private createPeriodStr(params: any){
    if("period" in params) {
      return params["period"];
    } else {
      console.log("Params");
      console.log(params);
      console.log(Object.keys(params));
      return "";
    }

  }
}
