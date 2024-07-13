import { Injectable } from '@angular/core';
import { Table } from './table';
import { TableObj } from '../models/models';
import { BustBonusService } from '../services/bust-bonus.service';

@Injectable({
  providedIn: 'root',
})

export class BlackjackEngineService {

  table: Table;
  
  constructor() {}

  createTable(tableObj: TableObj, bustBonusService: BustBonusService) {
    this.table = new Table(tableObj, bustBonusService);
  }
}