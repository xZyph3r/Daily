import * as moment from "moment";

export interface ArkTask {
    type: TypeOfList;
    title: string;
    checked: boolean;
    details: LostArkDetails[];
    description?: string;
    image: any;
}

export interface Tab {
    name: string;
    date: moment.Moment;
    list: any[];
}

export enum TypeOfList {
    'RosterDaily',
    'RosterWeekly',
    'CharDaily',
    'CharWeekly'
}

export enum LostArkDetails {
   'ilvl.302',
    'ilvl.420',
    'ilvl.460',
    'ilvl.1350',
    'Once per Char',
    '5 per day',
    'Once per day',
    'Once per week',
    'At specific times',
    'Multiple times a Day',
    '3 per day per Char',
    '3 per week per Abyss',
    'Once per week per Dungeon',
    'On weekly reset',
    'Per Boss',
    '3 per Week',
    'Per Abyss',
    'ilvl.250',
    'ilvl.340',
    'lvl.50'
}
