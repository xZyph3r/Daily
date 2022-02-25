import { Component, OnInit, } from '@angular/core';
import * as moment from 'moment';
import { ArkTask, LostArkDetails, Tab, TypeOfList } from './ark-list';
import { MatDialog, } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { FormControl } from '@angular/forms';
import { ArkService } from './ark.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {

  title = 'Daily Checker';
  selected = new FormControl(0);
  newChar = '';
  checkedColor = 'accent';
  selectedindex = 0;


  constructor(
    public dialog: MatDialog,
    public getArkData: ArkService
  ) { }

  ngOnInit(): void {
    this.getArkData.getDailyPlanner();
  }

  getDetails(number: LostArkDetails): string {
    return LostArkDetails[number];
  }

  download() {
    let file = new Blob([JSON.stringify(this.getArkData.tabs)], { type: '.json' });
    let a = document.createElement('a');
    let url = URL.createObjectURL(file);

    a.href = url;
    a.download = moment().format('YYYY-MM-DD') + '-LostArk.json';
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }

  upload() {
    const inputElement: any = document.querySelector('#file');

    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();

      reader.readAsText(inputElement.files[0]);

      reader.onload = (e: any) => {
        this.getArkData.tabs = JSON.parse(e.target.result);
        localStorage.setItem('lostark', e.target.result);
      }
    }

  }

  getList(number: TypeOfList): ArkTask[] {
    return this.getArkData.ArkData.filter((task: ArkTask) => task.type === number);
  }

  openDialog(task: ArkTask) {
    this.dialog.open(DialogComponent, {
      data: task
    });
  }

  addChar() {
    this.getArkData.tabs.push({
      date: moment(),
      name: this.newChar,
      list: [this.getList(2), this.getList(3)]
    });
    this.getArkData.save();
    this.newChar = '';
    this.selected.setValue(this.getArkData.tabs.length - 1);
  }

  removeTab(index: number) {
    this.getArkData.tabs.splice(index, 1);
  }


}
