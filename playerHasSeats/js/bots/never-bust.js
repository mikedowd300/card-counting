class NeverBustBot {

  constructor() {}

  bettingUnit = conditions.minimumBet;
  // bankrollHistory = [];
  chooseInsuranceOption = () => 'DECLINE';

  resizeBet = () => {
    const multiplier = Math.max(1, shoe.getHiLoTrueCount());
    return this.bettingUnit * multiplier;
  };

  chooseOption = ({ cardValue }, hand) => {
    if(hand.hasAce() && hand.getSoftValue() < 7) {
      return 'HIT';
    }
    if(hand.getValue() < 12) {
      return 'HIT';
    }
    return 'STAY'
  };
  // addToBankrollHistory = item => this.bankrollHistory.push(item);
  // getBankrollHistory = () => this.bankrollHistory;
}