class DealerUI {
  constructor(parentElement, methods) {
    this.continue = true;
    jq.prependElem(parentElement, this.getTemplate());
    this.self = jq.getElById(this.getSelfSelector);
    this.cardsContainer = jq.getElById(this.getCardsContainerSelector());
    this.holeCard = null;
    this.dealButton = jq.getElById(this.getDealButtonSelector());
    this.dealButton.addEventListener('click', () => {
      if(flow.getCurrentStep() === 'PLACE_BETS' && this.continue) {
        if(!conditions.useDealLoop) {
          flow.setStep('DEAL');
          methods.playStep();
        } else {
          this.continue = false;
          methods.dealLoop();
        }
      }
    });
    this.insuranceButton = jq.getElById(this.getInsuranceButtonSelector());
    this.insuranceButton.addEventListener('click', () => methods.closeInsurance());
    this.discardPercentageEl = jq.getElById(this.getDiscardPercentageSelector());
    this.runningCountEl = jq.getElById(this.getRunningCountSelector());
  }

  getSelfSelector = () => 'dealer';
  getCardsContainerSelector = () => 'dealer-cards-container';
  getDealButtonSelector = () => `deal-button`;
  getInsuranceButtonSelector = () => `close-insurance-button`;
  getHoleCardSelector = () => 'hole-card';
  getDiscardPercentageSelector = () => `discard-percentage`;
  getRunningCountSelector = () => `running-count`;

  getCardTemplate = (url, isHoleCard=false) => isHoleCard 
    ? `<img src="./js/assets/card-back.jpg" id="hole-card">` 
    : `<img src="${url}">`;

  addCard = ({ image, isHoleCard }) => {
   jq.appendElem(this.cardsContainer, this.getCardTemplate(image, isHoleCard))
  }

  showDealButton() {
    this.dealButton.classList.remove('hide');
  }

  hideDealButton() {
    this.dealButton.classList.add('hide');
  }

  hideInsuranceButton() {
    this.insuranceButton.classList.add('hide');
  }

  showInsuranceButton() {
    this.insuranceButton.classList.remove('hide');
  }

  flipHoleCard(card) {
    this.holeCard = jq.getElById(this.getHoleCardSelector());
    this.holeCard.setAttribute( "src", card.image );
  }

  reset() {
    Array.from(this.cardsContainer.getElementsByTagName('img')).forEach(el => el.remove());
  }

  updateCountInfo() {
    this.discardPercentageEl.innerHTML = Math.round(shoe.getDecksRemaining() * 10)/10;
    this.runningCountEl.innerHTML = shoe.getHiLoRunningCount();
  }

  getTemplate = () => (
    `<div class="dealer flex" id="dealer">
      <div class="buttons-container flex">
        <button class="deal-button flex hide" id="deal-button">DEAL</button>
        <button class="close-insurance-button hide" id="close-insurance-button">CLOSE INSURANCE</button>
        <div class="count-info">
          <button class="show-count-button flex hide" id="show-count-button">SHOW COUNT</button>
          <span id="discard-percentage"></span>
          <span id="running-count"></span>
        </div>
      </div>
      <div class="cards-container flex" id="dealer-cards-container"></div>
    </div>`
  );
}