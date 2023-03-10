import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { ConfigService } from '../config.service';
import { I18nService } from '../i18n.service';
import { ApiReply, WarehouseRoom, WarehouseSpace } from '../if';
import { SettingsService } from '../user/settings/settings.service';
import { FormatService } from '../utils/format.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit, OnDestroy {

  rooms: WarehouseRoom[] = [];
  spaces: { [key: number]: WarehouseSpace } = {};
  subs: Subscription[] = [];

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    public router: Router,
    private settings: SettingsService,
    public formatService: FormatService) {
    this.subs.push(this.settings.warehouseRooms$.subscribe((rooms) => {
      if (rooms !== null) {
        this.rooms = rooms;
      }
    }));
    this.subs.push(this.settings.warehouseSpaces$.subscribe((spaces) => {
      if (spaces !== null) {
        this.spaces = spaces;
      }
    }));
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }
  
  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.settings.loadWarehouseEntities();
  }

  onSortRooms(event: CdkDragDrop<string[]>): void {
    this.rooms[event.previousIndex].order = event.currentIndex;
    moveItemInArray(this.rooms, event.previousIndex, event.currentIndex);
    this.authService.updateApi(`api/warehouse/${this.rooms[event.currentIndex].id}`, { room: this.rooms[event.currentIndex] }).subscribe((reply) => this.updateRooms(reply));
  }

  updateRooms(reply: ApiReply): void {
    if (reply.success && reply.payload != undefined && reply.payload['rooms'] != undefined) {
      const newrooms = <WarehouseRoom[]>reply.payload['rooms'];
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
  rooms: WarehouseRoom[];
  spaces: WarehouseSpace[];
}
