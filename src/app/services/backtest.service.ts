import {Injectable} from '@angular/core';
import configJson from 'src/config.json';

export interface BacktestData {
  id: number;
  label: string;
  show: boolean;
  backtestPath: string;
  customBacktestDataPath: string;
  data?: any;
}

/**
 * Used by BacktestParserService to interact with and cache the backtest file data.
 */
@Injectable({
  providedIn: 'root'
})
export class BacktestService {
  public backtestDatas: BacktestData[] = configJson.backtestData;

  private fetchCache: any = {};

  public async getAllBacktests(): Promise<BacktestData[]> {
    //"32-51"
    const backtests: BacktestData[] = [];
    for (let i = 0; i < this.backtestDatas.length; i++) {
      let backtest = this.backtestDatas[i];
      backtest.data = await this.getData(backtest);
      backtests.push(backtest);
    }

    console.log("returning backtests");
    console.log(backtests);

    return backtests;
  }

  public async getData(backtest: BacktestData): Promise<any> {
    let jsonData: any = await this.getJsonData(backtest.backtestPath);
    let customStats: any = {};
    if(backtest.customBacktestDataPath && backtest.customBacktestDataPath != "") {
      customStats = await this.getJsonData(backtest.customBacktestDataPath);
    }
    // merge objects using spread operator
    let all: any = {
      ...jsonData,
      ...customStats
    };
    return all;
  }
    /*
    {totalUnrealizedProfit: [{timestamp, amount}] ,
     unrealizedProfit:
     {
        endingTotal: {timestamp, amount}
        totalPerPeriod :[{timestamp, amount}]}
        security : [{ ticker:APPL , perPeriod:  [{timestamp, amount}]}]

        }
     }
     */

  private async getJsonData(path: string){
    let jsonData: any = undefined;
    if (this.fetchCache.hasOwnProperty(path)) {
      console.log("using cache");
      jsonData = this.fetchCache[path];
    } else {
      const res = await fetch(path);
      jsonData = await res.json();
      this.fetchCache[path] = jsonData;
    }
    return jsonData;
  }


}


