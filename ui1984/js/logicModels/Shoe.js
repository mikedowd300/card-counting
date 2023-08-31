class Shoe {
  constructor(methodBag) {
    this.cardNames = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
    this.suites = ['S', 'H', 'C', 'D'];
    this.cards = this.createShoe();
    this.methodBag = methodBag;
    this.hiLoCount = 0;
  }

  createShoe() {
    let shoe = [...this.createDeck()]
    for (let d = 0; d < conditions.decksPerShoe - 1; d++) {
      shoe = [...shoe, ...this.createDeck()]
    }
    return this.shuffle(shoe);
  }

  createDeck() {
    const deck = [];
    for(let s = 0; s < 4; s++) {
      for(let n = 0; n < 13; n++) {
        deck.push({
        cardName: `${this.cardNames[n]}${this.suites[s]}`,
        cardValue: Math.min(10, n+1),
        hiLoCountValue: this.setHiLoCountValueForCard(Math.min(10, n+1)),
        });
      }
    }
    return deck;
  }

  shuffleCheck() {
    const fullShoeLength = 52 * conditions.decksPerShoe;
    const currentShoeLength = this.cards.length;
    const isShufleTime = (fullShoeLength - currentShoeLength) < ( 1 - conditions.shufflePoint) * fullShoeLength;
    if(isShufleTime) {
      this.shuffle([...this.cards, ...this.methodBag.getDiscardTray()]);
    }
  }

  shuffle(shoe) {
    const newShoe = [];
    let oldShoe = [...shoe];
    const limit = 52 * conditions.decksPerShoe;
    for (let i = limit - 1; i >= 0; i--) {
      const index = Math.floor(Math.random() * i);
      newShoe.push(oldShoe[index]);
      oldShoe = [...oldShoe.slice(0, index), ...oldShoe.slice(index + 1)];
    }
    return newShoe;
  }

  deal(doCount = false) {
    const card = this.cards.pop();
    console.log(doCount, card)
    this.hiLoCount = doCount ? card.hiLoCountValue : 0 >= 2 && card.cardValue;
    return card;
  };

  burn() {
    return this.deal();
  };

  setHiLoCountValueForCard(value) {
    if(value > 1 && value < 7) {
      return 1
    }
    if(value === 1 || value === 10) {
      return -1
    }
    return 0;
  }

  getHiLoCount = () => this.hiLoCount;
}