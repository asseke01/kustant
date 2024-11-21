import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {PopupService} from '../../../services/helper-services/popup.service';

@Component({
  selector: 'app-confirm-popup',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './confirm-popup.component.html',
  styleUrl: './confirm-popup.component.css'
})
export class ConfirmPopupComponent {
  dialogVisible = false;

  constructor(private confirmDialogService: PopupService) {
    this.confirmDialogService.getDialogState().subscribe((state) => {
      this.dialogVisible = state;
    });
  }

  onCancel(): void {
    this.confirmDialogService.closeDialog();
  }

  onConfirm(): void {
    this.confirmDialogService.confirm();
  }
}
