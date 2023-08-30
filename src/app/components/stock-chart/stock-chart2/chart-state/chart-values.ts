export class ChartValues {
  private seriesCount: number = 0;
  private yAxisCount: number = 0;
  private chartCount: number = 0;
  private volumeSeriesId: string= "";
  private stockChartYAxisId: string = "";
  private stockChartSeriesId: string= "";
  public hasStockChart: boolean = false;

  private top: number = 0;

  public SERIES_ID_PREFIX: string = "series_";
  public Y_AXIS_ID_PREFIX: string = "axis_";
  public CHART_ID_PREFIX: string = "chart_";

  public setVolumeSeriesId(val: string): void {
    this.volumeSeriesId = val;
  }
  public getVolumeSeriesId(): string {
    return this.volumeSeriesId;
  }

  public setStockChartYAxisId(val: string): void {
    this.stockChartYAxisId = val;
  }

  public getStockChartYAxisId(): string {
    return this.stockChartYAxisId;
  }

  public setStockChartSeriesId(val: string): void {
    this.stockChartSeriesId = val;
  }

  public getStockChartSeriesId(): string {
    return this.stockChartSeriesId;
  }

  public setHasStockChart(val: boolean): void {
    this.hasStockChart = val;
  }

  public getHasStockChart(): boolean {
    return this.hasStockChart;
  }

  public createSeriesId(): string {
    this.seriesCount = this.seriesCount + 1;
    return this.SERIES_ID_PREFIX + this.seriesCount;
  }

  public createYAxisId(): string {
    this.yAxisCount = this.yAxisCount + 1;
    return this.Y_AXIS_ID_PREFIX + this.yAxisCount;
  }

  public createChartId(): string {
    this.chartCount = this.chartCount + 1;
    return this.CHART_ID_PREFIX + this.chartCount;
  }

  public incrementTop(height: number): number {
    this.top += height;
    return height;
  }

  public getTop(): number {
    return this.top;
  }
  public setTop(top: number): void {
    this.top = top;
  }

}
