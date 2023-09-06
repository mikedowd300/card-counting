class PuppetPlayerUI {

  constructor(parentElem, id, methodsBag, player) {
    this.methodsBag = methodsBag;
    jq.prependElem(parentElem, this.getTemplate(player));
    this.self = jq.getElById(this.getSelfSelector(id))
    this.handsElem = jq.getElById(this.getHandsElemSelector(id));
    this.insuranceModal = jq.getElById(this.getInsuranceModalSelector(id));
    this.betSize = jq.getElById(this.getBetSizeSelector(id));
    this.bankrollElem = jq.getElById(this.getBankrolleSelector(id));
    this.leaveSpotButton = jq.getElById(this.getLeaveSpotButtonSelector(id));
    this.incBetButton = jq.getElById(this.getIncBetButtonSelector(id));
    this.decBetButton = jq.getElById(this.getDecBetButtonSelector(id));
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
    this.leaveSpotButton.addEventListener('click', () => methodsBag.leaveSpot(`taken-${ id }-spot`, this.getSelfSelector(id), id));
    this.declineInsuranceButton.addEventListener('click', () => declineInsurance());
    this.acceptInsuranceButton.addEventListener('click', () => acceptInsurance());
  }

  hideLeaveSpotButton() {
    this.leaveSpotButton.classList.add('hide');
  }

  showLeaveSpotButton() {
    this.leaveSpotButton.classList.remove('hide');
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
  getHandsElemSelector = id => `player-${ id }-hands`;
  getAcceptInsuranceButtonSelector = id => `player-${ id }-accept-insurance`;
  getDeclineInsuranceButtonSelector = id => `player-${ id }-decline-insurance`;
  getInsuranceModalSelector = id => `player-${ id }-insurance`;
  getLeaveSpotButtonSelector = id => `leave-spot-${ id }-button`;
  getBankrolleSelector = id => `player-bankroll-${ id }`;

  hideInsuranceModal = () => this.insuranceModal.classList.add('hide');
  showInsuranceModal = () => this.insuranceModal.classList.remove('hide');
  updateBetAmount = bet => this.betSize.innerHTML = bet;
  removeHands = () => Array.from(this.handsElem.getElementsByClassName('hand')).forEach(el => el.remove());

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
      <button class="leave-spot-button" id="leave-spot-${ id }-button">Leave Spot</button>
      <div class="player-bet flex">
        <button class="betsize-button" id="player-${ id }-inc-bet">+</button>
        <span class="betsize" id="player-${ id }-betsize">${ bet }</span>
        <button class="betsize-button" id="player-${ id }-dec-bet">-</button>
      </div>
      <div class="hands flex" id="player-${ id }-hands"></div>
    </div>`
  );

  updateUIBankroll(bankroll) {
    this.bankrollElem.innerHTML = bankroll;
  }
};