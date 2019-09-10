export class ChartUtils {

  static getValues(tab, onlyAverage) {
    let result = [];

    console.log("onlyAv", onlyAverage);
    if (onlyAverage !== false) {
      result.push(Math.max.apply(Math, tab));
      result.push(Math.min.apply(Math, tab));
    }
    const sum = tab.reduce(function(a,b) { return a + b});
    const average = sum / tab.length;
    result.push(average);
    return result;
  }

  static parseTable(oldTab, keyFrom, keyTo = null, max) {

    let oldTabTemp = [];

    if (keyFrom !== -1 && keyTo === -1) {
      console.log("parse HERE", max);
      oldTabTemp = oldTab.slice(keyFrom);
    } else if (keyFrom !== -1 && keyTo !== -1) {
      // Have to add 2 because of the table modification in Dropdown.
      oldTabTemp = oldTab.slice(keyFrom, keyTo + keyFrom + 2);
    } else {
      oldTabTemp = oldTab;
    }
    let newTab = [];

    if (oldTabTemp.length > max) {
      console.log("here with max =", max);
      const delta = Math.floor(oldTabTemp.length / max);

      for (let i = 0; i < oldTabTemp.length; i += delta) {
        newTab.push(oldTabTemp[i]);
      }
      return newTab;
    }

    return oldTabTemp;
  }
}
