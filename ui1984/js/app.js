const table = new Table();

const controlTiming = () => ({
  afterPayout: () => {
    makeTable();
    setTimeout(() => {
      table.setStep('HAND_OVER');
      makeTable();
    }, conditions.timeAfterPayout);
  },
  afterDealersBlackJackPayout: () => {
    table.setMessage(conditions.dealerHasBlackjack);
    makeTable();
    setTimeout(() => {
      table.setStep('HAND_OVER');
      table.setMessage(conditions.placeBetsMessage);
      makeTable();
  }, conditions.timeAfterPayout);
  }
});

table.timing = controlTiming();

const getActiveHand = () => {
  const activeSeat = table.takenSeats.find(seat => seat.player.isActivePlayer);
  return activeSeat.player.hands.find(hand => !hand.isPlayed);
}

const setActivePlayerOptionsMessage = () => {
  if(table.getCurrentStep() === 'PLAY_HANDS') {
    const activeSeat = table.takenSeats.find(seat => seat.player.isActivePlayer);
    const hand = activeSeat.player.hands.find(hand => !hand.isPlayed);
    let options;
    if(hand.options.length > 1) {
      options = [...hand.options];
      const lastOption = options.pop();
      options = options.join(', ') + ` or ${lastOption}`
    }
    table.setMessage(`${activeSeat.player.handle}, you may ${options} - count: ${table.shoe.getHiLoCount()}`);
  }
}

const betIns = index => {
  table.seats[index].player.makeInsuranceBet();
  makeTable();
}

const bet = (index, amount) => {
  if(table.getCurrentStep() === 'HAND_OVER') {
    table.setStep('PLACE_BETS');
  }
  if(table.getCurrentStep() === 'PLACE_BETS') {
    table.seats[index].player.setBetSize(amount);
  } else {
    table.setMessage('This isnt the time to change your bet size!');
  }
  makeTable();
}

const help = () => {
  table.setMessage('Valid commands are: ins({seat id}), closeIns(), sit({seat id},{player handle} and deal()');
  makeTable();
}

const ins = index => {
  if(table.getCurrentStep() === 'INSURANCE') {
    const validIds = table.takenSeats.map(seat => seat.id);
    if(validIds.includes(index)) {
      const player = table.seats[index].player
      player.makeInsuranceBet();
      table.setMessage(`${player.handle} ${player.hasInsurance ? 'took insurance' : 'is uninsured'} `);
    } else {
      table.setMessage(`${index} is not a valid index! ${conditions.insuranceMessage}`);
    }
  } else {
    table.setMessage('Invalid command!');
  }
  makeTable();
}

const deal = () => {
  table.setStep('DEAL');
  setActivePlayerOptionsMessage();
  makeTable();
}

const closeIns = () => {
  table.closeInsurance();
  if(table.getCurrentStep() === 'HAND_OVER') {
    table.setMessage('DEALER HAD BLACKJACK, PLACE YOUR BETS FOR A NEW HAND!');
    makeTable();
  } else {
    makeTable();
  }
}

const sit = (index, name) => {
  table.seats[index].takeSeat(name);
  makeTable();
}

const st = () => {
    if(table.getCurrentStep() === 'PLAY_HANDS') {
      const hand = getActiveHand();
      if(hand.options.includes('STAY')) {
        hand.stay();
      } else {
        table.setMessage('STAY is not a valid option!')
      }
      setActivePlayerOptionsMessage();
    } else {
      table.setMessage(`That command is not valid for ${table.getCurrentStep()}`)
    }
    makeTable();
  }
  
  const h = () => {
    if(table.getCurrentStep() === 'PLAY_HANDS') {
      const hand = getActiveHand();
      if(hand.options.includes('HIT')) {
        hand.hit();
      } else {
        table.setMessage('HIT is not a valid option! You may ${options}')
      }
      setActivePlayerOptionsMessage();
    } else {
      table.setMessage(`That command is not valid for ${table.getCurrentStep()}`)
    }
    makeTable();
  }
  
  const su = () => {
    if(table.getCurrentStep() === 'PLAY_HANDS') {
      const hand = getActiveHand();
      if(hand.options.includes('SURRENDER')) {
        hand.surrender();
      } else {
        table.setMessage('SURRENDER is not a valid option! You may ${options}')
      }
      setActivePlayerOptionsMessage();
      makeTable();
    } else {
      table.setMessage(`That command is not valid for ${table.getCurrentStep()}`)
    }
    makeTable();
  }
  
  const d = () => {
    if(table.getCurrentStep() === 'PLAY_HANDS') {
      const hand = getActiveHand();
      if(hand.options.includes('DOUBLE')) {
        hand.doubleDown();
      } else {
        table.setMessage('DOUBLE is not a valid option! You may ${options}')
      }
      setActivePlayerOptionsMessage();
      makeTable();
    } else {
      table.setMessage(`That command is not valid for ${table.getCurrentStep()}`)
    }
    makeTable();
  }
  
  const sp = () => {
    if(table.getCurrentStep() === 'PLAY_HANDS') {
      const hand = getActiveHand();
      if(hand.options.includes('SPLIT')) {
        hand.split();
      } else {
        table.setMessage('SPLIT is not a valid option! You may ${options}')
      }
      setActivePlayerOptionsMessage();
    } else {
      table.setMessage(`That command is not valid for ${table.getCurrentStep()}`)
    }
    makeTable();
  }
  
  table.seats[0].takeSeat('Harry')
  table.seats[4].takeSeat('Rob')
  table.seats[0].player.setBetSize(20);
  makeTable();
  deal();