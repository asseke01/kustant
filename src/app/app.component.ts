import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AlertComponent} from './components/helpers/alert/alert.component';
import {ConfirmPopupComponent} from './components/helpers/confirm-popup/confirm-popup.component';
import {LoaderComponent} from './components/helpers/loader/loader.component';
import {LoaderService} from './services/helper-services/loader.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AlertComponent, ConfirmPopupComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  private loaderService = inject(LoaderService)
  title = 'testant';

  ngOnInit(): void {
    const isFirstVisit = localStorage.getItem('hasVisited');

    if (!isFirstVisit) {
      this.loaderService.show();

      setTimeout(() => {
        this.loaderService.hide();
        localStorage.setItem('hasVisited', 'true');
      }, 4300);
    }
  }
}
