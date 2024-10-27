import { Component } from '@angular/core';
import {NgClass} from '@angular/common';
import {RouterLink} from '@angular/router';
import {NavBarComponent} from '../../helpers/navbar/nav-bar.component';

@Component({
  selector: 'app-start-page',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    NavBarComponent
  ],
  templateUrl: './start-page.component.html',
  styleUrl: './start-page.component.css'
})
export class StartPageComponent {


}
