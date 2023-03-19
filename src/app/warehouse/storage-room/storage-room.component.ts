import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { AppConfig, ConfigService } from 'src/app/config.service';
import { I18nService } from 'src/app/i18n.service';
import { WarehouseItem, WarehouseRoom, WarehouseSpace } from 'src/app/if';
import { SettingsService } from 'src/app/user/settings/settings.service';
import { FormatService } from 'src/app/utils/format.service';

@Component({
  selector: 'app-storage-room',
  templateUrl: './storage-room.component.html',
  styleUrls: ['./storage-room.component.scss']
})
export class StorageRoomComponent implements OnInit {

  room: WarehouseRoom | null = null;
  roomid: number | null = null;
  roomFormgroup = new FormGroup({
    name: new FormControl('', Validators.required),
    icon: new FormControl(''),
  });
  spaces: { [key: number]: WarehouseSpace } = {};
  spacesOpened: number[] = [];
  currentSpaceId: number | null = null;
  currentSpaceItems: WarehouseItem[] | null = null;
  subs: Subscription[] = [];

  constructor(private authService: AuthService,
    private configService: ConfigService,
    private i18nService: I18nService,
    public router: Router,
    private route: ActivatedRoute,
    private settings: SettingsService,
    public formatService: FormatService) {
    this.subs.push(this.settings.warehouseRooms$.subscribe((rooms) => this.loadRoomData()));
    this.subs.push(this.settings.warehouseSpaces$.subscribe((spaces) => {
      if (spaces !== null) {
        this.spaces = spaces;
        this.loadSpaceItems();
      }
    }));
    this.subs.push(route.params.subscribe((params) => {
      if (params['roomid']) {
        this.roomid = +params['roomid'];
        this.loadRoomData();
      }
    }));
    this.subs.push(route.queryParams.subscribe((params) => {
      this.spacesOpened = params['route'] != undefined ? (<string>params['route']).split(',').map(Number) : [];
      this.currentSpaceId = params['space'] != undefined ? <number>params['space'] : null;
      this.loadSpaceItems();
    }));
  }

  get config(): AppConfig {
    return this.configService.config;
  }

  getSpaceIdRoute(space: WarehouseSpace): number[] {
    let items: number[] = space.parentid === null ? [] : this.getSpaceIdRoute(this.spaces[space.parentid]);
    items.push(space.id);
    return items;
  }

  getSpaceQueryParam(space: WarehouseSpace): string {
    let items = this.getSpaceIdRoute(space);
    return items.map(String).join(',');
  }

  i18n(key: string, params: string[] = []): string {
    return this.i18nService.i18n(key, params);
  }

  loadRoomData(): void {
    if (this.roomid != null) {
      this.room = this.settings.getWarehouseRoom(this.roomid);
      if (this.room != null) {
        this.roomFormgroup.setValue({ name: this.room.name, icon: this.room.icon });
      }
      else {
        this.roomFormgroup.setValue({ name: '', icon: '' });
      }
    }
  }

  loadSpaceItems(): void {
    this.currentSpaceItems = null;
    if (this.currentSpaceId == null || this.spaces[this.currentSpaceId] == undefined)
      return;
    this.settings.loadWarehouseItems(this.spaces[this.currentSpaceId]).subscribe((reply) => {
      if (reply == true || reply == false)
        return;
      this.currentSpaceItems = <WarehouseItem[]>reply;
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.settings.loadWarehouseEntities();
  }

  onSortSpaces(event: CdkDragDrop<string[]>): void {

  }

  onSubmitRoom(): void {

  }

}
