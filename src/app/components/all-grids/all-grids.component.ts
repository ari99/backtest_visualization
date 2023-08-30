import {Component, Input, OnInit} from '@angular/core';
import {GridService} from "../../services/grid.service";
import {GroupedData} from "../../services/backtest-parser.service";

export interface DisplayOption {
  label: string;
  show: boolean;
}

@Component({
  selector: 'app-all-grids',
  templateUrl: './all-grids.component.html',
  styleUrls: ['./all-grids.component.scss']
})
export class AllGridsComponent implements OnInit {
  @Input() backtestPath: string="";
  @Input() backtestLabel: string="";

  displayOptions: { [key: string]: DisplayOption; } = {
      statistics: {label:"Statistics", show: false},
      tradeStats: {label:"Trade Statistics", show: false},
      portfolioStats: {label:"Portfolio Statistics", show: false},
      runtimeStats: {label:"Runtime Statistics", show: false},
      alphaStats: {label:"Alpha Statistics", show: false},
      orders: {label:"Orders", show: false},
      rollingTradeStats: {label:"Rolling Trade Statistics", show: false},
      rollingPortfolioStats: {label:"Rolling Portfolio Statistics", show: false},
      rollingClosedTrades: {label:"Rolling Closed Trades", show: false},
      totalPerformanceClosedTrades: {label:"Total Performance Closed Trades", show: false}
  };
  btData: any;

  // data for scalar component
  alphaStats: GroupedData[] = [];
  statistics: GroupedData[] = [];
  tradeStatistics: GroupedData[] = [];
  runtimeStatistics: GroupedData[] = [];
  portfolioStatistics: GroupedData[] = [];

  //data for table component
  rollingPortfolioStats: any[] = [];
  rollingClosedTrades: any[] = [];
  rollingTradeStats: any[] = [];
  orders: any[] = [];
  closedTrades: any[] = [];

  constructor(private gridDataService: GridService) {}

  // https://www.techiediaries.com/angular-local-json-files/
  ngOnInit() {
    fetch(this.backtestPath).then(res => res.json())
      .then(jsonData => {
        this.btData = jsonData;
        this.setupData();
      });
  }

  public toggleDisplayOption(key: string){
    this.displayOptions[key].show = !this.displayOptions[key].show;
  }

  private setupData() {
    this.alphaStats = [{"label": "values",
      "rows": this.gridDataService.convertValuesToColumns([this.btData['AlphaRuntimeStatistics']])[0]}];

    // data for scalar component
    this.alphaStats = [{"label": "values",
      "rows": this.gridDataService.convertValuesToColumns([this.btData['AlphaRuntimeStatistics']])[0]}];
    this.statistics= [{"label": "values", "rows": this.btData.Statistics}];
    this.tradeStatistics= [{"label": "values", "rows": this.btData.TotalPerformance.TradeStatistics}];
    this.runtimeStatistics= [{"label": "values", "rows": this.btData.RuntimeStatistics}];
    this.portfolioStatistics= [{"label": "values", "rows": this.btData.TotalPerformance.PortfolioStatistics}];

    //data for table component
    this.rollingTradeStats = this.gridDataService.getJsonPathFromList(this.btData['RollingWindow'], ["TradeStatistics"]);
    this.rollingPortfolioStats = this.gridDataService.getJsonPathFromList(this.btData['RollingWindow'], ["PortfolioStatistics"]);
    this.rollingClosedTrades = this.gridDataService.getJsonPathFromList(this.btData['RollingWindow'], ["ClosedTrades"]);
    this.orders = this.btData.Orders;
    this.closedTrades = this.btData.TotalPerformance.ClosedTrades;
  }

}
