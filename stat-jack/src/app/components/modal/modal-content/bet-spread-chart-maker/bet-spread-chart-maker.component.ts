import { Component, OnInit } from '@angular/core';
import { BetSpreadService } from './../../../../services/bet-spread.service';
import { RoundingStrategyEnum, CountByEnum, ChipColorEnum } from 'src/app/models/models';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'bet-spread-chart-maker',
  templateUrl: './bet-spread-chart-maker.component.html',
  styleUrls: ['./bet-spread-chart-maker.component.scss']
})

export class BetSpreadChartMakerComponent implements OnInit {
  mode: string = "add-edit-mode";
  chartConfigs
  selectedChart
  selectedStrategyTitle: string = '';
  spreads: any[] = [];
  countIndexes: string[] = [];
  newStrategyView: boolean = true;
  chartTitles: string[] = [];
  newChartName: string = '';
  maxCount: number = 8;
  minCount: number = -4;
  shoeParts: number = 1;
  hasChartData$: Observable<boolean>;
  chartName$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  maxCount$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  minCount$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  shoeParts$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  showCustomChart: boolean = false;
  customChart: any;
  roundingInstructions: string;
  isBlackListed: boolean;

  roundingStrategyOptions: RoundingStrategyEnum[] = [
    RoundingStrategyEnum.ROUND_UP, 
    RoundingStrategyEnum.ROUND_DOWN
  ];
  selectedRoundingStrategy: RoundingStrategyEnum = RoundingStrategyEnum.ROUND_UP;

  countByStrategyOptions: CountByEnum[] = [
    CountByEnum.COUNT_BY_POINT_1,
    CountByEnum.COUNT_BY_POINT_2,
    CountByEnum.COUNT_BY_POINT_5,
    CountByEnum.COUNT_BY_1
  ];
  selectedCountByStrategy: CountByEnum = CountByEnum.COUNT_BY_1;
  countByMap = {
    [CountByEnum.COUNT_BY_POINT_1]: .1,
    [CountByEnum.COUNT_BY_POINT_2]: .2,
    [CountByEnum.COUNT_BY_POINT_5]: .5,
    [CountByEnum.COUNT_BY_1]: 1
  }

  chipRoundStrategyOptions: ChipColorEnum[] = [
    ChipColorEnum.WHITE_CHIP,
    ChipColorEnum.RED_CHIP
  ];
  selectChipRoundStrategy: ChipColorEnum = ChipColorEnum.RED_CHIP;

  constructor(public chartMaker: BetSpreadService) {}

  ngOnInit() {
    this.hasChartData$ = combineLatest([
      this.chartName$, 
      this.maxCount$, 
      this.minCount$, 
      this.shoeParts$
    ]).pipe(map(([name, max, min, parts]) =>  name && max && min && parts));
  }

  selectMode(mode: string): void {
    if(!(this.mode === mode)) {
      this.mode = mode;
    }
  }

  createChart() {
    this.roundingInstructions = `${this.selectedChart.roundingMethod} to the nearest ${this.selectedChart.roundToNearest}.`
    this.spreads = [ ...this.selectedChart.spreads ]
    this.countIndexes = Object.keys(this.spreads[0]);
    let tempRay: number[] = this.countIndexes.map(ind => parseFloat(ind))
    const tempRayPositive = tempRay.filter(item => item >= 0).sort();
    const tempRayNegative = tempRay.filter(item => item < 0).sort().reverse();
    this.countIndexes = [...tempRayNegative, ...tempRayPositive].toString().split(',');
    this.chartTitles = this.spreads.length < 2 
      ? ['Betting Units'] 
      : this.spreads.map((s, i) => `Less than ${i + 1}/${this.spreads.length} dealt`);
  }

  createNewStrategy() {
    this.newStrategyView = true;
  }

  generateCustomChart() {
    let countIndexes = [];
    let betRay = [];
    for(let i = 0; i < this.shoeParts; i++) {
      betRay.push({});
    }
    for(let i = this.minCount; i <= this.maxCount; i += this.countByMap[this.selectedCountByStrategy]) {
      countIndexes.push(i);
      for(let j = 0; j < betRay.length; j++) {
        betRay[j][i.toString()] = 1
      }
    }
    const titles = betRay.length < 2 
      ? ['Betting Units'] 
      : betRay.map((s, i) => `Less than ${i + 1}/${betRay.length} dealt`);
    this.customChart = {
      countIndexes, 
      betRay,
      titles,
    };
    this.showCustomChart = true;
  }

  handleSelectStrategy({ target }) {
    this.selectedStrategyTitle = target.value;
    this.selectedChart = { ...this.chartMaker.chartConfigs[target.value]};
    this.isBlackListed = this.chartMaker.blacklist.includes(target.value);
    this.createChart();
    this.newStrategyView = false;
    this.showCustomChart = false;
  }

  handelNameChange({ target }) {
    // TODO: Set an error in the UI by setting an error class here
    const valid = !(target.value === '') && !(this.chartMaker.blacklist.includes(target.value))
    this.chartName$.next(valid);
  }

  handleMinCountChange({ target }) {
    // TODO: Set an error in the UI by setting an error class here
    const valid = (target.value >= -10) && (target.value <= 0);
    this.maxCount$.next(valid);
  }

  handleMaxCountChange({ target }) {
    // TODO: Set an error in the UI by setting an error class here
    const valid = (target.value >= 0) && (target.value <= 12);
    this.minCount$.next(true); 
  }

  handleShoePartsChange({ target }) {
    // TODO: Set an error in the UI by setting an error class here
    const valid = (target.value >= 1) && (target.value <= 10);
    this.shoeParts$.next(true);
  }

  handleRoundingStrategyRadioChange({ target }) {
    this.selectedRoundingStrategy = target.defaultValue;
  }
  
  handleCountByStrategyRadioChange({ target }) {
    this.selectedCountByStrategy = target.defaultValue;
  }

  handleChipRoundingStrategyRadioChange({ target }) {
    this.selectChipRoundStrategy = target.defaultValue;
  }

  addStrategyToLS() { 
    const payload = {
      roundToNearest: this.selectChipRoundStrategy,
      roundingMethod: this.selectedRoundingStrategy,
      countBy: this.selectedCountByStrategy,
      spreads: this.customChart.betRay
    };
    this.chartMaker.addStrategyToLS(payload, this.newChartName);
  }
}




