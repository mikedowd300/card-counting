import { Component, OnInit } from '@angular/core';
import { SurrenderService } from '../../../../services/surrender.service';
import { ChartCell, SurrenderStrategyEnum } from '../../../../models/models';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'surrender-chart-maker',
  templateUrl: './surrender-chart-maker.component.html',
  styleUrls: ['./surrender-chart-maker.component.scss']
})

export class SurrenderChartMakerComponent implements OnInit {
  mode: string = "add-edit-mode"; //"delete-mode" "select-mode"
  chartCell: ChartCell;
  buttonText: string;
  chartConfigs
  selectedChart
  chartKeys: string[];
  customPlayStrategyConfigs: any;
  customPlayStrategyKeys: string[] = [];
  selectedStrategyTitle: string = '';

  constructor(
    public surrenderService: SurrenderService, 
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit() {
    this.customPlayStrategyConfigs = this.localStorageService.getItem('surrender-configs');
    this.customPlayStrategyKeys = Object.keys(this.customPlayStrategyConfigs);
    this.chartConfigs = this.surrenderService.chartConfigs;
    this.chartKeys = Object.keys(this.chartConfigs);
    this.selectedChart = { ... this.surrenderService.grid };
    this.updateButtonText();
  }

  selectMode(mode: string): void {
    if(!(this.mode === mode)) {
      this.mode = mode;
    }
    this.updateButtonText();
  }

  updateButtonText(targetConfig: string = null) {
    console.log(targetConfig);
    if(this.mode === "add-edit-mode") {
      this.buttonText = "Customize a Surrender Strategy";
      let blackList = Object.values(SurrenderStrategyEnum).map(item => item.toString());
      if(this.chartKeys.includes(targetConfig)) {
        this.buttonText = `Save changes to ${targetConfig}`;
      }
      if(blackList.includes(targetConfig)) {
        this.buttonText = '';
      }
    }
  }

  handleSelectStrategy({ target }) {
    console.log(target.value);
    this.selectedStrategyTitle = target.value
    this.updateButtonText(target.value);
    this.selectedChart = { ...this.chartConfigs[target.value]};
    console.log(this.selectedChart);
  }

  addStrategyToLS() {
    console.log(this.selectedStrategyTitle);
    if(this.selectedStrategyTitle) {
      this.customPlayStrategyConfigs[this.selectedStrategyTitle] = this.selectedChart;
      console.log(this.customPlayStrategyConfigs);
      this.localStorageService.setItem('surrender-configs', this.customPlayStrategyConfigs);
    }
  }

  updateSelectedCellsOptions({ value }, key) {
    console.log(JSON.stringify(this.selectedChart));
  }
}




