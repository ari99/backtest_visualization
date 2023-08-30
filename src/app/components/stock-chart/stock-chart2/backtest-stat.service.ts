import {Injectable} from "@angular/core";
import {BacktestData} from "../../../services/backtest.service";


@Injectable({
  providedIn: 'root'
})
export class BacktestStatService {

  public createChartOptions(backtestData: BacktestData){
    const seriesOptions: {[key: string]: string[]} = {};
    for (const [key1, elem] of Object.entries(backtestData.data.Charts)) {
      // @ts-ignore
      const topName: string = elem["Name"];

      console.log(" elem is ")
      console.log(elem);

      // @ts-ignore
      for(const [key2, elem2] of Object.entries(elem["Series"]) ){
        // @ts-ignore
        //const seriesName: string = elem2["Name"];
        //const unit: string = series.Unit;
        //const values: [] = series.Values;
        const resultkey: string = key1 + " - " + key2;
        seriesOptions[resultkey]  = ["Charts",key1, "Series", key2, "Values"];
      }
    }
    return seriesOptions;
  }



}
