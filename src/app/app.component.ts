import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AlertComponent} from './components/helpers/alert/alert.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'testant';
}
