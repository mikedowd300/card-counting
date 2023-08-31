class Card {
  constructor(suit, index, isHoleCard = false) {
    this.values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'J', 'Q', 'K'];
    this.name = `${this.values[index]}${suit}`;
    this.image = `https://deckofcardsapi.com/static/img/${this.name}.png`;
    this.cardValue = Math.min(index + 1, 10);
    this.hiLoCountValue = this.setHiLoCountValueForCard(Math.min(10, index + 1));
    this.isHoleCard = isHoleCard;
  }

  setHiLoCountValueForCard(value) {
    if(value > 1 && value < 7) {
      return 1
    }
    if(value === 1 || value === 10) {
      return -1
    }
    return 0;
  }
}