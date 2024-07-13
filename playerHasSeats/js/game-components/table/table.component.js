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
    this.tableStats = [];
    this.tableStat = new TableStat();
    this.statsByTrueCount = {};
  }

  getStatsByTrueCount() {
    const minCount = this.tableStats.length < 120000 
      ? Math.min(...this.tableStats.map(({trueCount}) => trueCount)) 
      : -12;
    const maxCount = this.tableStats.length < 120000 
      ? Math.max(...this.tableStats.map(({trueCount}) => trueCount)) 
      : 12;

    const winnings = this.tableStats.map(({ totalWinnings }) => totalWinnings)
      .reduce((partialSum, a) => partialSum + a, 0);

    const allInstances = this.tableStats.length;
    const overAllAverage = allInstances === 0 ? 0 : Math.round((winnings / allInstances) * 100) / 100;

    for(let i = minCount; i <= maxCount; i++) {
      const instances = this.tableStats.filter(({trueCount}) => trueCount === i).length;
      const totalWinnings = this.tableStats.filter(({trueCount}) => trueCount === i)
        .map(({ totalWinnings }) => totalWinnings)
        .reduce((partialSum, a) => partialSum + a, 0);
      const average = instances === 0 ? 0 : Math.round((totalWinnings / instances) * 100) / 100;
      this.statsByTrueCount[i] = { instances, totalWinnings, average }
    }

    return(this.statsByTrueCount);
  }

  getAceCountsForTrueCountAt(count) {
    const aceResultsMap = {
      '8': { key: '8-8', instances: 0, winnings: 0, average: 0},
      '-4': { key: '8-7', instances: 0, winnings: 0, average: 0},
      '-17': { key: '8-6', instances: 0, winnings: 0, average: 0},
      '-29': { key: '8-5', instances: 0, winnings: 0, average: 0},
      '-42': { key: '8-4', instances: 0, winnings: 0, average: 0},
      // '-55': { key: '8-3', instances: 0, winnings: 0, average: 0},
      // '8-67': { key: '8-2', instances: 0, winnings: 0, average: 0},

      '21': { key: '7-8', instances: 0, winnings: 0, average: 0},
      '7': { key: '7-7', instances: 0, winnings: 0, average: 0},
      '-7': { key: '7-6', instances: 0, winnings: 0, average: 0},
      '-22': { key: '7-5', instances: 0, winnings: 0, average: 0},
      '-36': { key: '7-4', instances: 0, winnings: 0, average: 0},
      '-50': { key: '7-3', instances: 0, winnings: 0, average: 0},
      '-64': { key: '7-2', instances: 0, winnings: 0, average: 0},
      '-79': { key: '7-1', instances: 0, winnings: 0, average: 0},
      '-93': { key: '7-0', instances: 0, winnings: 0, average: 0},

      '39': { key: '6-8', instances: 0, winnings: 0, average: 0},
      '23': { key: '6-7', instances: 0, winnings: 0, average: 0},
      '6': { key: '6-6', instances: 0, winnings: 0, average: 0},
      '-11': { key: '6-5', instances: 0, winnings: 0, average: 0},
      '-27': { key: '6-4', instances: 0, winnings: 0, average: 0},
      '-44': { key: '6-3', instances: 0, winnings: 0, average: 0},
      '-61': { key: '6-2', instances: 0, winnings: 0, average: 0},
      '-77': { key: '6-1', instances: 0, winnings: 0, average: 0},
      '-94': { key: '6-0', instances: 0, winnings: 0, average: 0},

      '65': { key: '5-8', instances: 0, winnings: 0, average: 0},
      '45': { key: '5-7', instances: 0, winnings: 0, average: 0},
      '25': { key: '5-6', instances: 0, winnings: 0, average: 0},
      '5': { key: '5-5', instances: 0, winnings: 0, average: 0},
      '-15': { key: '5-4', instances: 0, winnings: 0, average: 0},
      '-35': { key: '5-3', instances: 0, winnings: 0, average: 0},
      '-55': { key: '5-2', instances: 0, winnings: 0, average: 0},
      '-75': { key: '5-1', instances: 0, winnings: 0, average: 0},
      '-95': { key: '5-0', instances: 0, winnings: 0, average: 0},

      '104': { key: '4-8', instances: 0, winnings: 0, average: 0},
      '79': { key: '4-7', instances: 0, winnings: 0, average: 0},
      '54': { key: '4-6', instances: 0, winnings: 0, average: 0},
      '29': { key: '4-5', instances: 0, winnings: 0, average: 0},
      '4': { key: '4-4', instances: 0, winnings: 0, average: 0},
      '-21': { key: '4-3', instances: 0, winnings: 0, average: 0},
      '-46': { key: '4-2', instances: 0, winnings: 0, average: 0},
      '-71': { key: '4-1', instances: 0, winnings: 0, average: 0},
      '-96': { key: '4-0', instances: 0, winnings: 0, average: 0},

      '170': { key: '3-8', instances: 0, winnings: 0, average: 0},
      '136': { key: '3-7', instances: 0, winnings: 0, average: 0},
      '103': { key: '3-6', instances: 0, winnings: 0, average: 0},
      '70': { key: '3-5', instances: 0, winnings: 0, average: 0},
      '36': { key: '3-4', instances: 0, winnings: 0, average: 0},
      '3': { key: '3-3', instances: 0, winnings: 0, average: 0},
      '-30': { key: '3-2', instances: 0, winnings: 0, average: 0},
      '-64': { key: '3-1', instances: 0, winnings: 0, average: 0},
      '-97': { key: '3-0', instances: 0, winnings: 0, average: 0},

      // '302': { key: '2-8', instances: 0, winnings: 0, average: 0},
      // '252': { key: '2-7', instances: 0, winnings: 0, average: 0},
      // '202': { key: '2-6', instances: 0, winnings: 0, average: 0},
      // '152': { key: '2-5', instances: 0, winnings: 0, average: 0},
      // '102': { key: '2-4', instances: 0, winnings: 0, average: 0},
      // '52': { key: '2-3', instances: 0, winnings: 0, average: 0},
      // '2': { key: '2-2', instances: 0, winnings: 0, average: 0},
      // '-48': { key: '2-1', instances: 0, winnings: 0, average: 0},
      // '-98': { key: '2-0', instances: 0, winnings: 0, average: 0},

      // '701': { key: '1-8', instances: 0, winnings: 0, average: 0},
      // '601': { key: '1-7', instances: 0, winnings: 0, average: 0},
      // '501': { key: '1-6', instances: 0, winnings: 0, average: 0},
      // '401': { key: '1-5', instances: 0, winnings: 0, average: 0},
      // '301': { key: '1-4', instances: 0, winnings: 0, average: 0},
      // '201': { key: '1-3', instances: 0, winnings: 0, average: 0},
      // '101': { key: '1-2', instances: 0, winnings: 0, average: 0},
      // '1': { key: '1-1', instances: 0, winnings: 0, average: 0},
      // '0': { key: '1-0', instances: 0, winnings: 0, average: 0},
    }
    console.log(count);
    const instances = this.tableStats.filter(({trueCount}) => trueCount === count);
    console.log(instances.length);
    console.log(instances);
    instances.forEach(({ aceRatio, totalWinnings }) => {
      if(count === -1) {
        console.log(aceRatio, shoe.discardTray.length);
      }
      if(aceResultsMap[aceRatio.toString()]) {
        aceResultsMap[aceRatio.toString()].instances++;
        aceResultsMap[aceRatio.toString()].winnings += totalWinnings;
        aceResultsMap[aceRatio.toString()].average = 
        Math.round((aceResultsMap[aceRatio.toString()].winnings / aceResultsMap[aceRatio.toString()].instances) * 100) / 100; 
      } else {
        console.log(aceRatio.toString());
      }
    });
    console.log(`Instances at true count ${count}:`, instances.length);
    let extendedMap = {};
    for(let oldKey in aceResultsMap) {
      const newKey = aceResultsMap[oldKey].key;
      extendedMap[newKey] = { 
        instances: aceResultsMap[oldKey].instances, 
        winnings: aceResultsMap[oldKey].winnings,  
        average: aceResultsMap[oldKey].average, 
      };
    }

    // for(let key in extendedMap) {
    //   if(extendedMap[key].instances > 0) {
    //     console.log(key, extendedMap[key]);
    //   }
    // }
    return(extendedMap);
  }

  leaveSpot(spotId) {
    this.spots[spotId] = { isTaken: false, takenBy: null, id: spotId, dealtIn: false };
    // UPDATE THE UI TO SHOW AN OPEN SEAT - WIP
  }
    
  clearCards() {
    this.dealtInPlayers.forEach(player => player.setHandOfShoeStat());
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
    const index = parentId; // TO DO - parentId is not an id, its an index, refactor/rename - its the only value needed
    this.view.removePuppetPlayer(parentId, childId, id);
    this.getPlayerByIdFromSpots(index).removeIdFromSpots(index);
    this.players = this.players.filter(player => player.id !== index);
    this.spots[id] = { isTaken: false, takenBy: null, id, dealtIn: false };
  }; 

  getPlayerFromSpot(spotId) {
    const playerName = this.spots[spotId].takenBy;
    return this.players.find(player => player.name === playerName);
  }

  setTakenSpots() {
    this.takenSpots = this.spots.filter(spot => {
      const player = this.getPlayerFromSpot(spot.id);
      return spot.isTaken && player.bankroll && player.bankroll > 0;
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
    this.players.filter(player => !player.puppetMaster)
      .forEach(player => player.bankrollHistory.push(player.bankroll));
    this.dealer.view.showDealButton();
    this.dealer.view.dealButton.classList.remove('hide');
    this.players.filter(player => !player.puppetMaster)
      .forEach(player => player.view.showAddSpotButton());
    this.players.filter(player => player.puppetMaster)
      .forEach(player => player.view.showLeaveSpotButton());
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
      flow.setStep('INSURANCE_PAYOUT');
      this.dealtInPlayers.forEach(player => player.view.hideInsuranceModal());
      this.playStep();
    }
  }

  dealLoop() {
    for(let i = 0; i < conditions.dealLoopIterations; i++) {
      flow.setStep('DEAL');
      this.playStep();
      if(i % 500 === 0) {
        console.log(i);
      }
    }
  }

  deal() {
    if(this.dealer.cards.length > 0) {
      this.tableStat.setEndingBankrolls(
        this.players.filter(player => !player.puppetMaster)
        .map(({bankroll}) => bankroll)
      );
      this.tableStats.push(this.tableStat.getStat());
      this.tableStat = new TableStat();
    }

    this.resetTable();
    this.players
      .filter(player => !player.puppetMaster && player.brainType !== 'HUMAN')
      .forEach(player => player.multiplierHistory.push(player.hands[0].botBrain.multiplier));
    this.trueCountHistory.push(shoe.getHiLoTrueCount());
    this.runningCountHistory.push(shoe.getHiLoRunningCount());
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
      // shoe.cards.push(new Card('H', 12));
      dealer.dealHoleCard();
      flow.setStep(dealer.showsAce() ? 'INSURANCE' : 'DEALER_BLACKJACK_PAYOUT');
      this.playStep();
    }
  };

  insurance() {
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
    this.dealtInPlayers.forEach(player => player.payInsuranceBet(this.dealer.hasBlackJack()));
    this.syncPuppetBankrolls();
    flow.setStep('DEALER_BLACKJACK_PAYOUT');
    this.playStep();
  } 

  dealerBlackJackPayout() {
    if(this.dealer.hasBlackJack()) {
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
    const player = this.dealtInPlayers.filter(player => !player.hasPlayed)[0];
    if(player) {
      player.playHandByHandId(0);
      this.dealer.view.updateCountInfo();
    } else {
      flow.setStep('PLAY_DEALERS_HAND');
      this.playStep();
    }
  }

  playDealersHand() {
    this.dealer.flipHoleCard();
    this.dealer.playHand();
    flow.setStep('PAYOUT');
    this.playStep();
  };

  payout() {
    this.players.forEach(player => player.hands.filter(hand => !hand.hasBeenPaid)
    .forEach(hand => {
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
    flow.setStep('PLACE_BETS');
    this.playStep();
  }

  resetTable() {
    if(this.dealer.cards.length > 0) {
      shoe.handsCount += 1;
    }
    // shoe.shuffleCheck();
    this.tableStat.setTrueCount(shoe.getHiLoTrueCount());
    this.tableStat.setAceRatio(shoe.getAceRatio());
    this.tableStat.setBeginningBankrolls(
      this.players.filter(player => !player.puppetMaster)
      .map(({bankroll}) => bankroll)
    );
    this.responsesToInsurance = 0;
    this.clearCards();
    this.dealer.reset();
    shoe.shuffleCheck(); // DO I WANNA SHUFFKE CHECK AFTER I SET THE STATS?
    this.players.filter(player => !player.puppetMaster).forEach(player => player.view.hideAddSpotButton());
    this.players.filter(player => player.puppetMaster).forEach(player => player.view.hideLeaveSpotButton());
    this.players.forEach(player => player.reset());
  }

  playStep() {
    this.dealer.view.updateCountInfo();
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