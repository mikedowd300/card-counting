import { Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { InsuranceStrategyEnum } from '../models/models';
import { neverTakeInsurance } from '../default-json/insurance/basic-strategy-json';
import { countingInsurance } from '../default-json/insurance/counting-json';
import { illustrious18Insurance } from '../default-json/insurance/illustrious18-json';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService {
  strategyConfigs
  selectedStrategy
  selectedStrategyTitle: string = '';
  showCustomStrategy: boolean = false;
  isBlackListed: boolean;
  showNewStrategyPrompt: boolean = false;
  neverTakeInsurance
  countingInsurance
  illustrious18Insurance
  strategyKeys: string[] = [];
  customInsuranceStrategyConfigs: any;
  customInsuranceStrategyKeys: string[] = [];
  blacklist: InsuranceStrategyEnum[] = [
    InsuranceStrategyEnum.NEVER_TAKE_INSURANCE,
    InsuranceStrategyEnum.COUNTING_INSURANCE,
    InsuranceStrategyEnum.COUNTING_INSURANCE,
  ];

  constructor(private localStorageService: LocalStorageService) {
    this.neverTakeInsurance = neverTakeInsurance;
    this.countingInsurance = countingInsurance;
    this.illustrious18Insurance = illustrious18Insurance;
    this.customInsuranceStrategyConfigs = this.localStorageService.getItem('insurance-strategy-configs');
    if(!this.customInsuranceStrategyConfigs) {
      localStorage.setItem('insurance-strategy-configs',JSON.stringify({}));
      this.customInsuranceStrategyConfigs = this.localStorageService.getItem('insurance-strategy-configs');
    }
    this.customInsuranceStrategyKeys = Object.keys(this.customInsuranceStrategyConfigs);
    this.strategyConfigs = { ...this.fetchCommonCharts(), ...this.customInsuranceStrategyConfigs };
    this.strategyKeys = Object.keys(this.strategyConfigs);
  }

  getStrategyFromTitle(title: string) {
    return this.strategyConfigs[title] 
      ? ({ ...this.strategyConfigs[title] }) 
      : ({ ...this.strategyConfigs[InsuranceStrategyEnum.NEVER_TAKE_INSURANCE] });
  }

  fetchCommonCharts() {
    return {
      [InsuranceStrategyEnum.NEVER_TAKE_INSURANCE]: neverTakeInsurance,
      [InsuranceStrategyEnum.COUNTING_INSURANCE]: countingInsurance,
      [InsuranceStrategyEnum.ILLUSTRIOUS_18_INSURANCE]: illustrious18Insurance,
    }
  }

  addStrategyToLS(strategy, title: string) { 
    this.customInsuranceStrategyConfigs[title] = strategy;
    this.localStorageService.setItem('insurance-strategy-configs', this.customInsuranceStrategyConfigs);
  }
}