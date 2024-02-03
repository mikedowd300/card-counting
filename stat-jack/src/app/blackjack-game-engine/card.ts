import { cardValues } from '../models/models'

export class Card {
  name: string;
  image: string;
  cardValue: number;
  hiLoCountValue: number;

  constructor(suit: string, index: number, public isHoleCard: boolean = false) {
    this.name = `${cardValues[index]}${suit}`;
    this.image = `https://deckofcardsapi.com/static/img/${this.name}.png`;
    this.cardValue = Math.min(index + 1, 10);
    this.hiLoCountValue = this.setHiLoCountValueForCard(Math.min(10, index + 1));
  }

  setHiLoCountValueForCard(value: number): number {
    if(value > 1 && value < 7) {
      return 1
    }
    if(value === 1 || value === 10) {
      return -1
    }
    return 0;
  }
}