import { Component, OnInit } from '@angular/core';
import { StatJackService } from './../../services/stat-jack.service';
import { ModalContent } from './../../models/models';

@Component({
  selector: 'modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  modalContent = ModalContent;

  constructor(public statJackService:StatJackService) { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  close() {
    this.statJackService.showModal$.next(false);
  }
}
