import {Injectable} from "@angular/core";
import {BacktestData} from "../../services/backtest.service";
import {StockChartService} from "../../services/stock-chart.service";
import {OrdersSeriesService} from "../../services/orders-series.service";
import {SeriesUtilService} from "./series-util.service";
import {CustomStatChartService} from "./custom-stat-chart.service";
import * as Highcharts from "highcharts/highstock";


/**
 * Logic for adding/removing backtest data  from the stock chart.
 */
@Injectable({
  providedIn: 'root'
})
export class BacktestChangeService {
  constructor(private stockService: StockChartService,
              private seriesUtilService: SeriesUtilService,
              private customStatChartService: CustomStatChartService,
              private btSeriesService: OrdersSeriesService,
  ) {
  }

  public onBacktestClicked(
                           bt: BacktestData,
                           ticker: string,
                           chartRef: Highcharts.Chart,
                           customStat: string,
                           customStatChartType: string,
                           indicatorParams: any
  ): void {

    const orderFlagsSeriesId = "order_flags_" + bt.label;
    const customStatSeriesId = this.customStatChartService.makeCustomStatSeriesId(bt.label);

    if(bt.show){
      const orderSeries = this.btSeriesService.createOrdersSeries(bt.label + " Orders", bt.data.Orders,
        orderFlagsSeriesId, ticker, ticker );

      const customStatSeries: any = this.customStatChartService.createCustomStatSeries(customStat,
        customStatChartType,
        ticker,
        indicatorParams,
        customStatSeriesId, bt);
      console.log("orderSeries");
      console.log(orderSeries);
      if (chartRef instanceof Highcharts.Chart) {

        this.seriesUtilService.removeSeries(orderFlagsSeriesId, chartRef);
        this.seriesUtilService.removeSeries(customStatSeriesId, chartRef);

        chartRef.addSeries(orderSeries);
        chartRef.addSeries(customStatSeries);

      }
    } else {
      console.log(" removing order series " + orderFlagsSeriesId);
      this.seriesUtilService.removeSeries(orderFlagsSeriesId, chartRef);
      this.seriesUtilService.removeSeries(customStatSeriesId, chartRef);
    }

  }
}
