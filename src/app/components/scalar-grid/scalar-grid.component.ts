import {Component, Input, OnInit} from '@angular/core';
import {GroupedData} from "../../services/backtest-parser.service";

@Component({
  selector: 'app-scalar-grid',
  templateUrl: './scalar-grid.component.html',
  styleUrls: ['./scalar-grid.component.scss']
})
export class ScalarGridComponent implements OnInit  {
  @Input() keyValGridOptions: any;
  @Input() tableData: GroupedData[] = [];
  @Input() name: string = "";
  public columnDefs: any[] = [];
  public rowData: any;

  ngOnInit() {
    console.log("input is ");
    console.log(this.tableData);
    this.processInput();
    this.createKeyValGridOptions();
  }

  private  convertKeyValsToRows(tableData: any, label: string): any[] {

    const keysList =Object.keys(tableData);
    const rowDatas = [];
    for (const element of keysList) {
      const rowData: any = {"name": element };
      rowData[label] = tableData[element];
      rowData["val"] = tableData[element];
      rowDatas.push(rowData);
    }
    return rowDatas;
  }

  private  convertKeyValsToRows2(tableData: any, label: string): any[] {
    const keysList =Object.keys(tableData);
    const rowDatas = [];
    for (const element of keysList) {
      const rowData: any = {"name": element };
      rowData["val"] = tableData[element];
      rowDatas.push(rowData);
    }
    return rowDatas;
  }

  private processInput(): void {
    const valueColumns: any[] = [];
    let finalRows: any[] = [];
    for (let btData of this.tableData) {

      const newData = this.convertKeyValsToRows(btData.rows, btData.label);

      if (finalRows.length > 0) {
        for (let i = 0; i < finalRows.length; i++) {
          const currentRowName = finalRows[i]["name"];
          const newFinalRow  = finalRows[i];
          const newValue = this.getValue(currentRowName, newData);
          newFinalRow[btData.label] = newValue;
          finalRows[i] = newFinalRow;
        }
      } else {
        finalRows = newData;
      }
      valueColumns.push({"field": btData.label});
    }

    // this.columnDefs = [{"field": "name", rowGroup: true, hide: true  }];
    this.columnDefs = [{"field": "name"}];

    this.columnDefs = this.columnDefs.concat(valueColumns);
    console.log("Final rows");
    console.log(finalRows);
    this.rowData = finalRows;
  }

  private getValue(nameValue: string, currentRows: any[]) {
      for (let c = 0; c < currentRows.length; c++) {
        if(currentRows[c]["name"] == nameValue){
          return currentRows[c]["val"];
        }
      }
  }

  private createKeyValGridOptions(): void {

    this.keyValGridOptions = {

      // default col def properties get applied to all columns
      defaultColDef: {
        //flex: 1,
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
      sideBar: {hiddenByDefault: false, toolPanels: ["filters"], position: "right"},
      rowSelection: 'multiple', // allow rows to be selected
      animateRows: true, // have rows animate to new positions when sorted

      // example event handler
      /*onCellClicked: (params: any) => {
        console.log('cell was clicked', params)
      }*/
    };
  }


}
