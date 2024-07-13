import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { DataDisplayService } from './../data-display.service';
import { map, tap } from 'rxjs';

@Component({
  selector: 'statjack-chart-v2',
  templateUrl: './statjack-chart-v2.component.html',
  styleUrls: ['./statjack-chart-v2.component.scss']
})

export class StatjackChartV2Component implements OnInit, AfterViewInit {
  @Input() singleChartData: any = {};
  @Input() chartId: string;
  @Input() label: string;
  @Input() chartDataType: string;

  chart: Chart;

  constructor(private dataDisplayService: DataDisplayService) {}

  ngOnInit(): void {
    this.dataDisplayService.zoomChart$
      .pipe(map(obj => obj[this.chartDataType]), tap(x => console.log(x)))
      .subscribe(data => this.createChart(data))
  }

  ngAfterViewInit(): void {
    this.createChart(this.singleChartData);
  }

  createChart(chartData) {
    if (this.chart != undefined) {
      this.chart.destroy();
    }
    let labels = Object.keys(chartData)
      .map(l => parseFloat(l))
      .sort((a, b) => a - b)
      .map(l => l.toString());

    let dataSet;
    
    if(this.chartDataType === 'totalWinnings') {
      dataSet = labels.map(l => chartData[l]?.totalWon);
    } else if(this.chartDataType === 'averageWinnings') {
      dataSet = labels.map(l => chartData[l]?.averageAmount);
    } else if(this.chartDataType === 'roi') {
      dataSet = labels.map(l => 100 * (chartData[l]?.totalWon / chartData[l]?.totalBet));
    }
    
    labels = labels.map(l => `${l} : ${chartData[l].instances}`);
    const data = {
      labels: labels,
      datasets: [{
        label: this.label,
        data: dataSet,
        fill: false, 
        borderColor: 'red',
        tension: 0.1
      }],
    };
    const options = {
      scales: {
        x: { grid: { drawOnChartArea: false } },
        y: { grid: { drawOnChartArea: false } }
      }
    };

    this.chart = new Chart(this.chartId, { type: 'bar', data, options });
  }
}







