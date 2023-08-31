class Player {
    constructor(handle, isAwake, methodBag) {
      this.methodBag = {
        ...methodBag,
        getTotalHandBets: () => this.getTotalHandBets(),
        getBankroll: () => this.getBankroll(),
        getHandsCount: () => this.getHandsCount(),
        playNextPlayer: () => this.setHasPlayedAndActivePlayer(),
        payBet: (x) => this.payBet(x),
        addHandToPlayer: (x) => this.addHandToPlayer(x),
        playerHasPlayed: () => this.setHasPlayedFalse(),
        getHand: (x) => this.getHand(x),
      };
      this.handle = handle;
      this.betSize = conditions.minimumBet;
      this.hands = [new Hand(0, this.betSize, this.methodBag)];
      this.bankroll = conditions.startingBankroll;
      this.hasInsurance = false;
      this.insuranceBetSize = 0;
      this.hasPlayed = false;
      this.isActivePlayer = false;
      this.isAwake = isAwake;
    }
  
    getHand(id) {
      return this.hands.find(hand => hand.id === id);
    }
  
    wakeUp() {
      this.isAwake = true;
    }
  
    getHandle() {
      return this.handle;
    }
  
    getHandsCount() {
      return this.hands.length;
    }
  
    getTotalHandBets() {
      let total = 0;
      this.hands.forEach(hand => total += hand.bet);
      return total;
    }
  
    getBankroll() {
      return this.bankroll;
    }
  
    setHasPlayedAndActivePlayer() {
      this.hasPlayed = true;
      this.isActivePlayer = false;
      this.methodBag.activePlayerPlays();
    }
  
    resetPlayer() {
      if(this.getBankroll() > 0) {
        const betSize = Math.min(this.bankroll, this.betSize);
        this.hands = [new Hand('0', betSize, this.methodBag)];
        this.hasInsurance = false;
        this.insuranceBetSize = 0;
        this.hasPlayed = false;
        this.isActivePlayer = false;
        this.isAwake = true;
      } else {
        this.methodBag.leaveSeat();
      }
    }
  
    setHasPlayedAndActivePlayer() {
      this.hasPlayed = true;
      this.isActivePlayer = false;
      this.methodBag.activePlayerPlays();
    }
  
    makeActivePlayer() {
      this.isActivePlayer = true;
      // console.log('this.isActivePlayer', this.isActivePlayer);
    }
  
    makeInsuranceBet() {
      //NO NEED TO CHANGE THE BANKROLL HERE - THAT HAPPENS DURING INSURANCE PAYOUT
      if(!this.hasInsurance) {
        let bet = 0;
        if(this.methodBag.getCurrentStep() === "INSURANCE" && conditions.canInsureForLess && !this.hasInsurance) {
          bet = Math.min(this.betSize/2, this.bankroll - this.betSize);
        } else if(this.methodBag.getCurrentStep() === "INSURANCE" && !this.hasInsurance) {
          bet = (this.betSize/2) < this.bankroll - this.betSize ? (this.betSize/2) : 0;
        }
        this.hasInsurance = bet > 0;
        this.insuranceBetSize = bet;
      } else {
        this.hasInsurance = false;
        this.insuranceBetSize = 0;
      }
    }

  payInsuranceBet(hasBlackJack) {
    // The bankroll was deducted when the bet was placed
    // This ONLY involves paying the insurance bet, NOT the hand bet
      if(this.methodBag.getCurrentStep() === "INSURANCE_PAYOUT" && hasBlackJack && this.hasInsurance) {
        this.bankroll =  this.bankroll + ( 2 * this.insuranceBetSize );
      } else if(this.methodBag.getCurrentStep() === "INSURANCE_PAYOUT" && this.hasInsurance) {
        this.bankroll =  this.bankroll - this.insuranceBetSize;
      }
      this.hasInsurance = false;
      this.insuranceBetSize = 0;
    }
    
    payBet( amount ) {
      this.bankroll = this.bankroll + amount;
    }
    
    setBetSize(betSize) {
      if(this.methodBag.getCurrentStep() === 'PLACE_BETS'
        && betSize >= conditions.minimumBet ) {
          if(betSize >= this.bankroll) {
            this.betSize = this.bankroll;
            this.hands[0].bet = this.betSize;
          } else {
            this.betSize = parseInt(betSize);
            this.hands[0].bet = betSize;
          }
      }
    }
    
    getTotalHandBets() {
      let total = 0;
      this.hands.forEach(hand => total += hand.bet);
      return total;
    }
    
    getHandsCount() {
      return this.hands.length;
    }
    
    addHandToPlayer({ id, bet, isFromSplit, firstCard, isFromSplitAces}) {
      const hand = new Hand(id, bet, this.methodBag, isFromSplit);
      hand.cards.push({...firstCard}),
      hand.isFromSplitAces = isFromSplitAces;
      this.hands.push(hand);
    }
}