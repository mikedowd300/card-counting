class PlayerUI {

  constructor(parentElem, id, methodsBag, player) {
    this.methodsBag = methodsBag;
    jq.prependElem(parentElem, this.getTemplate(player));
    this.self = jq.getElById(this.getSelfSelector(id));
    this.handsElem = jq.getElById(this.getHandsElemSelector(id));
    this.insuranceModal = jq.getElById(this.getInsuranceModalSelector(id));
    this.betSize = jq.getElById(this.getBetSizeSelector(id));
    this.bankrollElem = jq.getElById(this.getBankrolleSelector(id));
    this.incBetButton = jq.getElById(this.getIncBetButtonSelector(id));
    this.decBetButton = jq.getElById(this.getDecBetButtonSelector(id));
    this.addSpotButton = jq.getElById(this.getAddSpotButtonSelector(id));
    this.acceptInsuranceButton = jq.getElById(this.getAcceptInsuranceButtonSelector(id));
    this.declineInsuranceButton = jq.getElById(this.getDeclineInsuranceButtonSelector(id));
    this.incBetButton.addEventListener('click', () => {
      methodsBag.incBetSize();
      this.betSize.innerHTML = methodsBag.getBetSize();
    });
    this.decBetButton.addEventListener('click', () => {
      methodsBag.decBetSize();
      this.betSize.innerHTML = methodsBag.getBetSize();
    });
    this.addSpotButton.addEventListener('click', () => methodsBag.addSpot( ));
    this.declineInsuranceButton.addEventListener('click', () => this.declineInsurance());
    this.acceptInsuranceButton.addEventListener('click', () => this.acceptInsurance());
  }

  hideAddSpotButton() {
    this.addSpotButton.classList.add('hide');
  }

  showAddSpotButton() {
    this.addSpotButton.classList.remove('hide');
  }

  declineInsurance() {
    this.hideInsuranceModal();
    this.methodsBag.updateInsuranceResponses();
  }

  acceptInsurance() {
    this.hideInsuranceModal();
    this.methodsBag.makeInsuranceBet();
    this.methodsBag.updateInsuranceResponses();
  }

  getSelfSelector = id => `player-${ id }`;
  getBetSizeSelector = id => `player-${ id }-betsize`;
  getIncBetButtonSelector = id => `player-${ id }-inc-bet`;
  getDecBetButtonSelector = id => `player-${ id }-dec-bet`;
  getAddSpotButtonSelector = id => `add-spot-${ id }-button`;
  getHandsElemSelector = id => `player-${ id }-hands`;
  getAcceptInsuranceButtonSelector = id => `player-${ id }-accept-insurance`;
  getDeclineInsuranceButtonSelector = id => `player-${ id }-decline-insurance`;
  getInsuranceModalSelector = id => `player-${ id }-insurance`;
  getBankrolleSelector = id => `player-bankroll-${ id }`;

  hideInsuranceModal = () => this.insuranceModal.classList.add('hide');
  showInsuranceModal = () => this.insuranceModal.classList.remove('hide');
  updateBetAmount = bet => this.betSize.innerHTML = bet;
  removeHands = () => Array.from(this.handsElem.getElementsByClassName('hand')).forEach(el => el.remove());
  updateUIBankroll = bankroll => this.bankrollElem.innerHTML = bankroll;

  // <button class="add-spot-button" should only be visible if there are available spots and the player has enough money to bring in a new player - WIP
  getTemplate = ({ id, name, bankroll, bet }) => (
    `<div class="player flex" id="player-${ id }">
      <div class="player-insurance flex hide" id="player-${ id }-insurance">
        <p>Insurance</p>
        <button class="insurance-button" id="player-${ id }-accept-insurance">Accept</button>
        <button class="insurance-button" id="player-${ id }-decline-insurance">Decline</button>
      </div>
      <div class="wrapper">
        <span class="player-name">${ name }</span>
        <span class="player-bankroll" id="player-bankroll-${ id }">${ bankroll }</span>
      </div>
      <button class="add-spot-button" id="add-spot-${ id }-button">Add Spot</button>
      <div class="player-bet flex">
        <button class="betsize-button" id="player-${ id }-inc-bet">+</button>
        <span class="betsize" id="player-${ id }-betsize">${ bet }</span>
        <button class="betsize-button" id="player-${ id }-dec-bet">-</button>
      </div>
      <div class="hands flex" id="player-${ id }-hands"></div>
    </div>`
  );
}