import { Component, OnInit } from '@angular/core';
import { TableProfileManagerService } from '../../../../services/table-profile-manager.service';
import { PlayerProfileManagerService } from '../../../../services/player-profile-manager.service'
import { StoredTableConditions, StoredTableConfig, TableConfig } from './../../../../models/models';
import { LocalStorageService } from '../../../../services/local-storage.service';

@Component({
  selector: 'table-maker',
  templateUrl: './table-maker.component.html',
  styleUrls: ['./table-maker.component.scss']
})
export class TableMakerComponent implements OnInit {
  tableConfigs: {}; 
  tableConfigsArray: string[] = [];
  tableConfig: TableConfig = null;
  tableConfigKeys: string[] = [];
  addOrEditModeButtonText: string = '';
  mode: string = "add-edit-mode"; //"delete-mode" "select-mode"
  buttonText: string = '';
  availableSeats: number[];

  storedPlayers: string[];
  players: string[];
  playerToDelete: string;

  storedTableConditions: string[];
  tableConditions: string;
  tableConditionsConfig: StoredTableConditions;

  playersSpotInfo: { spotId?: null, spotOptions?: [] } = {};

  constructor(
    private localStorageService: LocalStorageService, 
    public tableService: TableProfileManagerService,
    public playerService: PlayerProfileManagerService
  ) {}

  ngOnInit() {
    this.tableConfigs = this.localStorageService.getItem('table-configs');
    this.tableConditionsConfig = this.localStorageService.getItem('table-conditions-configs');
    if(!this.tableConfigs) {
      this.tableConfigs = { [this.tableService.defaultStoredTableConfig.title.value]: this.tableService.defaultTableConfig }
    }
    this.tableConfigsArray = [ 'Default Table', ...Object.keys(this.tableConfigs)];
    this.addOrEditModeButtonText = this.tableConfigsArray.length > 1 ? "Add or Edit" : "Add";
    this.tableConfig = this.tableService.hydrateTableConfig(this.tableService.defaultStoredTableConfig);
    this.tableConfigKeys = Object.keys(this.tableConfig).filter(key => key !== 'title');
    this.storedPlayers = this.getStoredPlayers();
    this.storedTableConditions = this.getStoredTableConditions();
    this.updateButtonText();

    console.log(this.tableConfig);
  }

  handleSelectTable({ target }) {
    this.tableConfig = this.tableService.hydrateTableConfig(this.tableConfigs[target.value]);
    this.playerToDelete = null;
    this.updateButtonText();
  }

  handleTableCTA({ target }) {
    if(this.mode === "add-edit-mode") {
      const storedPlayer: StoredTableConfig = 
        this.tableService.createStoredTableConfig(this.tableConfig);
      this.updateTableConfigs(this.tableConfig.title.value as string, storedPlayer);
      this.tableConfigKeys = Object.keys(this.tableConfig).filter(key => key !== 'title');
    }
    if(this.mode === "delete-mode") {
      console.log('WIP');
    }
    if(this.mode === "select-mode") {
      console.log('WIP');
    }
  }

  updateTableConfigs(key: string, storedTable: StoredTableConfig): void {
    this.tableConfigs[key] = storedTable;
    this.localStorageService.setItem('table-configs', this.tableConfigs);
  }

  selectMode(mode: string): void {
    if(!(this.mode === mode)) {
      this.mode = mode;
    }
    this.updateButtonText();
  }

  handleTitleChange({ target }) {
    this.updateButtonText();
  }

