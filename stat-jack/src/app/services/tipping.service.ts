import { Injectable } from '@angular/core';
import { TippingEnum } from './../models/models';
import { LocalStorageService } from './local-storage.service';
import { neverTip } from '../default-json/tips/never-tip';
import { cheapTipper } from '../default-json/tips/cheap-tipper';
import { moderateTipper } from '../default-json/tips/moderate-tipper';
import { generousTipper } from '../default-json/tips/generous-tipper';

@Injectable({
  providedIn: 'root'
})
export class TippingService {

  configs
  configKeys: string[] = [];
  customTippingConfigs: any;
  customTippingKeys: string[] = [];
  blacklist: TippingEnum[] = [
    TippingEnum.NEVER_TIP,
    TippingEnum.CHEAP_TIPPER,
    TippingEnum.MODERATE_TIPPER,
    TippingEnum.GENEROUS_TIPPER,
  ];

  neverTip: any;
  cheapTipper: any;
  moderateTipper: any;
  generousTipper: any;

  constructor(private localStorageService: LocalStorageService) {
    this.neverTip = neverTip;
    this.cheapTipper = cheapTipper;
    this.moderateTipper = moderateTipper;
    this.generousTipper = generousTipper;

    this.customTippingConfigs = this.localStorageService.getItem('tipping-configs');
    if(!this.customTippingConfigs) {
      localStorage.setItem('tipping-configs', JSON.stringify({}));
      this.customTippingConfigs = this.localStorageService.getItem('tipping-configs');
    }
    this.customTippingKeys = Object.keys(this.customTippingConfigs);
    this.configs = { ...this.fetchCommonConfigs(), ...this.customTippingConfigs };
    this.configKeys = Object.keys(this.configs);
  }

  fetchCommonConfigs() {
    return {
      [TippingEnum.NEVER_TIP]: neverTip,
      [TippingEnum.CHEAP_TIPPER]: cheapTipper,
      [TippingEnum.MODERATE_TIPPER]: moderateTipper,
      [TippingEnum.GENEROUS_TIPPER]: generousTipper,
    }
  }

  getStrategyFromTitle(title: string) {
    return this.configs[title] 
      ? ({ ...this.configs[title] }) 
      : ({ ...this.configs[TippingEnum.NEVER_TIP] });
  }

  addStrategyToLS(config, title: string) { 
    this.customTippingConfigs[title] = config;
    this.localStorageService.setItem('tipping-configs', this.customTippingConfigs);
    this.customTippingConfigs = this.localStorageService.getItem('tipping-configs');
    this.configs = { ...this.fetchCommonConfigs(), ...this.customTippingConfigs };
    this.configKeys = Object.keys(this.configs);
  }
}