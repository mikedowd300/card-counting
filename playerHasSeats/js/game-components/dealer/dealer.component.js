class DealerComponent {
  constructor(parentElem, methodsBag) {
    this.methodsBag = methodsBag;
    this.parentElem = parentElem;
    this.cards = [];
    this.view = new DealerUI(parentElem, this.methodsBag);
  }

  showsAce = () => this.cards.length === 2 && this.cards[0].cardValue === 1;

  hasBlackJack = () => this.cards.length === 2 && this.is21();

  is21 = () => this.getValue() === 21;

  isBust = () => this.getValue() > 21;

  getValue() {
    let value = 0;
    this.cards.forEach(card => value += card.cardValue);
    if(this.hasAce()) {
      value = (value + 10) > 21 ? value : (value + 10);
    }
    return value;
  }

  getSoftValue(cards) {
    let value = 0;
    cards.forEach(card => value += card.cardValue);
    return value;
  }

  isSoft17() { // TEST THIS - IMPLEMENT THIS
    if(this.hasAce() && this.getValue() === 17) {
      const ace = this.cards.find(card => card.cardValue === 1 );
      const aceIndex = this.cards.indexOf(ace);
      const tempCards = this.cards.filter((card, i) => i !== aceIndex);
      const tempValue = this.getSoftValue(tempCards);
      return tempValue === 6;
    }
    return false;
  }

  hasAce = () => this.cards.filter(card => card.cardValue === 1).length > 0;

  dealSelfCard() {
    const card = shoe.deal();
    this.cards.push(card);
    this.view.addCard(card);
  }

  dealHoleCard() {
    const card = shoe.dealHoleCard();
    this.cards.push(card);
    this.view.addCard(card);
  }

  flipHoleCard() {
    shoe.flipHoleCard(this.cards[1]);
    this.view.flipHoleCard(this.cards[1]);
  }

  reset() {
    shoe.discard(this.cards);
    this.cards = [];
    this.view.reset();
  }

  // setMessage(message) {
  //   this.message = message;
  // }

  // getMessage() {
  //   return this.message;
  // }

  mustHit = () => this.isSoft17() ? !conditions.dealerStaysOnSoft17 : this.getValue() < 17;

  playHand() {
    this.view.updateCountInfo();
    let unpaidHandsCount = 0;
    this.methodsBag.getPlayers().forEach(player => player.hands.forEach(hand => {
      if(!hand.hasBeenPaid) {
        unpaidHandsCount += 1;
      }
    }));
    while(this.mustHit() && unpaidHandsCount > 0) {
      const card = shoe.deal();
      this.cards.push(card);
      this.view.addCard(card);
    }
    this.view.updateCountInfo();
  }
}