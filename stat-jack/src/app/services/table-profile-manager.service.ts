import { Injectable } from '@angular/core';
import { DisplayTypeEnum, StoredTableConfig, TableConfig } from './../models/models';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TableProfileManagerService {

  defaultStoredTableConfig: StoredTableConfig = {
    title: { value: 'Default Table' },
    players: { value: [] },
    tableConditions: { value: 'default' },
    playerSpotMap: { },
  };

  defaultTableConfig: TableConfig = {
    title: { value: ''},
    players: {
      description: 'Add or delete players',
      displayWith: DisplayTypeEnum.SELECT,
      value: null,
    },
    tableConditions: {
      description: 'Set the table conditions you want',
      displayWith: DisplayTypeEnum.SELECT,
      value: null,
    },
    playerSpotMap: { },
  };

  constructor(private localStorageService: LocalStorageService) {}

  hydrateTableConfig(sourceConfig: StoredTableConfig = this.defaultStoredTableConfig): TableConfig {
    let tableConfig = { ... this.defaultTableConfig };
    tableConfig.title.value = sourceConfig.title.value;
    tableConfig.players.value = [ ...sourceConfig.players.value ] || [ ...this.defaultStoredTableConfig.players.value ];
    tableConfig.tableConditions.value = sourceConfig.tableConditions.value || this.defaultStoredTableConfig.tableConditions.value;
    tableConfig.playerSpotMap = { ...sourceConfig.playerSpotMap };

    return tableConfig;
  }

  createStoredTableConfig(config: TableConfig): StoredTableConfig {
    let playerSpotMap = { };
    (config.players.value as string[])
      .forEach(player => playerSpotMap[player] = config.playerSpotMap[player]);

    return {
      title: { value: config.title.value as string },
      players: { value: [ ...config.players.value as string[]] }, 
      tableConditions: { value: config.tableConditions.value as string }, 
      playerSpotMap,
    }
  }
}