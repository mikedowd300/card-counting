class TableStat {
  beginningBankrolls = [];
  endingBankrolls = [];
  trueCount = null;
  aceRatio = null;

  constructor() {}

  setBeginningBankrolls(bankrolls) {
    this.beginningBankrolls = bankrolls;
  }

  setEndingBankrolls(bankrolls) {
    this.endingBankrolls = bankrolls;
  }

  getPlayerWinnings() {
    return this.endingBankrolls.map((bankroll, i) => bankroll - this.beginningBankrolls[i]);
  }

  getTotalWinnings() {
    let winnings = 0;
    this.getPlayerWinnings().forEach(winning => winnings += winning);
    return winnings
  }

  setTrueCount(count) {
    this.trueCount = count;
  }

  setAceRatio(count) {
    this.aceRatio = count;
  }

  getStat() {
    return {
      playerWinnings: this.getPlayerWinnings(),
      totalWinnings: this.getTotalWinnings(),
      trueCount: this.trueCount,
      aceRatio: this.aceRatio,
    };
  }
}