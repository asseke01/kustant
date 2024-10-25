import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {AuthService} from '../../../services/auth-services/auth.service';

@Component({
  selector: 'app-admin-side-bar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-side-bar.component.html',
  styleUrl: './admin-side-bar.component.css'
})
export class AdminSideBarComponent implements OnInit{
  private authService = inject(AuthService);
  userData:any;


  ngOnInit(): void {
    this.userData = this.authService.getUserData();
  }
}
