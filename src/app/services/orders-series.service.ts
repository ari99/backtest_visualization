import { Injectable } from '@angular/core';

/**
 * Service for creating the series of orders added to the charts.
 */
@Injectable({
  providedIn: 'root'
})
export class OrdersSeriesService {

  // https://github.com/highcharts/highcharts-angular
  // https://github.com/highcharts/highcharts/issues/4199
  // https://api.highcharts.com/highstock/series.flags
  // https://api.highcharts.com/highstock/series.flags.data
  // https://www.highcharts.com/forum/viewtopic.php?t=44326
  // https://www.highcharts.com/docs/stock/flag-series
  // https://www.quantconnect.com/docs/v2/our-platform/api-reference/backtest-management/read-backtest/orders
  // order type enum: https://github.com/QuantConnect/Lean/blob/master/Common/Orders/OrderTypes.cs#L21
  // order status enum: https://github.com/QuantConnect/Lean/blob/master/Common/Orders/OrderTypes.cs#L87
  public createOrdersSeries(label: string, orders: any,
                            seriesId: string, ticker: string, onSeriesId: string): any {

    const flagDatas: any[] = [];
    for (let index of Object.keys(orders)) {
      const typedIndex: string = index;
      const order: any = orders[typedIndex];

      // only push filled orders for now
      if(parseInt(order.Status) == 3 && order.Symbol.Value == ticker) {
        const flagData = this.createFlagData(order);
        flagDatas.push(flagData);
      } else {
        //console.log("Unfilled order status: "+ order.Status);
        //console.log("or ticker not match "+ order.Symbol.Value + " to "+ ticker);
      }

    }

    return this.makeOrdersSeries(flagDatas, label, seriesId, onSeriesId);
  }

  private createFlagData(order: any): any {
    // "2014-02-07T05:00:00Z"
    //Gets the utc time the last fill was received, or null if no fills have been received.
    const lastFillTimeStr: string = order["LastFillTime"];
    const axisDate: number = Date.parse(lastFillTimeStr);

    // https://github.com/QuantConnect/Lean/blob/master/Common/Orders/OrderTypes.cs#L67
    const directionTxt = this.createDirectionText(order);
    const flagData = {
      x : axisDate,      // Point where the flag appears
      title : directionTxt, // Title of flag displayed on the chart
      text : directionTxt + " Quantity: " +order.Quantity+ " Value:  " + order.Value +
        "\n Tag: " + order.Tag,    // Text displayed when the flag are highlighted.
    };
    return flagData;
  }


  private createDirectionText(order: any): string {
    let directionTxt: string  = "";

    if(order.Direction == 0) {
      directionTxt = "Buy";
    } else if (order.Direction == 1) {
      directionTxt = "Sell";
    } else {
      directionTxt = "Hold"
    }
    return directionTxt;
  }

  private makeOrdersSeries(flagDatas: any[], label: string,
                           seriesId: string, onSeriesId: string,): any{
    console.log("Label " + label);

    const series = {
      type : 'flags',
      id: seriesId,
      data : flagDatas,
      name: label,
      onSeries : onSeriesId,  // ID of which series it should be placed on. If not defined
                              // the flag series will be put on the X axis
      shape : 'circlepin',  // Defines the shape of the flags.
      grouping: false,
      zIndex: 100,
      allowOverlapX: true
      //dataGrouping: {
        //approximation: 'average',
        //enabled: false,
      //}
    };

    return series;
  }

}
