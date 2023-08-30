import {Injectable} from "@angular/core";
import * as Highcharts from "highcharts/highstock";

@Injectable({
  providedIn: 'root'
})
export class SeriesUtilService {

  public removeSeries(seriesId: string, chartRef: Highcharts.Chart) {
    if (chartRef instanceof Highcharts.Chart) {

      const series = chartRef.get(seriesId);

      if (series) {
        console.log("Removing order series: " + seriesId);
        series.remove(false);
      } else{
        console.log("no order series to remove: "+seriesId);
      }

    }
  }

  public updateSeries(id: string, options: any,  chartRef: Highcharts.Chart){

    if (chartRef instanceof Highcharts.Chart) {
      const series = chartRef.get(id);

      if (series) {
        console.log("in updateSeries going to REMOVE  " + id);
        series.remove(false);
        console.log("ADDING series to chart " + id);
        console.log(options);
        // @ts-ignore
        chartRef.addSeries(options);
      } else {
        console.log("ADDING series to chart " + id);
        chartRef.addSeries(options);
      }
    }
  }

}
