class Illustrious18Bot {

  constructor(getRetroResizeCoefficient) {
    this.getRetroResizeCoefficient = getRetroResizeCoefficient;
  }

  insuranceAt = conditions.basicStrategySettings.insuranceAt;
  bettingUnit = conditions.basicStrategySettings.bettingUnit;
  betSpread = conditions.basicStrategySettings.betSpread;
  split10s = conditions.basicStrategySettings.split10s;

  chooseInsuranceOption = () => {
    return shoe.getHiLoTrueCount() >= this.insuranceAt ? 'ACCEPT' : 'DECLINE';
  }

  resizeBet = () => {
    const count = shoe.getHiLoTrueCount();
    let multiplierIndex = 0;
    if(count <= 0) {
      multiplierIndex = 0;
    } else if(count >= this.betSpread.length - 1) {
      multiplierIndex = this.betSpread[8];
    } else {
      multiplierIndex = Math.max(0, shoe.getHiLoTrueCount());
    }
    return this.bettingUnit * this.getRetroResizeCoefficient() * this.betSpread[multiplierIndex];
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
    const DAS = conditions.canDoubleAfterSplit; // This may be redundant since isDoubleable should account for this, but it wont hurt

    const trueCount = shoe.getHiLoTrueCount();

    if(isSurrenderable && !isSoft) {
      let against16 = [1, 9, 10]
      let against15 = [10];
      let against14 = [];
      let against13 = [];

      if(trueCount <= -1) {
        against16 = against16.filter(x => x !== 9 && x !== 10);
      }
      if(trueCount >= 2) {
        against15.push(9);
        against15.push(1);
      }
      if(trueCount >= 3) {
        against14.push(10);
      }
      if(trueCount >= 4) {
        against16.push(8);
      }
      if(trueCount >= 5) {
        against14.push(1);
      }
      if(trueCount >= 7) {
        against15.push(8);
        against14.push(9);
      }
      if(trueCount >= 8) {
        against13.push(10);
      }
      if(handValue === 16 && against16.includes(upCard) 
      || handValue === 15 && against15.includes(upCard)
      || handValue === 14 && against14.includes(upCard)
      || handValue === 14 && against13.includes(upCard)
      ) {
        return 'SURRENDER';
      }
    }

    if(isSplittable && (hasAce || firstCardValue === 8)) {
      return 'SPLIT';
    }
    if(isSplittable) {
      let against9s = [2, 3, 4, 5, 6, 8, 9];
      let against7s = [2, 3, 4, 5, 6, 7];
      let against6s = DAS ? [2, 3, 4, 5, 6] : [3, 4, 5, 6];
      let against4s = DAS ? [5, 6] : [];
      let against3s = DAS ? [2, 3, 4, 5, 6, 7] : [4, 5, 6, 7];
      let against2s = DAS ? [2, 3, 4, 5, 6, 7] : [4, 5, 6, 7];
      let against10s = (this.split10s && trueCount >= 4) ? [6] : [];
      if(this.split10s && trueCount >= 5) {
        against10s.push(5);
      }
      if(this.split10s && trueCount >= 6) {
        against10s.push(4);
      }
      if(
          (firstCardValue === 10 && against10s.includes(upCard)) ||
          (firstCardValue === 9 && against9s.includes(upCard)) ||
          (firstCardValue === 7 && against7s.includes(upCard)) ||
          (firstCardValue === 6 && against6s.includes(upCard)) ||
          (firstCardValue === 4 && against4s.includes(upCard)) ||
          (firstCardValue === 3 && against3s.includes(upCard)) ||
          (firstCardValue === 2 && against2s.includes(upCard)) 
        ) {
        return 'SPLIT';
      }    
    }
    if(isSoft && isDoubleable) {
      if(handValue === 19) {
        let doublesAgainst = [6];
        if(trueCount >= 1) {
          doublesAgainst.push(5);
        }
        if(trueCount >= 3) {
          doublesAgainst.push(4);
        }
        if(doublesAgainst.includes(upCard)) {
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
        if(trueCount >= 1) {
          doublesAgainst.push(2);
        }
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
        let doublesAgainst = [2, 3, ,4, 5, 6, 7, 8, 9];
        if(trueCount >= 4) {
          doublesAgainst.push(10);
          doublesAgainst.push(1);
        }
        if(doublesAgainst.includes(upCard)) {
          return 'DOUBLE';
        }
      }
      if(handValue === 9) {
        let doublesAgainst = [3, 4, 5, 6];
        if(trueCount >= 1.5) {
          doublesAgainst.push(2);
        }
        if(trueCount >= 3) {
          doublesAgainst.push(7);
        }
        if(doublesAgainst.includes(upCard)) {
          return 'DOUBLE';
        } 
      }
    }
    if(isHittable) {
      if(handValue === 16 && trueCount > 0 && upCard === 10) {
        return 'STAY';
      }
      if(handValue === 16 && trueCount >= 4 && upCard === 9) {
        return 'STAY';
      }
      if(handValue === 15 && trueCount >= 4 && upCard === 10) {
        return 'STAY';
      }
      const genericHittableValues = [16, 15, 14, 13];
      if(genericHittableValues.includes(handValue) && (upCard > 6 || upCard === 1)) {
        return 'HIT';
      }
      if(handValue === 12) {
        let hitAgainst = [1, 2, 3, 7, 8, 9, 10];
        if(trueCount < 0) {
          hitAgainst.push(4)
        }
        if(trueCount < -1) {
          hitAgainst.push(5)
        }
        if(trueCount < -2) {
          hitAgainst.push(6)
        }
        if(trueCount > 1.5) {
          hitAgainst = hitAgainst.filter(x => x !== 3)
        }
        if(trueCount >= 3) {
          hitAgainst = hitAgainst.filter(x => x !== 2)
        }
        if(hitAgainst.includes(upCard)) {
          return 'HIT';
        }
      }
      if(handValue < 12 && handValue > 3) {
        return 'HIT';
      }
    }
    return 'STAY';
  };
}