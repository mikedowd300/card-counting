class PuppetPlayerComponent {
  constructor(spotId, parentElem, methodsBag, player) { 
    this.spots = null;
    this.id = spotId;
    this.name = player.name;
    this.betSize = player.betSize;
    this.bankroll = player.bankroll;
    this.hasInsurance = false;
    this.insuranceBetSize = 0;
    this.hasPlayed = false;
    this.hands = [];
    this.puppetMaster = player;
    this.brainType = player.brainType;
    this.methodsBag = {
      ...methodsBag,
      getBetSize: () => this.getBetSize(),
      incBetSize: () => this.incBetSize(),
      decBetSize: () => this.decBetSize(),
      addSpot: (x) => this.addSpot(x),
      leaveSpot: (x, y, z) => this.leaveSpot(x, y, z),
      makeInsuranceBet: () => this.makeInsuranceBet(),
      getTotalHandBets: () => this.getTotalHandBets(),
      getBankroll: () => this.getBankroll(),
      getHandsCount: () => this.getHandsCount(),
      playHandByHandId: (x) => this.playHandByHandId(x),
      payBet: (x) => this.payBet(x),
      updateBetAmount: (x) => this.updateBetAmount(x),
      addHandToPlayer: (x) => this.addHandToPlayer(x),
    };
    const info = { name: player.name, bankroll: this.puppetMaster.bankroll, bet: player.betSize, id: spotId };
    this.view = new PuppetPlayerUI(parentElem, spotId, this.methodsBag, info);
    this.hands = [new HandComponent(this.brainType, this.view.handsElem, this.methodsBag, this.betSize, spotId, 0)];
  }

  getHandsPlayedCount() {
    return this.puppetMaster.handsPlayedCount;
  }

  incHandsPlayedCount = () => this.puppetMaster.handsPlayedCount += 1;
  
  hasBlackJack() {
    return this.hands[0].isBlackJack();
  }

  leaveSpot(parentId, childId, id) {
    // There should eventually be a check that the seat left is at the end of the players spots array
    this.methodsBag.removePuppetPlayer(parentId, childId, id);
  }

  getBetSize() {
    return this.betSize;
  }

  setBetSize(betSize) {
    if((flow.getCurrentStep() === 'PLACE_BETS' || flow.getCurrentStep() === 'TAKE_SEAT') && betSize >= conditions.minimumBet && betSize <= conditions.maximumBet) {
      this.betSize = betSize >= this.puppetMaster.bankroll ? this.puppetMaster.bankroll : parseInt(betSize);
      this.hands[0].setBet(this.betSize);
    }
  }

  incBetSize() {
    if(this.betSize >= 100 && this.puppetMaster.bankroll >= (this.betSize + 25)) {
      this.setBetSize(this.betSize + 25);
    } else if(this.betSize >= 25 && this.puppetMaster.bankroll >= (this.betSize + 5)) {
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
    //NO NEED TO CHANGE THE BANKROLL HERE - THAT HAPPENS DURING INSURANCE PAYOUT
    if(!this.hasInsurance) {
      let bet = 0;
      if(flow.getCurrentStep() === "INSURANCE" && conditions.canInsureForLess && !this.hasInsurance) {
        bet = Math.min(this.betSize/2, this.puppetMaster.bankroll - this.betSize);
      } else if(flow.getCurrentStep() === "INSURANCE" && !this.hasInsurance) {
        bet = (this.betSize/2) < this.puppetMaster.bankroll - this.betSize ? (this.betSize/2) : 0;
      }
      this.hasInsurance = bet > 0;
      this.insuranceBetSize = bet;
    } else {
      // This implies that the player can change his mind, but the UI does not allow this
      this.hasInsurance = false;
      this.insuranceBetSize = 0;
    }
  }

  updateBetAmount(bet) {
    this.view.updateBetAmount(bet)
  }

  payInsuranceBet(hasBlackJack) {
    // THE UI FOR PUPPETS IS UPDATED IN table.insurancePayout
    this.puppetMaster.payInsuranceBet(hasBlackJack)
    if(flow.getCurrentStep() === "INSURANCE_PAYOUT" && hasBlackJack && this.hasInsurance) {
      this.puppetMaster.bankroll = this.puppetMaster.bankroll + ( 2 * this.insuranceBetSize );
    } else if(flow.getCurrentStep() === "INSURANCE_PAYOUT" && this.hasInsurance) {
      this.puppetMaster.bankroll = this.puppetMaster.bankroll - this.insuranceBetSize;
    }
    this.puppetMaster.view.updateUIBankroll(this.puppetMaster.bankroll);
    this.hasInsurance = false;
    this.insuranceBetSize = 0;
  }

//   reset() {
//     this.view.removeHands();
//     if(this.getBankroll() > 0) {
//       const betSize = Math.min(this.getBankroll(), this.betSize);
//       this.hands = [new HandComponent(this.brainType, this.view.handsElem, this.methodsBag, this.betSize, this.id, 0)];
//       this.hasInsurance = false;
//       this.insuranceBetSize = 0;
//       this.hasPlayed = false;
//     } else {
//       this.methodsBag.leaveSpot(this.id);
//     }
//   }

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
    this.puppetMaster.bankroll += this.hands[0].bet * conditions.blackJackPaysRatio;
    this.hasPlayed = true;
    this.methodsBag.syncPuppetBankrolls();
  }

  payBet( amount ) {
    this.incHandsPlayedCount();
    this.puppetMaster.bankroll = this.puppetMaster.bankroll + amount;
    this.methodsBag.syncPuppetBankrolls();
  }
    
  getTotalHandBets() {
    let total = 0;
    this.hands.forEach(hand => total += hand.bet);
    return total;
  }
  
  getBankroll() {
    return this.puppetMaster.bankroll;
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
    hand.cards.push({...firstCard}),
    hand.isFromSplitAces = isFromSplitAces;
    this.hands.push(hand);
  }
}