import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataDisplayService {

  zoomChart$: Subject<any> = new Subject<any>();

  constructor() {}
}