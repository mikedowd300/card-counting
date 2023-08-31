class Dealer extends Hand {
    constructor(methodBag) {
      super()
  
      this.methodBag = methodBag;
      this.message = '';
    }
  
    showsAce() {
      return this.cards.length === 2 && this.cards[0].cardValue === 1;
    }
  
    hasBlackJack() {
      return this.isBlackJack();
    }
  
    setMessage(message) {
      this.message = message;
    }
  
    getMessage() {
      return this.message;
    }
  
    mustHit() {
      if(this.hasAce() && this.getValue() === 17 && !conditions.dealerStaysOnSoft17){
        return true;
      }
      return !(this.getValue() >= 17);
    }
  
    playHand() {
      while(this.mustHit()) {
        this.cards.push(this.methodBag.deal());
      }
    }
  }