const jq = new JqService();
const tableConditions = new ConditionsService();
let conditions = tableConditions.conditions;
const flow = new FlowService();
const shoe = new ShoeService();
const body = jq.getElById('body');
const table = new TableComponent(body);
const tableSetup = new TableConditionsComponent(body, table);
table.view.hideSelf();
tableSetup.view.hideSelf();

const setConditions = () => {
  table.view.hideSelf();
  tableSetup.view.showSelf();
}; 

const playBlackJack = () => {
  tableSetup.view.hideSelf();
  table.view.showSelf();
};

// THE OG UI NEEDS TO HIDDEN ON setConditions() and playBlackJack() - WIP
