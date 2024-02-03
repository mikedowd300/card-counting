import { Injectable } from '@angular/core';
import { 
  ShoeConditions, 
  TableObj, 
  TableSpotsInformation, 
  TableConditionsObj, 
  HoleCardTypesEnum, 
  SurrenderTypesEnum,
  SpotStatus
} from '../models/models';
import { Shoe } from './shoe';
import { Player } from './player';
import { SpotManager } from './spot-manager';
import { DealerHand } from './dealer-hand';
import { LocalStorageService } from './../services/local-storage.service';
import { PlayChartMakerService } from './../services/play-chart-maker.service';
import { BetSpreadService } from '../services/bet-spread.service';
import { InsuranceService } from '../services/insurance.service';
import { UnitResizingService } from '../services/unit-resizing.service';
import { WongingService } from '../services/wonging.service';
import { TippingService } from '../services/tipping.service';

@Injectable({
  providedIn: 'root',
})

export class Table {
  spotCount: number;
  shoe: Shoe;
  players: Player[] = [];
  iterations: number;
  spotManager: SpotManager;
  playedRounds: number = 0;
  dealerHand: DealerHand; 
  conditions: TableConditionsObj;
  totalRoundsDealt: number = 0;
  shared: any;
  localStorageService: LocalStorageService = new LocalStorageService();
  playChartMakerService:PlayChartMakerService = new PlayChartMakerService(this.localStorageService);
  betSpreadService: BetSpreadService = new BetSpreadService(this.localStorageService);
  insuranceService: InsuranceService = new InsuranceService(this.localStorageService);
  unitResizingService: UnitResizingService = new UnitResizingService(this.localStorageService);
  wongingService: WongingService = new WongingService(this.localStorageService);
  tippingService: TippingService = new TippingService(this.localStorageService);
  record: {
    dealersHand: null,
  }; // WIP

  constructor(private tableObj: TableObj) {
    this.initializeShoe(this.tableObj);
    this.shared = {
      payPlayerInSpot: (x, y) => this.payPlayerInSpot(x, y),
      getPlayerBySpotId: (x) => this.getPlayerBySpotId(x),
      discard: (x) => this.shoe.discard(x),
      deal: () => this.shoe.deal(),
      getDecksRemaining: () => this.shoe.getDecksRemaining(),
      getHiLoTrueCountTenth: () => this.shoe.getHiLoTrueCountTenth(),
      dealerHasBlackjack: () => this.dealerHasBlackjack(),
      getConditions: null,
      getDealerUpCard: () => this.getDealerUpCard(),
      getPlayingStrategyFromTitle: (x) => this.playChartMakerService.getStrategyFromTitle(x),
      getBettingStrategyFromTitle: (x) => this.betSpreadService.getStrategyFromTitle(x),
      getInsuranceStrategyFromTitle: (x) => this.insuranceService.getStrategyFromTitle(x),
      getUnitResizingStrategyFromTitle: (x) => this.unitResizingService.getStrategyFromTitle(x),
      getWongingStrategyFromTitle: (x) => this.wongingService.getStrategyFromTitle(x),
      getTippingStrategyFromTitle: (x) => this.tippingService.getStrategyFromTitle(x),
      getInsuranceStrategyBySpotId: (x) => this.getInsuranceStrategyBySpotId(x),
      getDealerHandValue: () => this.getDealerHandValue(),
      getOccupiedActiveSpotCount: () => this.getOccupiedActiveSpotCount(),
      getSpotById: (x) => this.spotManager.getSpotById(x),
      getPlayers: () => this.players, // THIS IS FOR TESTING
      getSpots: () => this.spotManager.spots, // THIS IS FOR TESTING
      isFreshShoe: () => this.shoe.getIsFreshShoe(),
      isSpotAvailable: (x) => this.spotManager.isSpotAvailable(x),
      getTable: () => this,
      getTotalRoundsDealt: () => this.totalRoundsDealt,
      first2Cards: this.playChartMakerService.playerFirst2
    };
    this.initializeTable(this.tableObj);
    this.play();
  }

