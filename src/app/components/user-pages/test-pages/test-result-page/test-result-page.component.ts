import { Component } from '@angular/core';
import {NavBarComponent} from '../../../helpers/navbar/nav-bar.component';
import {NgForOf} from '@angular/common';
import {UserFooterComponent} from '../../user-footer/user-footer.component';

@Component({
  selector: 'app-test-result-page',
  standalone: true,
  imports: [
    NavBarComponent,
    NgForOf,
    UserFooterComponent
  ],
  templateUrl: './test-result-page.component.html',
  styleUrl: './test-result-page.component.css'
})
export class TestResultPageComponent {

}
