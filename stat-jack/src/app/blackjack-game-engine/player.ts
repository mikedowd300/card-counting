import { Injectable } from '@angular/core';
import { ChipColorEnum, PlayerObj, RoundingStrategyEnum, SpotStatus, TableSpot } from '../models/models';

@Injectable({
  providedIn: 'root',
})

export class Player {

  handle: string;
  resizeProgression: number[] = [];
  bettingUnit: number;
  progressiveBettingUnitIndex:number = 0;
  bankroll: number;
  originalBankroll: number;
  coverPlayStrategy: string; // For now
  playingStrategy: any;
  lateSurrenderStrategy: string;
  earlySurrenderStrategy: string;
  betSpreadingStrategy: any;
  insuranceStrategy: any;
  unitResizingStrategy: any;
  wongingStrategy: any;
  tippingStrategy: any;
  usesAceCount: boolean;
  spotIds: number[] = [];
  wongSpotIds: number[] = [];
  hadBlackJackLastHand: boolean = false;
  betSizeLastHand: number;
  tipSize: number = 0;
  tippedAway: number = 0;
  totalBet: number = 0;
  amountBetPerHand: number = 0;

  // random unscheduled idea/question I had 
  firstBetCamoMultiplier: number = 1;
  wonFirstHandOfShoe: boolean = false;

  constructor(
    private playerObj: PlayerObj, 
    private spotId: number, 
    private shared,
  ) {
    this.initializePlayer(spotId);
  }

  initializePlayer(spotId: number): void {
    this.handle = this.playerObj.handle;
    this.bettingUnit = parseInt(this.playerObj.bettingUnit.toString());
    this.betSizeLastHand = this.bettingUnit;
    this.bankroll = parseInt(this.playerObj.bankroll.toString());
    this.originalBankroll = this.bankroll;
    this.coverPlayStrategy = this.playerObj.coverPlayStrategy;
    this.playingStrategy = this.shared.getPlayingStrategyFromTitle(this.playerObj.playingStrategy);
    this.lateSurrenderStrategy = this.playerObj.lateSurrenderStrategy;
    this.earlySurrenderStrategy = this.playerObj.earlySurrenderStrategy;
    this.betSpreadingStrategy = this.shared.getBettingStrategyFromTitle(this.playerObj.betSpreadingStrategy);
    this.insuranceStrategy = this.shared.getInsuranceStrategyFromTitle(this.playerObj.insuranceStrategy);
    this.unitResizingStrategy = this.shared.getUnitResizingStrategyFromTitle(this.playerObj.unitResizingStrategy);
    this.wongingStrategy = this.shared.getWongingStrategyFromTitle(this.playerObj.wongingStrategy);
    this.tippingStrategy = this.shared.getTippingStrategyFromTitle(this.playerObj.tippingStrategy);
    this.usesAceCount = this.playerObj.usesAceCount;
    this.resizeProgression = this.initializeResizeProgression();
    this.addSpot(spotId);
  }

  resizeRound(size: number): number {
    const roundingMethod = this.unitResizingStrategy.roundingMethod;
    const roundToNearest = this.unitResizingStrategy.roundToNearest;
    const ROUND_UP = RoundingStrategyEnum.ROUND_UP;
    const ROUND_DOWN = RoundingStrategyEnum.ROUND_DOWN;
    const WHITE_CHIP = ChipColorEnum.WHITE_CHIP;
    const RED_CHIP = ChipColorEnum.RED_CHIP;
    let betAmount = size;
    if(roundingMethod === ROUND_UP && roundToNearest === WHITE_CHIP && size % 1 === .5) {
      betAmount += .5;
    }
    if(roundingMethod === ROUND_DOWN && roundToNearest === WHITE_CHIP && size % 1 === .5) {
      betAmount -= .5;
    }
    if(roundingMethod === ROUND_UP && roundToNearest === RED_CHIP && size % 5 === 2.5) {
      betAmount += 2.5;
    }
    if(roundingMethod === ROUND_DOWN && roundToNearest === RED_CHIP && size % 5 === 2.5) {
      betAmount -= 2.5;
    }
    if(roundingMethod === ROUND_UP && roundToNearest === RED_CHIP && size % 5 === .5) {
      betAmount = Math.ceil(size / 5) * 5;
    }
    if(roundingMethod === ROUND_DOWN && roundToNearest === RED_CHIP && size % 5 === .5) {
      betAmount = Math.floor(size / 5) * 5;
    }
    return betAmount;
  }

