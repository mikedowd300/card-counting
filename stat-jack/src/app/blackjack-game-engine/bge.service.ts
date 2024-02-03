import { Injectable } from '@angular/core';
import { Table } from './table';
import { TableObj } from '../models/models';

@Injectable({
  providedIn: 'root',
})

export class BlackjackEngineService {

  table: Table;

  constructor() {}

  createTable(tableObj: TableObj) {
    this.table = new Table(tableObj);
  }
}