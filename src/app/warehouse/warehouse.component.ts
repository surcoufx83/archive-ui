import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { ApiReply } from '../if';
import { SettingsService } from '../user/settings/settings.service';
import { FormatService } from '../utils/format.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

  rooms: Room[] = [];
  spaces: { [key: number]: Space } = {};
  spacenames: { [key: string]: number } = {};

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    public router: Router,
    private userSettings: SettingsService,
    public formatService: FormatService) { }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  ngOnInit(): void {
    this.authService.queryApi('api/warehouse').subscribe((reply) => {
      if (reply.success && reply.payload != undefined && reply.payload['rooms'] != undefined && reply.payload['spaces'] != undefined) {
        const payload = <WarehouseReply>reply.payload;
        payload.rooms.forEach((room) => {
          room.urlname = room.name.replace(/\s/ig, '-');
        });
        let tempspaces: { [key: number]: Space } = {}
        let tempspacenames: { [key: string]: number } = {}
        payload.spaces.forEach((space) => {
          tempspaces[space.id] = space;
          tempspacenames[space.name] = space.id;
        });
        this.rooms = payload.rooms.sort((a, b) => a.order - b.order);
        this.spaces = tempspaces; 
        this.spacenames = tempspacenames;
      }
    });
  }

  onSortRooms(event: CdkDragDrop<string[]>) : void {
    console.log(event)
    this.rooms[event.previousIndex].order = event.currentIndex;
    moveItemInArray(this.rooms, event.previousIndex, event.currentIndex);
    this.authService.updateApi(`api/warehouse/${this.rooms[event.currentIndex].id}`, { room:  this.rooms[event.currentIndex]}).subscribe((reply) => this.updateRooms(reply));
  }

  updateRooms(reply: ApiReply) : void {
    if (reply.success && reply.payload != undefined && reply.payload['rooms'] != undefined) {
      const newrooms = <Room[]>reply.payload['rooms'];
      newrooms.forEach((newroom) => {
        newroom.urlname = newroom.name.replace(/\s/ig, '-');
        this.rooms.forEach((room, i) => {
          if (room.id === newroom.id)
            this.rooms[i] = newroom;
        });
      });
    }
  }

}

export interface WarehouseReply {
  rooms: Room[];
  spaces: Space[];
}

export interface Room {
  id: number;
  name: string;
  urlname: string;
  order: number;
  structure: Structure;
  created: string;
  updated: string;
  deleted: string | null;
}

export interface Space {
  id: number;
  key: string;
  layout: string;
  name: string;
  roomid: number;
  created: string;
  updated: string;
  deleted: string | null;
}

export interface Structure {
  key: string | null;
  layout: string | null;
  spaces: Structure[] | null;
}