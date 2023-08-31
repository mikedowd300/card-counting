class TableComponent {
  constructor(parentElem) {
    this.methodsBag = {
      addPlayerToSpot: (x, y, z) => this.addPlayerToSpot(x, y, z),
      getAvailableSpotForPlayer: (x) => this.getAvailableSpotForPlayer(x),
      takeExtraSpotClick: (x, y) => this.takeExtraSpotClick(x, y),
      getLatestPuppeteer: () => this.getLatestPuppeteer(),
      addPuppetToSpot: (w, x, y, z) => this.addPuppetToSpot(w, x, y, z),
      removePuppetPlayer: (x, y, z) => this.removePuppetPlayer(x, y, z),
      playStep: () => this.playStep(),
      closeInsurance: () => this.closeInsurance(),
      playNextHand: () => this.playNextHand(),
      syncPuppetBankrolls: () => this.syncPuppetBankrolls(),
      leaveSpot: (x) => this.leaveSpot(x),
      updateInsuranceResponses: () => this.updateInsuranceResponses(),
      dealLoop: () => this.dealLoop(),
      getPlayers: () => this.players,
      getDealersUpCard: () => this.getDealersUpCard(),
    };
    this.spots = this.createSpots();
    this.idNames = ['Abe', 'Barb', 'Chris', 'Dan', 'Ed', 'Fred', 'Gina', 'Hank', 'Iris', 'Jim'];
    this.takenSpots = [];
    this.dealtInPlayers = [];
    this.message = '';
    const info = { spots: this.spots.length, methodsBag: this.methodsBag };
    this.view = new TableUI(parentElem, info);
    this.dealer = new DealerComponent(this.view.dealerContainer, this.methodsBag);
    this.players = [];
    this.latestPuppeteer = null;
    this.handsCount = 0;
    this.responsesToInsurance = 0;
    this.trueCountHistory = [];
    this.runningCountHistory = [];
  }

  leaveSpot(spotId) {
    this.spots[spotId] = { isTaken: false, takenBy: null, id: spotId, dealtIn: false };
    // UPDATE THE UI TO SHOW AN OPEN SEAT - WIP
  }
    
  clearCards() {
    this.dealtInPlayers.forEach(player => player.hands.forEach(hand => {
      shoe.discard(hand.cards);
      hand.view.removeCards();
    }));
  }

  takeExtraSpotClick = (spotId, playerName) => {
    this.latestPuppeteer = playerName;
    jq.getElById(this.view.getHumanSpotButtonSelector(spotId, true)).click();
  }

  getLatestPuppeteer() {
    const tempPuppeteer = this.latestPuppeteer;
    this.latestPuppeteer = null;
    return tempPuppeteer;
  }

  addPlayerToSpot(spotId, parentElem, brainType) {
    if(flow.getCurrentStep() !== 'PLACE_BETS') {
      flow.setStep('PLACE_BETS'),
      this.playStep();
    }
    this.players.push(new PlayerComponent(spotId, parentElem, this.methodsBag, this.idNames[spotId], brainType));
    this.takeSpot(spotId, this.idNames[spotId]);
  }

  addPuppetToSpot(spotId, parentElem, playerName) {
    const player = this.getPlayerByName(playerName);
    this.players.push(new PuppetPlayerComponent(spotId, parentElem, this.methodsBag, player));
    this.takeSpot(spotId, playerName);
  }
  
  getMax = ids => {
    if(ids.length > 0) {
      let max = ids[0];
      ids.forEach(id => max = id > max ? id : max);
      return max
    }
    return null;
  }

  getMin = ids => {
    if(ids.length > 0) {
      let min = ids[0];
      ids.forEach(id => min = id < min ? id : min);
      return min
    }
    return null;
  }

  getAvailableSpotForPlayer(ids) {
    const leftSpot = this.spots[this.getMin(ids) - 1] || { isTaken: true };
    const rightSpot = this.spots[this.getMax(ids) + 1] || { isTaken: true };

    if(!leftSpot.isTaken) {
      this.takeSpot(leftSpot.id, this.idNames[leftSpot.id]);
      return leftSpot;
    } 
    if(!rightSpot.isTaken) {
      this.takeSpot(rightSpot.id, this.idNames[rightSpot.id]);
      return rightSpot;
    }
    return null;
  }

  createSpots(seatsPerTable = conditions.seatsPerTable) {
    const spots = [];
    for(let id = 0; id < seatsPerTable; id++){
      spots.push({ isTaken: false, takenBy: null, id, dealtIn: false });
    }
    return spots;
  }

  getPlayerByIdFromSpots = id => this.players.find(player => player.spots?.includes(id));

  removePuppetPlayer = (parentId, childId, id) => {
    this.view.removePuppetPlayer(parentId, childId, id);
    this.getPlayerByIdFromSpots(id).removeIdFromSpots(id);
    this.players = this.players.filter(player => player.id !== id);
    this.spots[id] = { isTaken: false, takenBy: null, id, dealtIn: false };
  }; 

  getPlayerFromSpot(spotId) {
    const playerName = this.spots[spotId].takenBy;
    return this.players.find(player => player.name === playerName);
  }

  setTakenSpots() {
    this.takenSpots = this.spots.filter(spot => {
      const player = this.getPlayerFromSpot(spot.id)
      return spot.isTaken && player.bankroll && player.bankroll > 0;// && player(spot.id).isAwake
    });
  }

  takeSpot = (id, name) => {
    const spot = this.spots.find(spot => spot.id === id)
    spot.isTaken = true;
    spot.takenBy = name;
  }

  getTakenSpots = () => this.spots.filter(({isTaken}) => isTaken);

  getDealtInPlayers = () => this.players.filter(player => !player.hasPlayed);

  setMessage = message => this.message = message;

  getPlayerByName = name => this.players.find(player => player.name === name && !!player.spots);

  getHasPlayers = () => this.spots.filter(spot => spot.isTaken).length > 0;

  placeBets() {
    // console.log('PLACE_BETS', this.handsCount);
    this.dealer.view.showDealButton();
    this.dealer.view.dealButton.classList.remove('hide');
    this.players.filter(player => player.brainType !== 'HUMAN').forEach(player => {
      player.betSize = player.hands[0].botBrain.resizeBet();
      player.view.betSize.innerHTML = player.getBetSize();
    });
  };

  getNewBet(player) {
    return Math.min(player.betSize, player.bankroll);
  }

  setDealtInPlayers() {
    this.dealtInPlayers = this.players.filter(player => !player.hasPlayed); 
  }

  updateInsuranceResponses() {
    this.responsesToInsurance++;
    if(this.responsesToInsurance === this.players.length) {
      this.closeInsurance();
    }
  }

  closeInsurance() {
    if(flow.getCurrentStep() === 'INSURANCE') {
      this.dealer.view.hideInsuranceButton();
      // console.log('Insurance Closed!!');
      flow.setStep('INSURANCE_PAYOUT');
      this.dealtInPlayers.forEach(player => player.view.hideInsuranceModal());
      this.playStep();
    }
  }

  dealLoop() {
    for(let i = 0; i < conditions.dealLoopIterations; i++) {
      flow.setStep('DEAL');
      this.playStep();
      if(i % 100 === 0) {
        console.log(i);
      }
    }
  }

  deal() {
    this.resetTable();
    this.players
      .filter(player => !player.puppetMaster && player.brainType !== 'HUMAN')
      .forEach(player => {
        player.bankrollHistory.push(player.bankroll);
        player.multiplierHistory.push(player.hands[0].botBrain.multiplier)
      });
    this.trueCountHistory.push(shoe.getHiLoTrueCount());
    this.runningCountHistory.push(shoe.hiLoRunningCount);
    // const decksRemaining = (Math.round((shoe.cards.length * 100)/(shoe.cards.length + shoe.discardTray.length)))/100
    // console.log(shoe.getHiLoRunningCount(), shoe.getHiLoTrueCount(), shoe.cards.length, shoe.discardTray.length, decksRemaining * conditions.decksPerShoe);
    // console.log('DEAL');
    this.handsCount++;
    this.dealer.view.hideDealButton();
    if(flow.getCurrentStep() === 'DEAL' && this.getHasPlayers()) {
      this.handsCount++;
      this.setTakenSpots();
      this.setDealtInPlayers();
      let { dealtInPlayers, dealer } = this;
      dealtInPlayers.forEach(player => player.hands[0].setBet(this.getNewBet(player)));
      // UPDATE THE UI WUTH THE PLAYERS NEW BETS - WIP
      dealtInPlayers.forEach(player => player.hands[0].dealCard(shoe.deal()));
      // shoe.cards.push(new Card('H', 0));
      dealer.dealSelfCard();
      // shoe.cards.push(new Card('H', 0));
      dealtInPlayers.forEach(player => player.hands[0].dealCard(shoe.deal()));
      // shoe.cards.push(new Card('H', 0));
      dealer.dealHoleCard();
      flow.setStep(dealer.showsAce() ? 'INSURANCE' : 'DEALER_BLACKJACK_PAYOUT');
      this.playStep();
    }
  };

  insurance() {
    // console.log('INSURANCE');
    this.dealer.view.showInsuranceButton();
    this.dealtInPlayers.forEach(player => player.view.showInsuranceModal());
    this.players
      .filter(player => player.brainType !== 'HUMAN')
      .forEach(player => {
        const selectInsurance = {
          'DECLINE': () => {
            player.view.declineInsurance();
            player.hands[0].history = 'DECLINE @ ' + shoe.getHiLoTrueCount();
            player.hands[0].view.updateHistory(player.hands[0].getHistory());
          },
          'ACCEPT': () => {
            player.view.acceptInsurance();
            player.hands[0].history = 'ACCEPT @ ' + shoe.getHiLoTrueCount();
            player.hands[0].view.updateHistory(player.hands[0].getHistory());
          }, 
        }
        selectInsurance[player.hands[0].botBrain.chooseInsuranceOption()]();
      });
  }

  getDealersUpCard() {
    if(this.dealer.cards[0]) {
      return this.dealer.cards[0];
    }
    return null;
  }
    
  insurancePayout() {
    // console.log('INSURANCE_PAYOUT');
    this.dealtInPlayers.forEach(player => player.payInsuranceBet(this.dealer.hasBlackJack()));
    this.syncPuppetBankrolls();
    flow.setStep('DEALER_BLACKJACK_PAYOUT');
    this.playStep();
  } 

  dealerBlackJackPayout() {
    // console.log('DEALER_BLACKJACK_PAYOUT');
    if(this.dealer.hasBlackJack()) {
      this.dealer.flipHoleCard();
      this.dealtInPlayers
        .forEach(player => { 
          player.payBet(!player.hands[0].isBlackJack() ? (-(player.hands[0].bet)) : 0);
          if(!player.hands[0].isBlackJack()) {
            player.hands[0].view.updateHistory(player.hands[0].getHistory() + 'DEALER BLACKJACK ' + (player.hands[0].bet * (-1)));
          } else {
            player.hands[0].view.updateHistory(player.hands[0].getHistory() + 'PUSH');
          }
          player.hasPlayed = true;
          player.hands[0].hasBeenPaid = true;
        });
        this.syncPuppetBankrolls();
      flow.setStep('PLAY_DEALERS_HAND');
      this.playStep();
    } else {
      flow.setStep('PLAYER_BLACKJACK_PAYOUTS');
      this.playStep();
    }
  }

  playerBlackJackpayouts() {
    // console.log('PLAYER_BLACKJACK_PAYOUTS');
    this.dealtInPlayers
      .filter(player => !player.hasPlayed && player.hasBlackJack())
      .forEach(player => {
        player.payForBlackjack();
        player.hands[0].isPlayed = true;
        player.hands[0].hasBeenPaid = true;
        player.hands[0].view.updateHistory(player.hands[0].getHistory() + 'BLACKJACK ' + (player.hands[0].bet * 1.5));
        player.hasPlayed = true;
        shoe.discard(player.hands[0].cards);
        player.hands[0].cards = [];
        // player.hands[0].view.removeCards();
      });
    this.syncPuppetBankrolls();
    const arePlayersRemaining = this.players.filter(player => !player.hasPlayed).length > 0;
    if(arePlayersRemaining) {
      flow.setStep('PLAY_HANDS');
    } else {
      flow.setStep('PLAY_DEALERS_HAND');
    }
    this.playStep();
  }

  playNextHand() {
    // console.log('PLAY_HANDS');
    const player = this.dealtInPlayers.filter(player => !player.hasPlayed)[0];
    if(player) {
      player.playHandByHandId(0);
    } else {
      flow.setStep('PLAY_DEALERS_HAND');
      this.playStep();
    }
  }

  playDealersHand() {
    // console.log('PLAY_DEALERS_HAND');
    this.dealer.flipHoleCard();
    this.dealer.playHand();
    flow.setStep('PAYOUT');
    this.playStep();
  };

  payout() {
    // console.log('PAYOUT');
    this.players.forEach(player => player.hands.filter(hand => !hand.hasBeenPaid).forEach(hand => {
      if(hand.isBust()) {
        player.payBet(hand.bet * (-1));
        hand.view.updateHistory(hand.getHistory() + ' BUST ' + (hand.bet * (-1)));
      } else if(this.dealer.isBust()) {
        player.payBet(hand.bet);
        hand.view.updateHistory(hand.getHistory() + ' WON ' + (hand.bet));
      } else if(this.dealer.getValue() > hand.getValue()) {
        hand.view.updateHistory(hand.getHistory() + ' LOST ' + (hand.bet * (-1)));
        player.payBet(hand.bet * (-1));
      } else if(this.dealer.getValue() < hand.getValue()) {
        hand.view.updateHistory(hand.getHistory() + ' WON ' + (hand.bet));
        player.payBet(hand.bet);
      } else if(this.dealer.getValue() === hand.getValue()) {
        hand.view.updateHistory(hand.getHistory() + ' PUSH ');
        player.incHandsPlayedCount();
      }
      hand.hasBeenPaid = true; 
    }))
    flow.setStep('HAND_OVER');
    this.playStep();
  }

  handOver() {
    // console.log('HAND_OVER');
    flow.setStep('PLACE_BETS');
    this.playStep();
  }

  resetTable() {
    this.responsesToInsurance = 0;
    this.clearCards();
    this.dealer.reset();
    shoe.shuffleCheck();
    this.players.forEach(player => player.reset());
  }

  playStep() {
    switch(flow.getCurrentStep()) {
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
      case 'DEALER_BLACKJACK_PAYOUT':
        this.dealerBlackJackPayout();
        break
      case 'HAND_OVER':
        this.handOver();
        break;
      case 'PLAYER_BLACKJACK_PAYOUTS':
        this.playerBlackJackpayouts();
        break
      case 'PAYOUT': 
        this.payout();
        break;
      case 'PLAY_HANDS':
        this.playNextHand();
        break;
      case 'PLAY_DEALERS_HAND':
        this.playDealersHand();
        break;
      default: () => {}
    }
  }

  syncPuppetBankrolls() {
    this.dealtInPlayers
      .filter(player => !player.spots)
      .forEach(player => {
        player.bankroll = player.puppetMaster.bankroll;
        player.view.updateUIBankroll(player.puppetMaster.bankroll)
      });
    this.dealtInPlayers
      .filter(player => player.spots)
      .forEach(player => player.view.updateUIBankroll(player.bankroll));
  }
}
  
//     setMessage(message) {
//       this.message = message;
//     }
  
//     getMessage() {
//       return this.message;
//     }
  
//     clearMessage() {
//       this.setMessage('');
//     }