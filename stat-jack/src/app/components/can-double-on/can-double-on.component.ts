import { Component, Input, OnInit } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'can-double-on',
  templateUrl: './can-double-on.component.html',
  styleUrls: ['./can-double-on.component.scss']
})
export class CanDoubleOnComponent implements OnInit {

  @Input() first2Cards: any;
  @Input() DS21: any;
  @Input() DS21A: any;
  @Output() updateTableConfigByConditionKey = new EventEmitter<any>();

  first2CardsKeys: string[] = [];
  aceKeys: string[] = [];
  nonAceKeys: string[] = [];

  constructor() { }

  ngOnInit(): void {
    this.first2CardsKeys = Object.keys(this.first2Cards);
    this.aceKeys = this.first2CardsKeys.filter(key => key.charAt(0) === "A");
    this.nonAceKeys = this.first2CardsKeys.filter(key => key.charAt(0) !== "A");
  }

  handleDoubleOnChange(parentKey: string, key: string) {
    this.updateTableConfigByConditionKey.emit([parentKey, this[key]]);
  }
}