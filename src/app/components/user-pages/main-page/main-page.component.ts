import {Component, inject} from '@angular/core';
import {NavBarComponent} from '../../helpers/nav-bar/nav-bar.component';
import {Router} from '@angular/router';

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
  private router = inject(Router);



  onClick(){
    this.router.navigate(['test-type']);
  }
}
