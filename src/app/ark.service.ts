import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ArkTask, LostArkDetails, Tab, TypeOfList } from "./ark-list";
import * as moment from "moment-timezone";

@Injectable({
  providedIn: "root",
})
export class ArkService {
  ArkData: ArkTask[] = [];
  tabs: Tab[] = [];
  storage = localStorage.getItem("lostark");
  weeklyString: string = "";
  dailyString: string = "";

  constructor(private http: HttpClient) {
    this.countdown();
  }

  countdown() {
    const x = setInterval(() => {
      const nextReset = moment().isoWeekday(4);
      const format = nextReset.format("YYYY-MM-DD");
      const time = "11:00";
      const distance = moment(format + " " + time).diff(
        moment(), "milliseconds"
      );

      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      this.weeklyString = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      this.dailyString = `${hours}h ${minutes}m ${seconds}s`;

      this.checkcurrentDate(format, time);
    }, 1000);
  }

  checkcurrentDate(resetDate: string, resetTime: string) {
    this.tabs.forEach((character) => {
      //TODO: zimezone missing

      let minutes = moment().diff(
        moment(moment(character.date).format("YYYY-MM-DD") + " " + resetTime),
        "minutes"
      );

      if (minutes >= 0) {
        resetDate = "2022-02-22";

        let weeklyMinutes = moment(resetDate + " " + resetTime).diff(
          moment(moment(character.date).format("YYYY-MM-DD") + " " + resetTime),
          "minutes"
        );

        character.list.forEach((list: ArkTask[]) => {
          if (
            list[0].type === 0 || (list[0].type === 1 && weeklyMinutes <= 0) || list[0].type === 2 || (list[0].type === 3 && weeklyMinutes <= 0)
          ) {
            this.resetCheckbox(list);
          }
        });
        character.date = moment().add(1, "days");
        this.save();
      }
    });
  }

  resetCheckbox(character: ArkTask[]) {
    character.forEach((list) => {
      list.checked = false;
      this.save();
    });
  }

  getDailyPlanner() {
    this.http
      .get<ArkTask[]>("./assets/dailyPlanner.json")
      .subscribe((data: ArkTask[]) => {
        this.ArkData = data;
        if (this.storage) {
          this.tabs = JSON.parse(this.storage);
        }
        this.defaultTab();
      });
  }

  defaultTab() {
    if (!this.tabs.find((tab) => tab.name === "Roster")) {
      this.tabs.push({
        date: moment(),
        name: "Roster",
        list: [this.getList(0), this.getList(1)],
      });
      this.save();
    }
  }

  getDetails(number: LostArkDetails): string {
    return LostArkDetails[number];
  }

  getList(number: TypeOfList): ArkTask[] {
    return this.ArkData.filter((task: ArkTask) => task.type === number);
  }

  save(): void {
    localStorage.setItem("lostark", JSON.stringify(this.tabs));
  }
}
