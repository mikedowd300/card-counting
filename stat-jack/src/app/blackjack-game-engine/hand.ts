import { Injectable } from '@angular/core';
import { Card } from './card';
import { HandOptionEnums, PayRatioEnum, SurrenderTypesEnum } from './../models/models';

@Injectable({
  providedIn: 'root',
})

export class Hand {

  cards: Card[] = [];
  hasBeenPaid: boolean = false;
  payRatioMap = {
    [PayRatioEnum.THREE_to_TWO]: 1.5,
    [PayRatioEnum.SIX_to_FIVE]: 1.2,
    [PayRatioEnum.TWO_to_ONE]: 2,
    [PayRatioEnum.ONE_to_ONE]: 1,
  };
  options: string[] = [];
  decisionMap = {
    'stay': () => this.stand(),
    'split': () => this.split(),
    'surrender': () => this.surrender(),
    'hit': () => this.hit(),
    'double': () => this.double(),
  };
  decisionHistory: string[] = [];

  handResult: any = {
    outcome: [],
    winnings: [],
  }

  actionMap = {
    'ST': 'stay',
    'SP': 'split',
    'SR': 'surrender',
    'H': 'hit',
    'D': 'double',
  };

  cardMap = { 1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: 'T' };
  dealerCardMap = { 1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10' };
  playStrategy
  conditions

  constructor(
    private spotId: number,
    private shared, 
    public betAmount: number,
    private handId: number,
    private isFromSplit: boolean = false,
    private isFromSplitAces: boolean = false,
    private isFromSplitTens: boolean = false,
  ) {
    this.conditions = this.shared.getConditions();
    this.playStrategy = this.shared.getPlayerBySpotId(this.spotId).playingStrategy;
  }

  playHand() {
    if(this.isFromSplit && this.cards.length === 1) {
      this.cards.push(this.shared.deal());
    }
    this.getOptions();
    this.makeDecision();
  }

  isFromWong(): boolean {
    return this.shared.getPlayerBySpotId(this.spotId).wongSpotIds.includes(this.spotId);
  }

  makeDecision() {
    const chartKey = this.createChartKey();
    let options: string[] = this.playStrategy[chartKey].options
      .split(',')
      .map(op => this.actionMap[op.trim()]);

    let conditions: string[] = this.playStrategy[chartKey].conditions
      .split(',')
      .filter(c => c != '')
      .map(c => c.trim());

    let actionConditions: any[] = options
      .map((op, i) => ({ [op]: (conditions[i] ? this.evaluateCondition(conditions[i]) : true) }))
      .filter((x, i) => this.options.includes(options[i]));

    let i = 0;
    let action: string = Object.keys(actionConditions[0])[0];
    while(!actionConditions[i][Object.keys(actionConditions[i])[0]]) {
      i++;
      action = Object.keys(actionConditions[i])[0];
    }

    this.decisionHistory.push(action);
    this.decisionMap[action]();
  }

  evaluateCondition(condition): boolean {
    const trueCount = this.shared.getHiLoTrueCountTenth();
    const DAS = this.shared.getConditions().DAS;
    if(condition.includes(':')) {
      // This only happens (currently) with DAS and a positive number
      return DAS && trueCount >= parseInt(condition.split(':')[1]);
    }
    if(condition === "DAS") {
      return DAS
    }
    if(parseFloat(condition) >= 0) {
      return trueCount > parseFloat(condition) // SHOULD THIS BE ">="
    }
    return trueCount < parseFloat(condition)
  }

  createChartKey() {
    if(this.cards.length === 2) {
      let first: number;
      let second: number;
      if(this.cards[0].cardValue === 1) {
        first = this.cards[0].cardValue;
        second = this.cards[1].cardValue
      } else if(this.cards[1].cardValue === 1) {
        first = this.cards[1].cardValue;
        second = this.cards[0].cardValue
      } else {
        first = this.cards[0].cardValue > this.cards[1].cardValue ? this.cards[0].cardValue : this.cards[1].cardValue;
        second = this.cards[0].cardValue < this.cards[1].cardValue ? this.cards[0].cardValue : this.cards[1].cardValue
      }
      const first2Cards = `${ this.cardMap[first] }${ this.cardMap[second] }`;
      return this.shared.first2Cards.includes(first2Cards)
        ? `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-${ first2Cards }`
        : `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-${ this.cards[0].cardValue + this.cards[1].cardValue }`;
    } 
    return this.getValue() === this.getSoftValue()
      ? `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-${ this.getValue() }`
      : `${ this.dealerCardMap[this.shared.getDealerUpCard()] }-A${ this.getSoftValue() - 1 }`;
  }

  stand() {}

  hit() {
    this.cards.push(this.shared.deal());
    if(this.isBust() || this.is21()) {
      if(this.isBust()) {
        this.decisionHistory.push('bust');
      }
      this.stand();
    } else {
      this.playHand();
    } 
  }

  double() {
    const bankroll = this.shared.getPlayerBySpotId(this.spotId).bankroll;
    const tipSize = this.shared.getPlayerBySpotId(this.spotId).tipSize;
    this.betAmount = bankroll < (2 * this.betAmount) ? bankroll : 2 * this.betAmount;
    this.shared.getPlayerBySpotId(this.spotId).incTotalBet(this.betAmount / 2);
    if(bankroll > this.betAmount + tipSize ) {
      this.shared.getPlayerBySpotId(this.spotId).doubleDealersTip(this.isFromWong());
    }
    this.cards.push(this.shared.deal());
    if(this.isBust()) {
      this.decisionHistory.push('bust');
    }
    this.stand();
  }

  split() {
    const bankroll = this.shared.getPlayerBySpotId(this.spotId).bankroll;
    const tipSize = this.shared.getPlayerBySpotId(this.spotId).tipSize;
    const betSize = this.shared.getPlayerBySpotId(this.spotId).getBetSize();
    this.shared.getPlayerBySpotId(this.spotId).incTotalBet(betSize);
    this.shared.addHand(true, this.betAmount);
    this.shared.seedSplitHand(this.cards.pop());
    this.cards.push(this.shared.deal());
    if(bankroll > (2 * this.betAmount) + tipSize ) {
      this.shared.getPlayerBySpotId(this.spotId).tipSplitHands(this.isFromWong());
    }
    this.playHand();
  }

  surrender() {
    this.paySurrender();
    this.stand();
  }

  clearCards() {
    this.shared.discard(this.cards);
  }

  hasBlackjack(): boolean {
    return this.cards.length === 2 && this.getValue() === 21 && !this.isFromSplit;
  }

  hasAce() {
    return this.cards.filter(card => card.cardValue === 1).length > 0;
  }

  getValue(): number {
    let value = 0;
    this.cards.forEach(card => value += card.cardValue);
    if(this.hasAce()) {
      value = (value + 10) > 21 ? value : (value + 10);
    }
    return value;
  }

  getSoftValue() {
    let value = 0;
    this.cards.forEach(card => value += card.cardValue);
    return value;
  }

  is21() {
    return this.getValue() === 21;
  }
  
  isBust() {
    return this.getValue() > 21;
  }
  
  isBlackJack() {
    return this.cards.length === 2 && this.is21() && !this.isFromSplit;
  }

  paySurrender(): void {
    this.shared.payPlayerInSpot(this.spotId, (this.betAmount / (-2)));
    this.hasBeenPaid = true;
  }

  payDealersBlackjack(spotId: number) {
    const winnings = this.hasBlackjack() ? 0 : (-1) * this.betAmount;
    this.setHandResult('Dealer Blackjack', winnings);
    if(!this.hasBlackjack()) {
      this.shared.payPlayerInSpot(spotId, -(this.betAmount));
      this.hasBeenPaid = true;
    } else {
      this.setHandResult('Player Blackjack', winnings);
    }
  }

  payBlackjack(spotId: number) {
    const amount = this.betAmount * this.payRatioMap[this.conditions.payRatio];
    const winnings = this.shared.dealerHasBlackjack() ? 0 : amount;
    if(!this.shared.dealerHasBlackjack() && this.hasBlackjack()) {
    this.shared.getPlayerBySpotId(this.spotId).hadBlackJackLastHand = true;
      this.setHandResult('Player Blackjack', winnings);
      this.shared.payPlayerInSpot(spotId, amount);
      this.hasBeenPaid = true;
    }
  }

  getOptions() {
    this.options = [HandOptionEnums.STAY];
    if(this.isSurrenderable()) {
      this.options.push(HandOptionEnums.SURRENDER);
    }
    if(this.isHittable()) {
      this.options.push(HandOptionEnums.HIT);
    }
    if(this.isDoubleable()) {
      this.options.push(HandOptionEnums.DOUBLE);
    }
    if(this.isSplittable()) {
      this.options.push(HandOptionEnums.SPLIT);
    }
  }

  isHittable() {
    if(this.isFromSplitAces && !this.isBust()) {
      return this.conditions.HSA;
    } else if(!this.isBust()) {
      return this.getValue() < 21;
    } 
    return false;
  }

  isSurrenderable() {
    return this.conditions.surrender === SurrenderTypesEnum.LATE 
      && this.cards.length === 2 
      && !this.isFromSplit
      && !this.isBlackJack()
  }

  isDoubleable() {
    if(this.shared.getPlayerBySpotId(this.spotId).bankroll === 0 
      || this.isBlackJack()
      || this.cards.length > 2
      || (!this.conditions.DAS && this.isFromSplit)) {
      return false;
    }
    if(this.isFromSplitAces && this.cards.length === 2 && !this.is21()) {
      return this.conditions.DSA;
    }
    if(this.cards.length === 2 && this.isFromSplitAces && this.is21()) {
      return this.conditions.DA2.DS21A;
    }
    if(this.cards.length === 2 && this.isFromSplitTens && this.is21()) {
      return this.conditions.DA2.DS21;
    }
    if(this.conditions.DA2.value ) {
      return true;
    }
    // if(this.cards.length === 2 && this.hasAce()) {
    //   return this.allowedSoftHands.includes(this.getValue())
    // }
    // if(this.cards.length === 2 && !this.hasAce()) {
    //   return this.allowedHardHands.includes(this.getValue())
    // }

    // Construct allowedSoftHands and allowedHardHands arrays based on the canOnlyDoubleOn values
  }

  isSplittable() {
    if(this.shared.getPlayerBySpotId(this.spotId).bankroll <= this.betAmount
      || this.conditions.MHFS === this.shared.getHandCount()
      || (!this.conditions.RSA && this.isFromSplitAces)) {
      return false;
    }
    return this.cards.length === 2 && this.cards[0].cardValue === this.cards[1].cardValue;
  }

  payHand() {
    const player = this.shared.getPlayerBySpotId(this.spotId)
    const dealerHandValue = this.shared.getDealerHandValue();
    let outcome: string = null;
    let winnings: number = this.betAmount;
    if(this.isBust()) {
      winnings = (-1) * this.betAmount;
      outcome = 'bust';
    } else if(dealerHandValue > 21) {
      outcome = 'dealer busts';
    } else if(this.getValue() > dealerHandValue) {
      outcome = 'player has better hand';
    } else if(this.getValue() < dealerHandValue) {
      winnings = (-1) * this.betAmount;
      outcome = 'dealer has better hand';
    } else {
      winnings = 0;
      outcome = 'push'
    }
    if(this.shared.isFreshShoe()) {
      // This is part of an unscheduled idea/question I had to know the answer to NOW
      this.shared.getPlayerBySpotId(this.spotId).setWonFirstHandOfShoe(winnings > 0);
    }
    player.payBankroll(winnings);
    this.setHandResult(outcome, winnings);
  }

  setHandResult(outcome: string, winnings: number): void {
    this.handResult.outcome.push(outcome);
    this.handResult.winnings.push(winnings);
  }

  finalizeHand() {
    // if(this.shared.isFreshShoe()) {
      // const player = this.shared.getPlayerBySpotId(this.spotId)
      // console.log(player.handle, `${player.bettingUnit}:${this.betAmount}`, this.cards.map(c => c.cardValue).join(','), this.decisionHistory.toString(), this.getValue());
      // console.log('OUTCOME:',this.handResult.outcome.join(', '), 'WINNINGS', this.handResult.winnings.join(', '), 'BANKROLL:', player.bankroll);
      // console.log('============================')
    // }
  }
}