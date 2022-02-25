import { ArkTask } from './../ark-list';
import { Component, OnInit, Input } from '@angular/core';
import { LostArkDetails, Tab } from '../ark-list';
import { MatDialog, } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ArkService } from '../ark.service';

@Component({
  selector: 'app-character-tab',
  templateUrl: './character-tab.component.html',
  styleUrls: ['./character-tab.component.scss']
})

export class CharacterTabComponent implements OnInit {

  @Input('characters') public characters: Tab = {} as Tab;

  constructor(
    public dialog: MatDialog,
    public getArkData: ArkService) { }

  ngOnInit(): void {
  }

  getDetails(number: LostArkDetails): string {
    return LostArkDetails[number];
  }

  openDialog(task: ArkTask) {
    this.dialog.open(DialogComponent, {
      data: task
    });
  }

  save(): void {
    localStorage.setItem("lostark", JSON.stringify(this.getArkData.tabs));
  }

  resetCheckbox(character: ArkTask[]) {
    character.forEach(list => {
      list.checked = false;
      this.save();
    });
  }

  checkAll(character: ArkTask[]) {
    character.forEach(list => {
      list.checked = true;
      this.save();
    });
  }
}