  updateButtonText(targetConfig: string = null) {
    if(this.mode === "add-edit-mode") {
      this.buttonText = "Create new Table";
      const titles: string[] = this.tableConfigsArray
        .filter(title => title !== this.tableService.defaultStoredTableConfig.title.value)
        .map(key => this.tableConfigs[key].title.value);
      if(titles.includes(this.tableConfig.title.value as string)) {
        this.buttonText = `Save changes to ${this.tableConfig.title.value}`;
      }
      if(this.tableConfig.title.value === this.tableService.defaultStoredTableConfig.title.value) {
        this.buttonText = '';
      }
      this.calculatePlayersSpotInfo();
    }
    if(this.mode === "delete-mode") {
      // const config = this.conditionsConfigArray
      //   .filter(condition => condition !== this.conditionsService.defaultStoredTableConditions.title)[0];
      // this.buttonText = `Delete ${ targetConfig ? targetConfig : config }`;
      this.buttonText = `Delete`;
    }
    if(this.mode === "select-mode") {
      this.buttonText = "Set as player for table";
    }
  }

  getStoredPlayers(): string[] {
    const playerConfigs = this.localStorageService.getItem('player-configs');
    return [ 'Default Player', ...Object.keys(playerConfigs)];
  }

  getStoredTableConditions(): string[] {
    const conditions = this.localStorageService.getItem('table-conditions-configs');
    return [ 'Default Conditions', ...Object.keys(conditions)];
  }

  addPlayer({ target }): void {
    // Add check for full table
    // The option to add players should be hidden if there is no room on the table
    let temp: string[] = this.tableConfig.players.value as string[];
    temp.push(target.value);
    this.tableConfig.players.value = [ ...temp ];
    const spotId = this.getOpenSpot(temp.filter(p => p !== target.value));
    this.playersSpotInfo[target.value] = { spotId, spotOptions: [] };
    this.updatePlayersSpotInfo({ value: spotId}, target.value);
  }

  getOpenSpot(players: string[]): number {
    if(players.length === 0) {
      return 1;
    }
    let seatIds = [];
    console.log(this.tableConfig.tableConditions.value);
    const seatCount: number =  
    this.tableConditionsConfig[this.tableConfig.tableConditions.value as string].spotsPerTable.value;
    for(let s = 1; s <= seatCount; s++) {
      seatIds.push(s);
    }
    const takenSpots = players.map(p => this.playersSpotInfo[p].spotId);
    return seatIds.find(s => !takenSpots.includes(s));
  }

  setPlayerToDelete({ target }): void {
    this.playerToDelete = target.value;
  }

  deletePlayer(): void {
    // Only a single instance of the players name should be deleted
    // temps are used because of typing issues with this.tableConfig.players.value
    let tempPlayers: string[] = this.tableConfig.players.value as string[];
    let tempPlayers2: string[] = [];
    tempPlayers.forEach(tp => {
      if(tp === this.playerToDelete) {
        this.playerToDelete = null;
      } else {
        tempPlayers2.push(tp);
      }
    });
    this.tableConfig.players.value = [ ...tempPlayers2 ];
  }

  calculatePlayersSpotInfo(): void { 
    if(this.tableConfig.tableConditions.value !== 'default') { 
      let spotRay: number[] = [];

      const seatCount: number =  
        this.tableConditionsConfig[this.tableConfig.tableConditions.value as string]?.spotsPerTable.value;

      const takenSpots: number[] = (this.tableConfig.players.value as string[])
        .map(handle => this.tableConfig.playerSpotMap[handle]);

      for(let i = 1; i <= seatCount; i++) {
        spotRay.push(i);
      }

      (this.tableConfig.players.value as string[]).forEach(handle => {
        const filteredtakenSpots: number [] = 
          takenSpots.filter(spot => spot !== this.tableConfig.playerSpotMap[handle]);
        this.playersSpotInfo[handle] = {
          spotId: this.tableConfig.playerSpotMap[handle],
          spotOptions: [ ...spotRay ].filter(spot => !filteredtakenSpots.includes(spot))
        }
      });
    }
  }

  updatePlayersSpotInfo({ value }, handle: string): void {
    console.log(value, handle);
    this.tableConfig.playerSpotMap[handle] = parseInt(value);
    this.calculatePlayersSpotInfo();
  }
}