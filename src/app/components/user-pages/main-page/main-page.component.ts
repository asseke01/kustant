import {Component, inject, OnInit, TemplateRef} from '@angular/core';
import {NavBarComponent} from '../../helpers/navbar/nav-bar.component';
import {Router} from '@angular/router';
import {TestActionsService} from '../../../services/user-services/test-actions.service';
import {GetLearnerSubjects} from '../../../../assets/interfaces/get_learner_subjects';
import {NgForOf, NgIf} from '@angular/common';
import {TestingService} from '../../../services/user-services/testing.service';
import {GetLearnerSpecifiedTests} from '../../../../assets/interfaces/get_learner_specified_tests';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {UserFooterComponent} from '../user-footer/user-footer.component';
import {ConfirmDialogComponent} from '../../../confirm-dialog/confirm-dialog.component';
import {RecordService} from '../../../services/record-services/record.service';

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
    UserFooterComponent,
    NgIf
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit{

  private testActionsService = inject(TestActionsService);
  private testingService = inject(TestingService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private recordService = inject(RecordService);
  records: any[]=[];
  recordsWeek: any[]=[];
  todayDate: string = '';
  error: string | null = null;
  private dialogRef: MatDialogRef<any> | null = null;


  public getLearnerSubjects: GetLearnerSubjects[] = []
  public getLearnerSpecifiedTests: GetLearnerSpecifiedTests[] = []

  ngOnInit() {
    this.getLearnerCurrentTestingExist()
    this.getLearnerSubject()
    this.getLearnerSpecifiedTest()
    this.setTodayDate();
    this.getRecords();
    this.getWeekRecords();
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

  public openDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Тестілеуді бастау?',
        message: 'Толық ҰБТ бойынша еркін тестті бастау?',
        cancelText: 'Жоқ',
        confirmText: 'Тестілеуді бастау',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.testActionsService.startUbtTest().subscribe((response) => {
          if(response.success) {
            this.router.navigate(['start-test']);
          }
        })
      }
    });
  }

  public closeDialog(): void {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  public getLearnerCurrentTestingExist(){
    this.testingService.getLearnerCurrentTestingExist().subscribe(data => {
      if(data.current_testing_exists){
        this.router.navigate(['start-test']);
      }
    })
  }

  setTodayDate(): void {
    const now = new Date();
    this.todayDate = `${this.padZero(now.getDate())}.${this.padZero(
      now.getMonth() + 1
    )}.${now.getFullYear()}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  getRecords(): void {
    this.recordService
      .getUBTRecords({
        record_type: 'all_time',
        limit: 20,
        offset: 0
      })
      .subscribe({
        next: (data) => {
          this.records = data.records;
        },
        error: (err) => {
          this.error = 'Failed to load records: ' + err.message;
        }
      });
  }

  getWeekRecords(){
    this.recordService
      .getUBTRecords({
        record_type: 'week',
        date: this.todayDate,
        limit: 20,
        offset: 0
      })
      .subscribe({
        next: (data) => {
          this.recordsWeek = data.records;
        },
        error: (err) => {
          this.error = 'Failed to load records: ' + err.message;
        }
      });
  }
}
