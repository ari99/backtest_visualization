import {ChartState, StockSubChart} from "./chart-state/chart-state";
import {BacktestData} from "../../../services/backtest.service";

export class ChartUtils {
  public static makeLinkedSubCharts(chartState: ChartState, subchart: StockSubChart): StockSubChart[] {
    const yAxisId: string = subchart.series.yAxis;
    const subChartId: string = subchart.subChartId;
    const result: StockSubChart[] = [];
    if (chartState != undefined) {
      for (const stateChart of chartState?.stockSubCharts) {
        if (subChartId != stateChart.subChartId && yAxisId == stateChart.series.yAxis) {
          result.push(stateChart);
        }
      }
    }
    return result;
  }

  public static getBacktest(id: number, backtests: BacktestData[]): BacktestData | undefined {
    for(const bt of backtests) {
      if(bt.id == id){
        return bt;
      }
    }
    return undefined;
  }

}
