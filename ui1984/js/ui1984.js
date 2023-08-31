const { seatsPerTable } = conditions; 
const fullWidth = 14 * seatsPerTable + 1;
let seats;

const lineHelper = (len, char) => {
  str = ''
  for(let i = 0; i < len; i++) {
    str += char;
  }
  return str;
}

const makeFullHorizontalBorder = () => console.log(lineHelper(fullWidth, '-'));

const makeFullBlankLine = () => console.log('|' + lineHelper(fullWidth - 2, ' ') + '|');

const displaySuperFullLineText = text => {
  const chunkSize = (14 * seatsPerTable) - 3;
  while (text.length > chunkSize) {
    const chunk = text.slice(0, chunkSize);
    text = text.slice(chunkSize, text.length + 1);
    displayFullLineText(chunk);
  }
  displayFullLineText(text);
}

const displayFullLineText = text => {
  if(text !== '') {
    const textLength = text.length;
    const leftLength = Math.floor((fullWidth - textLength - 2)/2);
    const rightLen = fullWidth - 2 - leftLength - textLength;
    console.log('|' + lineHelper(leftLength, ' ') + text + lineHelper(rightLen, ' ') + '|');
  }
}

const getDealersCards = () => 
  table.dealer.cards.map(card => card.isHoleCard ? 'XX' : card.cardName).toString().split(',').join(' ');

const getDealerHandValue = () => table.getCurrentStep() === 'PLAY_DEALERS_HAND' && table.dealer.getValue() > 0 
  ? table.dealer.getValue().toString() 
  : '';

const getStep = () => table.getCurrentStep().split('_').join(' ');

const displayPlayerText = text => {
  text = text.length > 13 ? text.slice(0, 13) : text;
  const leftLength = Math.floor((13 - text.length)/2);
  const rightLength = 13 - leftLength - text.length;
  return ('|' + lineHelper(leftLength, ' ') + text + lineHelper(rightLength, ' '));
}

const displayNames = () => {
  str = '';
  seats.forEach(seat => str += 
    displayPlayerText(seat.player.handle ? seat.player.handle + ' ' + seat.player.bankroll : `seat-${seat.id}`));
  console.log(str + '|');
}

const makeEmptyPlayerLines = () => console.log(lineHelper(seatsPerTable, '|             ') + '|')

const maxHandLength = () => {
  let maxHandLength = 0;
  table.takenSeats
    .forEach(seat => seat.player.hands.forEach(hand => maxHandLength = Math.max(maxHandLength, hand.cards.length)))
  return maxHandLength;
}

const displayHands = () => {
  if(maxHandLength() > 0) {
    for(let row = maxHandLength() + 3; row >= 0; row--) {
      let allStr = '';
      seats.forEach(seat => {
        let str = '';
        if(!!seat.player.hands) {
          seat.player.hands.forEach(hand => {
            const val = hand.getValue().toString().length < 2 ? ' ' + hand.getValue() : hand.getValue();
            let cards = [...hand.cards];
            cards.unshift({ cardName: '--' });
            cards.unshift({ cardName: val.toString() });
            cards.unshift({ cardName: '--' });
            cards.unshift({ cardName: hand.bet.toString() });
            str += cards[row] ? ' ' + cards[row].cardName : '   ';
          });
        }
        allStr += displayPlayerText(str);
      });
      console.log(allStr + '|');
    }
  }
}

const displayBets = () => {
  if(table.getCurrentStep() === 'PLACE_BETS' || table.getCurrentStep() === 'HAND_OVER') {
    str = '';
    seats.forEach(seat => 
      str += displayPlayerText(seat.player.betSize ? seat.player.betSize.toString() : '              '))
    console.log(str + '|');
  }
}

displayHandMessages = () => {
  if(table.getCurrentStep() === 'PAYOUT' || table.getCurrentStep() === 'DEALER_BLACKJACK_CHECK_AND_PAYOUT') {
    str = '';
    seats.forEach(seat => {
      if(seat.player.hands) {
        let partialStr = '';
        seat.player.hands.forEach(hand => partialStr += hand.message)
        str += displayPlayerText(partialStr);
      } else {
        str += '|             ';
      }
    })
    console.log(str + '|');
  }
}
  
const playerHorizontalLine = () => console.log(lineHelper(seatsPerTable, '|-------------') + '|');

const makeMessageBox = () => {
  makeFullBlankLine();
  displaySuperFullLineText(table.getMessage());
  makeFullBlankLine();
  makeFullHorizontalBorder();
}

const makePlayers = () => {
  makeEmptyPlayerLines();
  displayHandMessages();
  displayHands();
  displayBets();
  playerHorizontalLine();
  displayNames();
  makeFullHorizontalBorder();
}

const makeDealer = () => {
  makeFullHorizontalBorder();
  makeFullBlankLine();
  displayFullLineText('DEALER');
  displayFullLineText(getDealersCards());
  displayFullLineText(getDealerHandValue());
  displayFullLineText(getStep());
  displayFullLineText(table.dealer.getMessage());
  makeFullBlankLine();
  makeFullHorizontalBorder();
}

const makeTable = () => {
  seats = [...table.seats].reverse();
  console.log('');
  makeDealer();
  makePlayers();
  makeMessageBox();
}