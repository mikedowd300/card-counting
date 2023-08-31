class HandUI {
  constructor(parentElem, spotId, handId, methods, info, isFromSplit, firstCard) {
    this.spotId = spotId;
    this.handId = handId;
    this.info = info;
    this.originalOptions = [];
    jq.appendElem(parentElem, this.getTemplate(spotId, handId));
    this.self = jq.getElById(this.getSelfSelector(spotId, handId));
    this.handHistory = jq.getElById(this.hetHandHistorySelector(spotId, handId));
    this.optionsContainer = jq.getElById(this.getOptionsContainerSelector(spotId, handId));
    if(isFromSplit) {
      this.addCard(firstCard);
    } 
  }

  updateHistory = history => this.handHistory.innerHTML = history;

  addCard = ({ image }) => jq.appendElem(this.self, this.getCardTemplate(image));

  getSelfSelector = (spotId, handId) => `player-spot-${spotId}-hand-${handId}`;
  getOptionsContainerSelector = (spotId, handId) => `options-wrapper-spot-${spotId}-hand-${handId}`;
  getOptionSelector = (option) => `play-option-${option}-spot-${this.spotId}-hand-${this.handId}`;
  hetHandHistorySelector = (spotId, handId) => `hand-history-${spotId}-hand-${handId}`;

  displayOptions = (options) => {
    this.removeOptions();
    this.originalOptions = [ ...options ];
    options.forEach(option => {
      jq.appendElem(this.optionsContainer, this.getOptionTemplate(this.spotId, this.handId, option));
      this.optionElem = jq.getElById(this.getOptionSelector(option));
      this.optionElem?.addEventListener('click', () => this.info.optionActions[option]());
    });
  }

  removeOptions = () => this.originalOptions.forEach(option => {
    const el = jq.getElById((this.getOptionSelector(option)));
    el?.remove();
  });

  updateOptionsDisplay = (options) => {
    const tergetOptions = this.originalOptions.filter(option => !options.includes(options));
    tergetOptions.forEach(option => {
      const elem = jq.getElById(this.getOptionSelector(option));
      elem?.remove();
    });
  }

  removeSplitCard() {
    Array.from(this.self.getElementsByTagName('img'))[1].remove();
  }

  removeCards() {
    Array.from(this.self.getElementsByTagName('img')).forEach(el => el.remove());
  }

  split(card) {
    this.addCard(card)
  }

  getCardTemplate = (url, isHoleCard=false) => isHoleCard 
    ? `<img src="./js/assets/card-back.jpg">` 
    : `<img src="${url}">`;

  getTemplate = (spotId, handId) => (
    `<div class="hand flex" id="player-spot-${spotId}-hand-${handId}">
      <div class="options-container flex" id="options-wrapper-spot-${spotId}-hand-${handId}"></div>
      <p class="hand-history" id="hand-history-${spotId}-hand-${handId}"></p>
    </div>`
  )

  getOptionTemplate = (spotId, handId, option) => (
    `<div class="option" id="play-option-${option}-spot-${spotId}-hand-${handId}">${option}</div>`
  )
}