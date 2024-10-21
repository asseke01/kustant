import {Component, inject, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormsModule} from '@angular/forms';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-admin-employee-page',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatIconButton,
    MatIcon,
    FormsModule,
    NgForOf
  ],
  templateUrl: './admin-employee-page.component.html',
  styleUrl: './admin-employee-page.component.css'
})
export class AdminEmployeePageComponent {
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

  subjects: Array<{ name: string }> = [
    { name: 'math' }
  ];

  addSubject() {
    this.subjects.push({ name: '' });
  }

  removeSubject(index: number) {
    this.subjects.splice(index, 1);
  }

}
