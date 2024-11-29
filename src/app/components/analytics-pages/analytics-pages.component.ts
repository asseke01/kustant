import { Component } from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {AnalyticsSidebarComponent} from './analytics-sidebar/analytics-sidebar.component';

@Component({
  selector: 'app-analytics-pages',
  standalone: true,
  imports: [
    RouterOutlet,
    AnalyticsSidebarComponent
  ],
  templateUrl: './analytics-pages.component.html',
  styleUrl: './analytics-pages.component.css'
})
export class AnalyticsPagesComponent {

}
