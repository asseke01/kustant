import { Component } from '@angular/core';
import {NavBarComponent} from '../../helpers/nav-bar/nav-bar.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    NavBarComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent {

}
