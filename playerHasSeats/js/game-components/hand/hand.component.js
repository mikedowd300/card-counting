class HandComponent {
  constructor(brainType, parentElem, methodsBag, bet, spotId, handId, isFromSplit = false, firstCard = null) {
    this.id = handId;
    this.parentElem = parentElem;    
    this.cards = [];
    this.isPlayed = false;
    this.hasBeenPaid = false;
    this.bet = bet;
    this.options = [];
    this.isFromSplit = isFromSplit;
    this.methodsBag = { 
      ...methodsBag,
    };
    this.spotId = spotId;
    this.doubleAmount = null;
    this.isFromSplitAces = false;
    this.surrendered = false;
    this.history = '';
    this.info = { 
      optionActions: {
        'STAY': () => this.stay(),
        'SURRENDER': () => this.surrender(),
        'HIT': () => this.hit(),
        'DOUBLE': () => this.doubleDown(),
        'SPLIT': () => this.split(),
      }
    };
    this.botBrain = brainType === 'HUMAN' ? null : (this.getBot(brainType) || null);
    this.view = new HandUI(parentElem, spotId, handId, this.methodsBag, this.info, isFromSplit, firstCard);
  }

  getHistory() {
    return this.history;
  }

  getBot(type) {
    const botMap = {
      'HOME_MADE': new HomeMadeBot(),
      'BASIC_STRATEGY': new BasicStrategyBot(),
      'NEVER_BUST': new NeverBustBot(),
    };
    return botMap[type];
  }

  bust() {
    this.methodsBag.payBet(this.bet * (-1));
    this.history = this.history + ' BUST';
    this.view.updateHistory(this.history + (this.bet * (-1)));
    this.hasBeenPaid = true;
    // this.view.removeCards();
    shoe.discard(this.cards);
    this.cards = [];
    this.methodsBag.syncPuppetBankrolls();
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

  getSoftValue() {
    let value = 0;
    this.cards.forEach(card => value += card.cardValue);
    return value;
  }
  
  isBust() {
    return this.getValue() > 21;
  }
  
  isBlackJack() {
    return this.cards.length === 2 && this.is21() && !this.isFromSplit;
  }

  isDoubleAbleSoft11() {
    //What about when it is from split aces
    return this.cards.length === 2 && this.isFromSplit && !this.isFromSplitAces && this.getValue() === 21;
  }
  
  is21() {
    return this.getValue() === 21;
  }
  
  hasAce() {
    return this.cards.filter(card => card.cardValue === 1).length > 0;
  }
  
  isHittable() {
    if(this.isFromSplitAces && !this.isBust()) {
      return conditions.canHitSpiltAces;
    }
    return this.getValue() < 21 || this.isDoubleAbleSoft11();
  }
  
  isSurrenderable() {
    if(this.isFromSplitAces && this.cards[1].cardValue === 'A') {
      return conditions.canSurrenderAfterSplit && conditions.canHitSpiltAces;
    }
    if(this.isFromSplit && !conditions.canSurrenderAfterSplit) {
      return false
    }
    return conditions.canSurrender && this.cards.length === 2 && !this.is21();
  }
  
  isDoubleable() {
    const { bet, cards, methodsBag, isFromSplit, isFromSplitAces } = this;
    const { canDoubleForLess, canDoubleAfterSplit, canOnlyDoubleOn, canDoubleAnyTwo, canDoubleSplitAces } = conditions;
    const totalHandBets = methodsBag.getTotalHandBets();
    if(isFromSplitAces && cards.length === 2) {
      return canDoubleSplitAces;
    }
    if(cards.length > 2
      || this.is21()
      || (!canDoubleForLess && (methodsBag.getBankroll() - totalHandBets) < bet)
      || (!canDoubleAfterSplit && isFromSplit)
      || (!canDoubleSplitAces && isFromSplitAces)) {
      return false;
    }
    return canDoubleAnyTwo || canOnlyDoubleOn.includes(this.getValue());
  }
  
  isSplittable() {
    const { methodsBag, bet, isFromSplitAces, cards } = this;
    const totalHandBets = methodsBag.getTotalHandBets();
  
    if((!conditions.canSplitForLess && methodsBag.getBankroll() - totalHandBets <= bet)
      || (!conditions.canResplitAces && isFromSplitAces)
      || (methodsBag.getHandsCount() === 4)
      || (methodsBag.getBankroll() - totalHandBets <= 0)) {
      return false;
    }
    return cards.length === 2 && cards[0].cardValue === cards[1].cardValue
  }

  setOptions() {
    this.options = [];
    if((!this.is21() && !this.isBust()) || this.isDoubleAbleSoft11()) {
      this.options.push('STAY');
    }
    if(this.isHittable()) {
      this.options.push('HIT');
    }
    if(this.isSurrenderable()) {
      this.options.push('SURRENDER');
    }
    if(this.isDoubleable() || this.isDoubleAbleSoft11()) {
      this.options.push('DOUBLE');
    }
    if(this.isSplittable()) {
      this.options.push('SPLIT');
    }
    if(this.isFromSplitAces && this.options.length === 0 && !this.canHitSpiltAces) {
      this.stay();
    }
    if(this.options.length === 1) {
      this.stay();
    } else {
      this.view.displayOptions(this.options);
    }
    if(this.botBrain && this.options.length > 1) {
      const optionSelector = { 
        'STAY': () => this.stay(),
        'HIT': () => this.hit(), 
        'DOUBLE': () => this.doubleDown(),
        'SURRENDER': () => this.surrender(),
        'SPLIT': () => this.split(), 
      };
      optionSelector[this.botBrain.chooseOption(this.methodsBag.getDealersUpCard(), this)]();
    }
  }
  dealCard(card) {
    this.view.addCard(card);
    this.cards.push(card);
  }

  stay() {
    // console.log('STAY');
    this.view.updateOptionsDisplay(this.options);
    this.isPlayed = true;
    this.methodsBag.playHandByHandId(this.id + 1);
    this.options = [];
  }

  surrender() {
    this.history = this.history + ' SURRENDER';
    this.view.updateHistory(this.history + (this.bet/2) * (-1));
    // this.view.removeCards();
    this.methodsBag.payBet((this.bet/2) * (-1));
    this.hasBeenPaid = true;
    this.surrendered = true;
    shoe.discard(this.cards);
    this.cards = [];
    this.methodsBag.syncPuppetBankrolls();
    this.stay();
  }

  hit() {
    this.history = this.history + ' HIT';
    this.view.updateHistory(this.history);
    const card = shoe.deal();
    this.cards.push(card);
    this.view.addCard(card);
    if(this.isBust()) {
      this.hasBeenPaid = true;
    }
    if(this.isBust() || this.is21()) {
      this.stay();
    } else {
      this.setOptions();
    }
    if(this.isBust()) {
      this.bust();
    }
  }

  doubleDown() {
    this.history = this.history + ' DOUBLE';
    this.view.updateHistory(this.history);
    const { methodsBag, bet } = this;
    const amount = (methodsBag.getBankroll() - methodsBag.getTotalHandBets()) < bet
      ? methodsBag.getBankroll() - methodsBag.getTotalHandBets()
      : bet;
    this.setBet(bet + amount);
    this.methodsBag.updateBetAmount(this.bet);
    const card = shoe.deal();
    this.view.addCard(card);
    this.cards.push(card);
    this.stay();
    if(this.isBust()) {
      this.bust();
    }
  }

  split() {
    this.history = this.history + ' SPLIT';
    this.view.updateHistory(this.history);
    this.isFromSplit = true;
    this.isFromSplitAces = this.cards[0].cardValue === 1;
    const newHandKit = {
      spotId: this.spotId,
      handId: this.methodsBag.getHandsCount(),
      bet: this.methodsBag.getBankroll() - this.methodsBag.getTotalHandBets() < this.bet
        ? this.methodsBag.getBankroll() - this.methodsBag.getTotalHandBets()
        : this.bet,
      isFromSplit: true,
      firstCard: this.cards.pop(),
      isFromSplitAces: this.isFromSplitAces
    }
    this.methodsBag.addHandToPlayer(newHandKit);
    const card = shoe.deal();
    this.cards.push(card);
    this.view.removeSplitCard();
    this.view.addCard(card);
    this.setOptions();
    if(this.options.length === 1) {
      this.stay();
    }
  }
}

