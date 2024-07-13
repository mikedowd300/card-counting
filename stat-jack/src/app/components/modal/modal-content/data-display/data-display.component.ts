import { Component, OnInit } from '@angular/core';
import { BlackjackEngineService } from '../../../../blackjack-game-engine/bge.service';
import { Chart } from 'chart.js/auto';
import { GameHistory } from '../../../../analytics/gameHistory'
import { TableConditionsObj } from '../../../../models/models';

@Component({
  selector: 'data-display',
  templateUrl: './data-display.component.html',
  styleUrls: ['./data-display.component.scss']
})

export class DataDisplayComponent implements OnInit {
  history: GameHistory;
  playerBankrollChart: Chart;
  playerNames: string[];
  activePlayerName: string = '';
  tableConditions: TableConditionsObj;
  bankrollChartHidden: boolean = true;
  tableDataByCount: any; // shape TBD - includes data for all 3 chart types
  playerDataByCount: any;
  playerWinningsByCountChart: any;
  selectedDisplayTab: string = 'Table';

  constructor(private bje: BlackjackEngineService) {}

  ngOnInit(): void {
    this.tableConditions = this.bje.table.conditions;
    this.history = this.bje.table.history;
    this.playerNames = this.history.getPlayerNames();
    this.tableDataByCount = this.history.tableDataByCount(); //V2

    // THESE ARE VALID DATA
    // this.history.resultsByCountAtEachRoundOfShoe();
    // this.history.getLosingStreaksByPlayer('Mike');
    // this.history.getLosingStreaksByPlayer('Megan');
  }

  // switchTableData() {
  //   this.bankrollChartHidden = !this.bankrollChartHidden;
  // }

  // handleSelectActivePlayer() {
  //   this.getPlayerInfo(this.activePlayerName);
  //   if(!this.playerWinningsByCountChart) {
  //     this.playerWinningsByCountChart = this.history.playerWinningsByCount(this.activePlayerName);
  //   }
  //   this.bankrollChartHidden = false;
  // }

  getPlayerInfo(playerName) {
    if (this.playerBankrollChart != undefined) {
      this.playerBankrollChart.destroy();
    }
    const playerBankRollDataSet = this.history.getPlayersBankrollHistory(playerName);
    // console.log(playerBankRollDataSet);
    const myLabels = playerBankRollDataSet.map(x => '');
    const data = {
      labels: myLabels,
      datasets: [{
        label: `${playerName}'s Bankroll History`,
        data: playerBankRollDataSet,
        fill: false, 
        borderColor: 'red',
        tension: 0.1
      }],
    };
    const options = {
      scales: {
        x: { grid: { drawOnChartArea: false } },
        y: { grid: { drawOnChartArea: false } }
      }
    };

    this.playerBankrollChart = new Chart("player-bankroll-chart", { type: 'line', data, options });

    // console.log(this.playerBankrollChart);
  }

  /*
    Clicking a tab will
    (1) Un-highlite the previously selected tab
    (2) Highlite the selected tab
    (3) Display the data relevant to the tab name 
    (either a player or the entire table)
  */
  handleTabSelection(name, e) {
    document.querySelector('.tabs button.selected')?.classList.remove('selected');
    e.target.classList.add('selected');
    this.selectedDisplayTab = name;
    this.playerDataByCount = this.history.playerDataByCount(name);
    if(name != 'Table') {
      this.getPlayerInfo(name);
    }
  }
}