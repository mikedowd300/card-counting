class PlayerComponent {
  constructor(spotId, parentElem, methodsBag, name, brainType) {
    this.spots = [spotId];
    this.id = spotId;
    this.name = name
    this.betSize = conditions.minimumBet;
    this.bankroll = conditions.startingBankroll;
    this.hasInsurance = false;
    this.insuranceBetSize = 0;
    this.hasPlayed = false;
    this.handsPlayedCount = 0;
    this.moneyInPlay = 0; // Implement this to prevent the player or its puppets from betting, doubling, splitting beyond the bankroll. - WIP
    this.brainType = brainType;
    this.methodsBag = {
      ...methodsBag,
      getBetSize: () => this.getBetSize(),
      incBetSize: () => this.incBetSize(),
      decBetSize: () => this.decBetSize(),
      addSpot: (x) => this.addSpot(x),
      makeInsuranceBet: () => this.makeInsuranceBet(),
      getTotalHandBets: () => this.getTotalHandBets(),
      getBankroll: () => this.getBankroll(),
      getHandsCount: () => this.getHandsCount(),
      playHandByHandId: (x) => this.playHandByHandId(x),
      payBet: (x) => this.payBet(x),
      updateBetAmount: (x) => this.updateBetAmount(x),
      addHandToPlayer: (x) => this.addHandToPlayer(x),
    };
    const info = { name, bankroll: this.bankroll, bet: this.betSize, id: this.id, name: this.name };
    this.view = new PlayerUI(parentElem, this.id, this.methodsBag, info);
    this.hands = [new HandComponent(this.brainType, this.view.handsElem, this.methodsBag, this.betSize, spotId, 0)];
    this.bankrollHistory = [];
    this.multiplierHistory = [];
  }

  getHandsPlayedCount() {
    return this.handsPlayedCount;
  }

  incHandsPlayedCount = () => this.handsPlayedCount += 1;

  hasBlackJack() {
    return this.hands[0].isBlackJack();
  }

  removeIdFromSpots(id) {
    this.spots = this.spots.filter(spotId => spotId !== id);
  }

  addSpot() {
    // Check that the players bankroll can handle another spot - WIP 
    // some casinos make a condition that the min bet is tableMin times the number of hands played or tableMax - a condition should be added - WIP
    const newSpot = this.methodsBag.getAvailableSpotForPlayer(this.spots);
    if(newSpot) {
      this.spots.push(newSpot.id);
      this.methodsBag.takeExtraSpotClick(newSpot.id, this.name);
    }
  }

  getBetSize() {
    return this.betSize;
  }

  setBetSize(betSize) {
    if((flow.getCurrentStep() === 'PLACE_BETS' || flow.getCurrentStep() === 'TAKE_SEAT') && betSize >= conditions.minimumBet && betSize <= conditions.maximumBet) {
      this.betSize = betSize >= this.bankroll ? this.bankroll : parseInt(betSize);
      this.hands[0].setBet(this.betSize);
    }
  }

  incBetSize() {
    if(this.betSize >= 100 && this.bankroll >= (this.betSize + 25)) {
      this.setBetSize(this.betSize + 25);
    } else if(this.betSize >= 25 && this.bankroll >= (this.betSize + 5)) {
      this.setBetSize(this.betSize + 5);
    } else {
      this.setBetSize(this.betSize + 1);
    }
  }

  decBetSize() {
    if(this.betSize > 100 ) {
      this.setBetSize(this.betSize - 25);
    } else if(this.betSize > 50) {
      this.setBetSize(this.betSize - 5);
    } else {
      this.setBetSize(this.betSize - 1);
    }
  }

  makeInsuranceBet() {
    if(!this.hasInsurance) {
      let bet = 0;
      if(flow.getCurrentStep() === "INSURANCE" && conditions.canInsureForLess && !this.hasInsurance) {
        bet = Math.min(this.betSize/2, this.bankroll - this.betSize);
      } else if(flow.getCurrentStep() === "INSURANCE" && !this.hasInsurance) {
        bet = (this.betSize/2) < this.bankroll - this.betSize ? (this.betSize/2) : 0;
      }
      this.hasInsurance = bet > 0;
      this.insuranceBetSize = bet;
    } else {
      // This implies that the player can change his mind, but the UI does not allow this yet
      this.hasInsurance = false;
      this.insuranceBetSize = 0;
    }
  }

  updateBetAmount(bet) {
    this.view.updateBetAmount(bet)
  }

  payInsuranceBet(hasBlackJack) {
    if(flow.getCurrentStep() === "INSURANCE_PAYOUT" && hasBlackJack && this.hasInsurance) {
      this.bankroll = this.bankroll + ( 2 * this.insuranceBetSize );
    } else if(flow.getCurrentStep() === "INSURANCE_PAYOUT" && this.hasInsurance) {
      this.bankroll = this.bankroll - this.insuranceBetSize;
    }
    this.view.updateUIBankroll(this.bankroll);
    this.hasInsurance = false;
    this.insuranceBetSize = 0;
  }

  reset() {
    this.view.removeHands();
    if(this.getBankroll() > 0) {
      if(this.brainType !== "HUMAN") {
        this.betSize = this.hands[0].botBrain.resizeBet();
      }
      const betSize = Math.min(this.getBankroll(), this.betSize);
      // UPDATE THE UI TO SHOW THE UPDATED BETSIZE
      this.hands = [new HandComponent(this.brainType, this.view.handsElem, this.methodsBag, this.betSize, this.id, 0)];
      this.hasInsurance = false;
      this.insuranceBetSize = 0;
      this.hasPlayed = false;
    } else {
      this.methodsBag.leaveSpot(this.id);
    }
  }

  payForBlackjack() {
    this.bankroll += this.hands[0].bet * conditions.blackJackPaysRatio;
    this.view.updateUIBankroll(this.bankroll);
    this.hasPlayed = true;
  }

  payBet( amount ) {
    this.incHandsPlayedCount();
    this.bankroll = this.bankroll + amount;
    this.view.updateUIBankroll(this.bankroll);
    this.methodsBag.syncPuppetBankrolls();
  }
    
  getTotalHandBets() {
    let total = 0;
    this.hands.forEach(hand => total += hand.bet);
    return total;
  }
  
  getBankroll() {
    return this.bankroll;
  }
  
  getHandsCount() {
    return this.hands.length;
  }

  playHandByHandId(handId) {
    if(this.hands[handId]) {
      if(this.hands[handId].isFromSplit) {    
        const card = shoe.deal();
        this.hands[handId].cards.push(card);
        this.hands[handId].view.addCard(card);
        if(this.isFromSplitAces && !conditions.canHitSpiltAces && !conditions.canResplitAces) {
          this.hands[handId].stay();
          return;
        }
      }
      this.hasPlayed = true;
      this.hands[handId].setOptions();
    } else {
      this.methodsBag.playNextHand();
    }
  }
  
  addHandToPlayer({ spotId, handId, bet, isFromSplit, firstCard, isFromSplitAces}) {
    const hand = new HandComponent(this.brainType, this.view.handsElem, this.methodsBag, 
    bet, spotId, handId, isFromSplit, firstCard);
    hand.cards.push({ ...firstCard }),
    hand.isFromSplitAces = isFromSplitAces;
    this.hands.push(hand);
  }
}