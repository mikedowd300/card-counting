class ConditionsService {

  constructor() {
    this.conditions = this.getDefaultConditions();
    const updateConditions = newConditions  => this.conditions = { ...newConditions };
    this.updateConditions = updateConditions;
  }

  getDefaultConditions() {
    return {
      dealerStaysOnSoft17: false,
      canResplitAces: true,
      canDoubleSplitAces: false,
      canHitSpiltAces: false,
      canDoubleForLess: false,
      canDoubleAfterSplit: true,
      canOnlyDoubleOn: [10, 11],
      canDoubleAnyTwo: true,
      canDoubleSoft11AfterSplitting10s: false,
      canInsureForLess: false,
      canSplitForLess: false,
      canSurrender: false,
      canSurrenderAfterSplit: false,
      useDealLoop: true,
      useRetroResize: false,
      dealLoopIterations: 10000,
      cardsBurnedPerShoe: 1,
      decksPerShoe: 2,
      seatsPerTable: 4,
      minimumBet: 10,
      maximumBet: 500,
      startingBankroll: 10000,
      shufflePoint: .7,
      blackJackPaysRatio: 3/2,
      basicStrategySettings: {
        split10s: false,
        insuranceAt: 3,
        bettingUnit: 10,
        addHandsAt: 2,
        decreaseHandsAt: 1,
        betSpread: [ 1, 1, 2, 3, 4, 5, 6, 6, 6],
      }
    }
  };
}