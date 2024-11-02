import {Component, inject, OnInit} from '@angular/core';
import {TestActionsService} from '../../../../services/user-services/test-actions.service';
import {ActivatedRoute, Router} from '@angular/router';
import {TestingService} from '../../../../services/user-services/testing.service';
import {NgClass, NgForOf, NgIf} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {GetCurrentTesting, Subject} from '../../../../../assets/interfaces/getCurrentTesting';
import {ConfirmDialogComponent} from '../../../../confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {answers, GetQuestion} from '../../../../../assets/interfaces/getQuestion';
import {FormsModule} from '@angular/forms';
import {MatFormField} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';

@Component({
  selector: 'app-start-test-page',
  standalone: true,
  imports: [
    NgForOf,
    NgClass,
    NgIf,
    MatProgressSpinner,
    FormsModule,
    MatFormField,
    MatSelect,
    MatOption
  ],
  templateUrl: './start-test-page.component.html',
  styleUrl: './start-test-page.component.css'
})
export class StartTestPageComponent implements OnInit {

  private testingService = inject(TestingService);
  private testActionsService = inject(TestActionsService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private dialog = inject(MatDialog);
  private router = inject(Router);

  public subject!: string;
  public questionNumber = 1;
  public questionData!: GetQuestion;
  public questionText!: string;
  public answers: answers[] = [];
  public answeredQuestions: Set<number> = new Set();
  public timer: string = '00:00';
  public currentTesting!: GetCurrentTesting;
  public subjects: Subject[] = [];
  public selectedSubject!: any;
  public questionsCount: number = 40;
  public loading: boolean = true;
  public matchingAnswers: { [key: number]: number | null } = {};

  private timerInterval: any;

  ngOnInit() {
    this.getCurrentTesting();
    this.subject = this.route.snapshot.queryParamMap.get('subject') || '';
    this.startTimer(90 * 60); // 90 минут на тест
  }

  getCurrentTesting() {
    this.loading = true;
    this.testActionsService.getCurrentTesting().subscribe(
      (data) => {
        this.currentTesting = data;
        this.subjects = data.subjects;
        if (this.subjects.length > 0) {
          this.selectedSubject = this.subjects[0];
          this.questionsCount = this.selectedSubject.questions_count;
          this.loadSubjectAnswers(this.selectedSubject.name);
        }
        this.loading = false;
      },
      (error) => {
        console.error("Error fetching current testing data:", error);
        this.loading = false;
      }
    );
  }

  loadSubjectAnswers(subjectName: string): void {
    const answers: number[] = this.currentTesting.subjects_answers[subjectName] || [];
    this.answeredQuestions.clear();

    answers.forEach((answer: number, index: number) => {
      if (answer !== -1) {
        this.answeredQuestions.add(index + 1);
      }
    });
    this.loadQuestion(1);
  }

  loadQuestion(number: number) {
    this.questionNumber = number;
    this.testingService.getQuestion(this.subject, number).subscribe((data) => {
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

  isMatchingAnswerComplete(): boolean {
    return Object.values(this.matchingAnswers).every((value) => value !== null);
  }

  onMatchingAnswerChange() {
    if (this.isMatchingAnswerComplete()) {
      this.saveAnswer();
    }
  }

  saveAnswer() {
    const { id, type } = this.questionData;

    let answerPayload: any;
    if (type === 'matching') {
      answerPayload = {
        question_id: id,
        answers: Object.entries(this.matchingAnswers).map(([questionId, answerId]) => ({
          question_id: Number(questionId),
          answer_id: answerId as number,
        })),
        type: 'matching'
      };
    } else {
      const selectedAnswerId = this.answers.find(answer => answer.is_selected)?.id;
      answerPayload = {
        question_id: id,
        answers: selectedAnswerId ? `[${selectedAnswerId}]` : "[]",
        type
      };
    }

    this.testingService.saveAnswer(answerPayload).subscribe(() => {
      this.answeredQuestions.add(this.questionNumber);
    });
  }

  selectAnswer(answerId: number) {
    if (this.questionData) {
      const { type } = this.questionData;

      this.questionData.answers.forEach((answer: any) => {
        answer.is_selected = answer.id === answerId;
      });

      if (type !== 'matching') {
        this.saveAnswer();
      }
    }
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

  startTimer(duration: number) {
    let timer = duration;
    this.timerInterval = setInterval(() => {
      let minutes = Math.floor(timer / 60);
      let seconds = timer % 60;
      this.timer = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      timer--;

      if (timer < 0) {
        clearInterval(this.timerInterval);
        this.endTest();
      }
    }, 1000);
  }

  endTest() {
    alert('Test time is over!');
  }

  finishTest(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Тестілеуді аяқтау',
        message: 'Белгіленбеген сұрақтар бар, тестілеуді аяқтағанда ол сұрақтарға 0 балл беріледі!',
        cancelText: 'Жалғастыру',
        confirmText: 'Aяқтау',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.testActionsService.finishTest().subscribe(() => {
          console.log('dada')
          this.router.navigate(['main']);
        });
      }
    });
  }

  public safeHtmlContent!: SafeHtml;

  sanitizeHtmlContent(htmlContent: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  protected readonly String = String;
}
