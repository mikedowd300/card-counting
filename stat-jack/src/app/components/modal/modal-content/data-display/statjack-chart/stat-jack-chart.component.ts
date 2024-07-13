import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'statjack-chart',
  templateUrl: './statjack-chart.component.html',
  styleUrls: ['./statjack-chart.component.scss']
})

export class StatjackChartComponent implements OnInit, AfterViewInit {
  @Input() data: any = {};
  @Input() prefix: string = '';

  chart: Chart;
  chartId: string;
  filterAtOrBelow: number = null;
  filterAtOrAbove: number = null;
  datasetLabelMap = {
    "total-table-winnings": 'Total Amount Won By Count',
    "average-table-winnings": 'Average Amount Won By Count',
    "table-roi": 'Average Rate of Return By Count'
  }

  constructor() {}

  ngOnInit(): void {
    this.chartId = `${this.prefix}-chart`;
  }

  ngAfterViewInit(): void {
    this.createChart(this.data);
  }

  filterCounts() {
    // The key in the key: value pait IS the stringified count
    let newData = {};
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
    filteredKeys.forEach(key => newData[key] = { ...this.data[key] });
    this.createChart(newData)
  }

  createChart(chartData) {
    if (this.chart != undefined) {
      this.chart.destroy();
    }
    let labels = Object.keys(chartData)
      .map(l => parseFloat(l))
      .sort((a, b) => a - b)
      .map(l => l.toString());
    const dataSet = !chartData[0].totalBet 
      ? labels.map(l => chartData[l].amount) 
      : labels.map(l => 100 * (chartData[l].totalWon / chartData[l].totalBet));
    labels = labels.map(l => `${l} : ${chartData[l].instances}`);
    const data = {
      labels: labels,
      datasets: [{
        label: this.datasetLabelMap[this.prefix],
        data: dataSet,
        fill: false, 
        borderColor: 'red',
        tension: 0.1
      }],
    };
    const options = {
      scales: {
        x: {
          grid: {
            drawOnChartArea: false
          }
        },
        y: {
          grid: {
            drawOnChartArea: false
          }
        }
      }
    };

    this.chart = new Chart(this.chartId, { type: 'bar', data, options });
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







