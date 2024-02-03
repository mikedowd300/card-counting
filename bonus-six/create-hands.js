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

convertToCard = c => `${cardValMap[Math.floor(c / 4)]}${suiteMap[c % 4]}`;

getCards = () => {
  let cards = [];
  for(let c = 0; c < 52; c++) {
    cards.push(convertToCard(c));
  }
  return cards;
}

let cards = getCards();

getStraitFlushes = () => {
  let straitFlushes = [];
  for(let s = 0; s < 4; s++) {
    for(let c = 0; c < 9; c++) {
      let str = '';
      for(let i = c + s; i < c + s + 5; i++) {
        str += `${cardValMap[i-s]}${suiteMap[s]} `
      }
      straitFlushes.push(str);
    }
  }
  return straitFlushes;
}

getFourOfKinds = () => {
  let fourOfKinds = [];
  for(let c = 0; c < 13; c++) {
    let str ='';
    for(let s = 0; s < 4; s++) {
      str += `${cardValMap[c]}${suiteMap[s]} `;
    }
    fourOfKinds.push(str);
  }
  let fourOfKindsWithKickers = fourOfKinds.map(fok => {
    let kickers = [];
    for(let c = 0; c < 52; c++) {
      let kicker = convertToCard(c);
      if(!fok.includes(kicker)) {
        kickers.push(`${fok}${kicker}`)
      }
    }
    return kickers;
  })
  let spreadFoK = [];
  fourOfKindsWithKickers.forEach(fok => spreadFoK = [ ...spreadFoK, ...fok])

  return spreadFoK;
}

get3oKWithoutKicker = () => {
  let threeOKs = [];
  let suiteCombos = [
    [0, 1, 2],
    [0, 1, 3],
    [0, 2, 3],
    [1, 2, 3],
  ];
  for(let c = 0; c < 52; c += 4) {
    for(let sc = 0; sc < suiteCombos.length; sc++) {
      let str3ok = '';
      for(let s = 0; s < 3; s++) {
        str3ok += `${convertToCard(c + suiteCombos[sc][s])}${s === 2 ? '': ' '}`;
      }
      threeOKs.push(str3ok);
    }
  }
  return threeOKs;
};

getPairsWithoutKickers = () => {
  let pairs = [];
  let suiteCombos = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ];
  for(let c = 0; c < 52; c += 4) {
    if(c < 4 || c > 19) {
      for(let sc = 0; sc < suiteCombos.length; sc++) {
        let pair = '';
        for(let s = 0; s < 2; s++) {
          pair += `${convertToCard(c + suiteCombos[sc][s])}${s === 1 ? '': ' '}`;
        }
        pairs.push(pair);
      }
    }
  }
  return pairs;
};

getFullHouses = (threes, pairs) => {
  let fullHouses = [];
  threes.forEach(t => pairs.forEach(p => {
    if(!t.includes(p[0])) {
      fullHouses.push(`${t} ${p}`);
    }
  }));
  return fullHouses;
};

getFlushes = royalFlushes => {
  let singleSuiteCombinations = [];
  let finalSingleSuiteCombinations = [];
  let cardIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  for(c1 = 0; c1 < cardIndexes.length; c1++) {
    let firstFilteredIndex = cardIndexes.filter(c => c !== cardIndexes[c1]);
    for(c2 = 0; c2 < firstFilteredIndex.length; c2++) {
      let secondFilteredIndex = firstFilteredIndex.filter(c => c !== firstFilteredIndex[c2]);
      for(c3 = 0; c3 < secondFilteredIndex.length; c3++) {
        let thirdFilteredIndex = secondFilteredIndex.filter(c => c !== secondFilteredIndex[c3]);
        for(c4 = 0; c4 < thirdFilteredIndex.length; c4++) {
          let fourthFilteredIndex = thirdFilteredIndex.filter(c => c !== thirdFilteredIndex[c4]);
          for(c5 = 0; c5 < fourthFilteredIndex.length; c5++) {
            const payload = [
              parseFloat(cardIndexes[c1]), 
              parseFloat(firstFilteredIndex[c2]), 
              parseFloat(secondFilteredIndex[c3]), 
              parseFloat(thirdFilteredIndex[c4]), 
              parseFloat(fourthFilteredIndex[c5])
            ].sort();
            if(Math.max(...payload) - Math.min(...payload) > 4) {
              let suits = [0, 1, 2, 3];
              suits.forEach(s => singleSuiteCombinations.push(payload.map(u => convertToCard((u*4)+s))));
            }
          }
        }
      }
    }
  }
  singleSuiteCombinations.forEach(ssc => {
    let sscStr = ssc.join(' ');
    if(!finalSingleSuiteCombinations.includes(sscStr) && !royalFlushes.includes(sscStr)) {
      finalSingleSuiteCombinations.push(sscStr);
    }
  });
  
  return finalSingleSuiteCombinations;
}

