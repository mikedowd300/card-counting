import { Injectable } from '@angular/core';
import { ChartCell, SurrenderStrategyEnum } from './../models/models';
import { LocalStorageService } from './local-storage.service';
import { basicLateSurrederJSON } from '../default-json/surrender/basic-late-surrender-json';
import { basicEnhcLateSurrederJSON } from '../default-json/surrender/enhc-basic-late-surrender-json';
import { enhcEarlySurrederAgainstAceWithDeviationsJSON } from '../default-json/surrender/enhc-ealy-surrender-against-ace-with-deviations-json';
import { enhcEarlySurrenderAgainst10orLessJSON } from '../default-json/surrender/enhc-early-surrender-against-10-or-less-json';
import { enhcEarlySurrenderAgainstAnyJSON } from '../default-json/surrender/enhc-early-surrender-against-any-json';
import { lateSurrederH17SingleDeckJSON } from '../default-json/surrender/late-h17-1dk-json';
import { lateSurrederH17DoubleDeckJSON } from '../default-json/surrender/late-h17-2dk-json';
import { lateSurrederH174orMoreDeckJSON } from '../default-json/surrender/late-h17-4dk-or-more-json';
import { lateSurrenderH174orMoreDeckWithDeviationsJSON } from '../default-json/surrender/late-h17-4dk-or-more-with-deviations-json';
import { lateSurrederS17SingleDeckJSON } from '../default-json/surrender/late-s17-1dk-json';
import { lateSurrederS17DoubleDeckJSON } from '../default-json/surrender/late-s17-2dk-json';
import { lateSurrederS174orMoreDeckJSON } from '../default-json/surrender/late-s17-4dk-or-more-json';
import { lateSurrenderS174orMoreDeckWithDeviationsJSON } from '../default-json/surrender/late-s17-4dk-or-more-with-deviations-json';

@Injectable({
  providedIn: 'root'
})
export class SurrenderService {

  buttonText: string;
  chartConfigs
  selectedChart
  chartKeys: string[];
  customSurrenderStrategyConfigs: any;
  customSurrenderStrategyKeys: string[] = [];
  dealerUpcards: string[] = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'A'];
  playerFirst2: string [] = ['AA', 'TT', '99', '88', '77', '66', '55', '44', '33', '22', 'A9', 'A8', 'A7', 'A6', 'A5', 'A4', 'A3', 'A2', '20', '19', '18', '17', '16', '15', '14', '13', '12', '11', '10', '9', '8', '7', '6', '5'];
  grid = {};

  basicLateSurrederJSON: any;
  basicEnhcLateSurrederJSON: any;
  enhcEarlySurrederAgainstAceWithDeviationsJSON: any;
  enhcEarlySurrenderAgainst10orLessJSON: any;
  enhcEarlySurrenderAgainstAnyJSON: any;
  lateSurrederH17SingleDeckJSON: any;
  lateSurrederH17DoubleDeckJSON: any;
  lateSurrederH174orMoreDeckJSON: any;
  lateSurrenderH174orMoreDeckWithDeviationsJSON: any;
  lateSurrederS17SingleDeckJSON: any;
  lateSurrederS17DoubleDeckJSON: any;
  lateSurrederS174orMoreDeckJSON: any;
  lateSurrenderS174orMoreDeckWithDeviationsJSON: any;

  constructor(private localStorageService: LocalStorageService) {
    this.createGrid();
    this.basicLateSurrederJSON = basicLateSurrederJSON;
    this.basicEnhcLateSurrederJSON = basicEnhcLateSurrederJSON;
    this.enhcEarlySurrederAgainstAceWithDeviationsJSON = enhcEarlySurrederAgainstAceWithDeviationsJSON;
    this.enhcEarlySurrenderAgainst10orLessJSON = enhcEarlySurrenderAgainst10orLessJSON;
    this.enhcEarlySurrenderAgainstAnyJSON = enhcEarlySurrenderAgainstAnyJSON;
    this.lateSurrederH17SingleDeckJSON = lateSurrederH17SingleDeckJSON;
    this.lateSurrederH17DoubleDeckJSON = lateSurrederH17DoubleDeckJSON;
    this.lateSurrederH174orMoreDeckJSON = lateSurrederH174orMoreDeckJSON;
    this.lateSurrenderH174orMoreDeckWithDeviationsJSON = lateSurrenderH174orMoreDeckWithDeviationsJSON;
    this.lateSurrederS17SingleDeckJSON = lateSurrederS17SingleDeckJSON;
    this.lateSurrederS17DoubleDeckJSON = lateSurrederS17DoubleDeckJSON;
    this.lateSurrederS174orMoreDeckJSON = lateSurrederS174orMoreDeckJSON;
    this.lateSurrenderS174orMoreDeckWithDeviationsJSON = lateSurrenderS174orMoreDeckWithDeviationsJSON;

    this.customSurrenderStrategyConfigs = this.localStorageService.getItem('surrender-configs');
    this.customSurrenderStrategyKeys = Object.keys(this.customSurrenderStrategyConfigs);
    this.chartConfigs = { ...this.fetchCommonCharts(), ...this.customSurrenderStrategyConfigs };
    this.chartKeys = Object.keys(this.chartConfigs);
    this.selectedChart = { ... this.grid };
  }

  fetchCommonCharts() {
    return {
      [SurrenderStrategyEnum.BASIC_LATE]: basicLateSurrederJSON,
      [SurrenderStrategyEnum.ENHC_BASIC_LATE]: basicEnhcLateSurrederJSON,
      [SurrenderStrategyEnum.ENHC_EARLY_AGAINST_10_OR_LESS]: enhcEarlySurrenderAgainst10orLessJSON,
      [SurrenderStrategyEnum.ENHC_EARLY_AGAINST_ANY]: enhcEarlySurrenderAgainstAnyJSON,
      [SurrenderStrategyEnum.ENHC_EARLY_AGAINST_ANY_WITH_DEVIATIONS]: enhcEarlySurrederAgainstAceWithDeviationsJSON,
      [SurrenderStrategyEnum.LATE_H17_SINGLE_DECK]: lateSurrederH17SingleDeckJSON,
      [SurrenderStrategyEnum.LATE_S17_SINGLE_DECK]: lateSurrederS17SingleDeckJSON,
      [SurrenderStrategyEnum.LATE_H17_DOUBLE_DECK]: lateSurrederH17DoubleDeckJSON,
      [SurrenderStrategyEnum.LATE_S17_DOUBLE_DECK]: lateSurrederS17DoubleDeckJSON,
      [SurrenderStrategyEnum.LATE_H17_4_OR_MORE_DECKS]: lateSurrederH174orMoreDeckJSON,
      [SurrenderStrategyEnum.LATE_S17_4_OR_MORE_DECKS]: lateSurrederS174orMoreDeckJSON,
      [SurrenderStrategyEnum.LATE_H17_4_OR_MORE_DECKS_WITH_DEVIATIONS]: lateSurrenderH174orMoreDeckWithDeviationsJSON,
      [SurrenderStrategyEnum.LATE_S17_4_OR_MORE_DECKS_WITH_DEVIATIONS]: lateSurrenderS174orMoreDeckWithDeviationsJSON,
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