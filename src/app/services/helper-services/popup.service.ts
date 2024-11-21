import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  private dialogState = new BehaviorSubject<boolean>(false);
  private confirmCallback: () => void = () => {};

  openDialog(confirmCallback: () => void): void {
    this.confirmCallback = confirmCallback;
    this.dialogState.next(true);
  }

  closeDialog(): void {
    this.dialogState.next(false);
  }

  confirm(): void {
    this.confirmCallback();
    this.closeDialog();
  }

  getDialogState(): Observable<boolean> {
    return this.dialogState.asObservable();
  }
}
