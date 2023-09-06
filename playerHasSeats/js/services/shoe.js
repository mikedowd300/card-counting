class ShoeService {
  constructor() {
    this.suites = ['S', 'H', 'C', 'D'];
    this.cards = [];
    this.hiLoRunningCount = 0;
    this.hiLoTrueCount = 0;
    this.discardTray = [];
    this.shoeCount = 0;
    this.isFreshShoe = true;
    this.createShoe();
  }

  createShoe() {
    let shoe = [...this.createDeck()]
    for (let d = 0; d < conditions.decksPerShoe - 1; d++) {
      shoe = [...shoe, ...this.createDeck()];
    }
    this.discardTray = [...shoe];
    this.shuffleCheck();
  }

  createDeck() {
    const deck = [];
    for(let s = 0; s < 4; s++) {
      for(let i = 0; i < 13; i++) {
        deck.push(new Card(this.suites[s], i));
      }
    }
    return this.shuffle(deck, 52);
  }

  shuffleCheck() {
    const fullShoeLength = 52 * conditions.decksPerShoe;
    const isShuffleTime = (this.discardTray.length / fullShoeLength) >= conditions.shufflePoint;
    if(isShuffleTime) {
      // console.log('SHUFFELING', this.discardTray.length / fullShoeLength);
      this.cards = this.shuffle([...this.cards, ...this.discardTray]);
      this.discardTray = [];
      this.isFreshShoe = true;
      this.burn();
    } else {
      this.isFreshShoe = false;
    }
  }

  // If shuffle algorithms are added for shuffle tracking, this one is purely random
  shuffle(shoe, limit = 52 * conditions.decksPerShoe) {
    const newShoe = [];
    let oldShoe = [ ...shoe ];
    const mikeRandom = (new Date().getMilliseconds());
    for (let i = limit - 1; i >= 0; i--) {
      const index = Math.ceil(Math.random() * mikeRandom) % (oldShoe.length);
      newShoe.push(oldShoe[index]);
      oldShoe = [...oldShoe.slice(0, index), ...oldShoe.slice(index + 1)];
    }
    this.hiLoRunningCount = 0;
    this.hiLoTrueCount = 0;
    this.shoeCount += 1;
    return newShoe;
  }

  deal() {
    const card = this.cards.pop();
    this.setHiLoRunningCount(card.hiLoCountValue);
    this.setHiLoTrueCount();
    return card;
  };

  dealHoleCard() {
    const card = this.cards.pop();
    card.isHoleCard = true;
    return card;
  }

  flipHoleCard(card) {
    card.isHoleCard = false;
    this.setHiLoRunningCount(card.hiLoCountValue);
    this.setHiLoTrueCount();
  }

  burn() {
    let burnCards = [];
    for(let i = 0; i < conditions.cardsBurnedPerShoe; i++) {
      burnCards.push(this.cards.pop());
    }
    this.discard(burnCards);
  }

  discard(discards) {
    this.discardTray = [ ...this.discardTray, ...discards];
  }

  getDecksRemaining = () => this.cards.length / 52

  getHiLoRunningCount = () => this.hiLoRunningCount;

  setHiLoRunningCount = count => this.hiLoRunningCount += count;

  getHiLoTrueCount = () => Math.round(this.hiLoTrueCount);

  setHiLoTrueCount = () => this.hiLoTrueCount = this.hiLoRunningCount / this.getDecksRemaining();
}