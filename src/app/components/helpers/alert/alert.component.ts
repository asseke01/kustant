import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {AlertService} from '../../../services/alert.service';
import {NgClass, NgIf} from '@angular/common';
import {animate, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [
    NgIf,
    NgClass
  ],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class AlertComponent implements  OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();
  private alertService = inject(AlertService)

  message: string | null = null;
  type: string = 'success';

  constructor() {}

  ngOnInit(): void {
    this.subscription = this.alertService.alert$.subscribe(alert => {
      this.message = alert.message;
      this.type = alert.type;

      setTimeout(() => {
        this.message = null;
      }, 5000);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
