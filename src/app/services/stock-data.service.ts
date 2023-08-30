import { Injectable } from '@angular/core';
import configJson from "../../config.json";
import * as Papa from "papaparse";
import {ParseResult} from "papaparse";


export interface StockData {
  show: boolean;
  ticker: string;
  path: string;
  ohlc?: number[][];
  volume?: number[][];
}
export interface StockBar{
  close: number;
  high: number;
  index: number;
  low: number;
  open: number;
  symbol: string;
  time: number;
  volume: number;
}
/**
 * Parses stock data csv's.
 */
@Injectable({
  providedIn: 'root'
})
export class StockDataService {

  public stockDatas: StockData[] = configJson.stockDatas;

  constructor() { }

  public async getStockDatas(): Promise<StockData[]> {
    const newStockDatas: StockData[] = [];
    for(let current of this.stockDatas) {
      const stockData: StockData = await this.getStockData(current);
      newStockDatas.push(stockData);
    }
    return newStockDatas;
  }


  public async getStockData(stockData: StockData): Promise<StockData> {

    return new Promise<StockData>((resolve, reject) => {

      Papa.parse(stockData.path, {
        header: true,
        skipEmptyLines: true,
        delimiter: ",",
        download: true,
        dynamicTyping: true,
        complete: (results: ParseResult<StockBar>, file) => {
          resolve(this.completeStockData(stockData, results));
        },
      })

    });

  }

  private completeStockData(stockData: StockData, results: ParseResult<StockBar>): StockData {
    const ohlc = [];
    const volume = [];
    const dataLength = results.data.length;
    const data: StockBar[] = results.data;
    //https://www.highcharts.com/demo/stock/all-indicators/brand-dark
    //https://dev.to/mahdi_falamarzi/how-to-read-csv-file-in-typescript-react-app-106h
    // results.errors and results.meta available as well
    // https://www.papaparse.com/docs#results
    for (var i = 0; i < dataLength; i += 1) {

      ohlc.push([
        data[i].time,
        data[i].open,
        data[i].high,
        data[i].low,
        data[i].close,
      ]);

      volume.push([
        data[i].time, // the date
        data[i].volume // the volume
      ]);
    }

    stockData.ohlc  =  ohlc;
    stockData.volume = volume;
    return stockData;
  }

}
