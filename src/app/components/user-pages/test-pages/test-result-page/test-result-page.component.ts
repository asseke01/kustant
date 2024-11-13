import {Component, inject, OnInit} from '@angular/core';
import {NavBarComponent} from '../../../helpers/navbar/nav-bar.component';
import {KeyValuePipe, NgForOf, NgIf} from '@angular/common';
import {UserFooterComponent} from '../../user-footer/user-footer.component';
import {ActivatedRoute, Router} from '@angular/router';
import {TestService} from '../../../../services/admin-services/test.service';
import {GetTestResult} from '../../../../../assets/interfaces/getTestResult';

@Component({
  selector: 'app-test-result-page',
  standalone: true,
  imports: [
    NavBarComponent,
    NgForOf,
    UserFooterComponent,
    NgIf,
    KeyValuePipe
  ],
  templateUrl: './test-result-page.component.html',
  styleUrl: './test-result-page.component.css'
})
export class TestResultPageComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private testService = inject(TestService);

  private testId!: number;
  public testResult!: GetTestResult;

  public started_on!: string;
  public over_all_marks!: number;
  public taken_marks!: number;
  public test_type_display!: string;
  public test_name!: string | null;
  public subject_display!: string;
  public subject!: string;
  public subjects: any;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.testId = +params.get('test_id')!;
    });

    this.getTestResult()
  }

  private getTestResult(){
    this.testService.getTestResult(this.testId).subscribe(data => {
      this.testResult = data;
      this.started_on = data.started_on;
      this.over_all_marks = data.over_all_marks;
      this.taken_marks = data.taken_marks;
      this.test_type_display = data.test_type_display;
      this.test_name = data.test_name;
      this.subject_display = data.subject_display;
      this.subject = data.subject;
      this.subjects = data.subjects;
    })
  }

  public navigateToTestReview() {
    this.router.navigate([`test-review/${this.testId}`]);
  }

}
