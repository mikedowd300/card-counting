import { Component, OnInit } from '@angular/core';
import { TippingService } from 'src/app/services/tipping.service';

@Component({
  selector: 'tipping',
  templateUrl: './tipping.component.html',
  styleUrls: ['./tipping.component.scss']
})

export class TippingComponent implements OnInit {
  mode: string = "add-edit-mode";
  selectedTippingConfig: any;
  selectedTippingConfigTitle: string = '';
  isBlackListed: boolean;
  customTippingConfig: any;
  newTitle: string;

  constructor(private tippingService: TippingService) {}

  ngOnInit(): void {}

  selectMode(mode: string): void {
    if(!(this.mode === mode)) {
      this.mode = mode;
    }
  }

  handleSelectStrategy({ target }): void {
    this.newTitle = '';
    this.selectedTippingConfigTitle = target.value;
    this.selectedTippingConfig = { ...this.tippingService.configs[target.value]};
    this.isBlackListed = this.tippingService.blacklist.includes(target.value);
    if(!this.isBlackListed) {
      this.newTitle = target.value;
    }
  }

  addStrategyToLS(): void {
    this.tippingService.addStrategyToLS(this.selectedTippingConfig, this.newTitle);
  }

  addRatioRow() {
    const len = this.selectedTippingConfig.tipToBetsizeRatios.length;
    const newTip = this.selectedTippingConfig.tipToBetsizeRatios[len - 1][0];
    const newBet = this.selectedTippingConfig.tipToBetsizeRatios[len - 1][1];
    this.selectedTippingConfig.tipToBetsizeRatios.push([newTip + 1, newBet + 100]);
  }

  removeRatioRow() {
    this.selectedTippingConfig.tipToBetsizeRatios = this.selectedTippingConfig.tipToBetsizeRatios.slice(0, this.selectedTippingConfig.tipToBetsizeRatios.length - 1);
  }
}