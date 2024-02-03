import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../../services/local-storage.service';
import { StoredTableConfig, TableObj, PlayerObj, SurrenderTypesEnum } from 'src/app/models/models';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { BlackjackEngineService } from '../../../../blackjack-game-engine/bge.service'
   
@Component({
  selector: 'data-collector',
  templateUrl: './data-collector.component.html',
  styleUrls: ['./data-collector.component.scss']
})
export class DataCollectorComponent implements OnInit {

  tableConfigs: any;
  tableKeys: string[];
  selectedTableName: string = '';
  tableConfig: StoredTableConfig;
  tableObj: TableObj = new TableObj();
  tableComplete$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  iterationSelected$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  showStartButton$: Observable<boolean>;
  simulationStarted$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  tableConditionConfigs: any;
  tableConditionKeys: string[];
  selectedConditionsTitle: string;
  tableConditionsConfig: StoredTableConfig;
  playerConfigsObj: {};
  playerConfigs: any[] = [];
  selectedPlayerNames: string[] = [];
  useInput: boolean = false;
  tableSpots: any[] = [];
  surrenderRule: string;

  iterationOptions: any[] = [ 1, 5, 10, 100, 1000, 10000, 50000, 100000, 1000000, 'Other' ];
  surrenderRules: {} = {
    [SurrenderTypesEnum.NO_SURRENDER]: 'No Surrender',
    [SurrenderTypesEnum.EARLY_AGAINST_ANY]: 'Early Surrender is allowed against any upcard',
    [SurrenderTypesEnum.EARLY_AGAINST_10_DOWN]: 'Early Surrender is allowed against 10s or less',
    [SurrenderTypesEnum.LATE]: 'Late surrender is allowed',
  };

  constructor(private localStorageService: LocalStorageService, private bje: BlackjackEngineService) {}

  ngOnInit() {
    this.tableConfigs = this.localStorageService.getItem('table-configs');
    this.tableConditionConfigs = this.localStorageService.getItem('table-conditions-configs');
    this.playerConfigsObj = this.localStorageService.getItem('player-configs');
    this.tableKeys = Object.keys(this.tableConfigs).filter(key => key !== 'title');
    this.tableConditionKeys = Object.keys(this.tableConditionConfigs).filter(key => key !== 'title');
    this.showStartButton$ = combineLatest([
        this.tableComplete$, 
        this.iterationSelected$, 
        this.simulationStarted$
      ])
      .pipe(map(([table, iterations, simulationStarted]) => table && iterations && !simulationStarted));
  }

  handleSelectTable({ value }) {
    this.selectedTableName = value;
    this.tableConfig = this.tableConfigs[value];
    this.selectedConditionsTitle = this.tableConfig.tableConditions.value;
    this.tableConditionsConfig = this.tableConditionConfigs[this.selectedConditionsTitle]
    this.selectedPlayerNames = this.tableConfig.players.value;
    this.selectedPlayerNames.forEach(name => this.playerConfigs.push(this.playerConfigsObj[name]));
    this.tableComplete$.next(true);
    this.createTableObj();
    this.setTableSpots();
  }

  setTableSpots() {
    this.tableSpots = [];
    const spotCount: number = this.tableObj.conditions.spotsPerTable;
    const takenSpots = this.tableObj.players.map(({ handle }) => this.tableObj.playerSpotMap[handle]);
    let takenByMap = {};
    this.tableObj.players.forEach(({ handle }) => takenByMap[this.tableObj.playerSpotMap[handle]] = handle );
    for(let i = 0; i <= spotCount; i++) {
      if(takenSpots.includes(i)) {
        const player = this.tableObj.players.find(p => p.handle === takenByMap[i]);
        this.tableSpots.push(player);
      } else {
        this.tableSpots.push(null)
      }
    }
    this.tableSpots.shift();
  }

  createTableObj() {
    this.tableObj.players = [];
    for(let condition in this.tableConditionsConfig) {
      if(condition === 'DA2') {
        this.tableObj.conditions[condition] = { 
          ...this.tableConditionsConfig[condition],
          DS21: this.tableConditionsConfig['DA2'].DS21.value,
          DS21A: this.tableConditionsConfig['DA2'].DS21A.value    
        };
        Object.keys(this.tableConditionsConfig['DA2'].canOnlyDoubleOn).forEach(key => {
          this.tableObj.conditions['DA2'].canOnlyDoubleOn[key] = this.tableConditionsConfig['DA2'].canOnlyDoubleOn[key];
        })
      } else {
        this.tableObj.conditions[condition] = this.tableConditionsConfig[condition].value;
      }
    }

    for(let player of this.playerConfigs) {
      let playerObj: PlayerObj= new PlayerObj();
      for(let property in player) {
        playerObj[property] = player[property].value;
      }
      playerObj.bettingUnit = this.adjustPlayerBettingUnit(playerObj);
      this.tableObj.players.push(playerObj);
    } 
    this.tableObj.title = this.selectedTableName;
    this.tableObj.playerSpotMap = this.tableConfig.playerSpotMap;
  }

  toggleUseInput() {
    this.useInput = !this.useInput;
  }

  handleSelectIterationOption({ value }) {
    if(value === 'Other') {
      this.toggleUseInput();
    } else {
      this.tableObj.iterations = value;
      this.iterationSelected$.next(true);
    }
  }

  handleIterationsInput({ value }) {
    this.tableObj.iterations = value;
    this.iterationSelected$.next(true);
  }

  startHandIterations() {
    this.simulationStarted$.next(true);
    this.bje.createTable(this.tableObj);
  }

  getSurrenderString() {
    const surrenderMap = {
      [SurrenderTypesEnum.NO_SURRENDER]: 'No Surrender',
      [SurrenderTypesEnum.EARLY_AGAINST_ANY]: 'Early Surrender is allowed against any upcard',
      [SurrenderTypesEnum.EARLY_AGAINST_10_DOWN]: 'Early Surrender is allowed against 10s or less',
      [SurrenderTypesEnum.LATE]: 'Late surrender is allowed',
    };
    this.surrenderRule = surrenderMap[this.tableObj.conditions.surrender];
  }

  adjustPlayerBettingUnit({ bettingUnit, bankroll }: PlayerObj): number {
    const numBettingUnit: number = parseInt(bettingUnit.toString());
    const numBankroll: number = parseInt(bankroll.toString());
    let newBettingUnit: number = numBettingUnit;
    if(numBettingUnit < this.tableObj.conditions.minBet) {
      if(numBankroll < this.tableObj.conditions.minBet) {
        newBettingUnit = 0;
      } else {
        newBettingUnit = this.tableObj.conditions.minBet;
      }
    }
    if(numBettingUnit > numBankroll) {
      if(numBankroll > this.tableObj.conditions.minBet) {
        newBettingUnit = numBankroll
      } else {
        newBettingUnit = 0;
      }
    }
    return newBettingUnit;
  }
}




