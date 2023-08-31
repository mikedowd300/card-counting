class Table {
  constructor() {
    this.currentStep = 'PLACE_BETS';
    this.handCount = 0;
    this.methodBag = { 
      getCurrentStep: () => this.getCurrentStep(),
      deal: () => this.shoe.deal(),
      setTakenSeats: () => this.setTakenSeats(),
      getDiscardTray: () => this.getDiscardTray(),
      activePlayerPlays: () => this.activePlayerPlays()
    }
    this.seats = this.createSeats();
    this.shoe = new Shoe(this.methodBag);
    this.dealer = new Dealer(this.methodBag);
    this.takenSeats = [];
    this.message = conditions.welcomeMessage;
    this.discardTray = [];
    this.steps = [
      'PLACE_BETS', 
      'DEAL', 
      'INSURANCE', 
      'DEALER_BLACKJACK_CHECK_AND_PAYOUT', 
      'PAYOUT',  
      'PLAY_HANDS', 
      'PLAY_DEALERS_HAND', 
      'INSURANCE_PAYOUT', 
      'HAND_OVER'
    ];
  }

  getSteps() {
    return this.steps;
  }

  getDiscardTray() {
    return this.discardTray;
  }

  clearTable() {
    let discards = [];
    this.takenSeats.forEach(seat => seat.player.hands.forEach(hand => {
      while (hand.cards.length > 0) {
        discards.push(hand.cards.pop());
      }
    }));
    while (this.dealer.cards.length > 0) {
      discards.push(this.dealer.cards.pop());
    }
    this.discardTray = [... this.discardTray, ...discards];
  }

  setTakenSeats() {
    this.takenSeats = this.seats.filter(seat =>
      seat.isTaken && seat.player.getBankroll() > 0 && seat.player.isAwake)
  }

  createSeats() {
    const seats = [];
    for(let s = 0; s < conditions.seatsPerTable; s++) {
      seats.push(new Seat(s, this.methodBag));
    }
    return seats;
  }

  getCurrentStep() {
    return this.currentStep;
  }

  setStep(step) {
    this.clearMessage();
    if(this.getSteps().includes(step) && this.isValidStep(step)) {
      this.currentStep = step;
      this.playStep()
    } else {
      this.setMessage(`${step} is not a valid step`);
    }
  }

  isValidStep(step) {
    switch(step) {
      case 'DEAL':
        return this.getCurrentStep() === 'PLACE_BETS' || this.getCurrentStep() === 'HAND_OVER';
      case 'INSURANCE_PAYOUT':
        return this.getCurrentStep() === 'INSURANCE';
      case 'PLACE_BETS':
        return this.getCurrentStep() === 'HAND_OVER';
      case 'DEALER_BLACKJACK_CHECK_AND_PAYOUT':
        return this.getCurrentStep() === 'INSURANCE_PAYOUT' || this.getCurrentStep() === 'DEAL';
      case 'PLAY_HANDS':
        return this.getCurrentStep() === 'DEALER_BLACKJACK_CHECK_AND_PAYOUT';
      default:
        return true
    }
  }
  
  incHandCount() {
    this.handCount = this.handCount + 1;
  }
  
  getHandCount() {
    return this.handCount;
  }

  getNewBet(player) {
    return Math.min(player.betSize, player.bankroll);
  }

  closeInsurance() {
    this.setStep('INSURANCE_PAYOUT');
  }

  setMessage(message) {
    this.message = message;
  }

  getMessage() {
    return this.message;
  }

  clearMessage() {
    this.setMessage('');
  }

  insurancePayout() {
    this.takenSeats.forEach(seat => 
      seat.player.payInsuranceBet(this.dealer.hasBlackJack()));
    this.setStep('DEALER_BLACKJACK_CHECK_AND_PAYOUT');
  } 

  dealersBlackJackPayout() {
    if(this.dealer.hasBlackJack()) {
    this.dealer.cards[1].isHoleCard = false;
      this.takenSeats.forEach(seat => {
        if(!seat.player.hands[0].isBlackJack()) {
          seat.player.payBet(-(seat.player.hands[0].bet));
          seat.player.hands[0].setMessage(conditions.handLosesMessage);
        } else {
          seat.player.hands[0].setMessage(conditions.handPushesMessage);
        }
      });
      if(this.timing && !!this.timing.afterPayout) {
        this.timing.afterDealersBlackJackPayout();
      } else {
        this.setStep('HAND_OVER');
      }
    } else {
      this.setPlayersWithBlackJackAsHasPlayed();
      this.setStep('PLAY_HANDS');
    }
  }

  initializeHand() {
    console.log('  initializeHand');
    this.clearTable();
    this.shoe.shuffleCheck();
    this.dealer = new Dealer(this.methodBag);
    this.seats.forEach(seat => seat.player.wakeUp && seat.player.wakeUp());
    this.takenSeats.forEach(seat => seat.player.resetPlayer());
  }

  handOver() {
    this.initializeHand();
  }

  setPlayersWithBlackJackAsHasPlayed() {
    this.takenSeats.forEach(seat => {
      if(seat.player.hands[0].isBlackJack()) {
        seat.player.setHasPlayedAndActivePlayer();
      }
    });
  }

  placeBets() {
    this.setMessage(conditions.placeBetsMessage);
  };

  insurance() {
    this.setMessage(conditions.insuranceMessage);
  }

  playStep() {
    switch(this.currentStep) {
      case 'PLACE_BETS':
        this.placeBets();
        break;
      case 'DEAL':
        this.deal();
        break;
      case 'INSURANCE':
        this.insurance();
        break;
      case 'INSURANCE_PAYOUT':
        this.insurancePayout();
        break;
      case 'DEALER_BLACKJACK_CHECK_AND_PAYOUT':
        this.dealersBlackJackPayout();
        break
      case 'HAND_OVER':
        this.handOver();
        break;
      case 'PAYOUT': 
        this.payout();
        break;
      case 'PLAY_HANDS':
        this.playHands();
        break;
      case 'PLAY_DEALERS_HAND':
        this.playDealersHand();
        break;
      default: () => {}
    }
  }

  deal() {
    this.setTakenSeats();
    let { takenSeats, dealer } = this;
    takenSeats.forEach(seat =>seat.player.hands[0].setBet(this.getNewBet(seat.player)));
    takenSeats.forEach(seat => seat.player.hands[0].cards.push(this.shoe.deal()));
    dealer.cards.push(this.shoe.deal());
    // dealer.cards.push({cardName: 'AD', cardValue: 1});
    takenSeats.forEach(seat => seat.player.hands[0].cards.push(this.shoe.deal()));
    dealer.cards.push({...this.shoe.deal(), isHoleCard: true });
    // dealer.cards.push({cardName: 'KD', cardValue: 10, isHoleCard: true});
    this.setStep(dealer.showsAce() ? 'INSURANCE' : 'DEALER_BLACKJACK_CHECK_AND_PAYOUT')
  };

  playHands() {
    this.takenSeats.forEach(seat => {
      seat.player.hands.forEach(hand => {
        if(!hand.isPlayed) {
          hand.setOptions();
        }
      });
    });
    this.activePlayerPlays();
  }

  activePlayerPlays() {
    const activeSeat = this.takenSeats.find(seat => !seat.player.hasPlayed);
    if(activeSeat) {
      activeSeat.player.makeActivePlayer();
    } else {
      this.setStep('PLAY_DEALERS_HAND');
    }
  }

  playDealersHand() {
    this.dealer.cards[1].isHoleCard = false;
    this.dealer.playHand();
    this.setStep('PAYOUT');
  }

  payout() {
    this.takenSeats.forEach(seat => seat.player.hands.forEach(hand => {
      if(hand.isBlackJack()) {
        seat.player.payBet(1.5 * hand.bet);
        hand.setMessage(conditions.handWinsMessage);
      } else if(hand.isBust()) {
        seat.player.payBet(-hand.bet);
        hand.setMessage(conditions.handLosesMessage);
      } else if(hand.surrendered) {
        hand.setMessage(conditions.handSurrendersMessage);
      } else if(this.dealer.isBust()) {
        seat.player.payBet(hand.bet);
        hand.setMessage(conditions.handWinsMessage);
      } else if(this.dealer.getValue() === hand.getValue()) {
        hand.setMessage(conditions.handPushesMessage);
      } else if(this.dealer.getValue() > hand.getValue()) {
        seat.player.payBet(-hand.bet);
        hand.setMessage(conditions.handLosesMessage);
      } else if(this.dealer.getValue() < hand.getValue()) {
        seat.player.payBet(hand.bet);
        hand.setMessage(conditions.handWinsMessage);
      }
    }))
    if(this.timing && !!this.timing.afterPayout) {
      this.timing.afterPayout();
    } else {
      this.setStep('HAND_OVER');
    }
  }
}