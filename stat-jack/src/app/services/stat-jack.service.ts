import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ModalContent } from './../models/models';

@Injectable({
  providedIn: 'root'
})
export class StatJackService {

  modalContentMap = {
    [ModalContent.BET_SPREAD_CHART_MAKER]: false,
    [ModalContent.UNIT_RESIZING_STRATEGY_MAKER]: false,
    [ModalContent.CHART_SPYING_CONFIG]: false,
    [ModalContent.TABLE_CONDITIONS_MAKER]: false,
    [ModalContent.COVER_PLAYS]: false,
    [ModalContent.DATA_COLLECTOR]: false,
    [ModalContent.PLAYER_PROFILE_MAKER]: false,
    [ModalContent.PLAY_CHART_MAKER]: false,
    [ModalContent.TABLE_MAKER]: false,
    [ModalContent.INSURANCE_STRATEGY]: false,
    [ModalContent.WONG_STRATEGY]: false,
    [ModalContent.TIPPING_STRATEGY]: false,
    [ModalContent.DATA_DISPLAY]: false,
  };

  public showModal$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() { }

  updateModalContent(newVal: ModalContent = null) {
    Object.keys(this.modalContentMap).forEach(key => this.modalContentMap[key] = false);
    if(newVal) {
      this.modalContentMap[newVal] = true;
    }
  }
}
