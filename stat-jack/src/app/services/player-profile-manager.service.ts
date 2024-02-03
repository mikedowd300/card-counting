import { Injectable } from '@angular/core';
import { PlayerConfig, PlayStrategyEnum, SurrenderStrategyEnum, StoredPlayerConfiguration, DisplayTypeEnum, SpreadStrategyEnum, InsuranceStrategyEnum, UnitResizingEnum, WongingEnum, TippingEnum} from './../models/models';

@Injectable({
  providedIn: 'root'
})
export class PlayerProfileManagerService {

  constructor() {}

  defaultStoredPlayerConfiguration: StoredPlayerConfiguration = {
    handle: { value : 'Default Player' },
    description: { value : 'The default player should be modified to create a new player' },
    bettingUnit: { value : 5 },
    bankroll: { value : 1000 },
    playingStrategy: { value : PlayStrategyEnum.BASIC_STRATEGY },
    betSpreadingStrategy: { value : SpreadStrategyEnum.BASIC_SPREAD },
    insuranceStrategy: { value : InsuranceStrategyEnum.ILLUSTRIOUS_18_INSURANCE}, 
    lateSurrenderStrategy: { value : SurrenderStrategyEnum.BASIC_LATE },
    earlySurrenderStrategy: { value : SurrenderStrategyEnum.ENHC_EARLY_AGAINST_ANY },
    unitResizingStrategy: { value : UnitResizingEnum.NEVER_RESIZE }, 
    coverPlayStrategy: { value : 'default' },
    wongingStrategy: { value : WongingEnum.NEVER_WONG  },
    tippingStrategy: { value : TippingEnum.NEVER_TIP },
    usesAceCount: { value : false },
  }

  public defaultPlayer: PlayerConfig = {
    handle: {
      description: 'What would you like the player to be called?',
      displayWith: DisplayTypeEnum.TEXT,
      value: null,
    },
    description: {
      description: 'Describe what makes this player unique',
      displayWith: DisplayTypeEnum.TEXTAREA,
      value: null,
    },
    bettingUnit: {
      description: 'What is this players initial betting unit. Subject to table limits',
      displayWith: DisplayTypeEnum.TEXT,
      value: null,
    }, 
    bankroll: {
      description: 'What is this players entire starting bankroll?',
      displayWith: DisplayTypeEnum.TEXT,
      value: null,
    },
    playingStrategy: {
      description: 'Select a playing strategy',
      displayWith: DisplayTypeEnum.SELECT,
      value: null,
    },
    lateSurrenderStrategy: {
      description: 'Select a late surrender strategy. This will only be relevant if surrender is allowed.',
      displayWith: DisplayTypeEnum.SELECT,
      value: null,
    },
    earlySurrenderStrategy: {
      description: 'Select an early surrender strategy. This will only be relevant if early surrender is allowed.',
      displayWith: DisplayTypeEnum.SELECT,
      value: null,
    },
    betSpreadingStrategy: { 
      description: 'Select a bet spreading strategy',
      displayWith: DisplayTypeEnum.SELECT,
      value: null 
    },
    insuranceStrategy: { 
      description: 'Select an Insurance strategy',
      displayWith: DisplayTypeEnum.SELECT,
      value: null 
    },
    unitResizingStrategy: {
      description: 'Select a unit resizing strategy',
      displayWith: DisplayTypeEnum.SELECT,
      value: null,
    },
    coverPlayStrategy: {
      description: 'Select all coverplays this player will use.',
      displayWith: DisplayTypeEnum.SELECT,
      value: null,
    },
    wongingStrategy: {
      description: 'Select a Wonging strategy for addirional hands.',
      displayWith: DisplayTypeEnum.SELECT,
      value: null,
    },
    tippingStrategy: {
      description: 'What tipping strategy will this player use?',
      displayWith: DisplayTypeEnum.SELECT,
      value: null,
    },
    usesAceCount: {
      description: 'Does this player count aces?',
      displayWith: DisplayTypeEnum.CHECK_BOX,
      value: null,
    },
  }

  hydratePlayer(sourceConfig: StoredPlayerConfiguration = this.defaultStoredPlayerConfiguration, handle: string = "Default Table Conditions"): PlayerConfig {
    let player: PlayerConfig = { ... this.defaultPlayer };
    player.handle.value = sourceConfig.handle.value as string;
    player.description.value = sourceConfig.description.value;
    player.bettingUnit.value = sourceConfig.bettingUnit.value;
    player.bankroll.value = sourceConfig.bankroll.value;
    player.playingStrategy.value = sourceConfig.playingStrategy.value;
    player.lateSurrenderStrategy.value = sourceConfig.lateSurrenderStrategy.value;
    player.earlySurrenderStrategy.value = sourceConfig.earlySurrenderStrategy.value;
    player.betSpreadingStrategy.value = sourceConfig.betSpreadingStrategy.value;
    player.insuranceStrategy.value = sourceConfig.insuranceStrategy.value;
    player.unitResizingStrategy.value = sourceConfig.unitResizingStrategy.value;
    player.coverPlayStrategy.value = sourceConfig.coverPlayStrategy.value;
    player.wongingStrategy.value = sourceConfig.wongingStrategy.value;
    player.tippingStrategy.value = sourceConfig.tippingStrategy.value;
    player.usesAceCount.value = sourceConfig.usesAceCount.value;
    return player;
  };

  createStoredPlayerConfiguration(player: PlayerConfig): StoredPlayerConfiguration {
    return {
      handle: { value: player.handle.value as string },
      description: { value: player.description.value as string },
      bettingUnit: { value: player.bettingUnit.value as number },
      bankroll: { value: player.bankroll.value as number },
      playingStrategy: { value: player.playingStrategy.value as PlayStrategyEnum },
      lateSurrenderStrategy: { value: player.lateSurrenderStrategy.value as SurrenderStrategyEnum },
      earlySurrenderStrategy: { value: player.earlySurrenderStrategy.value as SurrenderStrategyEnum },
      betSpreadingStrategy: { value: player.betSpreadingStrategy.value as SpreadStrategyEnum },
      insuranceStrategy: { value: player.insuranceStrategy.value as InsuranceStrategyEnum },
      unitResizingStrategy: { value: player.unitResizingStrategy.value as UnitResizingEnum },
      coverPlayStrategy: { value: player.coverPlayStrategy.value as string },
      wongingStrategy: { value: player.wongingStrategy.value as WongingEnum },
      tippingStrategy: { value: player.tippingStrategy.value as TippingEnum },
      usesAceCount: { value: player.usesAceCount.value as boolean },
    }
  }
}