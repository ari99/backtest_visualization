import {Component, Input, OnInit} from '@angular/core';
import * as Highcharts from "highcharts/highstock";
import HC_exporting from 'highcharts/modules/exporting';
HC_exporting(Highcharts);
// https://github.com/highcharts/highcharts-angular#to-load-a-module
import IndicatorsAll from "highcharts/indicators/indicators-all";
IndicatorsAll(Highcharts);

import { chartTypeOptions } from '../stock-chart/chart-options';
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent  implements OnInit {
  @Input() inputSeries:  Highcharts.SeriesOptionsType[] =[] ;
  @Input() chartTitle: string = "";

  //////////////start
  Highcharts: typeof Highcharts = Highcharts; // required
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {};
  //chartCallback: Highcharts.ChartCallbackFunction = function (chart) { ... } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = true; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false
  chartRef: Highcharts.Chart | void = undefined;
  //////////////////////////// end

  public chartTypeOptions = chartTypeOptions;


  ngOnInit(): void {
    console.log("input series");
    console.log(this.inputSeries);
    this.chartOptions = {
      chart: {type: "line"},
      title: {text: this.chartTitle},
      rangeSelector: {
        enabled: true,
        selected: 2
      },
      navigator: {
        enabled: true
      },
      xAxis: {
        type: 'datetime',
        title: {
          text: 'Date'
        }
      },
      series: this.inputSeries
    };
  }

  private chartType: string = "line";

  public onChartTypeChange(event: MatSelectChange ){
    console.log("in change");

    const value: string = event.value;
    this.chartType = value;

    if (this.chartRef instanceof Highcharts.Chart) {
      console.log("chart ref is an instance of chart");

      this.chartRef.update({
        chart: {
          type: value,
        }
      });
    }

  }


  // a normal function part of the class wont work
  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    console.log("Setting chart");
    //console.log(chart);
    this.chartRef = chart;
    //console.log(this.chartRef);
  };


}
