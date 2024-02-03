import { Injectable } from '@angular/core';
import { LocalStorageService } from "../services/local-storage.service";
import { ShoeConditions } from "../models/models";
import { Card } from "./card";

@Injectable({
  providedIn: 'root'
})

export class Shoe {

  private suites: string[] = ['S', 'H', 'C', 'D'];
  cards: Card[] = [];
  private hiLoRunningCount: number = 0;
  private aceCount: number;
  private discardTray: Card[] = [];
  private shoeCount: number = 0;
  private isFreshShoe: boolean = true;
  private handsCount: number = 1;
  private decksPerShoe: number;
  private cardsBurnedPerShoe: number;
  private shufflePoint: number;
  private localStorage: LocalStorageService;
  
  constructor(private conditions: ShoeConditions) {
    this.initializeShoe(); 
  }

  initializeShoe(): void {
    this.localStorage = new LocalStorageService();
    this.decksPerShoe = this.conditions.decksPerShoe;
    this.cardsBurnedPerShoe = this.conditions.cardsBurnedPerShoe;
    this.shufflePoint = this.conditions.shufflePoint;
    this.aceCount = this.decksPerShoe * 4;
    this.createShoe();
  }

  createShoe(): void {
    // FIRST CHECK LOCAL STORAGE FOR A SHOE THERE
    if(this.localStorage.getItem('shoes') && this.localStorage.getItem('shoes')[`${this.decksPerShoe}-deck`]) {
      let shoe = [];
      let cards: string[] = this.localStorage.getItem('shoes')[`${this.decksPerShoe}-deck`].split(',');
      cards.forEach(card => shoe.push(new Card(card[1], this.getCardNumber(card[0]))));
      this.discardTray = [...shoe];
    } else {
    // CREATE SHOE IF NOT IN LOCAL STORAGE
      let shoe = [...this.createDeck()];
      for (let d = 0; d < this.decksPerShoe - 1; d++) {
        shoe = [...shoe, ...this.createDeck()];
      }
      this.discardTray = [...shoe];
    }
    this.shuffleCheck();
  }

  getCardNumber(val: string): number {
    switch(val) { 
      case 'A': { 
        return 0; 
      } 
      case '0': { 
        return 9; 
      }
      case 'J': { 
        return 10; 
      } 
      case 'Q': { 
        return 11; 
      }
      case 'K': { 
        return 12; 
      }
      default: { 
        return parseInt(val) - 1; 
      }
    }
  }

  createDeck(): Card[] {
    const deck: Card[] = [];
    for(let s = 0; s < 4; s++) {
      for(let i = 0; i < 13; i++) {
        deck.push(new Card(this.suites[s], i));
      }
    }
    return this.shuffle(deck, 52);
  }

  // If shuffle algorithms are added for shuffle tracking, this one is purely random and not necessarily an ordering that would be created froma a shuffle
  shuffle(shoe: Card[], limit = 52 * this.decksPerShoe): Card[] {
    const newShoe= [];
    let oldShoe = [ ...shoe ];
    const mikeRandom = (new Date().getMilliseconds()); // The random number generator will not depend solely on the built in seed
    for (let i = limit - 1; i >= 0; i--) {
      const index = Math.ceil(Math.random() * mikeRandom) % (oldShoe.length);
      newShoe.push(oldShoe[index]);
      oldShoe = [...oldShoe.slice(0, index), ...oldShoe.slice(index + 1)];
    }
    this.hiLoRunningCount = 0;
    this.shoeCount += 1;
    return newShoe;
  }

  shuffleCheck(): void {
    const fullShoeLength: number = 52 * this.decksPerShoe;
    const isShuffleTime: boolean = (this.discardTray.length / fullShoeLength) >= this.shufflePoint;
    if(isShuffleTime) {
      this.cards = this.shuffle([...this.cards, ...this.discardTray]);
      this.updateLocalStorageShoe();
      this.discardTray = [];
      this.isFreshShoe = true;
      this.handsCount = 1;
      this.aceCount = this.decksPerShoe * 4;
      this.burn();
    } else {
      this.isFreshShoe = false;
    }
  }

  burn(): void {
    let burnCards: Card[] = [];
    for(let i = 0; i < this.cardsBurnedPerShoe; i++) {
      burnCards.push(this.cards.pop());
    }
    this.discard(burnCards);
  }

  discard(discards: Card[]): void {
    this.discardTray = [ ...this.discardTray, ...discards];
  }

  deal(): Card {
    const card: Card = this.cards.pop();
    this.setHiLoRunningCount(card.hiLoCountValue);
    // this.setHiLoTrueCount();
    this.updateAceCount(card.cardValue);
    return card;
  };

  dealHoleCard(): Card {
    const card = this.cards.pop();
    card.isHoleCard = true;
    return card;
  }

  flipHoleCard(card: Card): void {
    card.isHoleCard = false;
    this.setHiLoRunningCount(card.hiLoCountValue);
    this.updateAceCount(card.cardValue);
    // this.setHiLoTrueCount();
  }

  setHiLoRunningCount = (count: number): void => {
    this.hiLoRunningCount += count;
  }

  // setHiLoTrueCount = (): void => { 
  //   this.hiLoTrueCount = this.hiLoRunningCount / this.getDecksRemaining();
  // };

  updateAceCount = (cardValue: number): void => {
    if(cardValue === 1) {
      this.aceCount -= 1;
    }
  };

  getDecksRemaining = (): number => (this.cards.length + this.cardsBurnedPerShoe) / 52;

  getHiLoRunningCount = (): number => this.hiLoRunningCount;

  getHiLoTrueCountFloor = (): number => 
    Math.floor(Math.round(this.getHiLoRunningCount() * 10) / (10 * this.getDecksRemaining()));

  getHiLoTrueCountTenth = (): number => 
    Math.floor(Math.round(this.getHiLoRunningCount() * 10) / this.getDecksRemaining()) / 10;

  getTrueAceCount = (): number => Math.round(((this.aceCount / this.getDecksRemaining()) - 4) * 100) / 100;

  getShoeCount = (): number => this.shoeCount;

  getIsFreshShoe = (): boolean => this.isFreshShoe;

  getHandsCount = (): number => this.handsCount;

  incHandCount = (): void => {
    this.handsCount += 1;
  }

  getHandId = (): string => `${this.shoeCount}-${this.handsCount}`;

  getShoeFromLocalStorage = (): Card[] => this.localStorage.getItem('shoes');

  updateLocalStorageShoe = (): void => {
    const minifiedShoe: string = this.cards.map(({ name }) => name).join(',');
    let shoes: any = this.localStorage.getItem('shoes')
      ? JSON.stringify(this.localStorage.getItem('shoes'))
      : JSON.stringify({ });
    shoes = JSON.parse(shoes);
    shoes[`${this.decksPerShoe}-deck`] = minifiedShoe;
    this.localStorage.setItem('shoes', shoes);
  };

  initializeRound() {
    // // if(this.isFreshShoe) {
    //   console.log('HAND ID', this.getHandId());
    //   // console.log('True Count (floor):', this.getHiLoTrueCountFloor());
    //   console.log('True Count (tenth):', this.getHiLoTrueCountTenth());
    //   console.log('Running Count', this.getHiLoRunningCount());
    //   console.log('Decks Remaining', this.getDecksRemaining());
    // // }
  }
}

