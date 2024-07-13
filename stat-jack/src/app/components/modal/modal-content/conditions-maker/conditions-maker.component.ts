import { Component, OnInit } from '@angular/core';
import { ConditionsProfileManagerService } from '../../../../services/conditions-profile-manager.service';
import { PayRatioEnum, SurrenderTypesEnum, TableConditions, StoredTableConditions } from '../../../../models/models';
import { LocalStorageService } from '../../../../services/local-storage.service';

@Component({
  selector: 'conditions-maker',
  templateUrl: './conditions-maker.component.html',
  styleUrls: ['./conditions-maker.component.scss']
})
export class ConditionsMakerComponent implements OnInit {

  conditionConfigs: any;
  mode: string = "add-edit-mode"; //"delete-mode" "select-mode"
  conditionsConfigArray: any[] = [];
  addOrEditModeButtonText: string = '';
  tableConditions: TableConditions = null;
  originalConditions: TableConditions = null;
  tableConditionsArray: any[] = [];
  tableConditionKeys: string[] = [];
  tableConditionsTitle: string;
  buttonText: string = '';
  selectedForDeletion: string;

  constructor(
    public conditionsService: ConditionsProfileManagerService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.conditionConfigs = this.getTableConditionsFromLocalStorage();
    this.updateConditionConfigsKeyArray();
    this.addOrEditModeButtonText = this.conditionsConfigArray.length > 0 ? "Add or Edit" : "Add"; 
    this.tableConditions = this.conditionsService.hydrateTableConditions();
    this.tableConditionKeys = Object.keys(this.tableConditions).filter(key => key !== "title");
    this.tableConditionsArray = Object.keys(this.tableConditions)
      .map(key => ({ [key]: this.tableConditions[key] }));
    this.tableConditionsTitle = this.tableConditions.title;
    this.originalConditions = { ...this.tableConditions };
    this.updateButtonText();
  }

  handleTableConditionsCTA() {
    if(this.mode === "add-edit-mode") {
      const abbreviatedTableConditions = 
        this.conditionsService.createStoredTableConditionsObject(this.tableConditions);
      this.updateTableConditionConfigs(abbreviatedTableConditions.title, abbreviatedTableConditions);
      this.conditionConfigs = this.getTableConditionsFromLocalStorage();
      this.updateConditionConfigsKeyArray();
      this.addOrEditModeButtonText = this.conditionsConfigArray.length > 0 ? "Add or Edit" : "Add"; 
      this.tableConditions = this.conditionsService.hydrateTableConditions();
      this.tableConditionKeys = Object.keys(this.tableConditions).filter(key => key !== "title");
      this.tableConditionsArray = Object.keys(this.tableConditions)
        .map(key => ({ [key]: this.tableConditions[key] }));
      this.tableConditionsTitle = this.tableConditions.title;
      this.originalConditions = { ...this.tableConditions };
      this.updateButtonText();
    }
  }

  updateButtonText(targetConfig: string = null) {
    if(this.mode === "add-edit-mode") {
      this.buttonText = "Create new Conditions";
      if(this.conditionsConfigArray.includes(this.tableConditionsTitle)) {
        this.buttonText = `Save changes to ${this.tableConditionsTitle}`;
      }
      if(this.tableConditionsTitle === this.conditionsService.defaultStoredTableConditions.title) {
        this.buttonText = '';
      }
    }
    if(this.mode === "delete-mode") {
      const config = this.conditionsConfigArray
        .filter(condition => condition !== this.conditionsService.defaultStoredTableConditions.title)[0];
      this.buttonText = `Delete ${ targetConfig ? targetConfig : config }`;
    }
    if(this.mode === "select-mode") {
      this.buttonText = "Set as conditions for table";
    }
  }

  handleTitleChange({ target }) {
    this.tableConditionsTitle = target.value;
    this.tableConditions.title = target.value;
    this.updateButtonText();
  }

  handleRadioChange({ target }, option: PayRatioEnum | SurrenderTypesEnum, key: string) {
    this.tableConditions[key].value = option;
  }

  updateConditionConfigsKeyArray(): void {
    this.conditionsConfigArray = Object.keys(this.conditionConfigs);
  }

  selectMode(mode: string): void {
    if(!(this.mode === mode)) {
      this.mode = mode;
      if(this.mode === this.mode) {
        this.selectedForDeletion = this.conditionsConfigArray
          .filter(condition => condition !== this.conditionsService.defaultStoredTableConditions.title)[0];
      }
    }
    this.updateButtonText();
  }

  handleSelectTableCondition({ target }): void {
    const key: string = target.value;
    this.tableConditions = this.conditionsService.hydrateTableConditions(this.conditionConfigs[key], key);
    this.originalConditions = { ...this.tableConditions };
    this.tableConditionsTitle = key;
    this.updateButtonText();
  }

  handleSelectTableConditionToDelete({ target }): void {
    this.selectedForDeletion = target.value;
    this.updateButtonText(target.value);
  }

  updateTableConditionByConditionKey([key, value]: [string, any]): void {
    this.tableConditions[key] = value;
  }

  getTableConditionWithKey(key: string): TableConditions { // NOT TESTED
    const storedConfig: StoredTableConditions = this.conditionConfigs[key] || this.conditionsService.defaultStoredTableConditions;
    return this.conditionsService.hydrateTableConditions(storedConfig);
  }

  getTableConditionsFromLocalStorage() {
    return this.localStorageService.getItem('table-conditions-configs')
  }

  updateTableConditionConfigs(key: string, abbreviatedTableConditions: StoredTableConditions): void {
    this.conditionConfigs[key] = abbreviatedTableConditions;
    this.localStorageService.setItem('table-conditions-configs', this.conditionConfigs);
  }

  deleteTableConditionWithKey(targetKet: string): void {
    // deletes a single key value pair from the StoredTableConditions in local storage
    let obj = {};
    Object.keys(this.conditionConfigs)
      .filter(key => key !== targetKet )
      .forEach(key => obj[key] = this.conditionConfigs[key]);
    this.conditionConfigs = { ...obj };
    this.updateConditionConfigsKeyArray();
    this.localStorageService.setItem('table-conditions-configs', this.conditionConfigs);
    this.updateButtonText();
  }
}
