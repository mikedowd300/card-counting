import { Component, OnInit } from '@angular/core';
import { PlayerProfileManagerService } from '../../../../services/player-profile-manager.service';
import { InsuranceStrategyEnum, PlayerConfig, PlayStrategyEnum, SpreadStrategyEnum, StoredPlayerConfiguration, SurrenderStrategyEnum } from './../../../../models/models';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { PlayChartMakerService } from 'src/app/services/play-chart-maker.service';
import { BetSpreadService } from 'src/app/services/bet-spread.service';
import { InsuranceService } from 'src/app/services/insurance.service';
import { UnitResizingService } from 'src/app/services/unit-resizing.service';
import { WongingService } from 'src/app/services/wonging.service';
import { TippingService } from 'src/app/services/tipping.service';

@Component({
  selector: 'player-maker',
  templateUrl: './player-maker.component.html',
  styleUrls: ['./player-maker.component.scss']
})
export class PlayerMakerComponent implements OnInit {

  playerConfigs: any; // This is an object with key value pairs, the valus is a StoredPlayerConditions
  playerConfigsArray: string[] = [];
  playerConfig: PlayerConfig = null;
  playerConfigKeys: string[] = [];
  originalConfig: PlayerConfig = null;
  addOrEditModeButtonText: string = '';
  mode: string = "add-edit-mode"; //"delete-mode" "select-mode"
  buttonText: string = '';

  playStrategies: (PlayStrategyEnum | string)[] = [];
  selectedPlayStrategy: string = '';

  lateSurrenderStrategies: (SurrenderStrategyEnum | string)[] = [];
  selectedLateSurrenderStrategy: string = '';

  earlySurrenderStrategies: (SurrenderStrategyEnum | string)[] = [];
  selectedEarlySurrenderStrategy: string = '';

  betSpreadingStrategies: (SpreadStrategyEnum | string)[];
  selectedBetSpreadingStrategy: string = '';

  insuranceStrategies: ( InsuranceStrategyEnum | string)[];
  selectedInsuranceStrategy: string = '';

  coverPlayStrategies: null;
  coverPlayStrategiesArray: string[] = [];
  selecteCoverPlayStrategy: string = '';

  usesAceCount: null;
  selectedUsesAceCount: boolean = null;

  constructor(
    private localStorageService: LocalStorageService,
    private playChartService: PlayChartMakerService,
    private betSpreadService: BetSpreadService,
    private insuranceService: InsuranceService,
    public playerService: PlayerProfileManagerService,
    public unitResizingService: UnitResizingService,
    public wongingService: WongingService,
    public tippingService: TippingService,
  ) {}

  ngOnInit() {
    this.playerConfigs = this.localStorageService.getItem('player-configs');
    if(!this.playerConfigs) {
      this.playerConfigs = { [this.playerService.defaultStoredPlayerConfiguration.handle.value]: this.playerService.defaultPlayer }
    }
    this.playerConfigsArray = [ 'Default Player', ...Object.keys(this.playerConfigs) ];
    
    this.addOrEditModeButtonText = this.playerConfigsArray.length > 0 ? "Add or Edit" : "Add";
    this.playStrategies = [
      PlayStrategyEnum.BASIC_STRATEGY, 
      PlayStrategyEnum.ENHC_BASIC_STRATEGY,
      PlayStrategyEnum.ILLUSTRIOUS_18_H17, 
      PlayStrategyEnum.ILLUSTRIOUS_18_S17, 
      PlayStrategyEnum.ALL_DEVIATIONS_H17,
      ...this.playChartService.customPlayStrategyKeys
    ];
    this.lateSurrenderStrategies = [
      SurrenderStrategyEnum.BASIC_LATE,
      SurrenderStrategyEnum.ENHC_BASIC_LATE,
      SurrenderStrategyEnum.LATE_H17_SINGLE_DECK,
      SurrenderStrategyEnum.LATE_S17_SINGLE_DECK,
      SurrenderStrategyEnum.LATE_H17_DOUBLE_DECK,
      SurrenderStrategyEnum.LATE_S17_DOUBLE_DECK,
      SurrenderStrategyEnum.LATE_H17_4_OR_MORE_DECKS,
      SurrenderStrategyEnum.LATE_S17_4_OR_MORE_DECKS,
      SurrenderStrategyEnum.LATE_H17_4_OR_MORE_DECKS_WITH_DEVIATIONS,
      SurrenderStrategyEnum.LATE_S17_4_OR_MORE_DECKS_WITH_DEVIATIONS,
    ];

    this.earlySurrenderStrategies = [
      SurrenderStrategyEnum.ENHC_EARLY_AGAINST_ANY,
      SurrenderStrategyEnum.ENHC_EARLY_AGAINST_10_OR_LESS,
      SurrenderStrategyEnum.ENHC_EARLY_AGAINST_ANY_WITH_DEVIATIONS,
    ],

    this.betSpreadingStrategies = this.betSpreadService.chartKeys;
    this.insuranceStrategies = this.insuranceService.strategyKeys;

    this.coverPlayStrategies = this.localStorageService.getItem('cover-play-configs');
    if(!this.coverPlayStrategies) {
      localStorage.setItem('cover-play-configs',JSON.stringify({}))
      this.coverPlayStrategies = this.localStorageService.getItem('cover-play-configs');
    }
    this.coverPlayStrategiesArray = Object.keys(this.coverPlayStrategies );

    this.playerConfig = this.playerService.hydratePlayer(this.playerService.defaultStoredPlayerConfiguration);
    this.playerConfigKeys = Object.keys(this.playerConfig).filter(key => key !== 'handle');
    
    this.updateButtonText();
  }

  handleSelectPlayer({ target }) {
    this.playerConfig = this.playerService.hydratePlayer(this.playerConfigs[target.value]);
    this.updateButtonText();
  }

  handlePlayerCTA({ target }) {
    if(this.mode === "add-edit-mode") {
      const storedPlayer: StoredPlayerConfiguration = this.playerService.createStoredPlayerConfiguration(this.playerConfig);
      this.updatePlayerConfigs(this.playerConfig.handle.value as string, storedPlayer);
      this.playerConfigKeys = Object.keys(this.playerConfig).filter(key => key !== 'handle');
    }
  }

  updatePlayerConfigs(key: string, storedPlayer: StoredPlayerConfiguration): void {
    this.playerConfigs[key] = storedPlayer;
    this.localStorageService.setItem('player-configs', this.playerConfigs);
  }

  selectMode(mode: string): void {
    if(!(this.mode === mode)) {
      this.mode = mode;
    }
    this.updateButtonText();
  }

  handleHandleChange({ target }) {
    this.updateButtonText();
  }

  updateButtonText(targetConfig: string = null) {
    if(this.mode === "add-edit-mode") {
      this.buttonText = "Create new Player";
      const handles: string[] = this.playerConfigsArray
        .filter(handle => handle !== this.playerService.defaultStoredPlayerConfiguration.handle.value)
        .map(key => this.playerConfigs[key].handle.value);
      if(handles.includes(this.playerConfig.handle.value as string)) {
        this.buttonText = `Save changes to ${this.playerConfig.handle.value}`;
      }
      if(this.playerConfig.handle.value === this.playerService.defaultStoredPlayerConfiguration.handle.value) {
        this.buttonText = '';
      }
    }
  }
}




