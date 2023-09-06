class TableUI {

  constructor(parentElem, info) {
    this.parentElem = parentElem;
    this.info = info;this.spotsElem
    jq.prependElem(parentElem, this.getTemplate());
    this.self = jq.getElById(this.getSelfSelector());
    this.spotsElem = jq.getElById(this.getSpotsSelector());
    this.addSpots(info, this.spotsElem);
    this.dealerContainer = jq.getElById(this.getDealerContainerSelector());
    this.messageContainer = jq.getElById(this.getMessageContainerSelector());
  }

  hideSelf() {
    if(this.self) {
      this.self.classList.add('hide')
    }
  }

  showSelf() {
    if(this.self) {
      this.self.classList.remove('hide')
    }
  }

  getSelfSelector = () => 'table';
  getSpotsSelector = () => 'spots';
  getSpotSelector = id => `spot-${id}`;
  getOpenSpotSelector = id => `open-${id}-spot`;
  getHumanSpotButtonSelector = (id, fromCode = false) => `human-${id}-spot-button`;
  getIllustrious18BotSpotButtonSelector = id => `illustrious-18-${id}-spot-button`;
  getBasicStrategyBotSpotButtonSelector = id => `basic-strategy-${id}-spot-button`;
  getNeverBustBotSpotButtonSelector = id => `never-bust-${id}-spot-button`;
  getHomeMadeBotSpotButtonSelector = id => `home-made-${id}-spot-button`;
  getTakenSpotSelector = id => `taken-${id}-spot`;
  getDealerContainerSelector = () => `dealer-container`;
  getMessageContainerSelector = () => `message-container`;

  getTemplate = () => (
    `<div class="table flex" id="table">
      <div class="spots-container flex" id="spots"></div>
      <div class="message-container flex" id="message-container"></div>
      <div class="dealer-container flex" id="dealer-container"></div>
    </div>`
  );

  getSpotTemplate = id => {
    const spotUIwidth = 100 / conditions.seatsPerTable ;
    const onclick = `onclick="${() => test(id)}"`
    return (
    `<div class="spot flex" 
      id="spot-${id}"
      style="width: ${ spotUIwidth }%"  
      onMouseOut="this.style.width='${ spotUIwidth }%'"
      onMouseOver="this.style.width='50%'"
    >
      <div class="open-spot flex" id="open-${id}-spot">
        <button class="human-spot-button human" id="human-${id}-spot-button">Human</button>
        <button 
          class="illustrious-18-spot-button basic-strategy" 
          id="illustrious-18-${id}-spot-button"
        >
          The Illustrious 18
        </button>
        <button 
          class="basic-strategy-spot-button basic-strategy" 
          id="basic-strategy-${id}-spot-button"
        >
          Basic Strategy
        </button>
        <button 
          class="home-made-spot-button home-made" 
          id="home-made-${id}-spot-button"
        >
          Home Made
        </button>
        <button 
          class="never-bust-spot-button never-bust" 
          id="never-bust-${id}-spot-button"
        >
          Never Bust
        </button>
      </div>
      <div class="taken-spot flex hide" id="taken-${id}-spot"></div>
    </div>`
    )
  };

  addSpots({ spots }, parentElem, fromCode = false) {
    for(let id = 0; id < spots; id++) {
      jq.prependElem(parentElem, this.getSpotTemplate(id));
      const humanButton = jq.getElById(this.getHumanSpotButtonSelector(id, fromCode));
      const basicStrategyBotButton = jq.getElById(this.getBasicStrategyBotSpotButtonSelector(id));
      const illustrious18BotButton = jq.getElById(this.getIllustrious18BotSpotButtonSelector(id));
      const neverBustBotButton = jq.getElById(this.getNeverBustBotSpotButtonSelector(id));
      const homeMadeBotButton = jq.getElById(this.getHomeMadeBotSpotButtonSelector(id));
      humanButton.addEventListener('click', () => this.spotButtonClickCallback(id, 'HUMAN', fromCode));
      basicStrategyBotButton.addEventListener('click', () => this.spotButtonClickCallback(id,'BASIC_STRATEGY'));
      illustrious18BotButton.addEventListener('click', () => this.spotButtonClickCallback(id,'ILLUSTRIOUS_18'));
      neverBustBotButton.addEventListener('click', () => this.spotButtonClickCallback(id,'NEVER_BUST'));
      homeMadeBotButton.addEventListener('click', () => this.spotButtonClickCallback(id,'HOME_MADE'));
    }
  }

  replaceSpots(oldSpots, newSpots) {    
    for(let id = 0; id < oldSpots; id++) {
      const spot = jq.getElById(this.getSpotSelector(id));
      console.log(spot);
      spot.remove();
    };
    this.info = { ...this.info, spots: newSpots};
    this.addSpots(this.info , this.spotsElem);
  }

  spotButtonClickCallback = (id, brainType, fromCode = false) => {
    const puppetMaster = this.info.methodsBag.getLatestPuppeteer();
    jq.getElById(this.getOpenSpotSelector(id)).classList.add('hide');
    const takenSpotEl = jq.getElById(this.getTakenSpotSelector(id))
    takenSpotEl.classList.remove('hide');
    if(!puppetMaster) {
      this.info.methodsBag.addPlayerToSpot(id, takenSpotEl, brainType);
    } else {
      this.info.methodsBag.addPuppetToSpot(id, takenSpotEl, puppetMaster, brainType);
    }
  }

  removePuppetPlayer(parentId, childId, id) {
    jq.removeChildFromParentByIds(parentId, childId);
    jq.getElById(this.getOpenSpotSelector(id)).classList.remove('hide');
    jq.getElById(this.getTakenSpotSelector(id)).classList.add('hide');
  }
}
