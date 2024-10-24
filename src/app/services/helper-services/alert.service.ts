import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject = new Subject<{ message: string, type: string }>();

  alert$ = this.alertSubject.asObservable();

  success(message: string) {
    this.alertSubject.next({ message, type: 'success' });
  }

  error(message: string) {
    this.alertSubject.next({ message, type: 'error' });
  }

  info(message: string) {
    this.alertSubject.next({ message, type: 'info' });
  }

  warn(message: string) {
    this.alertSubject.next({ message, type: 'warning' });
  }

}