  initializeShoe({ conditions }: TableObj) {
    const shoeConditions: ShoeConditions = {
      decksPerShoe: conditions.decksPerShoe,
      cardsBurnedPerShoe: conditions.cardsBurnedPerShoe,
      shufflePoint: conditions.shufflePoint
    };
    this.shoe = new Shoe(shoeConditions);
  }

  initializeTable({ conditions, players, playerSpotMap, iterations }: TableObj) {
    this.conditions = conditions;
    const spotInfo: TableSpotsInformation = { 
      spotsPertable: conditions.spotsPerTable,
      playerSpotMap
    };
    this.shared.getConditions = () => this.conditions;
    this.spotManager = new SpotManager(spotInfo, this.shared);
    players.forEach(p => 
      this.players.push(new Player(p, spotInfo.playerSpotMap[p.handle], this.shared)));
    this.iterations = iterations;
    this.dealerHand = new DealerHand(this.shared);
  }

  getOccupiedActiveSpotCount(): number {
    return this.spotManager.spots.filter(s => s.status === SpotStatus.TAKEN).length;
  }

  removePlayerByHandle(handle) {
    const spotIds = this.getPlayerByHandle(handle).spotIds
    // this.players = this.players.filter(p => p.handle !== handle);
    spotIds.forEach(id => this.spotManager.getSpotById(id).removePlayer());
  }

  removeBrokePlayers() {
    this.players
      .filter(p => p.bankroll < this.conditions.minBet)
      .forEach(p => this.removePlayerByHandle(p.handle));
  }

  play() {
    let hasSpots: boolean = this.spotManager.spots.filter(s => s.status === SpotStatus.TAKEN).length > 0;
    while(this.playedRounds < this.iterations && hasSpots) {
      this.initializeRound();
      this.deal();
      this.surrenderEarly();
      this.offerInsurance();
      this.payStandardInsurance();
      this.handleDealerBlackjack();
      this.payBlackjacks();
      this.playHands();
      this.handleNonStandardBlackjack();
      this.playDealersHand();
      this.payHands();
      this.finalizeRound();
      hasSpots = this.spotManager.spots.filter(s => s.status === SpotStatus.TAKEN).length > 0;
    }
    console.log(this.players.map(p => `${p.handle}:${p.bankroll}:${p.tippedAway}`).join(', '));
    
    console.log(this.players.map(p => {
      const ratio = Math.round(10000 * ((p.bankroll - p.originalBankroll) / p.totalBet)) / 100;
      return`TOTAL BET:${p.totalBet} : MONEYWONtoMONEYBET RATIO: ${ratio} each of the ${this.totalRoundsDealt}`
    }).join(', '));
  }

  initializeRound() {
    // console.log('initializeRound');
    // this is where players will wong in (and out?), adjust their bet up or down, tip. If its a new shoe, this could be where players evaluate and change the size of their betting unit.
    // this is where statistcs for a round are initialized, what that means is TBD
    // Check that players betsize is as least as big as their bankroll
    // If the players betSize is less then the bankroll, the bet might be resized here by the betResize strategy, but that isn't a guarantee, if not the players betsize should be resized to the table min, it the bankroll still is not big enough, the player should leave the table - BUT THE PLAYER SHOULD LEAVE THE TABE AT THE END OF A HAND, NOT THE BEGINNING.
    //Players leave at the end of a hand because this gives other players to play that spot at the beginning of he next hand.

    this.shoe.initializeRound();
    // ALLOW WONGED OUT PLAYERS TO WONG IN - ESPECIALLY IF ITS THE PLAYERS MAIN (1st) HAND
    // ALLOW Players wonged out of their main hand to wong in before other players wong into the spot with their additional hands
    this.players.forEach(p => p.initializeRound());

    // All spots' hadBlackJack properties need to be set to false
  }

  getInsuranceStrategyBySpotId(spotId: number) {
    return this.players.find(({ spotIds }) => spotIds.includes(spotId)).insuranceStrategy
  }

  deal() {
    this.shoe.incHandCount();
    this.spotManager.getTakenSpots().forEach(spot => spot.addHand());
    this.spotManager.getTakenSpots()
      .forEach(({ hands }) => hands
      .forEach(({ cards }) => cards.push(this.shoe.deal())));
    this.dealerHand.cards.push(this.shoe.deal());
    this.spotManager.getTakenSpots()
      .forEach(({ hands }) => hands
      .forEach(({ cards }) => cards.push(this.shoe.deal())));

    if(this.isStandardGame()) {
      this.dealerHand.cards.push(this.shoe.dealHoleCard());
    }
    this.totalRoundsDealt++;
  }

