import { Injectable } from '@angular/core';
import { SpreadStrategyEnum } from './../models/models';
import { LocalStorageService } from './local-storage.service';
import { basicSpreadJSON } from '../default-json/bet-spreads/basic-spread-json';
import { halfShoeSpreadJSON } from '../default-json/bet-spreads/half-shoe-spread-json';
import { thirdShoeSpreadJSON } from '../default-json/bet-spreads/third-shoe-spread-json';
import { quarterShoeSpreadJSON } from '../default-json/bet-spreads/quarter-shoe-spread-json';
import { sixthShoeSpreadJSON } from '../default-json/bet-spreads/sixth-shoe-spread-json';

@Injectable({
  providedIn: 'root'
})
export class BetSpreadService {

  chartConfigs
  selectedChart
  chartKeys: string[] = [];
  customSpreadStrategyConfigs: any;
  customSpreadStrategyKeys: string[] = [];
  blacklist: SpreadStrategyEnum[] = [
    SpreadStrategyEnum.BASIC_SPREAD,
    SpreadStrategyEnum.HALF_SHOE_SPREAD,
    SpreadStrategyEnum.THIRD_SHOE_SPREAD,
    SpreadStrategyEnum.QUARTER_SHOE_SPREAD,
    SpreadStrategyEnum.SIXTH_SHOE_SPREAD,
  ];

  basicSpreadJSON: any;
  halfShoeSpreadJSON: any;
  thirdShoeSpreadJSON: any;
  quarterShoeSpreadJSON: any;
  sixthShoeSpreadJSON: any;

  constructor(private localStorageService: LocalStorageService) {
    this.basicSpreadJSON = basicSpreadJSON;
    this.halfShoeSpreadJSON = halfShoeSpreadJSON;
    this.thirdShoeSpreadJSON = thirdShoeSpreadJSON;
    this.quarterShoeSpreadJSON = quarterShoeSpreadJSON;
    this.sixthShoeSpreadJSON = sixthShoeSpreadJSON;

    this.customSpreadStrategyConfigs = this.localStorageService.getItem('bet-spread-strategy-configs');
    if(!this.customSpreadStrategyConfigs) {
      localStorage.setItem('bet-spread-strategy-configs',JSON.stringify({}));
      this.customSpreadStrategyConfigs = this.localStorageService.getItem('bet-spread-strategy-configs');
    }
    this.customSpreadStrategyKeys = Object.keys(this.customSpreadStrategyConfigs);
    this.chartConfigs = { ...this.fetchCommonCharts(), ...this.customSpreadStrategyConfigs };
    this.chartKeys = Object.keys(this.chartConfigs);
  }

  fetchCommonCharts() {
    return {
      [SpreadStrategyEnum.BASIC_SPREAD]: basicSpreadJSON,
      [SpreadStrategyEnum.HALF_SHOE_SPREAD]: halfShoeSpreadJSON,
      [SpreadStrategyEnum.THIRD_SHOE_SPREAD]: thirdShoeSpreadJSON,
      [SpreadStrategyEnum.QUARTER_SHOE_SPREAD]: quarterShoeSpreadJSON,
      [SpreadStrategyEnum.SIXTH_SHOE_SPREAD]: sixthShoeSpreadJSON,
    }
  }

  getStrategyFromTitle(title: string) {
    return this.chartConfigs[title] 
      ? ({ ...this.chartConfigs[title] }) 
      : ({ ...this.chartConfigs['Basic spread'] });
  }

  addStrategyToLS(chart, title: string) { 
    this.customSpreadStrategyConfigs[title] = chart;
    this.localStorageService.setItem('bet-spread-strategy-configs', this.customSpreadStrategyConfigs);
    this.customSpreadStrategyKeys = Object.keys(this.customSpreadStrategyConfigs);
    this.chartConfigs = { ...this.fetchCommonCharts(), ...this.customSpreadStrategyConfigs };
    this.chartKeys = Object.keys(this.chartConfigs);
  }
}