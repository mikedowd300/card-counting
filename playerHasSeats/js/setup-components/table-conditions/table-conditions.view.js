class TableConditionsUI {

  constructor(parentElem, table) {
    this.parentElem = parentElem;
    this.table = table;
    this.rules = [
      {
        rule: 'dealerStaysOnSoft17',
        title: "Dealer Stays On Soft 17",
        value: conditions.dealerStaysOnSoft17,
        elementType: 'checkbox'
      },
      {
        rule: 'canResplitAces',
        title: "Can Resplit Aces",
        value: conditions.canResplitAces,
        elementType: 'checkbox'
      },
      {
        rule: 'canDoubleSplitAces',
        title: "Can Double Split Aces",
        value: conditions.canDoubleSplitAces,
        elementType: 'checkbox'
      },
      {
        rule: 'canHitSpiltAces',
        title: "Can Hit Split Aces",
        value: conditions.canHitSpiltAces,
        elementType: 'checkbox'
      },
      {
        rule: 'canDoubleForLess',
        title: "Can Double For Less",
        value: conditions.canDoubleForLess,
        elementType: 'checkbox'
      },
      {
        rule: 'canDoubleAfterSplit',
        title: "Can Double After a Split",
        value: conditions.canDoubleAfterSplit,
        elementType: 'checkbox'
      },
      {
        rule: 'canDoubleAnyTwo',
        title: "Can Double Any 2 Cards",
        value: conditions.canDoubleAnyTwo,
        elementType: 'checkbox'
      },
      {
        rule: 'canOnlyDoubleOn',
        title: "Can Only Double on: ",
        value: conditions.canOnlyDoubleOn,
        elementType: 'text'
      },
      {
        rule: 'canDoubleSoft11AfterSplitting10s',
        title: "can Double Soft 11 After splitting 10s",
        value: conditions.canDoubleSoft11AfterSplitting10s,
        elementType: 'checkbox'
      },
      {
        rule: 'canInsureForLess',
        title: "Can Insure For Less",
        value: conditions.canInsureForLess,
        elementType: 'checkbox'
      },
      {
        rule: 'canSplitForLess',
        title: "Can Split For Less",
        value: conditions.canSplitForLess,
        elementType: 'checkbox'
      },
      {
        rule: 'canSurrender',
        title: "Can Surrender",
        value: conditions.canSurrender,
        elementType: 'checkbox'
      },
      {
        rule: 'canSurrenderAfterSplit',
        title: "Can Surrender After Split",
        value: conditions.canSurrenderAfterSplit,
        elementType: 'checkbox'
      },
      {
        rule: 'useDealLoop',
        title: "Use Deal Loop",
        value: conditions.useDealLoop,
        elementType: 'checkbox'
      },
      {
        rule: 'dealLoopIterations',
        title: "Deal Iterations",
        value: conditions.dealLoopIterations,
        elementType: 'text'
      },
      {
        rule: 'cardsBurnedPerShoe',
        title: "Cards Burned Per Shoe",
        value: conditions.cardsBurnedPerShoe,
        elementType: 'text'
      },
      {
        rule: 'decksPerShoe',
        title: "Decks Per Shoe",
        value: conditions.decksPerShoe,
        elementType: 'text'
      },
      {
        rule: 'seatsPerTable',
        title: "Seats Per Table",
        value: conditions.seatsPerTable,
        elementType: 'text'
      },
      {
        rule: 'minimumBet',
        title: "Minimum Bet",
        value: conditions.minimumBet,
        elementType: 'text'
      },
      {
        rule: 'maximumBet',
        title: "Maximum Bet",
        value: conditions.maximumBet,
        elementType: 'text'
      },
      {
        rule: 'startingBankroll',
        title: "Starting Bankroll",
        value: conditions.startingBankroll,
        elementType: 'text'
      },
      {
        rule: 'shufflePoint',
        title: "Shuffle Point",
        value: conditions.shufflePoint,
        elementType: 'text'
      },
      {
        rule: 'blackJackPaysRatio',
        title: "BlackJack Pays:",
        value: conditions.blackJackPaysRatio,
        elementType: 'text'
      },
    ];
    jq.prependElem(parentElem, this.getTemplate());
    this.self = jq.getElById(this.getSelfSelector());
    this.playBlackJackButton = jq.getElById(this.getPlayBlackJackButton());
    this.playBlackJackButton.addEventListener('click', () => {
      this.updateConditions()
      this.hideSelf();
      table.view.showSelf();
    })
    this.form = jq.getElById(this.getFormSelector());
    this.rules.forEach(rule => {
      jq.appendElem(this.form, this.getFormElement(rule));
      const el = jq.getElById(rule.rule);
      el.addEventListener('change', () => {
        const value = rule.elementType === 'text' ? el.value : el.checked;
        const targetRule = this.rules.find(r => r.rule === rule.rule);
        targetRule.value = value;
      })
    })
  }

  updateConditions() {
    let newConditions = { ...conditions };
    this.rules.forEach(r => {
      newConditions[r.rule] = r.elementType === 'text' && r.rule !== 'canOnlyDoubleOn' 
        ? r.rule !== 'blackJackPaysRatio' || r.rule !== 'shufflePoint' 
          ? parseFloat(r.value) 
          : parseInt(r.value) 
        : r.value;
    });
    this.table.spots = this.table.createSpots(newConditions.seatsPerTable);
    if(conditions.seatsPerTable !== newConditions.seatsPerTable) {
      this.table.view.replaceSpots(conditions.seatsPerTable, newConditions.seatsPerTable);
    }
    conditions = { ...newConditions };
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

  getSelfSelector = () => `conditions-container`;
  getPlayBlackJackButton = () => `play-blackjack`;
  getFormSelector = () => `conditions-form`;

  getTemplate = () => (
    `<div class="conditions-container flex" id="conditions-container">
      <h1>Game Conditions</h1>
      <form id="conditions-form" action="#"></form>
      <div class="buttons-wrapper flex">
        <button id="play-blackjack">Play</button>
      </div>
    </div>`
  );

  getFormElement = ({ rule, title, value, elementType }) => (
    `<div class="form-element flex ${elementType}">
      <input type="${elementType}" id="${rule}" name="${rule}" 
        value="${value}" ${elementType === 'checkbox' && value ? 'checked' : ''}
      >
      <label for="${rule}">${title}</label>
    </div>`
  );
}