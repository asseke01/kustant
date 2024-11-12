import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AsyncPipe, NgClass, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatFormField} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatSelect, MatSelectTrigger} from '@angular/material/select';
import {TestingService} from '../../../../services/user-services/testing.service';
import {GetTestReview, reviewSubject} from '../../../../../assets/interfaces/getTestReview.interface';
import {answers, GetQuestion} from '../../../../../assets/interfaces/getQuestion';
import {QuestionService} from '../../../../services/admin-services/question.service';
import {AlertService} from '../../../../services/helper-services/alert.service';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-test-review',
  standalone: true,
  imports: [
    AsyncPipe,
    FormsModule,
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatFormField,
    MatInput,
    MatOption,
    MatProgressSpinner,
    MatSelect,
    NgForOf,
    NgIf,
    NgClass,
    MatSelectTrigger
  ],
  templateUrl: './test-review.component.html',
  styleUrl: './test-review.component.css'
})
export class TestReviewComponent implements OnInit {

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private testingService = inject(TestingService);
  private questionService = inject(QuestionService);
  private alert = inject(AlertService)
  private sanitizer = inject(DomSanitizer);
  private dialog = inject(MatDialog);


  private testId!: number;

  public testReview!: GetTestReview;
  public loading: boolean = true;
  public selectedSubject!: any;
  public subjects: reviewSubject[] = [];
  public questionsCount: number = 40;
  public questionNumber = 1;
  public questionData!: GetQuestion;
  public subject!: string;
  public questionText!: string;
  public answers: answers[] = [];
  public matchingAnswers: { [key: number]: number | null } = {};
  public answeredQuestions: Map<number, 'correct' | 'incorrect' | 'half-correct'> = new Map();
  public selectedAnswers: Map<number, boolean> = new Map();


  @ViewChild('errorReportDialog') errorReportDialog!: TemplateRef<any>;
  public errorDescription: string = '';


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.testId = +params.get('test_id')!;
    });

    this.getTestReview()
  }

  private getTestReview() {
    this.loading = true;
    this.testingService.getTestReview(this.testId).subscribe(data => {
      this.testReview = data;
      this.subjects = data.subjects;
      if (this.subjects.length > 0) {
        this.selectedSubject = this.subjects[0];
        this.subject = this.selectedSubject.name;
        this.questionsCount = this.selectedSubject.questions_count;

        // Map answered states based on API response
        this.selectedSubject.correct_answers.forEach((num: any) => this.answeredQuestions.set(num, 'correct'));
        this.selectedSubject.incorrect_answers.forEach((num: any) => this.answeredQuestions.set(num, 'incorrect'));
        this.selectedSubject.half_answers.forEach((num: any) => this.answeredQuestions.set(num, 'half-correct'));
        this.loadQuestion(this.questionNumber);
      }
      this.loading = false;
    }, (error) => {
      console.error("Error fetching current testing data:", error);
      this.loading = false;
    });
  }

  private selectSubject(subject: reviewSubject) {
    this.selectedSubject = subject;
    this.subject = subject.name;
    this.questionsCount = subject.questions_count;

    // Update answered status based on current subject
    this.answeredQuestions.clear();
    subject.correct_answers.forEach((num: any) => this.answeredQuestions.set(num, 'correct'));
    subject.incorrect_answers.forEach((num: any) => this.answeredQuestions.set(num, 'incorrect'));
    subject.half_answers.forEach((num: any) => this.answeredQuestions.set(num, 'half-correct'));

    this.loadQuestion(1); // Load the first question for the selected subject
  }

  onSubjectChange(subject: reviewSubject) {
    this.selectSubject(subject); // Update the selected subject and reload data
  }

  public loadQuestion(number: number) {
    this.questionNumber = number;
    this.testingService.getQuestionResult(number, this.subject, this.testId).subscribe((data) => {
      this.questionData = data;
      this.questionText = data.text;
      this.answers = data.answers;
      if (this.questionData.question_type === 'matching') {
        this.initMatchingAnswers();
      }
    });
  }

  initMatchingAnswers() {
    this.matchingAnswers = {};
    this.questionData.questions?.forEach((question: any) => {
      this.matchingAnswers[question.id] = question.answer_id || null;
    });
  }

  openErrorReportDialog(): void {
    console.log('dada')
    this.dialog.open(this.errorReportDialog);
  }

  closeDialog(): void {
    this.errorDescription = ''
    this.dialog.closeAll();
  }

  submitErrorReport(): void {
    if (this.errorDescription.trim()) {
      const reportData = {
        question_type: this.questionData.question_type,
        question_id: this.questionData.question_id,
        text: this.errorDescription,
      };
      console.log(reportData);

      this.questionService.notifyIncorrectQuestion(reportData).subscribe({
        next: (response) => {
          if (response.success) {
            this.alert.success('Апелляция успешно отправлена'); // Display success message
          }
          this.errorDescription = ''
          this.closeDialog();
        },
        error: (err) => {
          console.error('Ошибка при отправке апелляции:', err);
          this.alert.success('Ошибка при отправке апелляции. Попробуйте еще раз.'); // Display error message
        }
      });
    } else {
      console.log('Описание ошибки не может быть пустым.');
      this.alert.success('Описание ошибки не может быть пустым.'); // Inform user to provide input
    }
  }

  sanitizeHtmlContent(htmlContent: string): SafeHtml {
    const maxWidth = window.innerWidth <= 500 ? '300px'
      : window.innerWidth <= 650 ? '400px'
        : window.innerWidth <= 900 ? '500px'
          : '700px';

    const modifiedHtml = htmlContent?.replace(
      /<img /g,
      `<img style="max-width: ${maxWidth}; height: auto;"`
    );
    return this.sanitizer.bypassSecurityTrustHtml(modifiedHtml);
  }

  nextQuestion() {
    if (this.questionNumber < this.questionsCount) {
      this.questionNumber++;
      this.loadQuestion(this.questionNumber);
    }
  }

  previousQuestion() {
    if (this.questionNumber > 1) {
      this.questionNumber--;
      this.loadQuestion(this.questionNumber);
    }
  }

  navigateToTestResult() {
    this.router.navigate([`/test-result/${this.testId}`]);
  }

  protected readonly String = String;
}
