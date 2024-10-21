import { Component } from '@angular/core';
import {AdminSideBarComponent} from './admin-side-bar/admin-side-bar.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-admin-pages',
  standalone: true,
  imports: [
    AdminSideBarComponent,
    RouterOutlet
  ],
  templateUrl: './admin-pages.component.html',
  styleUrl: './admin-pages.component.css'
})
export class AdminPagesComponent {

}
