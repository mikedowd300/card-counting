import { Component, OnInit } from '@angular/core';
import { PlayChartMakerService } from './../../../../services/play-chart-maker.service';
import { ChartCell, PlayStrategyEnum } from './../../../../models/models';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'play-strategy-chart-maker',
  templateUrl: './play-strategy-chart-maker.component.html',
  styleUrls: ['./play-strategy-chart-maker.component.scss']
})

export class PlayStrategyChartMakerComponent implements OnInit {
  mode: string = "add-edit-mode"; //"delete-mode" "select-mode"
  chartCell: ChartCell;
  buttonText: string;
  chartConfigs
  selectedChart
  chartKeys: string[];
  customPlayStrategyConfigs: any;
  customPlayStrategyKeys: string[] = [];
  selectedStrategyTitle: string = '';

  constructor(public chartMaker: PlayChartMakerService, private localStorageService: LocalStorageService) {}

  ngOnInit() {
    this.customPlayStrategyConfigs = this.localStorageService.getItem('play-strategy-configs');
    this.customPlayStrategyKeys = Object.keys(this.customPlayStrategyConfigs);
    this.chartConfigs = { ...this.fetchCommonCharts(), ...this.customPlayStrategyConfigs };
    this.chartKeys = Object.keys(this.chartConfigs);
    this.selectedChart = { ... this.chartMaker.grid };
    this.updateButtonText();
  }

  selectMode(mode: string): void {
    if(!(this.mode === mode)) {
      this.mode = mode;
    }
    this.updateButtonText();
  }

  updateButtonText(targetConfig: string = null) {
    if(this.mode === "add-edit-mode") {
      this.buttonText = "Customize a Play Strategy";
      let blackList = Object.values(PlayStrategyEnum).map(item => item.toString());
      if(this.chartKeys.includes(targetConfig)) {
        this.buttonText = `Save changes to ${targetConfig}`;
      }
      if(blackList.includes(targetConfig)) {
        this.buttonText = '';
      }
    }
  }

  handleSelectStrategy({ target }) {
    this.selectedStrategyTitle = target.value
    this.updateButtonText(target.value);
    this.selectedChart = { ...this.chartConfigs[target.value]};
  }

  addStrategyToLS() {
    if(this.selectedStrategyTitle) {
      this.customPlayStrategyConfigs[this.selectedStrategyTitle] = this.selectedChart;
      this.localStorageService.setItem('play-strategy-configs', this.customPlayStrategyConfigs);
    }
  }

  fetchCommonCharts() {
    return {
      [PlayStrategyEnum.BASIC_STRATEGY]: this.chartMaker.basicStrategyJSON,
      [PlayStrategyEnum.ENHC_BASIC_STRATEGY]: this.chartMaker.enhcBasicStrategyJSON,
      [PlayStrategyEnum.ILLUSTRIOUS_18_H17]: this.chartMaker.illustrious18H17JSON,
      [PlayStrategyEnum.ILLUSTRIOUS_18_S17]: {},
      [PlayStrategyEnum.ALL_DEVIATIONS_H17]: this.chartMaker.allDeviationsH17,
    }
  }

  updateSelectedCellsOptions({ value }, key) {
    console.log(JSON.stringify(this.selectedChart));
  }
}
