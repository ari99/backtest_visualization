import {Component, Input, OnInit} from '@angular/core';
import {GridService} from "../../services/grid.service";


/**
 * Table grids are for orders and rolling stats in combined and separate grids pages.
 * They have the data as columns and the backtest as a value of a column.
 */
@Component({
  selector: 'app-table-grid',
  templateUrl: './table-grid.component.html',
  styleUrls: ['./table-grid.component.scss']
})
export class TableGridComponent implements OnInit {
  //https://www.techiediaries.com/angular-local-json-files/
  @Input() tableData: any;
  @Input() convertValues: boolean = true;
  @Input() convertObjectToArray: boolean = false

  @Input() name: string= "";
  public columnDefs: any;
  public rowData: any;
  public gridOptions: any;

  constructor(private gridDataService: GridService) {}

  ngOnInit() {
    this.processInput();
    this.createGridOptions();
  }

  private convertKeyedIndexToList(tableData: any): any[] {
    const tableList = [];
    for (const [key, value] of Object.entries(tableData)) {
      tableList.push(value);
    }
    return tableList;
  }

  private makeColumnDefs(keysList: any[]) {

    const defs = [];
    for (const element of keysList) {
      const columnDefObj = {field: element};
      defs.push(columnDefObj);
    }
    return defs;
  }

  private processInput(): void {
    if(this.tableData == null || this.tableData.length === 0) {
      console.log("no elements, not showing table");
      return;
    }

    let tableList: any[] = [];
    if(this.convertObjectToArray) {
      tableList = this.convertKeyedIndexToList(this.tableData)
    } else {
      tableList = this.tableData;
    }

    if(this.convertValues) {
      tableList = this.gridDataService.convertValuesToColumns(tableList);
    }
    const tableKeys = Object.keys(tableList[0])
    this.columnDefs = this.makeColumnDefs(tableKeys);
    this.rowData = tableList;
  }




  private createGridOptions(): void {
    // Grid Options are properties passed to the grid
    this.gridOptions = {

      // default col def properties get applied to all columns
      defaultColDef: {
        flex: 1,
        minWidth: 100,
        // allow every column to be aggregated
        enableValue: true,
        // allow every column to be grouped
        enableRowGroup: true,
        // allow every column to be pivoted
        enablePivot: true,
        sortable: true,
        filter: true,
        resizable: true

      },
      //width: 700,
      sideBar: {hiddenByDefault: false, toolPanels:["columns", "filters"]},
      rowSelection: 'multiple', // allow rows to be selected
      animateRows: true, // have rows animate to new positions when sorted

      // example event handler
      /*onCellClicked: (params: any) => {
        console.log('cell was clicked', params)
      }*/
    };
  }


}