getStraights = () => {
  const sequencedCards = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
  const suites = ['C', 'D', 'H', 'S'];
  const suitlessStraits = [];
  const suiteCombos = [];
  const straits = [];
  for(c = 0; c < 10; c++) {
    suitlessStraits.push([
      sequencedCards[c], 
      sequencedCards[c + 1], 
      sequencedCards[c + 2], 
      sequencedCards[c + 3], 
      sequencedCards[c + 4]
    ])
  }
  for(let i = 0; i < 4; i++) {
    for(let j = 0; j < 4; j++) {
      for(let k = 0; k < 4; k++) {
        for(let l = 0; l < 4; l++) {
          for(let m = 0; m < 4; m++) {
            const indexes = [i, j, k, l, m]
            if(Math.max(...indexes) !== Math.min(...indexes)) {
              suiteCombos.push([suites[i], suites[j], suites[k], suites[l], suites[m]]);
            }
          }
        }
      }
    }
  }
  suitlessStraits
  .forEach(ss => suiteCombos
    .forEach(sc => {
      straits.push(ss.map((s, i) => `${s}${sc[i]}`).join(' '))
    })
  );
  return straits;
}

getAll2NonPairCombosWithoutNonSortedDupes = () => {
  let nonPairs = [];
  for(let c1 = 0; c1 < 52; c1++) {
    for(let c2 = 0; c2 < 52; c2++) {
      const card1 = convertToCard(c1);
      const card2 = convertToCard(c2);
      const sorted = [card1, card2].sort().join(' ');
      if(card1[0] !== card2[0] && !nonPairs.includes(sorted)) {
        nonPairs.push(sorted);
      }
    }
  }
  return nonPairs;
};

getThreeOfKinds = (threes, nonPairs) => {
  let threeOKinds = []
  threes.forEach(t => {
    nonPairs.forEach(np => {
      let nonPairCards = np.split(' ')
      if(!t.includes(nonPairCards[0][0]) && !t.includes(nonPairCards[1][0])) {
        threeOKinds.push(`${t} ${np}`);
      }
    })
  });
  return threeOKinds;
};

getAll3CardCombosWithoutDupesSorted = () => {
  let combos = [];
  let finalCombos = [];
  const cards = getCards();
  for(let c1 = 0; c1 < cards.length; c1++) {
    const firstFilteredCards = cards.filter(c => c[0] !== cards[c1][0]);
    for(let c2 = 0; c2 < firstFilteredCards.length; c2++) {
      const secondFilteredCards = firstFilteredCards.filter(c => c[0] !== firstFilteredCards[c2][0]);
      for(let c3 = 0; c3 < secondFilteredCards.length; c3++) {
        const comboCards = [cards[c1], firstFilteredCards[c2], secondFilteredCards[c3]].sort().join(' ');
        combos.push(comboCards);
      }
    }
  }
  combos.forEach(combo => {
    let sortedCombo = combo.split(' ').sort().join(' ');
    if(!finalCombos.includes(sortedCombo)) {
      finalCombos.push(sortedCombo);
    }
  });
  return finalCombos;
}

getTwoPairsNoKicker = pairs => {
  const twoPairs = [];
  const finalTwoPairs = [];
  for(let p1 = 0; p1 < pairs.length; p1++) {
    const filteredPairs = pairs.filter(p => !pairs[p1].includes(p[0]));
    filteredPairs.forEach(fp => {
      const sortedTwoPairs = [ ...pairs[p1].split(' '), ...fp.split(' ') ].sort().join(' ')
      twoPairs.push(sortedTwoPairs)
    });
  }
  twoPairs.forEach(tp => {
    if(!finalTwoPairs.includes(tp)) {
      finalTwoPairs.push(tp);
    }
  });
  return finalTwoPairs;
}

getTwoPairs = (twoPairs, cards) => {
  const twoPairHands = [];
  twoPairs.forEach(tp => cards.forEach(c => {
    if(!tp.includes(c[0])) {
      twoPairHands.push(`${tp} ${c}`);
    }
  }));
  return twoPairHands;
};

getPairs = (pairs, threeCardsCombos) => {
  let pairHands = [];
  pairs.forEach(p => threeCardsCombos.forEach(tcs => {
    if(!tcs.includes(p[0])) {
        pairHands.push((`${p} ${tcs}`));
    }
  }))
  return pairHands;
};

// const getAll3CardCombos = () => {
//   let combos = [];
//   for(let c1 = 0; c1 < 52; c1++) {
//     for(let c2 = 0; c2 < 52; c2++) {
//       if(c2 !== c1) {
//         for(let c3 = 0; c3 < 52; c3++) {
//           if( c3 !== c1 && c3 !== c2) {
//             const payload = [
//               convertToCard(c1),
//               convertToCard(c2),
//               convertToCard(c3),
//             ].sort().join(' ');
//             combos.push(payload);
//           }
//         }
//       }
//     }
//   }
//   return combos;
// }

