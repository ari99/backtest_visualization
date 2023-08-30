import {StockSubChart} from "./chart-state";
import * as Highcharts from "highcharts/highstock";


export class ChartStateUtils {
  public static getSubChart(subChartId: string, stockSubCharts: StockSubChart[] ): StockSubChart | undefined {
    for(let subchart of stockSubCharts){
      if(subchart.subChartId == subChartId){
        return subchart;
      }
    }
    return undefined;
  }
  //https://github.com/highcharts/highcharts/blob/9b3c23b50892f96487593fd7e553d9432e60f635/ts/Stock/Indicators/MACD/MACDIndicator.ts#L97
  public static createParams(seriesType: string): any {
    const types: any= Highcharts.Series.types;
    if( types.hasOwnProperty(seriesType)) {
      console.log('Looking for params');
      console.log( types[seriesType].defaultOptions.params);

      console.log(types);
      console.log( types[seriesType].defaultOptions);
      console.log( types[seriesType].types);
      //console.log( new types[seriesType]());
      //Highcharts.SMAIndicator.defaultOptions
      //Highcharts.Series.SeriesRegistry.types;
      //MACDIndicator.defaultOptions.params;
      return { ...(types[seriesType].defaultOptions.params) };
    }
    return {};
  }
}
