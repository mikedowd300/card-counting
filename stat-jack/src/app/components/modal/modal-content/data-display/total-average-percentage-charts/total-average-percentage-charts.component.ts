import { Component, Input, OnInit } from '@angular/core';
import { DataDisplayService } from './../data-display.service';

@Component({
  selector: 'total-average-percentage-charts',
  templateUrl: './total-average-percentage-charts.component.html',
  styleUrls: ['./total-average-percentage-charts.component.scss']
})

/*
  This component will create and display 3 charts. 
  (1) The total amount won by count,
  (2) The average amount won by count
  (3) The average ROI (percentage) won by count
  A single control to filter out counts above and below a given count will apply to all 3 charts
  The data input is not restricted to a table, it can be for an individual player or for and data set of the correct shape (shape To Be Defined)
*/
export class TotalAveragePercentageChartsComponent implements OnInit {
  @Input() data: any = {};
  @Input() prefix: string = '';

  filterAtOrBelow: number = null;
  filterAtOrAbove: number = null;
  datasetMap = {
    totalWinnings: { 
      label: 'Total Amount Won', 
      chartId: '',
      chartData: {},
    },
    averageWinnings: { 
      label: 'Average Amount Won', 
      chartId: '',
      chartData: {},
    },
    roi: { 
      label: 'Average ROI', 
      chartId: '',
      chartData: {},
    }
  };
  datasetKeys: string[] = [];

  constructor(private dataDisplayService: DataDisplayService) {}

  ngOnInit(): void {
    // console.log(this.data);
    this.datasetKeys = Object.keys(this.datasetMap);
    this.datasetMap.totalWinnings.chartData = this.data;
    this.datasetMap.averageWinnings.chartData = this.getAverageWinningsByCount();
    this.datasetMap.roi.chartData = this.data;
    this.datasetKeys.forEach(
      key => this.datasetMap[key].chartId = `${this.prefix}-${key}-chart`
    );
  }

  getAverageWinningsByCount() {
    const totabByCountObj = this.datasetMap.totalWinnings.chartData;
    let averageByCount = {};
    console.log(totabByCountObj);
    Object.keys(totabByCountObj).forEach(key => averageByCount[key] = {
      instances: totabByCountObj[key].instances,
      averageAmount: totabByCountObj[key].totalWon / totabByCountObj[key].instances
    })
    return averageByCount;
  }

  filterCounts() {
    // The key in the key: value pair IS the stringified count
    let newTotalWinnings = {};
    let newAverageWinnings = {};
    let newRoi = {};
    const filteredKeys = Object.keys(this.data).filter(key => {
      let valid = true;
      if(this.filterAtOrBelow) {
        if(parseInt(key) <= this.filterAtOrBelow) {
          valid = false
        }
      }
      if(this.filterAtOrAbove && valid) {
        if(parseInt(key) >= this.filterAtOrAbove) {
          valid = false
        }
      }
      return valid;
    })

    filteredKeys.forEach(key => {
      newTotalWinnings[key] = { ...this.datasetMap.totalWinnings.chartData[key] };
      newAverageWinnings[key] = { ...this.datasetMap.averageWinnings.chartData[key] };
      newRoi[key] = { ...this.datasetMap.roi.chartData[key] };
    })

    this.dataDisplayService.zoomChart$.next({
      totalWinnings: { ...newTotalWinnings },
      averageWinnings: { ...newAverageWinnings },
      roi: { ...newRoi }
    })
  }

  ensureRange(direction: string) {
    if(direction === 'above') {
      if(this.filterAtOrAbove < 2) {
        this.filterAtOrAbove = null
      } else if(this.filterAtOrAbove > -1) {
        this.filterAtOrBelow = null
      }
    }
  }
}







