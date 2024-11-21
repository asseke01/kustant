import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Form, FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TestService} from '../../../services/admin-services/test.service';
import {QuestionService} from '../../../services/admin-services/question.service';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {AlertService} from '../../../services/helper-services/alert.service';
import {QuillEditorComponent} from 'ngx-quill';

@Component({
  selector: 'app-admin-question-page',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgClass,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    QuillEditorComponent,
  ],
  templateUrl: './admin-question-page.component.html',
  styleUrl: './admin-question-page.component.css'
})
export class AdminQuestionPageComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  dialog = inject(MatDialog);
  dialogRef: MatDialogRef<any> | null = null;
  private testService = inject(TestService);
  private questionService = inject(QuestionService);
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);

  selectedSubject: string = 'history';
  selectedSubTheme: number | undefined = undefined;
  selectedText: string = 'Барлығы';
  selectedValue: string = 'has_one_answer';
  selectedType: string = '';

  questionCount: number | undefined = undefined;
  offset: number = 0;
  limit: number = 20;
  currentPage: number = 1;
  protected maxAnswers = 5;
  protected maxManyAnswers = 6;

  subjects = [
    {name: 'history', displayName: 'Қазақстан тарихы'},
    {name: 'reading_grammar', displayName: 'Оқу сауаттылығы'},
    {name: 'math_grammar', displayName: 'Мат. сауаттылық'},
    {name: 'math', displayName: 'Математика'},
    {name: 'physics', displayName: 'Физика'},
    {name: 'chemistry', displayName: 'Химия'},
    {name: 'biology', displayName: 'Биология'},
    {name: 'geography', displayName: 'География'},
    {name: 'world_history', displayName: 'Дүниежүзі тарихы'},
    {name: 'en_lang', displayName: 'Ағылшын тілі'},
    {name: 'it', displayName: 'Информатика'},
    {name: 'laws', displayName: 'Құқық негіздері'},
    {name: 'kz_lang', displayName: 'Қазақ тілі'},
    {name: 'ru_lang', displayName: 'Орыс тілі'},
    {name: 'kz_literature', displayName: 'Қазақ әдебиеті'},
    {name: 'ru_literature', displayName: 'Орыс әдебиеті'},
    {name: 'general_eng', displayName: 'General English'},
  ];

  quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{header: 1}, {header: 2}],
      [{list: 'ordered'}, {list: 'bullet'}],
      ['image']
    ]
  };

  status = 'not_accepted'
  type = 'has_many_answers'

  subThemes:any[]=[];
  questionsData:any[]=[];

  //ЗАГРУЗКА ДАННЫХ

  ngOnInit(): void {
    this.loadSubThemes();

    this.loadQuestions();

  }

  loadSubThemes() {
    this.testService.getSubThemes(this.selectedSubject).subscribe(data => {
      this.subThemes = data;
    });
  }

  loadQuestions() {
    this.questionService.getQuestions(this.selectedValue, this.selectedSubject, undefined, undefined, this.offset, this.limit)
      .subscribe(data => {
        this.questionsData = data.questions;
        this.questionCount = data.total_questions_count;
      });
  }

  nextPage() {
    if (this.questionCount !== undefined && (this.offset + this.limit < this.questionCount)) {
      this.offset += this.limit;
      this.currentPage++;
      this.loadQuestions();
    }
  }


  previousPage() {
    if (this.offset >= this.limit) {
      this.offset -= this.limit;
      this.currentPage--;
      this.loadQuestions();
    }
  }

  changeType(newType: string) {
    this.selectedValue = newType;
    this.loadQuestions();
  }



  //ЗАГРУЗКА ДАННЫХ

  getDisplayName(name: string): string {
    const subject = this.subjects.find(item => item.name === name);
    return subject ? subject.displayName : 'Не найдено';
  }

  getDisplayTheme(id: number | undefined): string {
    const selectedItem = this.subThemes.find(item => item.id === Number(id));
    if (selectedItem) {
      return selectedItem.name;

    } else {
      return 'Барлығы';
    }
  }

  onSelectionChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedText = selectElement.options[selectElement.selectedIndex].text;
  }


  //Контроль формы

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, type: string): void {
    this.initializeAnswers(5);
    this.initializeManyAnswers(6);
    this.initializeQuestions(5);
    this.initializeMatchQuestions(2);
    this.initializeMatchAnswers(2);
    this.selectedType = type;

    const dialogHeight = this.getDialogHeightByType(type);

    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      maxWidth: '50vw',
      height: dialogHeight,
      width: '100%',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    });
  }

  changeModalType(newType: string): void {
    this.selectedType = newType;

    if (this.dialogRef) {
      const newHeight = this.getDialogHeightByType(newType);
      this.dialogRef.updateSize('100%', newHeight);
    }
  }

  getDialogHeightByType(type: string): string {
    console.log(type);
    switch (type) {
      case 'select-type':
        return '400px';
      case 'one-question':
        return '80vh';
      case 'many-question':
        return '80vh';
      case 'context-question':
        return '80vh';
      case 'match-question':
        return '80vh';
      default:
        return '100%';
    }
  }

  public oneQuestionForm = this.fb.group({
    subject: [{ value: this.selectedSubject, disabled: true }],
    help_text:[''],
    text:[''],
    lvl:[''],
    status:[this.status],
    theme_id:[''],
    type:[this.type],
    answers: this.fb.array([])
  })

  public manyQuestionForm = this.fb.group({
    subject: [{ value: this.selectedSubject, disabled: true }],
    help_text:[''],
    text:[''],
    lvl:[''],
    status:['not_accepted'],
    theme_id:[''],
    type:['has_one_answer'],
    answers: this.fb.array([])
  })

  public contextQuestionForm = this.fb.group({
    help_text:[''],
    subject: [{ value: this.selectedSubject, disabled: true }],
    status:['not_accepted'],
    text:[''],
    questions: this.fb.array([])
  })

  public matchingQuestionForm = this.fb.group({
    help_text:[''],
    subject: [{ value: this.selectedSubject, disabled: true }],
    theme_id:[''],
    status:['not_accepted'],
    text:[''],
    questions: this.fb.array([]),
    answers: this.fb.array([])
  })

  get answers(): FormArray {
    return this.oneQuestionForm.get('answers') as FormArray;
  }

  get answersMany(): FormArray {
    return this.manyQuestionForm.get('answers') as FormArray;
  }

  get questions(): FormArray {
    return this.contextQuestionForm.get('questions') as FormArray;
  }

  get matchingQuestion():FormArray{
    return this.matchingQuestionForm.get('questions') as FormArray;
  }

  get matchingAnswers():FormArray{
    return this.matchingQuestionForm.get('answers') as FormArray;
  }

  getAnswers(questionIndex: number): FormArray {
    return this.questions.at(questionIndex).get('answers') as FormArray;
  }

  initializeAnswers(count: number): void {
    for (let i = 0; i < count; i++) {
      this.addAnswer();
    }
  }

  initializeManyAnswers(count: number): void {
    for (let i = 0; i < count; i++) {
      this.addManyAnswer();
    }
  }

  initializeQuestions(count: number): void {
    for (let i = 0; i < count; i++) {
      this.addQuestion();
    }
  }

  initializeMatchQuestions(count: number): void {
    for (let i = 0; i < count; i++) {
      this.addMatchQuestion();
    }
  }

  initializeMatchAnswers(count: number): void {
    for (let i = 0; i < count; i++) {
      this.addMatchAnswer();
    }
  }


  addMatchQuestion(): void {
    const questionGroup = this.fb.group({
      question: [''],
      answer: ['']
    });
    this.matchingQuestion.push(questionGroup);
  }

  addMatchAnswer(): void {
    const answerGroup = this.fb.group({
      text: ['']
    });
    this.matchingAnswers.push(answerGroup);
  }

  removeMatchAnswer(index: number): void {
    if (this.matchingAnswers.length > 2) {
      this.matchingAnswers.removeAt(index);
    }
  }




  addAnswer(): void {
    if (this.answers.length < this.maxAnswers) {
      const answerGroup = this.fb.group({
        text: [''],
        is_correct: [false]
      });
      this.answers.push(answerGroup);
    }
  }

  addManyAnswer(): void {
    if (this.answersMany.length < this.maxManyAnswers) {
      const answerGroup = this.fb.group({
        text: [''],
        is_correct: [false]
      });
      this.answersMany.push(answerGroup);
    }
  }

  addQuestion(): void {
    const questionGroup = this.fb.group({
      text: [''],
      answers: this.fb.array([])
    });
    this.questions.push(questionGroup);

    this.initializeContextAnswers(this.questions.length - 1, 5);
  }

  initializeContextAnswers(questionIndex: number, count: number): void {
    const answers = this.questions.at(questionIndex).get('answers') as FormArray;
    for (let i = 0; i < count; i++) {
      const answerGroup = this.fb.group({
        text: [''],
        is_correct: [false]
      });
      answers.push(answerGroup);
    }
  }

  getEditorConfig(index: number) {
    return {
      toolbar: {
        container: '#toolbar-' + index,
      },
      history: {
        userOnly: true,
      },
    };
  }

  getContextConfig(qIndex: number, aIndex: number) {
    return {
      toolbar: {
        container: `#toolbar-${qIndex}-${aIndex}`,
      },
      history: {
        userOnly: true,
      },
    };
  }


  getModuleConfig(index: number) {
    return {
      toolbar: {
        container: '#toolbox-' + index
      }
    };
  }

  getMatchConfig(index: number) {
    return {
      toolbar: {
        container: '#toolbox-question-' + index
      }
    };
  }

  getMatchAnswerConfig(index: number) {
    return {
      toolbar: {
        container: '#toolbox-answer-' + index
      }
    };
  }
  removeLastAnswer(): void {
    const answersLength = this.answers.length;
    if (answersLength > 0) {
      this.answers.removeAt(answersLength - 1);
    }
  }

  setCorrectAnswer(index: number): void {
    this.answers.controls.forEach((control, i) => {
      control.get('is_correct')?.setValue(i === index);
    });
  }


  handleAnswerContentChange(index: number, event: any): void {
    const content = event.html || '';

    const currentText = this.answers.at(index).get('text')?.value || '';

    if (currentText !== content) {
      this.answers.at(index).get('text')?.setValue(content, { emitEvent: false });
    }
  }

  setCorrectManyAnswer(index: number): void {
    const currentControl = this.answersMany.controls[index];
    const answerText = currentControl.get('text')?.value;

    if (!answerText || answerText.trim() === '') {
      this.alert.warn('Невозможно отметить ответ как правильный, так как текст не заполнен.');
      return;
    }

    const correctAnswers = this.answersMany.controls
      .map((control, idx) => ({ control, idx }))
      .filter(item => item.control.get('is_correct')?.value);

    const correctAnswersCount = correctAnswers.length;
    const isCurrentlyCorrect = currentControl.get('is_correct')?.value;

    if (isCurrentlyCorrect) {
      currentControl.patchValue({ is_correct: false });
    } else {
      if (correctAnswersCount < 3) {
        currentControl.patchValue({ is_correct: true });
      } else {
        const lastCorrectAnswerIndex = correctAnswers[correctAnswersCount - 1].idx;
        this.answersMany.controls[lastCorrectAnswerIndex].patchValue({ is_correct: false });
        currentControl.patchValue({ is_correct: true });
      }
    }
  }


  handleManyAnswerContentChange(index: number, event: any): void {
    const content = event.html || '';

    const currentText = this.answersMany.at(index).get('text')?.value || '';

    if (currentText !== content) {
      this.answersMany.at(index).get('text')?.setValue(content, { emitEvent: false });
    }
  }

  handleQuestionContentChange(qIndex: number, event: any): void {
    const content = event.html || '';
    const currentQuestion = this.questions.at(qIndex);
    if (currentQuestion.get('text')?.value !== content) {
      currentQuestion.get('text')?.setValue(content, { emitEvent: false });
    }
  }

  handleAnswerContextChange(qIndex: number, aIndex: number, event: any): void {
    const content = event.html || '';
    const currentAnswer = (this.questions.at(qIndex).get('answers') as FormArray).at(aIndex);
    if (currentAnswer.get('text')?.value !== content) {
      currentAnswer.get('text')?.setValue(content, { emitEvent: false });
    }
  }

  setContextCorrectAnswer(qIndex: number, aIndex: number): void {
    const answers = this.questions.at(qIndex).get('answers') as FormArray;
    const currentAnswer = answers.at(aIndex);

    answers.controls.forEach((control, index) => {
      if (index !== aIndex) {
        control.patchValue({ is_correct: false });
      }
    });

    currentAnswer.patchValue({ is_correct: true });
  }

  removeFifthAnswer(qIndex: number): void {
    const answers = this.getAnswers(qIndex);
    if (answers.length === 5) {
      answers.removeAt(4);
    }
  }

  addFifthAnswer(qIndex: number): void {
    const answers = this.getAnswers(qIndex);
    if (answers.length < 5) {
      const newAnswer = this.fb.group({
        text: [''],
        is_correct: [false]
      });
      answers.push(newAnswer);
    }
  }


  onSubmit(){
    if (this.oneQuestionForm.invalid) {
      this.alert.warn('Форма содержит ошибки');
      return;
    }

    this.questionService.saveQuestion(this.oneQuestionForm.value).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Данные успешно сохранены');
          this.oneQuestionForm.reset();
          this.oneQuestionForm.patchValue({ subject: this.selectedSubject });
          this.manyQuestionForm.patchValue({ subject: this.selectedSubject });
          this.contextQuestionForm.patchValue({ subject: this.selectedSubject });
          this.closeDialog();
        }
      },
      (error) => {
        if (error.status === 409) {
          this.alert.warn('Пользователь с таким номером телефона уже существует');
        } else {
          this.alert.error('Ошибка сохранения данных');
        }
      }
    );
  }

  onSubmitMany(){
    if (this.manyQuestionForm.invalid) {
      this.alert.warn('Форма содержит ошибки');
      return;
    }

    this.questionService.saveQuestion(this.manyQuestionForm.value).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Данные успешно сохранены');
          this.manyQuestionForm.reset();
          this.oneQuestionForm.patchValue({ subject: this.selectedSubject });
          this.manyQuestionForm.patchValue({ subject: this.selectedSubject });
          this.contextQuestionForm.patchValue({ subject: this.selectedSubject });
          this.closeDialog();
        }
      },
      (error) => {
        if (error.status === 409) {
          this.alert.warn('Пользователь с таким номером телефона уже существует');
        } else {
          this.alert.error('Ошибка сохранения данных');
        }
      }
    );
  }

  onSubmitContext(){


    if (this.contextQuestionForm.invalid) {
      this.alert.warn('Форма содержит ошибки');
      return;
    }
    console.log(this.contextQuestionForm.get('subject')?.value);

    this.questionService.saveContext(this.contextQuestionForm.value).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Данные успешно сохранены');
          this.oneQuestionForm.patchValue({ subject: this.selectedSubject });
          this.manyQuestionForm.patchValue({ subject: this.selectedSubject });
          this.contextQuestionForm.patchValue({ subject: this.selectedSubject });
          this.closeDialog();
          this.contextQuestionForm.reset();
        }
      },
      (error) => {
        if (error.status === 409) {
          this.alert.warn('Пользователь с таким номером телефона уже существует');
        } else {
          this.alert.error('Ошибка сохранения данных');
        }
      }
    );
  }

  closeDialog(): void {
    this.oneQuestionForm.reset();
    this.oneQuestionForm.patchValue({ subject: this.selectedSubject });
    this.manyQuestionForm.patchValue({ subject: this.selectedSubject });
    this.contextQuestionForm.patchValue({ subject: this.selectedSubject });

    this.dialog.closeAll();
  }

  //Контроль формы


}
