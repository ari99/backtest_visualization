import {Injectable} from "@angular/core";
import {StockChartService} from "../../services/stock-chart.service";
import {BacktestData} from "../../services/backtest.service";
import * as Highcharts from "highcharts/highstock";

import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
// https://github.com/highcharts/highcharts-angular#to-load-a-module
import IndicatorsAll from "highcharts/indicators/indicators-all";
import {SeriesOptionsType} from "highcharts/highstock";
import {SeriesUtilService} from "./series-util.service";
IndicatorsAll(Highcharts);

/**
 * Service for custom stats added to the default QuantConnect stats.
 */
@Injectable({
  providedIn: 'root'
})
export class CustomStatChartService {

  private customSeriesPrefix: string = "custom_stat";

  constructor(private stockService: StockChartService,
              private seriesUtilService: SeriesUtilService) {}

  public createCustomStatOptions(customStat: string,
                            customStatChartType: string,
                            ticker: string,
                            indicatorParams: any,
                            customStatSeriesId: string,
                            backtestData: BacktestData,
                            ): SeriesOptionsType {
    const options: SeriesOptionsType = this.createCustomStatSeries(customStat,
      customStatChartType,
      ticker,
      indicatorParams,
      customStatSeriesId, backtestData)

    return options;
  }

  public createCustomStatSeries(customStat: string,
                                customStatChartType: string,
                                ticker: string,
                                indicatorParams: any,
                                customStatSeriesId: string, backtestData: BacktestData): SeriesOptionsType {
    return  this.stockService.createDataSeriesOptions(customStatSeriesId,
      3,
      backtestData.label +" "+ customStat,
      customStat,
      customStatChartType,
      backtestData.data["securityStats"][ticker][customStat],
      indicatorParams);
  }

  public makeCustomStatSeriesId (label: string): string {
    const customStatSeriesId = this.customSeriesPrefix +"_"+ label;
    return  customStatSeriesId;
  }

}
