class BasicStrategyBot {

  constructor() {}

  bettingUnit = 10;

  multiplier = Math.max(1, shoe.getHiLoTrueCount());

  chooseInsuranceOption = () => {
    return shoe.getHiLoTrueCount() >= 4 ? 'ACCEPT' : 'DECLINE';
  }

  resizeBettingUnit = () => 10;

  resizeBet = () => {
    this.multiplier = Math.max(1, shoe.getHiLoTrueCount());
    this.multiplier = this.multiplier === 2 ? 1 : this.multiplier;
    return this.bettingUnit * Math.min(this.multiplier, 4);
  };

  chooseOption = ({ cardValue }, hand) => {
    const cardValues = hand.cards.map(card => card.cardValue);
    const firstCardValue = cardValues[0];
    const handValue = hand.getValue();
    const softValue = hand.getSoftValue();
    const isSoft = handValue !== softValue;
    const options = hand.options;
    const upCard = cardValue;
    const hasAce = hand.hasAce();
    const isSplittable = hand.isSplittable() && options.includes('SPLIT');
    const isSurrenderable = hand.isSurrenderable() && options.includes('SURRENDER');
    const isHittable = hand.isHittable() && options.includes('HIT');
    const isDoubleable = hand.isDoubleable() && options.includes('DOUBLE');

    if(isSurrenderable && !isSoft) {
      const against16 = [1, 9, 10]
      const against15 = 10;
      if(handValue === 16 && against16.includes(upCard) || handValue === 15 && against15 === upCard) {
        return 'SURRENDER';
      }
    }
    if(isSplittable && (hasAce || firstCardValue === 8)) {
      return 'SPLIT';
    }
    if(isSplittable) {
      const against9 = [2, 3, 4, 5, 6, 8, 9];
      const against7 = [2, 3, 4, 5, 6, 7];
      const against6 = [2, 3, 4, 5, 6];
      const against4 = [5, 6];
      const against3 = [2, 3, 4, 5, 6, 7];
      const against2 = [2, 3, 4, 5, 6, 7];
      if(firstCardValue === 9 && against9.includes(upCard) ||
        firstCardValue === 7 && against7.includes(upCard) ||
        firstCardValue === 6 && against6.includes(upCard) ||
        firstCardValue === 4 && against4.includes(upCard) ||
        firstCardValue === 3 && against3.includes(upCard) ||
        firstCardValue === 2 && against2.includes(upCard)) {
        return 'SPLIT';
      }    
    }
    if(isSoft && isDoubleable) {
      if(handValue === 19) {
        if(upCard === 6) {
          return 'DOUBLE';
        }
      }
      if(handValue === 18) {
        const doublesAgainst = [2, 3, 4, 5, 6];
        if(doublesAgainst.includes(upCard)) {
          return 'DOUBLE';
        }
      }
      if(handValue === 17) {
        const doublesAgainst = [3, 4, 5, 6];
        if(doublesAgainst.includes(upCard)) {
          return 'DOUBLE';
        }
      }
      if(handValue === 16) {
        const doublesAgainst = [4, 5, 6];
        if(doublesAgainst.includes(upCard)) {
          return 'DOUBLE';
        }
      }
      if(handValue === 15) {
        const doublesAgainst = [4, 5, 6];
        if(doublesAgainst.includes(upCard)) {
          return 'DOUBLE';
        }
      }
      if(handValue === 14) {
        const doublesAgainst = [5, 6];
        if(doublesAgainst.includes(upCard)) {
          return 'DOUBLE';
        }
      }
      if(handValue === 13) {
        const doublesAgainst = [5, 6];
        if(doublesAgainst.includes(upCard)) {
          return 'DOUBLE';
        }
      }
    }
    if(isSoft && isHittable) {      
      if(handValue === 18) {
        const hitsAgainst = [1, 9, 10];
        if(hitsAgainst.includes(upCard)) {
          return 'HIT';
        }
      }
      if(handValue < 18 && handValue > 12) {
        return 'HIT';
      }
    }
    if(isDoubleable) {
      if(handValue === 11) {
        return 'DOUBLE';
      }
      if(handValue === 10) {
        const doublesAgainst = [2, 3, ,4, 5, 6, 7, 8, 9];
        if(doublesAgainst.includes(upCard)) {
          return 'DOUBLE';
        }
      }
      if(handValue === 9) {
        const doublesAgainst = [3, 4, 5, 6];
        if(doublesAgainst.includes(upCard)) {
          return 'DOUBLE';
        } 
      }
    }
    if(isHittable) {
      const genericHittableValues = [16, 15, 14, 13];
      if(genericHittableValues.includes(handValue) && (upCard > 6 || upCard === 1)) {
        return 'HIT';
      }
      if(handValue === 12 && (upCard > 6 || upCard < 4)) {
        return 'HIT';
      }
      if(handValue < 12 && handValue > 4) {
        return 'HIT';
      }
    }
    return 'STAY';
  };
}