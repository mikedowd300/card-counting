class ConditionsService {

  constructor() {
    this.conditions = this.getDefaultConditions();
    const updateConditions = newConditions  => this.conditions = { ...newConditions };
    this.updateConditions = updateConditions;
  }

  getDefaultConditions() {
    return {
      dealerStaysOnSoft17: true,
      canResplitAces: true,
      canDoubleSplitAces: false,
      canHitSpiltAces: false,
      canDoubleForLess: true,
      canDoubleAfterSplit: true,
      canOnlyDoubleOn: [10, 11],
      canDoubleAnyTwo: true,
      canDoubleSoft11AfterSplitting10s: false,
      canInsureForLess: true,
      canSplitForLess: true,
      canSurrender: false,
      canSurrenderAfterSplit: false,
      useDealLoop: false,
      dealLoopIterations: 10000,
      cardsBurnedPerShoe: 1,
      decksPerShoe: 2,
      seatsPerTable: 4,
      minimumBet: 10,
      maximumBet: 100,
      startingBankroll: 5000,
      shufflePoint: .7,
      blackJackPaysRatio: 3/2,
      basicStrategySettings: {
        insuranceAt: 3,
        bettingUnit: 10,
        addHandsAt: 2,
        decreaseHandsAt: 1,
        betSpread: [ 1, 1, 2, 3, 4, 4, 4, 4, 4],
      }
    }
  };
}