import {Injectable} from "@angular/core";
import {StockChartService} from "../../services/stock-chart.service";
import {SeriesUtilService} from "./series-util.service";
import * as Highcharts from "highcharts/highstock";

/**
 * Overlay utils.
 */
@Injectable({
  providedIn: 'root'
})
export class OverlayService {

  private overlayType: string = "pc";
  private OVERLAY_SERIES_ID: string = "overlay";

  constructor(private stockService: StockChartService,
            private seriesUtilService: SeriesUtilService) { }

  // https://www.highcharts.com/docs/stock/technical-indicator-series
  // https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/sma/
  // https://www.highcharts.com/blog/tutorials/creating-custom-technical-indicators-financial-charts/
  // https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/maps/members/series-update/
  // https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/demo/all-indicators
  // https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/stock/indicators/sma/

  public updateOverlay(typeValue: string,
                        ticker: string, //      this.stockData.ticker,
                        indicatorParams: any, //this.indicatorParams
                        chartRef: Highcharts.Chart) {
    this.overlayType = typeValue;
    const options: any = this.stockService.createIndicatorSeriesOptions(this.OVERLAY_SERIES_ID,
      0,
      typeValue,
      ticker,
      indicatorParams);
    this.seriesUtilService.updateSeries(this.OVERLAY_SERIES_ID, options, chartRef);
  }
}