  initializeResizeProgression(): number[] {
    return this.unitResizingStrategy.unitProgression.map(p => this.resizeRound(p * this.bettingUnit))
  }

  addSpot(id: number): void {
    this.spotIds.push(id);
  }

  sitInOrOut() {
    // A players can't sit out if he is the only player at the table
    // The check to see if a player is alone is in getBetSize
    this.shared.getSpotById(this.spotId).status = SpotStatus.TAKEN;
    if(this.getBetSize() === 0) {
      this.shared.getSpotById(this.spotId).status = SpotStatus.RESERVED;
    }
  }

  abandonSpotById(spotId: number): void {
    this.spotIds = this.spotIds.filter(id => id !== spotId);
  }

  payBankroll(amount: number): void {
    this.bankroll = this.bankroll + amount;
  }

  getBetSize(): number {
    const multiplierMap = {
      '0.1': 10,
      '0.2': 5,
      '0.5': 2,
      '1': 1
    };
    const countByMap = {
      'Count by 1/10': .1,
      'Count by 1/5': .2,
      'Count by 1/2': .5,
      'Count by 1': 1
    };
    const columns: number[] = this.betSpreadingStrategy.spreads.map((s, i) => i);
    const percentNotDealt = Math.floor((this.shared.getDecksRemaining() / this.shared.getConditions().decksPerShoe) * 100)/ 100;
    const columnIndex = this.getColumnIndex(columns.length,  percentNotDealt);
    const countBy = countByMap[this.betSpreadingStrategy.countBy];
    const trueCountTenth = this.shared.getHiLoTrueCountTenth();
    const indexes = Object.keys(this.betSpreadingStrategy.spreads[0]).map(i => parseInt(i)) ;
    const minIndex: number = Math.min(...indexes);
    const maxIndex: number = Math.max(...indexes);
    const isOnlyPlayer = this.shared.getOccupiedActiveSpotCount() === 1;
    let key = trueCountTenth >= 0 
      ? Math.floor(multiplierMap[countBy] * trueCountTenth) / multiplierMap[countBy]
      : Math.ceil(multiplierMap[countBy] * trueCountTenth) / multiplierMap[countBy]
    if(key < minIndex) {
      key = minIndex;
    }
    if(key > maxIndex) {
      key = maxIndex;
    }

    let betAmount = this.bettingUnit * this.betSpreadingStrategy.spreads[columnIndex][key];

    // unscheduled idea/question I need to see now
    if(this.wonFirstHandOfShoe || this.shared.isFreshShoe()) {
      betAmount = betAmount * this.firstBetCamoMultiplier;
    }

    if(betAmount === 0 && !isOnlyPlayer) {
      return 0;
    }
    if(betAmount === 0 && !isOnlyPlayer) {
      betAmount = this.getLowestNonZeroValue();
    }
    if(this.betSpreadingStrategy.roundingMethod === RoundingStrategyEnum.ROUND_UP && this.betSpreadingStrategy.roundToNearest === ChipColorEnum.WHITE_CHIP && betAmount % 1 === .5) {
      betAmount += .5;
    }
    if(this.betSpreadingStrategy.roundingMethod === RoundingStrategyEnum.ROUND_DOWN && this.betSpreadingStrategy.roundToNearest === ChipColorEnum.WHITE_CHIP && betAmount % 1 === .5) {
      betAmount -= .5;
    }
    if(this.betSpreadingStrategy.roundingMethod === RoundingStrategyEnum.ROUND_UP && this.betSpreadingStrategy.roundToNearest === ChipColorEnum.RED_CHIP && betAmount % 5 === 2.5) {
      betAmount += 2.5;
    }
    if(this.betSpreadingStrategy.roundingMethod === RoundingStrategyEnum.ROUND_UP && this.betSpreadingStrategy.roundToNearest === ChipColorEnum.RED_CHIP && betAmount % 5 === 2.5) {
      betAmount -= 2.5;
    }
    if(betAmount % 1 === .5) {
      betAmount += .5;
    }
    return Math.max(this.shared.getConditions().minBet, betAmount);
  }

  getColumnIndex(columnCount: number, percentNotDealt: number): number {
    let index = columnCount;
    while(((index / columnCount) >= percentNotDealt) && (index >= 0)) {
      index -= 1;
    }
    return columnCount - index - 1;
  }

