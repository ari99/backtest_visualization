import {Injectable} from "@angular/core";
import * as Highcharts from "highcharts/highstock";
import {SeriesOptionsType} from "highcharts/highstock";

import { StockSubChart} from "./stock-chart2/chart-state/chart-state";

/**
 * Service for adding/removing subcharts from a main chart.
 */
@Injectable({
  providedIn: 'root'
})
export class ChartManagerService {

  public addSubchart(chartRef: Highcharts.Chart, stockSubChart: StockSubChart): void{
    if (stockSubChart.yAxisOptions) {
      chartRef.addAxis(stockSubChart.yAxisOptions);
    }
    chartRef.addSeries(stockSubChart.series as SeriesOptionsType);
  }

  public removeSubchart(chartRef: Highcharts.Chart, stockSubChart: StockSubChart): void{
    if(stockSubChart.series && stockSubChart.series.id){
      chartRef.get(stockSubChart.series.id)?.remove(false);
    }

    if(stockSubChart.yAxisOptions && stockSubChart.yAxisOptions.id){
      chartRef.get(stockSubChart.yAxisOptions.id)?.remove(false);
    }
  }

  public updateSubChart(chartRef: Highcharts.Chart, stockSubChart: StockSubChart,
                        linkedSubCharts: StockSubChart[]): void{
    console.log(" in chart manager service update sub chart");
    console.log(stockSubChart.series);
    //const axises: Axis[] = chartRef.yAxis
    //const series: Series[] = chartRef.series;
    if(stockSubChart.series && stockSubChart.series.id){
      chartRef.get(stockSubChart.series.id)?.remove(false);
    }

    if(stockSubChart.yAxisOptions && stockSubChart.yAxisOptions.id){
      chartRef.get(stockSubChart.yAxisOptions.id)?.remove(false);
    }

    if (stockSubChart.yAxisOptions) {
      chartRef.addAxis(stockSubChart.yAxisOptions);
    }
    console.log("Adding subcharts: ");
    console.log(stockSubChart.series);

    // series has to come after axis
    chartRef.addSeries(stockSubChart.series as SeriesOptionsType);
    console.log(stockSubChart);
    for(const linked of linkedSubCharts){
      console.log(linked);
      chartRef.get(linked.series.id)?.remove(false);
      console.log("linked series: ");
      console.log(linked.series);

      chartRef.addSeries(linked.series);
    }
    chartRef.redraw();

  }


  updateHeight(chartRef: Highcharts.Chart, height: number): void {
    console.log("in updateHeight setting height to" +height );
    chartRef.setSize(chartRef.chartWidth, height+50 );
  }

  updateTops(chartRef: Highcharts.Chart, subcharts: StockSubChart[]): void {
    console.log("subcharts to update tops");
    console.log(subcharts);

    for(const subchart of subcharts) {
      if(subchart.yAxisOptions && subchart.yAxisOptions.id) {
        // @ts-ignore
        chartRef.get(subchart.yAxisOptions.id)?.update(subchart.yAxisOptions, false);
      }
    }

  }


}
