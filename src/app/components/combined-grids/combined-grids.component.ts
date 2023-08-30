import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {DisplayOption} from "../all-grids/all-grids.component";
import {cloneDeep} from 'lodash';
import {BacktestParserService, CombinedBacktestState} from "../../services/backtest-parser.service";
import configJson from "../../../config.json";
import {BacktestData} from "../../services/backtest.service";

@Component({
  selector: 'app-combined-grid',
  templateUrl: './combined-grids.component.html',
  styleUrls: ['./combined-grids.component.scss']
})
export class CombinedGridsComponent implements OnInit{

  @Input() displayOptions: { [key: string]: DisplayOption; } = {
    statistics: {label:"Statistics", show: false},
    tradeStats: {label:"Trade Statistics", show: false},
    portfolioStats: {label:"Portfolio Statistics", show: false},
    runtimeStats: {label:"Runtime Statistics", show: false},
    alphaStats: {label:"Alpha Statistics", show: false},
    orders: {label:"Orders", show: false},
    rollingTradeStats: {label:"Rolling Trade Statistics", show: false},
    rollingPortfolioStats: {label:"Rolling Portfolio Statistics", show: false},
    rollingClosedTrades: {label:"Rolling Closed Trades (seems always blank)", show: false},
    totalPerformanceClosedTrades: {label:"Total Performance Closed Trades", show: false}
  };

  @Input() backtestDisplayOptions:  BacktestData[] = configJson.backtestData;

  public state: CombinedBacktestState | void = undefined;
  public isReady: boolean = false;

  constructor( private parser: BacktestParserService , private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.parser.doAllData(this.backtestDisplayOptions).then((value) => {
      console.log(value);
      this.state = value;
      this.isReady = true;
    });
  }

  public closeAll(){
    for(let option in this.displayOptions){
      this.displayOptions[option].show = false;
    }
  }

  public closeAllBacktests(){
    for (let i = 0; i < this.backtestDisplayOptions.length ; i++) {
      this.backtestDisplayOptions[i].show = false;
    }
    this.state = this.parser.resetData();
    this.reloadGrids();

  }

  private reloadGrids() {
    const options = cloneDeep(this.displayOptions);
    this.closeAll();
    this.cdr.detectChanges();
    this.displayOptions = options;
    //this.cdr.detectChanges();
  }

  public openAllBacktests(){
    for (let i = 0; i < this.backtestDisplayOptions.length ; i++) {
      this.backtestDisplayOptions[i].show = true;
    }
    this.parser.doAllData(this.backtestDisplayOptions).then(value => {
      this.state =value;
    });
    this.reloadGrids();

  }

  public toggleDisplayOption(key: string) {
    this.displayOptions[key].show = !this.displayOptions[key].show;
  }

  public toggleBacktestDisplayOptions(index: number) {

    this.backtestDisplayOptions[index].show = !this.backtestDisplayOptions[index].show;
    this.parser.doAllData(this.backtestDisplayOptions).then( (value) => {
      this.state = value;
      this.reloadGrids();
    });

  }

  /*private async doAllData() {
    this.resetData();
    for (let i = 0; i < this.backtestDisplayOptions.length ; i++) {
      let item = this.backtestDisplayOptions[i];
      if(item.show) {
        let jsonData = undefined;
        if(this.fetchCache.hasOwnProperty(item.path)){
          console.log("using cache");
          jsonData = this.fetchCache[item.path];
        } else {
          const res = await fetch(item.path);
          jsonData = await res.json();
          this.fetchCache[item.path] = jsonData;
        }
        //console.log(jsonData);
        this.appendData(jsonData, item.label);
      }
    }
  }*/


}
