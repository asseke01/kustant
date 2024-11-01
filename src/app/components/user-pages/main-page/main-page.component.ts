import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import {NavBarComponent} from '../../helpers/navbar/nav-bar.component';
import {Router} from '@angular/router';
import {TestActionsService} from '../../../services/user-services/test-actions.service';
import {GetLearnerSubjects} from '../../../../assets/interfaces/get_learner_subjects';
import {NgForOf} from '@angular/common';
import {TestingService} from '../../../services/user-services/testing.service';
import {GetLearnerSpecifiedTests} from '../../../../assets/interfaces/get_learner_specified_tests';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {UserFooterComponent} from '../user-footer/user-footer.component';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    NavBarComponent,
    NgForOf,
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    UserFooterComponent
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit{

  private testActionsService = inject(TestActionsService);
  private testingService = inject(TestingService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  private dialogRef: MatDialogRef<any> | null = null;


  public getLearnerSubjects: GetLearnerSubjects[] = []
  public getLearnerSpecifiedTests: GetLearnerSpecifiedTests[] = []

  ngOnInit() {
    this.getLearnerSubject()
    this.getLearnerSpecifiedTest()
  }

  private getLearnerSubject() {
    return this.testActionsService.getLearnerSubjects().subscribe(data => {
      this.getLearnerSubjects = data;
    })
  }

  private getLearnerSpecifiedTest() {
    return this.testActionsService.getLearnerSpecifiedTests().subscribe(data => {
      this.getLearnerSpecifiedTests = data;
    })
  }

  public onClick(subject_name: string) {
    this.router.navigate(['test-type', subject_name]);
  }

  openDialog(templateRef: TemplateRef<any>): void {
    this.dialogRef = this.dialog.open(templateRef);
  }

  closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
