import { Component, OnInit } from '@angular/core';
import { WongingService } from 'src/app/services/wonging.service';

@Component({
  selector: 'wonging',
  templateUrl: './wonging.component.html',
  styleUrls: ['./wonging.component.scss']
})

export class WongingComponent implements OnInit {
  mode: string = "add-edit-mode";
  selectedWongingConfig: any;
  selectedWongingConfigTitle: string = '';
  isBlackListed: boolean;
  wongingConfigKeys: string[] = [];
  customWongingConfig: any;

  newTitle: string = '';
  cardinalMap = {
    1: 'First',
    2: 'Second',
    3: 'Third',
    4: 'Fourth',
    5: 'Fifth',
    6: 'Sixth',
    7: 'Seventh',
    8: 'Eighth',
    9: 'Ninth',
    10: 'Tenth',
  };
  shoeSections: number;

  constructor(private wongingService: WongingService) {}

  ngOnInit(): void {}

  selectMode(mode: string): void {
    if(!(this.mode === mode)) {
      this.mode = mode;
    }
  }

  handleSelectStrategy({ target }): void {
    this.newTitle = '';
    this.selectedWongingConfigTitle = target.value;
    this.selectedWongingConfig = [ ...this.wongingService.configs[target.value]];
    this.isBlackListed = this.wongingService.blacklist.includes(target.value);
    if(!this.isBlackListed) {
      this.newTitle = target.value;
    }
    this.createWong();
  }

  createWong(): void {
    this.shoeSections = this.selectedWongingConfig[0]?.length || 0;
  }

  addStrategyToLS(): void {
    this.wongingService.addStrategyToLS(this.selectedWongingConfig, this.newTitle);
  }

  addSpot(): void {
    if(this.selectedWongingConfig.length < 6) {
      const temp = this.selectedWongingConfig[this.selectedWongingConfig.length - 1];
      this.selectedWongingConfig.push(temp);
    }
  }

  removeSpot(): void {
    if(this.selectedWongingConfig.length > 1) {
      this.selectedWongingConfig = this.selectedWongingConfig.slice(0, this.selectedWongingConfig.length - 1);
    }
  }

  deleteColumn(): void {
    this.selectedWongingConfig = this.selectedWongingConfig.map(row => row.slice(0, row.length - 1));
  }

  addColumn(): void {
    this.selectedWongingConfig = this.selectedWongingConfig.map(row => ([ ...row, row[row.length - 1] ]));
  }
}