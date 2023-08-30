import {Injectable} from "@angular/core";
import {StockChartService} from "../../services/stock-chart.service";
import {SeriesUtilService} from "./series-util.service";
import * as Highcharts from "highcharts/highstock";

/**
 * Oscillator utils.
 */
@Injectable({
  providedIn: 'root'
})
export class OscillatorService {

  private oscillatorType: string = "macd";
  private OSCILLATOR_SERIES_ID: string = "oscillator";

  constructor(private stockService: StockChartService,
              private seriesUtilService: SeriesUtilService) { }

  public updateOscillator(typeValue: string,
                           ticker: string,
                           indicatorParams: any,
                           chartRef: Highcharts.Chart ): void {
    this.oscillatorType = typeValue;
    const options: any = this.stockService.createIndicatorSeriesOptions(this.OSCILLATOR_SERIES_ID,
      2,
      typeValue,
      ticker,
      indicatorParams);
    this.seriesUtilService.updateSeries(this.OSCILLATOR_SERIES_ID, options, chartRef);
  }


}
