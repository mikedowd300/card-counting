import { Injectable } from '@angular/core';
import { WongingEnum } from './../models/models';
import { LocalStorageService } from './local-storage.service';
import { neverWong } from '../default-json/wong/never-wong';
import { wongTo1AdditionalSpot } from '../default-json/wong/wong-to-1-additional-spot';
import { wongTo2AdditionalSpots } from '../default-json/wong/wong-to-2-additional-spots';
import { wongTo3AdditionalSpots } from '../default-json/wong/wong-to-3-additional-spots';

@Injectable({
  providedIn: 'root'
})
export class WongingService {

  configs
  configKeys: string[] = [];
  customWongingConfigs: any;
  customWongingKeys: string[] = [];
  blacklist: WongingEnum[] = [
    WongingEnum.NEVER_WONG,
    WongingEnum.WONG_TO_1_ADDITIONAL_SPOTS,
    WongingEnum.WONG_TO_2_ADDITIONAL_SPOTS,
    WongingEnum.WONG_TO_3_ADDITIONAL_SPOTS,
  ];

  neverWong: any;
  wongTo1AdditionalSpot: any;
  wongTo2AdditionalSpots: any;
  wongTo3AdditionalSpots: any;

  constructor(private localStorageService: LocalStorageService) {
    this.neverWong = neverWong;
    this.wongTo1AdditionalSpot = wongTo1AdditionalSpot;
    this.wongTo2AdditionalSpots = wongTo2AdditionalSpots;
    this.wongTo3AdditionalSpots = wongTo3AdditionalSpots;

    this.customWongingConfigs = this.localStorageService.getItem('wonging-configs');
    if(!this.customWongingConfigs) {
      localStorage.setItem('wonging-configs', JSON.stringify({}));
      this.customWongingConfigs = this.localStorageService.getItem('wonging-configs');
    }
    this.customWongingKeys = Object.keys(this.customWongingConfigs);
    this.configs = { ...this.fetchCommonConfigs(), ...this.customWongingConfigs };
    this.configKeys = Object.keys(this.configs);
  }

  fetchCommonConfigs() {
    return {
      [WongingEnum.NEVER_WONG]: neverWong,
      [WongingEnum.WONG_TO_1_ADDITIONAL_SPOTS]: wongTo1AdditionalSpot,
      [WongingEnum.WONG_TO_2_ADDITIONAL_SPOTS]: wongTo2AdditionalSpots,
      [WongingEnum.WONG_TO_3_ADDITIONAL_SPOTS]: wongTo3AdditionalSpots,
    }
  }

  getStrategyFromTitle(title: string) {
    return this.configs[title] 
      ? ([ ...this.configs[title] ]) 
      : ([ ...this.configs[WongingEnum.NEVER_WONG] ]);
  }

  addStrategyToLS(config, title: string) { 
    this.customWongingConfigs[title] = config;
    this.localStorageService.setItem('wonging-configs', this.customWongingConfigs);
    this.customWongingConfigs = this.localStorageService.getItem('wonging-configs');
    this.configs = { ...this.fetchCommonConfigs(), ...this.customWongingConfigs };
    this.configKeys = Object.keys(this.configs);
  }
}