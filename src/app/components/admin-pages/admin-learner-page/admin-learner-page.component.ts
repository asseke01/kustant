import {Component, inject, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {NgForOf} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

@Component({
  selector: 'app-admin-learner-page',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    NgForOf,
    ReactiveFormsModule
  ],
  templateUrl: './admin-learner-page.component.html',
  styleUrl: './admin-learner-page.component.css'
})
export class AdminLearnerPageComponent {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(this.dialogTemplate, {
      width: '90%',
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

}
