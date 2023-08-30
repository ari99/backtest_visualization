import { Injectable } from '@angular/core';
import {BacktestData, BacktestService} from "./backtest.service";
import {GridService} from "./grid.service";


export interface GroupedData {
  label: string;
  rows: any[];
}
export interface CombinedBacktestState {

  // data for scalar component
  alphaStats: GroupedData[];
  statistics: GroupedData[];
  tradeStatistics: GroupedData[];
  runtimeStatistics: GroupedData[];
  portfolioStatistics: GroupedData[];

  //data for table component
  rollingPortfolioStats: any[];
  rollingClosedTrades: any[];
  rollingTradeStats: any[];
  orders: any[];
  closedTrades: any[];
}

/**
 * Parses backtest data from QuantConnect. This data is augmented by custom stats gathered during backtests.
 */
@Injectable({
  providedIn: 'root'
})
export class BacktestParserService {

  constructor(private gridDataService: GridService, private backtestService: BacktestService) { }

  public resetData() {
    const state: CombinedBacktestState ={
      alphaStats: [],
      statistics: [],
      tradeStatistics: [],
      runtimeStatistics: [],
      portfolioStatistics: [],
      rollingPortfolioStats: [],
      rollingClosedTrades: [],
      rollingTradeStats: [],
      orders: [],
      closedTrades: []
    };

    return state;
  }

  public async doAllData(backtestDisplayOptions: BacktestData[]): Promise<CombinedBacktestState> {
    let state: CombinedBacktestState = this.resetData();
    for (let i = 0; i < backtestDisplayOptions.length ; i++) {
      let item = backtestDisplayOptions[i];
      if(item.show) {
        let jsonData = undefined;
        jsonData = await this.backtestService.getData(item);
        state = this.appendData(state, jsonData, item.label);
      }
    }
    return state;
  }

  private appendData(state: CombinedBacktestState, jsonData: any, label: string): CombinedBacktestState {

    state.alphaStats.push({"label": label,
      rows: this.gridDataService.convertValuesToColumns([jsonData['AlphaRuntimeStatistics']])[0]});
    state.statistics.push({"label": label,rows: jsonData.Statistics});
    state.tradeStatistics.push({"label": label, rows: jsonData.TotalPerformance.TradeStatistics});
    state.runtimeStatistics.push({"label": label, rows: jsonData.RuntimeStatistics});
    state.portfolioStatistics.push({"label": label, rows: jsonData.TotalPerformance.PortfolioStatistics});

    this.appendRollingData(state, jsonData['RollingWindow'], label);

    state.rollingClosedTrades = state.rollingClosedTrades.concat(this.addBtLabelAsColumn(
      this.gridDataService.getJsonPathFromList(jsonData['RollingWindow'], ["ClosedTrades"]), label));

    state.orders = state.orders.concat(this.addBtLabelAsColumn(this.convertObjectToArray(jsonData.Orders), label));
    state.closedTrades = state.closedTrades.concat(
      this.addBtLabelAsColumn(this.convertObjectToArray(jsonData.TotalPerformance.ClosedTrades), label));

    return state;
  }

  private appendRollingData(state: CombinedBacktestState, rollingWindows: any, label: string): CombinedBacktestState{
    for(let key of Object.keys(rollingWindows)) {
      const rollingWindow: any = rollingWindows[key];
      const tradeStats: any = rollingWindow["TradeStatistics"];
      const portfolioStatistics: any = rollingWindow["PortfolioStatistics"];
      const startTradeTimestamp:  number = Date.parse(tradeStats["StartDateTime"]);
      const endTradeTimestamp:  number = Date.parse(tradeStats["EndDateTime"]);
      portfolioStatistics["startTradeTimestamp"] = startTradeTimestamp;
      portfolioStatistics["endTradeTimestamp"] = endTradeTimestamp;
      tradeStats["startTradeTimestamp"] = startTradeTimestamp;
      tradeStats["endTradeTimestamp"] = endTradeTimestamp;

      state.rollingTradeStats = state.rollingTradeStats.concat(
        this.addBtLabelAsColumn([tradeStats], label));

      state.rollingPortfolioStats = state.rollingPortfolioStats.concat(
        this.addBtLabelAsColumn([portfolioStatistics], label));
    }
    return state;
  }

  private addBtLabelAsColumn( rows: any[], label: string ) {
    for (let i = 0; i < rows.length; i++) {
      const currentRow: any = rows[i];
      currentRow["backtest"] = label;
      rows[i] = currentRow;
    }
    return rows;
  }

  private convertObjectToArray(obj: any): any[]{
    const res: any[] = [];
    for(let key of Object.keys(obj)){
      res.push(obj[key]);
    }
    return res
  }


}