  surrenderEarly() {
    // TODO - HANDLE BOTH EARLY SURRENDERS
    const againstAce: boolean = this.dealerHand.showsAce();
    const earlyAgainstAny: boolean = this.conditions.surrender === SurrenderTypesEnum.EARLY_AGAINST_ANY
    const earlyAgainst10Down: boolean =this.conditions.surrender === SurrenderTypesEnum.EARLY_AGAINST_10_DOWN;
    if(earlyAgainstAny || (earlyAgainst10Down && !againstAce)) {
      this.spotManager.offerEarlySurrender();
    }
  }

  offerInsurance() {
    if(this.dealerHand.showsAce()) {
      this.spotManager.offerInsurance();
    }
  }

  payStandardInsurance() {
    if(this.dealerHand.showsAce() && this.isStandardGame()) {
      this.spotManager.payInsurance();
    }
  }

  handleDealerBlackjack() {
    if(this.dealerHand.hasBlackjack()) { 
      this.spotManager.payDealersBlackjack();
    }
  }

  payBlackjacks() {
    if(!this.dealerHand.hasBlackjack() && this.isStandardGame()) {
      this.spotManager.payBlackjacks();
    }
  }

  playHands() {
    if(!this.dealerHand.hasBlackjack()) {
      this.spotManager.playHands()
    }
  }

  handleNonStandardBlackjack() {
    if(!this.isStandardGame()) {
      this.spotManager.payInsurance();
      this.handleDealerBlackjack();
    }
  }

  playDealersHand() {
    if(this.isStandardGame()) {
      // const card = this.dealerHand.cards[1];
      // this.shoe.setHiLoRunningCount(card.hiLoCountValue);
      // this.shoe.updateAceCount(card.cardValue);
      this.shoe.flipHoleCard(this.dealerHand.cards[1]);
    }
    if(!this.dealerHand.hasBlackjack() && this.spotManager.getTakenUnpaidSpots().length > 0) {
      this.dealerHand.playHand();
    }
  }

  payHands() {
    if(!this.dealerHand.hasBlackjack()) {
      this.spotManager.payHands();
    }
  }

  finalizeRound() {
    // This is where players leave the table, either because they are out of money or they Wong out.
    // This is also when and where stat objects for a round are finalized.
    // This is where the roundCount is incremented

    this.dealerHand.finalize();
    this.spotManager.getTakenSpots().forEach(spot => spot.finalizeHand());
    this.spotManager.getTakenSpots().forEach(spot => spot.resetHands());
    this.dealerHand.clearCards();
    this.shoe.shuffleCheck();
    this.playedRounds += 1;
    this.removeBrokePlayers();
    this.players.forEach(p => p.finalizeRound());
  }

  getPlayerBySpotId(spotId: number): Player {
    return this.players.find(({ spotIds }) => spotIds.includes(spotId))
  }

  getPlayerByHandle(handle: string): Player {
    return this.players.find(p => p.handle === handle)
  }

  payPlayerInSpot(spotId: number, amount: number) {
    this.getPlayerBySpotId(spotId).payBankroll(amount);
  }

  isStandardGame(): boolean {
    return this.conditions.holeCardType === HoleCardTypesEnum.STANDARD
  }

  isOBOGame(): boolean {
    return this.conditions.holeCardType === HoleCardTypesEnum.OBO
  }

  isENHCGame(): boolean {
    return this.conditions.holeCardType === HoleCardTypesEnum.ENHC
  }

  hasLateSurrender(): boolean {
    return this.conditions.surrender === SurrenderTypesEnum.LATE
  }

  dealerHasBlackjack(): boolean {
    return this.dealerHand.hasBlackjack();
  }

  getDealerUpCard(): string {
    return this.dealerHand.cards[0].cardValue.toString();
  }

  getDealerHandValue() {
    return this.dealerHand.getValue();
  }
}