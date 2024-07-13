export interface SimplifiedDealerHand {
  holeCard?: string;
  allCards?: string[];
  didBust?: boolean;
  hadBlackjack?: boolean;
  value: number;
}

export interface InsuranceResults {
  wasOfferedInsurance: boolean;
  didAcceptInsurance: boolean;
  insuranceWinnings: number;
}

export interface SimplifiedHand {
  cards?: string[];
  didBust?: boolean;
  didWin?: boolean; 
  didPush?: boolean;
  didAcceptInsurance?: InsuranceResults;
  betAmount: number;
}

export interface SimplifiedSpot {
  hands: SimplifiedHand[];
}

export interface SimplifiedPlayer {
  handle?: string;
  bettingUnit: number;
  startingBankroll?: number;
  endingBankroll?: number;
  totalBetThisHand?: number;
  spots?: SimplifiedSpot[];
  tip: number;
}

export class RoundRecord {
  shoeId?: number;
  handOfShoe?: number;
  prePenn?: number;
  postPenn?: number;
  isEndOfShoe?: boolean;
  beginningTrueCount?: number;
  endingTrueCount?: number;
  aceSideCount?: number;
  beginningRunningCount?: number;
  endingRunningCount?: number;
  dealerHand?: SimplifiedDealerHand;
  players?: SimplifiedPlayer[];

  constructor(public roundId: string) {}
}

export interface ShoeRecord {
  shoeId?: string;
  roundsDealt?: number;
  wasHalfShoe?: boolean;
  countAtShuffle?: number;
}

export class LosingStreak {
  previousHi: number = null;
  newHi: number = null;
  roundsInBetween: number = 0;
  lowestPoint: number = null;
}