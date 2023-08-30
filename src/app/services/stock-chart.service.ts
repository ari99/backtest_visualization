import { Injectable } from '@angular/core';

/**
 * Tooling for setting up the stock chart.
 */
@Injectable({
  providedIn: 'root'
})
export class StockChartService {

  public createDataSeriesOptions(id: string,
                                  yAxis: number | string,
                                  seriesName: string,
                                  customStat: string,
                                  typeValue: string,
                                  seriesData: any[],
                                  indicatorParams: any): any {

    let options: any = {
      // @ts-ignore
      name: seriesName,
      type: typeValue,
      data: seriesData,
      id: id,
      yAxis: yAxis
    };
    options = this.addParamsToOptions(options, indicatorParams, customStat);
    return options;
  }

  public createIndicatorSeriesOptions(id: string,
                                      yAxis: number,
                                      typeValue: string,
                                      linkedTo: string,
                                      indicatorParams: any): any {
        let options: any = {
          // @ts-ignore
          type: typeValue,
          linkedTo: linkedTo,
          id: id,
          yAxis: yAxis
        };
        options = this.addParamsToOptions(options, indicatorParams, typeValue);
        return options;
  }

  private addParamsToOptions(options: any, indicatorParams: any, key: string): any {
    if (Object.keys(indicatorParams).includes(key)) {
      console.log("settting params to " + indicatorParams[key]);
      console.log(indicatorParams[key]);

      options.params = indicatorParams[key];
    } else {
      console.log("TypeValue " + key + " not in ");
      console.log(Object.keys(indicatorParams));
    }
    return options;
  }

}
