import { Component, OnInit } from '@angular/core';
import { InsuranceService } from 'src/app/services/insurance.service';

@Component({
  selector: 'insurance-strategy',
  templateUrl: './insurance-strategy.component.html',
  styleUrls: ['./insurance-strategy.component.scss']
})

export class InsuranceStrategyComponent implements OnInit {
  mode: string = "add-edit-mode";
  selectedStrategy
  selectedStrategyTitle: string = '';
  showCustomStrategy: boolean = false;
  customStrategyTitle: string = '';
  isBlackListed: boolean;
  showNewStrategyPrompt: boolean = false;
  strategyKeys: string[] = [];
  customInsuranceStrategyConfigs: any;
  customInsuranceStrategyKeys: string[] = [];
  deckKeys: string[] = []
  deckToTextMap = {
    deck1: 'Single Deck',
    deck2: 'Double Deck',
    deck3: '3 Decks',
    deck4: '4 Decks',
    deck5: '5 Decks',
    deck6: '6 Decks',
    deck7: '7 Decks',
    deck8: '8 Decks',
    deck9: '9 Decks',
    deck10: '10 Decks',
  }

  constructor(private insuranceService: InsuranceService) {}

  ngOnInit() {}

  selectMode(mode: string): void {
    if(!(this.mode === mode)) {
      this.mode = mode;
    }
  }

  handleSelectStrategy({ target }) {
    this.selectedStrategyTitle = target.value;
    this.selectedStrategy = { ...this.insuranceService.strategyConfigs[target.value]};
    this.isBlackListed = this.insuranceService.blacklist.includes(target.value);
    this.createStrategy();
  }

  createStrategy() {
    this.deckKeys = Object.keys(this.selectedStrategy);
    this.showNewStrategyPrompt = true;
  }
}




