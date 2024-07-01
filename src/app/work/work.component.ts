import { Component } from '@angular/core';
import { environment } from 'src/environments/environment.dev';
import { NavbarItem } from '../config.service';

@Component({
  selector: 'app-work',
  templateUrl: './work.component.html',
  styleUrls: ['./work.component.scss']
})
export class WorkComponent {

  navitems: NavbarItem[] = environment.navigation.workBarItems;

}
