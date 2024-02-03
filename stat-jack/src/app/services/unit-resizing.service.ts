import { Injectable } from '@angular/core';
import { UnitResizingEnum } from './../models/models';
import { LocalStorageService } from './local-storage.service';
import { neverResize } from '../default-json/unit-resizing/never-resize';
import { reduceRiskRed } from '../default-json/unit-resizing/reduce-risk-red';

@Injectable({
  providedIn: 'root'
})
export class UnitResizingService {

  configs
  selectedConfig
  configKeys: string[] = [];
  customUnitResizingConfigs: any;
  customUnitResizingKeys: string[] = [];
  blacklist: UnitResizingEnum[] = [
    UnitResizingEnum.NEVER_RESIZE,
    UnitResizingEnum.REDUCE_RISK_RED,
  ];

  neverResize: any;
  reduceRiskRed: any;

  constructor(private localStorageService: LocalStorageService) {
    this.neverResize = neverResize;
    this.reduceRiskRed = reduceRiskRed;

    this.customUnitResizingConfigs = this.localStorageService.getItem('unit-resizing-configs');
    if(!this.customUnitResizingConfigs) {
      localStorage.setItem('unit-resizing-configs', JSON.stringify({}));
      this.customUnitResizingConfigs = this.localStorageService.getItem('unit-resizing-configs');
    }
    this.customUnitResizingKeys = Object.keys(this.customUnitResizingConfigs);
    this.configs = { ...this.fetchCommonConfigs(), ...this.customUnitResizingConfigs };
    this.configKeys = Object.keys(this.configs);
  }

  fetchCommonConfigs() {
    return {
      [UnitResizingEnum.NEVER_RESIZE]: neverResize,
      [UnitResizingEnum.REDUCE_RISK_RED]: reduceRiskRed,
    }
  }

  getStrategyFromTitle(title: string) {
    return this.configs[title] 
      ? ({ ...this.configs[title] }) 
      : ({ ...this.configs[UnitResizingEnum.NEVER_RESIZE] });
  }

  addStrategyToLS(config, title: string) { 
    this.customUnitResizingConfigs[title] = config;
    this.localStorageService.setItem('unit-resizing-configs', this.customUnitResizingConfigs);
    this.configs = this.localStorageService.getItem('unit-resizing-configs');
    this.configKeys = Object.keys(this.configs);
  }
}