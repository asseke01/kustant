import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AlertComponent} from './components/helpers/alert/alert.component';
import {ConfirmPopupComponent} from './components/helpers/confirm-popup/confirm-popup.component';
import {LoaderComponent} from './components/helpers/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent, ConfirmPopupComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'testant';
}