  initializeRound() {
    if(this.shared.isFreshShoe()) {
      this.leaveAllWongSpots();
    }
    this.resizeUnit(); // add logic for minbet considering multiple spots played due to wonging and condition.AHMR - also make sure AHMR doesnt push past maxBet
    this.sitInOrOut();
    this.wongIn();
    this.tip();
    this.updateTotalBet()
  }

  updateTotalBet() {
    this.totalBet += [ ...this.wongSpotIds, this.spotId].length * this.getBetSize();
    this.amountBetPerHand += [ ...this.wongSpotIds, this.spotId].length * this.getBetSize();
  }

  incTotalBet(betSize: number) {
    //used on split, double and insurance
    this.totalBet += betSize;
    this.amountBetPerHand += betSize;
  }

  finalizeRound() {
    this.wongOut();
    this.amountBetPerHand = 0;
  }

  setWonFirstHandOfShoe(val: boolean): void {
    this.wonFirstHandOfShoe = val;
  }

  resizeUnit() {
    if(this.shared.isFreshShoe()) {
      const increaseAtProgression = [ ...this.unitResizingStrategy.increaseAtProgression ];
      const decreaseAtProgression = [ ...this.unitResizingStrategy.decreaseAtProgression ];
      const resizeProgression = [ ...this.resizeProgression ];
      const currentIndex = resizeProgression.indexOf(this.bettingUnit);
      if(this.bankroll > increaseAtProgression[currentIndex] && resizeProgression[currentIndex + 1]) {
        this.bettingUnit = resizeProgression[currentIndex + 1]
      }
      if(decreaseAtProgression[currentIndex] && this.bankroll < decreaseAtProgression[currentIndex]) {
        this.bettingUnit = resizeProgression[currentIndex - 1]
      }
    }
  }

  getLowestNonZeroValue() {
    let lowest = null;
    let concat = [];
    this.betSpreadingStrategy.spreads
      .forEach(spread => concat = [ ...concat, ...Object.values(spread)]);
    concat.filter(val => val > 0);
    return Math.min(...concat);
  }

  tip() {
    const { tipToBetsizeRatios, maxTip, afterBlackjack, dealerJoins, dealerLeaves, tipFirstHandOfShoe,
    playerIncreasesBet, everyXHands, tipSplitHandToo, doubleOnDouble, tipWongHands } = this.tippingStrategy;
    if(tipToBetsizeRatios || maxTip) {
      const betSize = this.getBetSize();
      const ratio = tipToBetsizeRatios.find(ratio => ratio[1] >= betSize);
      this.tipSize = (ratio ? ratio[0] : maxTip) 
      const tipAmount = (tipWongHands ? this.tipSize * (this.wongSpotIds.length + 1) : this.tipSize) * (-1) ;
      const totalRoundsCount = this.shared.getTotalRoundsDealt();
      const handsPerDealer = this.shared.getConditions().handsPerDealer;
      if(afterBlackjack && this.hadBlackJackLastHand) {
        // console.log('TIPPING AFTER BLACKJACK', 'BETSIZE:', betSize, 'HANDS', this.wongSpotIds.length + 1, 'TIPSIZE:', tipAmount)
        this.payBankroll(tipAmount);
        this.tippedAway += (tipAmount * (-1));
      }
      if(totalRoundsCount % handsPerDealer === handsPerDealer - 1 && dealerLeaves) {
        // console.log('TIPPING dealerLeaves', 'BETSIZE:', betSize, 'HANDS', this.wongSpotIds.length + 1, 'TIPSIZE:', tipAmount)
        this.payBankroll(tipAmount);
        this.tippedAway += (tipAmount * (-1));
      } 
      if(totalRoundsCount % handsPerDealer === handsPerDealer && dealerJoins && totalRoundsCount !== 0) {
        // console.log('TIPPING dealerJoins', 'BETSIZE:', betSize, 'HANDS', this.wongSpotIds.length + 1, 'TIPSIZE:', tipAmount)
        this.payBankroll(tipAmount);
        this.tippedAway += (tipAmount * (-1));
      }
      if(this.shared.isFreshShoe() && tipFirstHandOfShoe) {
        // console.log('TIPPING tipFirstHandOfShoe', 'BETSIZE:', betSize, 'HANDS', this.wongSpotIds.length + 1, 'TIPSIZE:', tipAmount)
        this.payBankroll(tipAmount);
        this.tippedAway += (tipAmount * (-1));
      }
      if(playerIncreasesBet && this.betSizeLastHand < betSize) {
        // console.log('TIPPING playerIncreasesBet', 'BETSIZE:', betSize, 'HANDS', this.wongSpotIds.length + 1, 'TIPSIZE:', tipAmount)
        this.payBankroll(tipAmount);
        this.tippedAway += (tipAmount * (-1));
      }
      if(everyXHands && (totalRoundsCount % everyXHands) === 0 && totalRoundsCount !== 0) {
        // console.log('TIPPING everyXHands', 'BETSIZE:', betSize, 'HANDS', this.wongSpotIds.length + 1, 'TIPSIZE:', tipAmount);
        this.payBankroll(tipAmount);
        this.tippedAway += (tipAmount * (-1));
      }
      this.hadBlackJackLastHand = false;
      this.betSizeLastHand = betSize;
    }
  }

