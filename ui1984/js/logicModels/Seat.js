class Seat {
    constructor(id, methodBag) {
      this.id = id;
      this.isTaken = false;
      this.player = {};
      this.methodBag = {
        ...methodBag,
        leaveSeat: () => this.leaveSeat()
      };
    }
  
    takeSeat(handle = 'Bob') {
      if(!this.isTaken) {
        const isAwake = this.methodBag.getCurrentStep() === 'PLACE_BETS' || this.methodBag.getCurrentStep() === 'HAND_OVER';
        this.isTaken = true;
        this.player = new Player(handle, isAwake, this.methodBag);
        this.methodBag.setTakenSeats();
      }
    }
  
    leaveSeat() {
      this.isTaken = false;
      this.player = {};
      this.methodBag.setTakenSeats();
    }
  }