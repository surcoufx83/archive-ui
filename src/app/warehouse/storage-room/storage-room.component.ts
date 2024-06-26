import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { I18nService } from 'src/app/i18n.service';
import { WarehouseItem, WarehouseRoom, WarehouseSpace } from 'src/app/if';
import { FormatService } from 'src/app/utils/format.service';
import { SettingsService } from 'src/app/utils/settings.service';
import { environment } from 'src/environments/environment.dev';

@Component({
  selector: 'app-storage-room',
  templateUrl: './storage-room.component.html',
  styleUrls: ['./storage-room.component.scss']
})
export class StorageRoomComponent implements OnInit {

  currentFixedCols: number[] = [];
  currentFixedRows: number[] = [];
  currentSpaceId: number | null = null;
  icons = environment.icons;
  room: WarehouseRoom | null = null;
  roomFormgroup = new FormGroup({
    name: new FormControl('', Validators.required),
    icon: new FormControl('')
  });
  roomid: number | null = null;
  spaces: { [key: number]: WarehouseSpace } = {};
  spacesOpened: number[] = [];
  subs: Subscription[] = [];

  constructor(
    private i18nService: I18nService,
    private route: ActivatedRoute,
    private settings: SettingsService,
    public formatService: FormatService,
    public router: Router,
  ) { }

  getSpaceIdRoute(space: WarehouseSpace): number[] {
    let items: number[] = space.parentid === null ? [] : this.getSpaceIdRoute(this.spaces[space.parentid]);
    items.push(space.id);
    return items;
  }

  getSpaceItem(space: WarehouseSpace, row: number, col: number): WarehouseItem | undefined {
    return space.items?.fixed[`${row},${col}`] ?? {
      id: 0, created: '', deleted: null, description: '',
      fixed: { row: row, col: col }, icon: 'fa-solid fa-question',
      name: '', order: 0, spaceid: this.currentSpaceId!, updated: '',
      externalUrl: ''
    };
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
        this.loadRoomItems();
      }
      else {
        this.roomFormgroup.setValue({ name: '', icon: '' });
      }
    }
  }

  loadRoomItems(): void {
    if (this.room == null)
      return;
    this.subs.push(this.settings.loadWarehouseItems(this.room).subscribe((reply) => {
      if (reply == true || reply == false)
        return;
      Object.keys(this.spaces).forEach((key) => {
        this.spaces[+key].items = {
          default: [],
          fixed: {},
          fixedCols: this.spaces[+key].layout === 'fixed' ? Array(this.spaces[+key].fixed!.cols).fill(0).map((x, i) => i) : undefined,
          fixedRows: this.spaces[+key].layout === 'fixed' ? Array(this.spaces[+key].fixed!.rows).fill(0).map((x, i) => i) : undefined,
        };
      });
      (<WarehouseItem[]>reply).forEach((item) => {
        if (this.spaces[item.spaceid] == undefined)
          console.error('SpaceId from Id is not available in room?');
        else {
          if (this.spaces[item.spaceid].layout === 'fixed')
            this.spaces[item.spaceid].items!.fixed[`${item.fixed.row},${item.fixed.col}`] = item;
          else
            this.spaces[item.spaceid].items!.default.push(item);
        }
      });
      console.log(this.spaces);
    }));
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.subs.push(this.settings.warehouseRooms$.subscribe((rooms) => this.loadRoomData()));
    this.subs.push(this.settings.warehouseSpaces$.subscribe((spaces) => {
      if (spaces !== null) {
        this.spaces = spaces;
      }
    }));
    this.subs.push(this.route.params.subscribe((params) => {
      if (params['roomid']) {
        this.roomid = +params['roomid'];
        this.loadRoomData();
      }
    }));
    this.subs.push(this.route.queryParams.subscribe((params) => {
      this.spacesOpened = params['route'] != undefined ? (<string>params['route']).split(',').map(Number) : [];
      this.currentSpaceId = params['space'] != undefined ? <number>params['space'] : null;
    }));
    this.settings.loadWarehouseEntities();
  }

  onSortSpaces(event: CdkDragDrop<string[]>): void {

  }

  onSubmitRoom(): void {

  }

}