  tipSplitHands(fromWong: boolean) {
    if(this.tippingStrategy.tipSplitHandToo && (!fromWong || fromWong && this.tippingStrategy.tipWongHands)) {
      this.payBankroll(this.tipSize * (-1));
    }
  }

  doubleDealersTip(fromWong: boolean): void {
    if(this.tippingStrategy.doubleOnDouble && (!fromWong || fromWong && this.tippingStrategy.tipWongHands)) {
      this.payBankroll(this.tipSize * (-1));
    }
  }

  wongIn() { 
    if(this.wongingStrategy.length > 0 && this.wongSpotIds.length < this.wongingStrategy.length) {
      const percentNotDealt = Math.floor((this.shared.getDecksRemaining() / this.shared.getConditions().decksPerShoe) * 100)/ 100;
      const rowIndex = this.wongSpotIds.length;
      const columns: number[] = this.wongingStrategy[0].map((s, i) => i);
      const columnIndex = this.getColumnIndex(columns.length,  percentNotDealt);
      const trueCountTenth = this.shared.getHiLoTrueCountTenth();
      if(trueCountTenth >= this.wongingStrategy[rowIndex][columnIndex].enter) {
        this.addWongSpot();
      } 
    }
  }

  addWongSpot() {
    const playerSpots = [ ...this.wongSpotIds, this.spotId];
    const minSpotId = Math.min( ...playerSpots);
    const maxSpotId = Math.max( ...playerSpots);
    let newSpotId = null;
    if(minSpotId > 1 && this.shared.isSpotAvailable(minSpotId - 1)) {
      newSpotId = minSpotId - 1;
    } else if(maxSpotId < this.shared.getConditions().spotsPerTable) {
      newSpotId = maxSpotId + 1;
    }
    if(newSpotId) {
      this.wongSpotIds.push(newSpotId);
      this.addSpot(newSpotId);
      const tableSpot: TableSpot = {
        status: SpotStatus.TAKEN,
        controlledBy: this.handle,
        id: null,
      }
      this.shared.getSpotById(newSpotId).initializeSpot(tableSpot);
    }
  }

  wongOut() {  
    if(this.wongingStrategy.length > 0 && this.wongSpotIds.length > 0 && this.wongSpotIds.length < this.wongingStrategy.length) {
      const percentNotDealt = Math.floor((this.shared.getDecksRemaining() / this.shared.getConditions().decksPerShoe) * 100)/ 100;
      const columns: number[] = this.wongingStrategy[0].map((s, i) => i);
      const columnIndex = this.getColumnIndex(columns.length,  percentNotDealt);
      const trueCountTenth = this.shared.getHiLoTrueCountTenth();
      const rowValues = this.wongingStrategy.map((ws) => ws[columnIndex].exit);
      this.wongSpotIds.forEach((id, i) => {
        if(trueCountTenth <= rowValues[i]) {
          this.leaveWongSpot(id);
        }
      });
    }
  }

  leaveWongSpot(spotIdToLeave) {
    // Dont leave a middle spot
    let diff: number = 0;
    let targetId: number;
    this.wongSpotIds.forEach(id => {
      // Find the spot farthest away from the primary spot (not necessarily spotIdToLeave)
      if(Math.abs(this.spotId - id) > diff) {
        targetId = id;
        diff = Math.abs(this.spotId - id);
      }
    });
    this.shared.getSpotById(targetId).removePlayer()
    this.wongSpotIds = this.wongSpotIds.filter(wsId => wsId !== spotIdToLeave);
  }

  leaveAllWongSpots() {
    // All spots will be wonged out of at the same time
    this.spotIds.filter(id => id !== this.spotId).forEach(id =>this.shared.getSpotById(id).removePlayer())
    this.spotIds = [this.spotId];
    this.wongSpotIds = [];
  }
}