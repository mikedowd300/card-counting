let totalNet = 0;

const suiteMap = {
  0: 'C',
  1: 'D', 
  2: 'H',
  3: 'S'
}

const cardValMap = {
  0: 'A',
  1: '2', 
  2: '3',
  3: '4',
  4: '5',
  5: '6',
  6: '7',
  7: '8',
  8: '9',
  9: 'T',
  10: 'J',
  11: 'Q',
  12: 'K',
}

const convertToCard = c => `${cardValMap[Math.floor(c / 4)]}${suiteMap[c % 4]}`;

const getDeck = () => {
  let cards = [];
  for(let c = 0; c < 52; c++) {
    cards.push(convertToCard(c));
  }
  return cards;
}

const deck = getDeck();

// const getAll5CardCombos = (c1, c2, c3) => {
//   let fiveCardCombos = [];
//   nonPair2CardCombos
//     .filter(combo => !combo.includes(c1) && !combo.includes(c2) && !combo.includes(c3))
//     .map(combo => combo.split(' '))
//     .forEach(combo => fiveCardCombos.push([ ...combo, c1, c2, c3].sort().join(' ')));
//   return fiveCardCombos.sort();
// }

const getAll5CardCombosLength = (c1, c2, c3) => {
  return nonPair2CardCombos.filter(combo => !combo.includes(c1) && !combo.includes(c2) && !combo.includes(c3)).length;
}

const countInstances = (c1, c2, c3, collection) => {
  let instances = 0;
  collection.forEach(c => {
    if(c.includes(c1) && c.includes(c2) && c.includes(c3)) {
      instances++;
    }
  });
  return instances;
}

const first3Cards = (c1, c2, c3) => {
  // let allCombos = getAll5CardCombos(c1, c2, c3);
  const allCombosLength = getAll5CardCombosLength(c1, c2, c3);
  if(deck.includes(c1) && deck.includes(c2) && deck.includes(c3)) {
    const possibleRoyalFlushes = countInstances(c1, c2, c3, royalFlushes);
    // royalFlushes
    //   .filter(cards => cards.includes(c1) && cards.includes(c2) && cards.includes(c3)).length
      // .map(cards => cards.split(' ').sort().join(' ')).length ;
    const possibleStraitFlushes = countInstances(c1, c2, c3, straightFlushes);
    // straightFlushes
    //   .filter(cards => cards.includes(c1) && cards.includes(c2) && cards.includes(c3)).length
      // .map(cards => cards.split(' ').sort().join(' ')).length ;
    const possible4ofAKinds = countInstances(c1, c2, c3, fourOfAKinds);
    // fourOfAKinds
    //   .filter(cards => cards.includes(c1) && cards.includes(c2) && cards.includes(c3)).length
      // .map(cards => cards.split(' ').sort().join(' ')).length ;
    const possibleFullHouses = countInstances(c1, c2, c3, fullHouses);
    // fullHouses
    //   .filter(cards => cards.includes(c1) && cards.includes(c2) && cards.includes(c3)).length
      // .map(cards => cards.split(' ').sort().join(' ')).length ;
    const possibleFlushes = countInstances(c1, c2, c3, flushes);
    // flushes
    //   .filter(cards => cards.includes(c1) && cards.includes(c2) && cards.includes(c3)).length
      // .map(cards => cards.split(' ').sort().join(' ')).length ;
    const possibleStraights = countInstances(c1, c2, c3, straights);
    // straights
    //   .filter(cards => cards.includes(c1) && cards.includes(c2) && cards.includes(c3)).length
      // .map(cards => cards.split(' ').sort().join(' ')).length ;
    const possible3ofAKinds = countInstances(c1, c2, c3, threeOfAKinds);
    // threeOfAKinds
    //   .filter(cards => cards.includes(c1) && cards.includes(c2) && cards.includes(c3)).length
      // .map(cards => cards.split(' ').sort().join(' ')).length ;
    const possibleTwoPairs = countInstances(c1, c2, c3, twoPairs);
    // twoPairs
    //   .filter(cards => cards.includes(c1) && cards.includes(c2) && cards.includes(c3)).length
      // .map(cards => cards.split(' ').sort().join(' ')).length ;
    const possiblePairs = countInstances(c1, c2, c3, pairs);
    // pairs
    //   .filter(cards => cards.includes(c1) && cards.includes(c2) && cards.includes(c3)).length
      // .map(cards => cards.split(' ').sort().join(' ')).length ;
    const winningHands = possibleRoyalFlushes + 
      possibleStraitFlushes + 
      possible4ofAKinds + 
      possibleFullHouses + 
      possibleFlushes + 
      possibleStraights + 
      possible3ofAKinds + 
      possibleTwoPairs + 
      possiblePairs;
    const winningAmount = (possibleRoyalFlushes * 1000 * 3) + 
      (possibleStraitFlushes * 100 * 3) + 
      (possible4ofAKinds * 50 * 3) + 
      (possibleFullHouses * 20 * 3) + 
      (possibleFlushes * 6 * 3) + 
      (possibleStraights * 5 * 3) + 
      (possible3ofAKinds * 3 * 3) + 
      (possibleTwoPairs * 2 * 3) + 
      (possiblePairs * 3);
    const losingHands = allCombosLength - winningHands;
    const totalWinnings = winningAmount - (losingHands * 3);
    const percentWinner = Math.round((totalWinnings * 1000) / ((losingHands + winningHands) * 3)) / 10
    const perHandWinner = Math.round((totalWinnings * 100)/ (winningHands + losingHands)) / 100;
    // console.log("LOSING HANDS", losingHands, ' - Costs', losingHands * 3, 'to play these hands');
    // console.log("WINNING HANDS:", winningHands, ' - Will win', winningAmount);
    // console.log('TOTAL WINNINGS PLAYING ALL COMBINATIONS', totalWinnings);
    // console.log('TOTAL WINNINGS NOT PLAYING ALL COMBINATIONS:',(-1)*(winningHands + losingHands));
    // console.log('% winner:', percentWinner, 'Per hand winner:', perHandWinner);
    totalNet += Math.max(totalWinnings, (-1)*(winningHands + losingHands))
  } else {
    console.log('Invalid Cards:', c1, c2, c3);
  }
}

const evaluateAllPossibleHands = () => {
  all3CardCombos.forEach((combo, i) => {
    ray = combo.split(' ');
    first3Cards(ray[0], ray[1], ray[2]);
    if(i % 1000 === 0) {
      console.log(i, ray);
    }
  });
  console.log(all3CardCombos.length, totalNet);
}

evaluateAllPossibleHands();