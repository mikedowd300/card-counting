class Hand {
  constructor(id, bet, methodBag, isFromSplit = false) {
    this.id = id;
    this.cards = [];
    this.isPlayed = false;
    this.bet = bet;
    this.options = [];
    this.isFromSplit = isFromSplit;
    this.methodBag = { ...methodBag };
    this.doubleAmount = null;
    this.isFromSplit = isFromSplit;
    this.isFromSplitAces = false;
    this.surrendered = false;
    this.message = '';
  }
  
  setMessage(message) {
    this.message = message;
  }
  
  setBet(bet) {
    this.bet = bet;
  }
  
  getValue() {
    let value = 0;
    this.cards.forEach(card => value += card.cardValue);
    if(this.hasAce()) {
      value = (value + 10) > 21 ? value : (value + 10);
    }
    return value;
  }
  
  isBust() {
    return this.getValue() > 21;
  }
  
  isBlackJack() {
    return this.cards.length === 2 && this.is21() && !this.isFromSplit;
  }
  
  is21() {
    return this.getValue() === 21;
  }
  
  hasAce() {
    return this.cards.filter(card => card.cardValue === 1).length > 0;
  }
  
  isHittable() {
    return this.getValue() < 21;
  }
  
  isSurrenderable() {
    if(this.isFromSplit && !conditions.canSurrenderAfterSplit) {
      return false
    }
    return conditions.canSurrender && this.cards.length === 2 && !this.is21();
  }
  
  isDoubleable() {
    const { cards, getValue, methodBag, isFromSplit, isFromSplitAces } = this;
    const { canDoubleForLess, canDoubleAfterSplit, canDoubleOn10or11Only, canDoubleAnyTwo, canDoubleSplitAces } = conditions;
    const totalHandBets = methodBag.getTotalHandBets();
    if(cards.length > 2
      || this.is21()
      || (!canDoubleForLess && (methodBag.getBankroll() - totalHandBets) < this.bet)
      || (!canDoubleAfterSplit && isFromSplit)
      || (!canDoubleSplitAces && isFromSplitAces)) {
      return false;
    }
    return canDoubleOn10or11Only && (this.getValue() === 10 || this.getValue() === 11)
      || canDoubleAnyTwo
  }
  
  isSplittable() {
    const { methodBag, bet, isFromSplitAces, cards } = this;
    const totalHandBets = methodBag.getTotalHandBets();
  
    if((!conditions.canSplitForLess && methodBag.getBankroll() - totalHandBets < bet)
      || (!conditions.canResplitAces && isFromSplitAces)
      || (methodBag.getHandsCount() === 4)
      || (methodBag.getBankroll() - totalHandBets <= 0)) {
      return false;
    }
    return cards.length === 2 && cards[0].cardValue === cards[1].cardValue
  }
  
  stay() {
    this.isPlayed = true;
    const nextHandId = this.id + 1;
    const nextHand = this.methodBag.getHand(nextHandId);
    if(!nextHand) {
      console.log('playNextPlayer');
      this.methodBag.playNextPlayer();
    } else {
      nextHand.cards.push(this.methodBag.deal());
      nextHand.setOptions();
      if(nextHand.options.length <= 1) {
        nextHand.stay();
      }
    }
  }

  surrender() {
    this.methodBag.payBet((this.bet/2) * (-1));
    this.surrendered = true;
    this.stay();
  }

  hit() {
    this.cards.push(this.methodBag.deal());
    this.setOptions();
    if(this.isBust() || this.is21()) {
      this.stay();
    }
  }

  doubleDown() {
    const { methodBag, bet } = this;
    const amount = (methodBag.getBankroll() - methodBag.getTotalHandBets()) < bet
      ? methodBag.getBankroll() - methodBag.getTotalHandBets()
      : bet;
    this.setBet(bet + amount);
    this.cards.push(methodBag.deal());
    this.stay();
  }

  split() {
    this.isFromSplit = true;
    this.isFromSplitAces = this.cards[0].cardValue === 1;
    const newHandKit = {
      id: this.methodBag.getHandsCount(),
      bet: this.methodBag.getBankroll() - this.methodBag.getTotalHandBets() < this.bet
        ? this.methodBag.getBankroll() - this.methodBag.getTotalHandBets()
        : this.bet,
      isFromSplit: true,
      firstCard: this.cards.pop(),
      isFromSplitAces: this.isFromSplitAces
    }
    this.methodBag.addHandToPlayer(newHandKit);
    this.cards.push(this.methodBag.deal());
    this.setOptions();
    if(this.options.length <= 1) {
      this.stay();
    }
  }

  setOptions() {
    const options = [];
    if(!this.is21() && !this.isBust()) {
      options.push('STAY');
    }
    if(this.isHittable()) {
      options.push('HIT');
    }
    if(this.isSurrenderable()) {
      options.push('SURRENDER');
    }
    if(this.isDoubleable()) {
      options.push('DOUBLE');
    }
    if(this.isSplittable()) {
      options.push('SPLIT');
    }
    this.options = options;
  }
}