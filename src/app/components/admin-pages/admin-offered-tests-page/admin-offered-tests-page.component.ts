import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {NgxMaskDirective} from 'ngx-mask';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {AlertService} from '../../../services/helper-services/alert.service';
import {StaffService} from '../../../services/admin-services/staff.service';
import {TestActionsService} from '../../../services/user-services/test-actions.service';
import {GetLearnerSpecifiedTests} from '../../../../assets/interfaces/get_learner_specified_tests';
import {GetSpecifiedTestResults} from '../../../../assets/interfaces/get_specified_test_results.interface';

@Component({
  selector: 'app-admin-offered-tests-page',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    NgForOf,
    NgIf,
    NgxMaskDirective,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './admin-offered-tests-page.component.html',
  styleUrl: './admin-offered-tests-page.component.css'
})
export class AdminOfferedTestsPageComponent implements OnInit {

  private dialog = inject(MatDialog);
  private form = inject(FormBuilder);
  private alert = inject(AlertService);
  private staffService = inject(StaffService);
  private testActionService = inject(TestActionsService);

  public specifiedTestResults!: GetSpecifiedTestResults;
  public specifiedTests: GetLearnerSpecifiedTests[] = [];

  ngOnInit() {
    this.getSpecifiedTests()
  }

  private getSpecifiedTests() {
    return this.testActionService.getSpecifiedTests().subscribe(data => {
      this.specifiedTests = data
    })
  }

  private getSpecifiedTestResults() {
    return this.testActionService.getSpecifiedTestResults().subscribe(data => {
      this.specifiedTestResults = data;
    })
  }
}
