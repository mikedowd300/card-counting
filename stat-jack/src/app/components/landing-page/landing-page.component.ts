import { Component, OnInit } from '@angular/core';
import { StrategyChartTypes, ModalContent } from "../../models/models"
import { StatJackService } from './../../services/stat-jack.service';

@Component({
  selector: 'landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  public chartTypes: StrategyChartTypes[] = [
    {
      name: "Spreading Bets", 
      view: ModalContent.BET_SPREAD_CHART_MAKER,
      description: "Create a bet spread strategy",
    }, 
    {
      name: "Play Decisions", 
      view: ModalContent.PLAY_CHART_MAKER,
      description: "Create a strategy chart for your play",
    }, 
    {
      name: "Surrender", 
      view: ModalContent.SURRENDER_CHART_MAKER,
      description: "Create a strategy chart for Surrender",
    },
    {
      name: "Insurance", 
      view: ModalContent.INSURANCE_STRATEGY,
      description: "Configure a Strategy for Accepting Insurance",
    },
    {
      name: "Unit Resizing", 
      view: ModalContent.UNIT_RESIZING_STRATEGY_MAKER,
      description: "Decide when and how to resize your betting",
    },
    {
      name: "Wonging", 
      view: ModalContent.WONG_STRATEGY,
      description: "Decide if and when to join a table and when to leave",
    },
    {
      name: "Tipping", 
      view: ModalContent.TIPPING_STRATEGY,
      description: "Determine if and when to tip",
    },
    {
      name: "Chart Spying", 
      view: ModalContent.CHART_SPYING_CONFIG,
      description: "Select the same squares from different betting strategies and compare results",
    },
    {
      name: "Cover Plays", 
      view: ModalContent.COVER_PLAYS,
      description: "Results may vary",
    },
  ];

  modalContent = ModalContent;

  constructor(public statJackService:StatJackService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  showModal(displayType: ModalContent) {
    this.statJackService.showModal$.next(true);
    this.statJackService.updateModalContent(displayType);
  }
}