// let x = getAll3CardCombos();
// console.log(JSON.stringify(x));

// getAll2NonPairCombosWithoutNonSortedDupes = () => {
//   let nonPairs = [];
//   for(let c1 = 0; c1 < 52; c1++) {
//     for(let c2 = 0; c2 < 52; c2++) {
//       const card1 = convertToCard(c1);
//       const card2 = convertToCard(c2);
//       const sorted = [card1, card2].sort().join(' ');
//       if(card1 !== card2 && !nonPairs.includes(sorted)) {
//         nonPairs.push(sorted);
//       }
//     }
//   }
//   return nonPairs.sort();
// };
// console.log(JSON.stringify(getAll2NonPairCombosWithoutNonSortedDupes()));
// main = () => {
//   console.log('nonPair2CardCombos', nonPair2CardCombos);
//   console.log('royalFlushes:', royalFlushes);
//   console.log('straight flushes:', straightFlushes);
//   console.log('4 of a kinds:', fourOfAKinds);
//   console.log('Full Houses:', fullHouses);
//   console.log('Flushes:', flushes);
//   console.log('Straights:', straights);
//   console.log('3 of a Kinds:', threeOfAKinds);
//   console.log('Two Pairs:', twoPairs);
//   console.log("Pairs of 6's or better", pairs);
//   console.log('ALL COMBINATIONS:', 2598960)
//   console.log('TOTAL PAYABLE HANDS:', (4) + (36) + (624) + (3744) + (5108) + (10200) + (54912) + (123552) + 760320);
//   console.log('TOTAL PAID ON 958500 HANDS:', ((4 * 1000) + (36 * 100) + (624 * 50) + (3744 * 20) + (5108 * 6) + (10200 * 5) + (54912 * 3) + (123552 * 2) + 760320) * 3);
//   console.log('TOTAL LOST ON LOSING HANDS:', 1640460)
// }

main = () => {
  const royalFlushes = ["AC JC QC KC TC", "AD JD QD KD TD", "AH JH QH KH TH", "AS JS QS KS TS"];
  const cards = getCards();
  // const straitFlushes = getStraitFlushes();
  // const fourOfKinds = getFourOfKinds();
  // const threeOfKindsWithoutKicker = get3oKWithoutKicker();
  const pairsWithoutKickers = getPairsWithoutKickers();
  // const fullHouses = getFullHouses(threeOfKindsWithoutKicker, pairsWithoutKickers);
  // const flushes = getFlushes(royalFlushes);
  // const straights = getStraights();
  // const all2NonPairCombosWithoutNonSortedDupes = getAll2NonPairCombosWithoutNonSortedDupes();
  // const threeOfKinds = getThreeOfKinds(threeOfKindsWithoutKicker, all2NonPairCombosWithoutNonSortedDupes);
  const all3CardCombosWithoutDupesSorted = getAll3CardCombosWithoutDupesSorted();
  // const twoPairsNoKicker = getTwoPairsNoKicker(pairsWithoutKickers);
  // const twoPairs = getTwoPairs(twoPairsNoKicker, cards);
  const pairs = getPairs(pairsWithoutKickers, all3CardCombosWithoutDupesSorted);
  // console.log('royalFlushes:', royalFlushes);
  // console.log(JSON.stringify(straitFlushes));
  // console.log(JSON.stringify(fourOfKinds));
  // console.log('threeOfKindsWithoutKicker:', threeOfKindsWithoutKicker);
  // console.log('pairsWithoutKickers:', pairsWithoutKickers);
  // console.log(JSON.stringify(fullHouses));
  // console.log(fullHouses);
  // console.log(JSON.stringify(flushes));
  // console.log(JSON.stringify(straights));
  // console.log('all2NonPairCombosWithoutNonSortedDupes:', all2NonPairCombosWithoutNonSortedDupes);
  // console.log(JSON.stringify(threeOfKinds));
  // console.log('all3CardCombosWithoutDupesSorted:', all3CardCombosWithoutDupesSorted);
  // console.log('twoPairsNoKicker:', twoPairsNoKicker);
  // console.log(JSON.stringify(twoPairs));
  console.log(JSON.stringify(pairs));
  // console.log('TOTAL PAYABLE HANDS:', (4 * 1000) + (36 * 100) + (624 * 50) + (3744 * 20) + (5108 * 6) + (10200 * 5) + (54912 * 3) + (123552 * 2) + 760320);
  // console.log('ALL COMBINATIONS:', 2598960)
}

main();