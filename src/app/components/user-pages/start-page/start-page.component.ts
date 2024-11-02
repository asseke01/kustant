import {Component, inject, OnInit} from '@angular/core';
import {NgClass} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {NavBarComponent} from '../../helpers/navbar/nav-bar.component';
import {AuthService} from '../../../services/auth-services/auth.service';

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
export class StartPageComponent implements OnInit {

  private authService = inject(AuthService)
  private router = inject(Router);


  ngOnInit() {
    this.navigateIfNotAuthorized()
  }

  navigateIfNotAuthorized() {
    const token = this.authService.getToken()
    if(token){
      this.router.navigate(['main']);
    }
  }

}
