import { Component } from '@angular/core';
import configJson from "../../../config.json";
import {BacktestData} from "../../services/backtest.service";

@Component({
  selector: 'app-all-grids-wrap',
  templateUrl: './all-grids-wrap.component.html',
  styleUrls: ['./all-grids-wrap.component.scss']
})
export class AllGridsWrapComponent {

  public btDatas: BacktestData[] = configJson.backtestData;

}
