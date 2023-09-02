const jq = new JqService();
const tableConditions = new ConditionsService();
let conditions = tableConditions.conditions;
const flow = new FlowService();
const shoe = new ShoeService();
const body = jq.getElById('body');
const table = new TableComponent(body);
table.view.hideSelf();
const tableSetup = new TableConditionsComponent(body, table);
