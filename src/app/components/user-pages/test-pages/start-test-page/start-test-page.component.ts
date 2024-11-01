import {Component, inject, OnInit} from '@angular/core';
import {TestActionsService} from '../../../../services/user-services/test-actions.service';
import {ActivatedRoute} from '@angular/router';
import {TestingService} from '../../../../services/user-services/testing.service';
import {NgClass, NgForOf} from '@angular/common';
import {DomSanitizer, SafeHtml} from '@angular/platform-browser';

@Component({
  selector: 'app-start-test-page',
  standalone: true,
  imports: [
    NgForOf,
    NgClass
  ],
  templateUrl: './start-test-page.component.html',
  styleUrl: './start-test-page.component.css'
})
export class StartTestPageComponent implements OnInit{

  public subject!: string;
  public questionNumber = 1;
  public questionData: any;
  public answeredQuestions: Set<number> = new Set();
  public currentQuestion: number = 1;
  public timer: string = '00:00';

  private timerInterval: any;

  private testingService = inject(TestingService);
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);


  ngOnInit() {
    this.subject = this.route.snapshot.queryParamMap.get('subject') || 'en_lang';
    this.loadQuestion(this.questionNumber);
    this.startTimer(90 * 60); // Example: 90 minutes for the test
  }

  loadQuestion(number: number) {
    this.questionNumber = number; // Теперь это также будет номер текущего вопроса
    this.testingService.getQuestion(this.subject, number).subscribe((data) => {
      this.questionData = data;
    });
  }

  selectAnswer(answerId: number) {
    if (this.questionData) {
      const { id, type } = this.questionData;

      this.questionData.answers.forEach((answer: any) => {
        answer.is_selected = answer.id === answerId;
      });

      this.testingService.saveAnswer(id, answerId, type).subscribe(() => {
        this.answeredQuestions.add(this.questionNumber);
      });
    }
  }

  nextQuestion() {
    if (this.questionNumber < 40) { // Assuming 40 questions
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
    // Add logic to submit the test or navigate to results
  }

  public safeHtmlContent!: SafeHtml;

  // Возвращаем SafeHtml для использования в шаблоне
  sanitizeHtmlContent(htmlContent: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(htmlContent);
  }

  protected readonly String = String;
}
