import { Injectable } from '@angular/core';

/**
 * Sets up the grid data.
 */
@Injectable({
  providedIn: 'root'
})
export class GridService {

  constructor() { }

  public getJsonPathFromList(list: any[], listPath: string[]): any[]{
    const resList = [];
    for (const [key, elem] of Object.entries(list)) {
      let res = elem;
      for (const k of listPath) {
        res = res[k];
      }
      resList.push(res);
    }

    return resList;
  }

  public convertValuesToColumns(tableList: any) {
    const newTableList = [];

    for (const item of tableList) {
      const newObj: any = {}
      for (const [key, value] of Object.entries(item)) {
        const typedval: any= value;
        //https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
        const checkType = (o: any) => Object.prototype
          .toString
          .call(o)
          .slice(8, -1)
          .toLowerCase();

        const valType = checkType(value);

        //console.log("TYPE for key " + key + " value  " + value + " is " + checkType(value));
        if (key == "Properties") {
        } else if (valType == "object") {
          for (const [valKey, valValue] of Object.entries(typedval)) {
            const newKey = key + "_" + valKey;
            newObj[newKey] = valValue;
          }
        } else if (valType == "array") {
          newObj[key] = typedval.join();
        } else {
          newObj[key] = typedval;
        }
      }
      newTableList.push(newObj);
    }

    return newTableList;
  }
}
