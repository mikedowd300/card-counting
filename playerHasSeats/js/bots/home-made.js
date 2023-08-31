class HomeMadeBot {

  constructor() {}

  bettingUnit = 10;

  multiplier = this.multiplier = Math.max(1, shoe.getHiLoTrueCount());

  chooseInsuranceOption = () => 'DECLINE';

  resizeBettingUnit = () => 10;

  resizeBet = () => {
    this.multiplier = Math.max(1, shoe.getHiLoTrueCount());
    return this.bettingUnit * this.multiplier;
  };

  chooseOption = ({ cardValue }, hand) => {
    const cardValues = hand.cards.map(card => card.cardValue);
    const handValue = hand.getValue();
    const softValue = hand.getSoftValue();
    const isSoft = handValue !== softValue;
    const has2Cards = hand.cards.length === 2;
    const options = hand.options;
    const upCard = cardValue;
    const bustCards = [3, 4, 5, 6];
    const hasAce = hand.hasAce();
    const showsBustCard = bustCards.includes(upCard);
    const isSplittable = hand.isSplittable() && options.includes('SPLIT');
    const isSurrenderable = hand.isSplittable() && options.includes('SURRENDER');
    const isHittable = hand.isHittable() && options.includes('HIT');
    const isDoubleable = hand.isDoubleable() && options.includes('DOUBLE');

    if(handValue === 16 && upCard === 10 && isSurrenderable) {
      return 'SURRENDER';
    }
    if(cardValues[0] === 1 && isSplittable) {
      return 'SPLIT';
    }
    if(showsBustCard && isSplittable && [2,3,4,6,7,8,9].includes(cardValues[0])) {
      return 'SPLIT';
    }
    if(handValue === 11 && isDoubleable) {
      return 'DOUBLE';
    }
    if(handValue === 10 && upCard < 10 && isDoubleable) {
      return 'DOUBLE';
    }
    if(showsBustCard && hasAce && softValue < 12 && isDoubleable) {
      return 'DOUBLE';
    }
    if(isSoft && softValue < 7 && isHittable) {
      return 'HIT';
    }
    if(handValue < 12 && isHittable) {
      return 'HIT';
    }
    if(handValue <= 16 && (upCard > 6 || upCard === 1) && isHittable) {
      return 'HIT';
    }
    return 'STAY'
  };
}