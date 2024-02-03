import { Injectable } from '@angular/core';
import { ChartCell, PlayStrategyEnum } from './../models/models';
import { LocalStorageService } from './local-storage.service';
import { basicStrategyJSON } from '../default-json/play/basic-strategy-json';
import { enhcBasicStrategyJSON } from '../default-json/play/enhc-basic-strategy-json';
import { illustrious18H17JSON } from '../default-json/play/illustrious18-h17-json';
import { allDeviationsH17 } from '../default-json/play/all-deviations-h17';

@Injectable({
  providedIn: 'root'
})
export class PlayChartMakerService {

  buttonText: string;
  chartConfigs
  selectedChart
  chartKeys: string[];
  customPlayStrategyConfigs: any;
  customPlayStrategyKeys: string[] = [];

  dealerUpcards: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];
  playerFirst2: string [] = ['AA', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'AT', 'A9', 'A8', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5'];
  grid = {};
  basicStrategyJSON: any;
  enhcBasicStrategyJSON: any;
  illustrious18H17JSON: any;
  allDeviationsH17: any;

  constructor(private localStorageService: LocalStorageService) {
    this.createGrid();
    this.basicStrategyJSON = basicStrategyJSON;
    this.enhcBasicStrategyJSON = enhcBasicStrategyJSON;
    this.illustrious18H17JSON = illustrious18H17JSON;
    this.allDeviationsH17 = allDeviationsH17;

    this.customPlayStrategyConfigs = this.localStorageService.getItem('play-strategy-configs');
    this.customPlayStrategyKeys = Object.keys(this.customPlayStrategyConfigs);
    this.chartConfigs = { ...this.fetchCommonCharts(), ...this.customPlayStrategyConfigs };
    this.chartKeys = Object.keys(this.chartConfigs);
    this.selectedChart = { ... this.grid };
  }

  fetchCommonCharts() {
    return {
      [PlayStrategyEnum.BASIC_STRATEGY]: basicStrategyJSON,
      [PlayStrategyEnum.ENHC_BASIC_STRATEGY]: enhcBasicStrategyJSON,
      [PlayStrategyEnum.ILLUSTRIOUS_18_H17]: illustrious18H17JSON,
      [PlayStrategyEnum.ILLUSTRIOUS_18_S17]: {},
      [PlayStrategyEnum.ALL_DEVIATIONS_H17]: allDeviationsH17,
    }
  }

  getStrategyFromTitle(title: string) {
    return this.chartConfigs[title] 
      ? ({ ...this.chartConfigs[title] }) 
      : ({ ...this.chartConfigs['Basic Strategy'] });
  }

  createGrid() {
    this.dealerUpcards.forEach(uc => {
      this.playerFirst2.forEach(pf2 => this.grid[`${uc}-${pf2}`] = { options: [], conditions: []})
    })
  }

  setGridValue(key: string, value: ChartCell) {
    this.grid[key] = { ...value }
  }
}