import { Component, OnInit } from '@angular/core';
import { UnitResizingService } from 'src/app/services/unit-resizing.service';
import { RoundingStrategyEnum, ChipColorEnum } from 'src/app/models/models';

@Component({
  selector: 'unit-resizing',
  templateUrl: './unit-resizing.component.html',
  styleUrls: ['./unit-resizing.component.scss']
})

export class UnitResizingComponent implements OnInit {
  mode: string = "add-edit-mode";
  selectedUnitResizingConfig: any;
  selectedUnitResizingConfigTitle: string = '';
  isBlackListed: boolean;
  unitResizingConfigKeys: string[] = [];
  customUnitResizingConfig: any;

  unitProgression: number[] = [];
  increaseAtProgression: number[] = [];
  decreaseAtProgression: number[] = [];
  roundToNearestChip: RoundingStrategyEnum;
  roundingMethod: ChipColorEnum;

  newTitle: string = '';
  unitResizer: any;

  chipRoundStrategyOptions: ChipColorEnum[] = [
    ChipColorEnum.WHITE_CHIP,
    ChipColorEnum.RED_CHIP
  ];
  roundingStrategyOptions: RoundingStrategyEnum[] = [
  RoundingStrategyEnum.ROUND_UP, 
  RoundingStrategyEnum.ROUND_DOWN
  ];

  constructor(private unitResizingService: UnitResizingService) {}

  ngOnInit(): void {}

  selectMode(mode: string): void {
    if(!(this.mode === mode)) {
      this.mode = mode;
    }
  }

  handleSelectStrategy({ target }): void {
    this.selectedUnitResizingConfigTitle = target.value;
    this.selectedUnitResizingConfig = { ...this.unitResizingService.configs[target.value]};
    this.isBlackListed = this.unitResizingService.blacklist.includes(target.value);
    if(!this.isBlackListed) {
      this.newTitle = target.value
    }
    this.createUnitResizer();
  }

  createUnitResizer(): void {
    this.unitResizer = {};
    this.unitProgression = [ ...this.selectedUnitResizingConfig.unitProgression ];
    this.increaseAtProgression = [ ...this.selectedUnitResizingConfig.increaseAtProgression ];
    this.decreaseAtProgression = [ ...this.selectedUnitResizingConfig.decreaseAtProgression ];
    this.roundToNearestChip = this.selectedUnitResizingConfig.roundToNearest;
    this.roundingMethod = this.selectedUnitResizingConfig.roundingMethod;
    this.unitProgression.forEach((u, i) => this.unitResizer[u] = 
      { 
        increateAt: this.increaseAtProgression[i] ? this.increaseAtProgression[i] : null,
        decreaseAt: this.decreaseAtProgression[i - 1] ? this.decreaseAtProgression[i - 1] : null
      })
  }

  handleChipRoundingStrategyRadioChange({ target }): void {
    this.roundToNearestChip = target.defaultValue;
  }

  handleRoundingStrategyRadioChange({ target }): void {
    this.roundingMethod = target.defaultValue;
  }

  addStrategyToLS(): void {
    const payload: any = {
      unitProgression: this.unitProgression,
      increaseAtProgression: this.increaseAtProgression,
      decreaseAtProgression: this.decreaseAtProgression,
      roundToNearest: this.roundToNearestChip,
      roundingMethod: this.roundingMethod,
    };
    this.unitResizingService.addStrategyToLS(payload, this.newTitle);
  }

  removeRow(): void {
    if(this.unitProgression.length > 1) {
      this.unitProgression = this.unitProgression.slice(0, this.unitProgression.length - 1);
      this.increaseAtProgression = this.increaseAtProgression.slice(0, this.increaseAtProgression.length - 1);
      this.decreaseAtProgression = this.decreaseAtProgression.slice(0, this.decreaseAtProgression.length - 1);
    }
  }

  addRow(): void {
    this.unitProgression.push(this.unitProgression[this.unitProgression.length - 1] + 1);
    this.increaseAtProgression[this.increaseAtProgression.length - 1] = this.increaseAtProgression[this.increaseAtProgression.length - 2]
    this.increaseAtProgression.push(null);
    this.decreaseAtProgression.push(this.decreaseAtProgression[this.decreaseAtProgression.length - 1]);
  }
}