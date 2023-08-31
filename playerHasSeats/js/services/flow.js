class FlowService {
  steps = [
    'TAKE_SEAT',
    'PLACE_BETS', 
    'DEAL', 
    'INSURANCE',  
    'INSURANCE_PAYOUT',
    'DEALER_BLACKJACK_PAYOUT',
    'PLAYER_BLACKJACK_PAYOUTS',
    'DEAL', 
    'PAYOUT',  
    'PLAY_HANDS', 
    'PLAY_DEALERS_HAND', 
    'HAND_OVER'
  ];

  currentStep = 'TAKE_SEAT';

  constructor() {}

  setStep(step = null) {
    if(step) {
      this.currentStep = step;
    } else {
      const index = this.steps.indexOf(this.currentStep);
      this.currentStep = index === this.steps.length + 1 ? 'PLACE_BETS' : this.steps(index + 1);
    }
  }

  getCurrentStep = () => this.currentStep;
}