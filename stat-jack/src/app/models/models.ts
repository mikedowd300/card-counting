import { Card } from '../blackjack-game-engine/card';

export class StrategyChartTypes {
  name: string;
  view: ModalContent;
  description?: string;
};

export const cardValues: string[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K'];

export enum ModalContent {
  BET_SPREAD_CHART_MAKER = 'bet-spread-chart-maker',
  UNIT_RESIZING_STRATEGY_MAKER = 'unit-resizing-strategy-maker',
  CHART_SPYING_CONFIG = 'chart-spying-config',
  TABLE_CONDITIONS_MAKER = 'conditions-maker',
  COVER_PLAYS='cover-plays',
  DATA_COLLECTOR = 'data-collector',
  PLAY_CHART_MAKER = 'play-chart-maker',
  PLAYER_PROFILE_MAKER = 'player-profile-maker',
  TABLE_MAKER = 'table-maker',
  SURRENDER_CHART_MAKER = 'surrender-chart-maker',
  INSURANCE_STRATEGY = 'insurance-strategy',
  WONG_STRATEGY = 'wong-strategy',
  TIPPING_STRATEGY = 'tipping-strategy',
  DATA_DISPLAY = 'data-display',
};

export enum DisplayTypeEnum {
  RADIO_BUTTON = 'radio',
  TEXT = 'text',
  CHECK_BOX = 'checkbox',
  SELECT = 'select',
  TEXTAREA = 'textarea',
}; 

export enum PayRatioEnum {
  THREE_to_TWO = '3/2',
  SIX_to_FIVE = '6/5',
  TWO_to_ONE = '2/1',
  ONE_to_ONE = '1/1',
};

export enum SurrenderTypesEnum {
  NO_SURRENDER = 'none',
  EARLY_AGAINST_ANY = 'early against any',
  EARLY_AGAINST_10_DOWN = 'early against 10 down',
  LATE = 'late',
}

export enum HoleCardTypesEnum {
  STANDARD = 'Standard',
  OBO = 'OBO',
  ENHC = 'ENHC',
}

export enum SpotStatus {
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  TAKEN = 'taken',
}

export enum HandOptionEnums {
  HIT = 'hit',
  STAY = 'stay',
  SPLIT = 'split',
  DOUBLE = 'double',
  SURRENDER = 'surrender',
}

export enum PlayStrategyEnum {
  BASIC_STRATEGY = 'Basic Strategy',
  ENHC_BASIC_STRATEGY = 'ENHC Basic Strategy',
  ILLUSTRIOUS_18_H17 = 'The Illustrious 18 for H17',
  ILLUSTRIOUS_18_S17 = 'The Illustrious 18 for S17',
  ALL_DEVIATIONS_H17 = 'All H17 Deviations',
}

export enum SpreadStrategyEnum {
  BASIC_SPREAD = 'Basic spread',
  HALF_SHOE_SPREAD = 'Spreads for each half of shoe',
  THIRD_SHOE_SPREAD = 'Spreads for each thirds of a shoe',
  QUARTER_SHOE_SPREAD = 'Spreads for each quarter of a shoe',
  SIXTH_SHOE_SPREAD = 'Spreads for each sixth of a shoe',
}

export enum InsuranceStrategyEnum {
  NEVER_TAKE_INSURANCE = 'Never Take Insurance',
  COUNTING_INSURANCE = 'Insurance With Counting',
  ILLUSTRIOUS_18_INSURANCE = 'Illustrious 18 Insurance',
}

export enum SurrenderStrategyEnum {
  BASIC_LATE = 'Basic Late Surrender',
  ENHC_BASIC_LATE = 'ENHC Basic Late Strategy',
  ENHC_EARLY_AGAINST_10_OR_LESS = 'ENHC Early Surrender Against a 10 or Less',
  ENHC_EARLY_AGAINST_ANY = 'ENHC Early Surrender Against Any Dealer Upcard',
  ENHC_EARLY_AGAINST_ANY_WITH_DEVIATIONS = 'ENHC Early Surrender with Deviations',
  LATE_H17_SINGLE_DECK = 'Single Deck H17 Late Surrender',
  LATE_S17_SINGLE_DECK = 'Single Deck S17 Late Surrender',
  LATE_H17_DOUBLE_DECK = 'Double Deck H17 Late Surrender',
  LATE_S17_DOUBLE_DECK = 'Double Deck S17 Late Surrender',
  LATE_H17_4_OR_MORE_DECKS = 'H17 4 or More Decks Late Surrender',
  LATE_S17_4_OR_MORE_DECKS = 'S17 4 or More Decks Late Surrender',
  LATE_H17_4_OR_MORE_DECKS_WITH_DEVIATIONS = 'H17 4 or More Decks Late Surrender With Deviations',
  LATE_S17_4_OR_MORE_DECKS_WITH_DEVIATIONS = 'H17 4 or More Decks Late Surrender With Deviations',
}

export enum UnitResizingEnum {
  NEVER_RESIZE = 'Never Resize',
  REDUCE_RISK_RED = 'Reduce Risk Red',
}

export enum WongingEnum {
  NEVER_WONG = "No wonging",
  WONG_TO_1_ADDITIONAL_SPOTS = "Wong to 1 Additional Spot",
  WONG_TO_2_ADDITIONAL_SPOTS = "Wong to 2 Additional Spots",
  WONG_TO_3_ADDITIONAL_SPOTS = "Wong to 3 Additional Spots",
}

export enum TippingEnum {
  NEVER_TIP = "No tipping",
  CHEAP_TIPPER = "Cheap Tipper",
  MODERATE_TIPPER = "Moderate Tipper",
  GENEROUS_TIPPER = "Generous Tipper",
}

export enum RoundingStrategyEnum {
  ROUND_UP = 'Round up',
  ROUND_DOWN = 'Round down'
}

export enum CountByEnum {
  COUNT_BY_POINT_1 = 'Count by 1/10',
  COUNT_BY_POINT_2 = 'Count by 1/5',
  COUNT_BY_POINT_5 = 'Count by 1/2',
  COUNT_BY_1 = 'Count by 1',
}

export enum ChipColorEnum {
  WHITE_CHIP = 'white chip',
  RED_CHIP = 'red chip',
  GREEN_CHIP = 'green chip',
  BLACK_CHIP = 'black chip',
  PURPLE_CHIP = 'purple chip',
}

export interface ChartCell {
  action: HandOptionEnums[],
  conditions: string[]
}

export interface ChartCellFromInput {
  action: string,
  conditions: string
}

export class TableHandHistory {
  decksPerShoe: number;
  handOfShoe: number;
  beginningRunningCount: number;
  beginningAmountOfShoeDealt: number;
  dealersCards: Card[]; // Can we just save the value?
  players: any[]; // We only need the handle and the players PlayerPlayHistory, not a full BlackjackPlayer
}

export class PlayerPlayHistory {
  beginningBankroll: number;
  endingBankroll: number;
  spotsPlayed: number;
  spotHistory: SpotHandHistory[]; 
}

export class SpotHandHistory {
  hands: [ hand: HandHistory];
}

export class HandHistory {
  cards: Card[]; // Can we just save the value?
  decisions: string[]; // Including insurance
  result: string; // ResutsEnum?
  tipHistory: TipHistory;
}

export class TipHistory {
  // Not all tips correlate to a hand. Tips may be given to a dealer without a hand being player. This affects the bankroll, but it cant be linked to a hand (in reality). Such tips need to be linked to a hand played for the sake of the bankroll.
  amount: number;
  reason: string[];
}

export class InputTypeEnum {
  description?: string;
  value: boolean 
    | PayRatioEnum 
    | number 
    | SurrenderTypesEnum 
    | PlayStrategyEnum 
    | string[] 
    | string 
    | HoleCardTypesEnum 
    | SurrenderStrategyEnum
    | SpreadStrategyEnum
    | InsuranceStrategyEnum;
  displayWith?: DisplayTypeEnum;
  options?: SurrenderTypesEnum[] | PayRatioEnum[] | HoleCardTypesEnum[];
};

export class ExtendedConditionInputTypeEnum extends InputTypeEnum {
  canOnlyDoubleOn? : {
    hard7: any;
    hard8: InputTypeEnum;
    hard9: InputTypeEnum;
    hard10: InputTypeEnum;
    hard11: InputTypeEnum;
    hard12: InputTypeEnum;
    hard13: InputTypeEnum;
    AA: InputTypeEnum;
    A2: InputTypeEnum;
    A3: InputTypeEnum;
    A4: InputTypeEnum;
    A5: InputTypeEnum;
    A6: InputTypeEnum;
    A7: InputTypeEnum;
    A8: InputTypeEnum;
    A9: InputTypeEnum;
    // AT: InputTypeEnum;
  };
  DS21?: InputTypeEnum;
  DS21A?: InputTypeEnum;
  expandsWhenFalse?: boolean;
  expandsWhenTrue?: boolean;
};

export class TableConfig {
  title: InputTypeEnum;
  players: InputTypeEnum;
  tableConditions: InputTypeEnum;
  playerSpotMap: any;
}

export class TableObj { 
  title: string;
  conditions: TableConditionsObj = new TableConditionsObj();
  players: PlayerObj[];
  playerSpotMap: any;
  iterations: number;
}

export class TableConditions {
  title: string;
  SI7: InputTypeEnum;
  RSA: InputTypeEnum;
  HSA: InputTypeEnum;
  DSA: InputTypeEnum;
  DAS: ExtendedConditionInputTypeEnum;
  DA2: ExtendedConditionInputTypeEnum;
  ALE: ExtendedConditionInputTypeEnum;
  AHMR: ExtendedConditionInputTypeEnum;
  DFL: ExtendedConditionInputTypeEnum;
  reshuffleOnDealerChange: ExtendedConditionInputTypeEnum; 
  payRatio: InputTypeEnum;
  surrender: InputTypeEnum;
  spotsPerTable: InputTypeEnum;
  decksPerShoe: InputTypeEnum;
  cardsBurnedPerShoe: InputTypeEnum;
  minBet: InputTypeEnum;
  maxBet: InputTypeEnum;
  shufflePoint: InputTypeEnum;
  handsPerDealer: InputTypeEnum;
  holeCardType: InputTypeEnum;
  MHFS: InputTypeEnum;
};

export class PlayerConfig {
  handle?: InputTypeEnum;
  description?: InputTypeEnum;
  bettingUnit: InputTypeEnum;
  bankroll: InputTypeEnum;
  playingStrategy: InputTypeEnum;
  lateSurrenderStrategy: InputTypeEnum;
  earlySurrenderStrategy: InputTypeEnum;
  betSpreadingStrategy: InputTypeEnum;
  insuranceStrategy: InputTypeEnum;
  unitResizingStrategy: InputTypeEnum;
  coverPlayStrategy: InputTypeEnum;
  wongingStrategy: InputTypeEnum;
  tippingStrategy: InputTypeEnum;
  usesAceCount: InputTypeEnum;
}

export class PlayerObj {
  handle?: string;
  description?: string;
  bettingUnit: number;
  bankroll: number;
  playingStrategy: string; // These strategies are just strings until they exist and have models
  lateSurrenderStrategy: string;
  earlySurrenderStrategy: string;
  betSpreadingStrategy: string;
  insuranceStrategy: string;
  unitResizingStrategy: string;
  coverPlayStrategy: string;
  wongingStrategy: string;
  tippingStrategy: string;
  usesAceCount: boolean;
  amountBetPerHand?: number;
}

export class StoredPlayerConfiguration {
  // This only concerns values stored in Local Storage
  handle?: { value: string }; // This is also the key in local storage
  description?: { value: string };
  bettingUnit: { value: number };
  bankroll: { value: number };
  playingStrategy: { value: PlayStrategyEnum };
  lateSurrenderStrategy: { value : SurrenderStrategyEnum };
  earlySurrenderStrategy: { value : SurrenderStrategyEnum };
  betSpreadingStrategy: { value: SpreadStrategyEnum };
  insuranceStrategy: { value: InsuranceStrategyEnum };
  unitResizingStrategy: { value: UnitResizingEnum }; 
  coverPlayStrategy: { value: string }; // Names of configutations in Local Storage
  wongingStrategy: { value: WongingEnum }
  tippingStrategy: { value: TippingEnum }
  usesAceCount: { value: boolean }
}

export class StoredTableConfig {
  title: { value: string };
  players: { value: string[] };
  tableConditions: { value: string };
  playerSpotMap: { };
}

export class StoredTableConditions {
  title: string;
  SI7: { value: boolean };
  RSA: { value: boolean };
  HSA: { value: boolean };
  DSA: { value: boolean };
  DA2: {
    value: boolean,
    canOnlyDoubleOn : {
      hard7: { value: boolean },
      hard8: { value: boolean },
      hard9: { value: boolean },
      hard10: { value: boolean },
      hard11: { value: boolean },
      hard12: { value: boolean },
      hard13: { value: boolean },
      AA: { value: boolean },
      A2: { value: boolean },
      A3: { value: boolean },
      A4: { value: boolean },
      A5: { value: boolean },
      A6: { value: boolean },
      A7: { value: boolean },
      A8: { value: boolean },
      A9: { value: boolean },
      // AT: { value: boolean },
    },
    DS21: { value: boolean },
    DS21A: { value: boolean },
  };
  ALE: { value: boolean };
  AHMR: { value: boolean };
  DFL: { value: boolean };
  DAS: { value: boolean };
  reshuffleOnDealerChange: { value: boolean };
  payRatio: { value: PayRatioEnum };
  surrender: { value: SurrenderTypesEnum };
  spotsPerTable: { value: number};
  decksPerShoe: { value: number};
  cardsBurnedPerShoe: { value: number};
  minBet: { value: number};
  maxBet: { value: number};
  shufflePoint: { value: number};
  handsPerDealer:  { value: number};
  holeCardType: { value: HoleCardTypesEnum};
  MHFS: { value: number};
};

export interface DA2TYPE {
  value: boolean;
  canOnlyDoubleOn : {
    hard7: boolean,
    hard8: boolean,
    hard9: boolean,
    hard10: boolean,
    hard11: boolean,
    hard12: boolean,
    hard13: boolean,
    AA: boolean,
    A2: boolean,
    A3: boolean,
    A4: boolean,
    A5: boolean,
    A6: boolean,
    A7: boolean,
    A8: boolean,
    A9: boolean,
    // AT: boolean,
  },
  DS21: boolean,
  DS21A: boolean,
}

export class TableConditionsObj {
  SI7: boolean = null;
  RSA: boolean = null;
  HSA: boolean = null;
  DSA: boolean = null;
  DAS: boolean = null;
  DA2: DA2TYPE = {
    value: null,
    canOnlyDoubleOn: {
      hard7: null,
      hard8: null,
      hard9: null,
      hard10: null,
      hard11: null,
      hard12: null,
      hard13: null,
      AA: null,
      A2: null,
      A3: null,
      A4: null,
      A5: null,
      A6: null,
      A7: null,
      A8: null,
      A9: null,
      // AT: null,
    },
    DS21: null,
    DS21A: null,
  }
  ALE: boolean = null;
  AHMR: boolean = null;
  DFL: boolean = null;
  reshuffleOnDealerChange: boolean = null;
  payRatio: PayRatioEnum = null;
  surrender: SurrenderTypesEnum = null;
  spotsPerTable: number = null;
  decksPerShoe: number = null;
  cardsBurnedPerShoe: number = null;
  minBet: number = null;
  maxBet: number = null;
  shufflePoint: number = null;
  handsPerDealer: number = null;
  holeCardType: HoleCardTypesEnum = null;
  MHFS: number = null;
};

export interface ShoeConditions {
  decksPerShoe: number;
  cardsBurnedPerShoe: number;
  shufflePoint: number;
}

export interface TableSpotsInformation {
  spotsPertable: number;
  playerSpotMap: any;
}

export interface TableSpot {
  status: SpotStatus;
  controlledBy: string;
  id: number;
}