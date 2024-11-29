import {Component, inject, OnInit} from '@angular/core';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from '../../../services/auth-services/auth.service';

@Component({
  selector: 'app-analytics-sidebar',
  standalone: true,
    imports: [
        RouterLink,
        RouterLinkActive
    ],
  templateUrl: './analytics-sidebar.component.html',
  styleUrl: './analytics-sidebar.component.css'
})
export class AnalyticsSidebarComponent implements OnInit{
  private authService = inject(AuthService);
  userData:any;


  ngOnInit(): void {
    this.userData = this.authService.getUserData();
  }
}
