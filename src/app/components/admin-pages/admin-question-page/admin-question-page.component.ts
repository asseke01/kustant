import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {Form, FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TestService} from '../../../services/admin-services/test.service';
import {QuestionService} from '../../../services/admin-services/question.service';
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {AlertService} from '../../../services/helper-services/alert.service';
import {QuillEditorComponent} from 'ngx-quill';
import {forkJoin} from 'rxjs';

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
    MatDialogClose,
  ],
  templateUrl: './admin-question-page.component.html',
  styleUrl: './admin-question-page.component.css'
})
export class AdminQuestionPageComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('editDialogTemplate') editDialogTemplate!: TemplateRef<any>;
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

  subThemes: any[] = [];
  questionsData: any[] = [];
  private questionsCache: Map<string, any> = new Map();


  //ЗАГРУЗКА ДАННЫХ

  ngOnInit(): void {
    this.loadSubThemes();

    this.loadQuestions();

  }

  clearCacheForSubject(subject: string): void {
    Array.from(this.questionsCache.keys())
      .filter(key => key.includes(subject))
      .forEach(key => this.questionsCache.delete(key));
  }

  onSubjectChange(): void {
    this.offset = 0;
    this.currentPage = 1;
    this.clearCacheForSubject(this.selectedSubject);

    forkJoin({
      subThemes: this.testService.getSubThemes(this.selectedSubject),
      questions: this.questionService.getQuestionsCached(this.selectedValue, this.selectedSubject, undefined, undefined, this.offset, this.limit)
    }).subscribe(({subThemes, questions}) => {
      this.subThemes = subThemes;
      this.questionsData = questions.questions;
      this.questionCount = questions.total_questions_count;
    });
  }

  loadSubThemes() {
    this.testService.getSubThemes(this.selectedSubject).subscribe(data => {
      this.subThemes = data;
    });
  }

  loadQuestions() {
    this.questionService.getQuestionsCached(
      this.selectedValue,
      this.selectedSubject,
      this.selectedSubTheme, // Передаем подтему (undefined, если не выбрано)
      this.selectedText !== 'Барлығы' ? this.selectedText : undefined, // Передаем статус (undefined, если "Барлығы")
      this.offset,
      this.limit
    ).subscribe(data => {
      this.questionsData = data.questions;
      this.questionCount = data.total_questions_count;
    });
  }

  loadContextQuestions(): void {
    this.questionService.getContextQuestions(
      this.selectedSubject,
      this.selectedText !== 'Барлығы' ? this.selectedText : undefined // Передаем только статус
    ).subscribe(
      data => {
        this.questionsData = data.questions;
        this.questionCount = data.total_questions_count;
      },
      error => {
        this.alert.error('Ошибка загрузки контекстных вопросов');
      }
    );
  }


  loadMatchingQuestions(): void {
    this.questionService.getMatchingQuestions(
      this.selectedSubject,
      this.selectedSubTheme, // Передаем подтему
      this.selectedText !== 'Барлығы' ? this.selectedText : undefined // Передаем статус
    ).subscribe(
      data => {
        this.questionsData = data.questions;
        this.questionCount = data.total_questions_count;
      },
      error => {
        this.alert.error('Ошибка загрузки матчинг вопросов');
      }
    );
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

  changeType(newType: string): void {
    this.selectedSubTheme = undefined;
    this.selectedText = 'Барлығы';
    this.selectedValue = newType;

    if (newType === 'context-question') {
      this.loadContextQuestions();
    } else if (newType === 'match-question') {
      this.loadMatchingQuestions();
    } else {
      this.loadQuestions(); // Загружаем стандартные вопросы
    }
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
      case 'has_one_answer':
        return '80vh'; // Для вопроса с одним ответом
      case 'has_many_answers':
        return '80vh'; // Для вопроса с несколькими ответами
      case 'context-question':
        return '80vh';
      case 'match-question':
        return '80vh';
      default:
        return '100%';
    }
  }

  public oneQuestionForm = this.fb.group({
    subject: [{value: this.selectedSubject, disabled: true}],
    help_text: [''],
    text: [''],
    lvl: [''],
    status: [this.status],
    theme_id: [''],
    type: [this.type],
    answers: this.fb.array([])
  })

  public manyQuestionForm = this.fb.group({
    subject: [{value: this.selectedSubject, disabled: true}],
    help_text: [''],
    text: [''],
    lvl: [''],
    status: ['not_accepted'],
    theme_id: [''],
    type: ['has_one_answer'],
    answers: this.fb.array([])
  })

  public contextQuestionForm = this.fb.group({
    help_text: [''],
    subject: [{value: this.selectedSubject, disabled: true}],
    status: ['not_accepted'],
    text: [''],
    questions: this.fb.array([])
  })

  public matchingQuestionForm = this.fb.group({
    help_text: [''],
    subject: [{value: this.selectedSubject, disabled: true}],
    theme_id: [''],
    status: ['not_accepted'],
    text: [''],
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

  get matchingQuestion(): FormArray {
    return this.matchingQuestionForm.get('questions') as FormArray;
  }

  get matchingAnswers(): FormArray {
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

  getEditorConfig(index: number, type: 'one' | 'many' = 'one') {
    const toolbarId = type === 'many' ? `#toolbar-many-${index}` : `#toolbar-${index}`;
    return {
      toolbar: {
        container: toolbarId,
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
      this.answers.at(index).get('text')?.setValue(content, {emitEvent: false});
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
      .map((control, idx) => ({control, idx}))
      .filter(item => item.control.get('is_correct')?.value);

    const correctAnswersCount = correctAnswers.length;
    const isCurrentlyCorrect = currentControl.get('is_correct')?.value;

    if (isCurrentlyCorrect) {
      currentControl.patchValue({is_correct: false});
    } else {
      if (correctAnswersCount < 3) {
        currentControl.patchValue({is_correct: true});
      } else {
        const lastCorrectAnswerIndex = correctAnswers[correctAnswersCount - 1].idx;
        this.answersMany.controls[lastCorrectAnswerIndex].patchValue({is_correct: false});
        currentControl.patchValue({is_correct: true});
      }
    }
  }


  handleManyAnswerContentChange(index: number, event: any): void {
    const content = event.html || '';

    const currentText = this.answersMany.at(index).get('text')?.value || '';

    if (currentText !== content) {
      this.answersMany.at(index).get('text')?.setValue(content, {emitEvent: false});
    }
  }

  handleQuestionContentChange(qIndex: number, event: any): void {
    const content = event.html || '';
    const currentQuestion = this.questions.at(qIndex);
    if (currentQuestion.get('text')?.value !== content) {
      currentQuestion.get('text')?.setValue(content, {emitEvent: false});
    }
  }

  handleAnswerContextChange(qIndex: number, aIndex: number, event: any): void {
    const content = event.html || '';
    const currentAnswer = (this.questions.at(qIndex).get('answers') as FormArray).at(aIndex);
    if (currentAnswer.get('text')?.value !== content) {
      currentAnswer.get('text')?.setValue(content, {emitEvent: false});
    }
  }

  setContextCorrectAnswer(qIndex: number, aIndex: number): void {
    const answers = this.questions.at(qIndex).get('answers') as FormArray;
    const currentAnswer = answers.at(aIndex);

    answers.controls.forEach((control, index) => {
      if (index !== aIndex) {
        control.patchValue({is_correct: false});
      }
    });

    currentAnswer.patchValue({is_correct: true});
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


  onSubmit() {
    if (this.oneQuestionForm.invalid) {
      this.alert.warn('Форма содержит ошибки');
      return;
    }

    this.questionService.saveQuestion(this.oneQuestionForm.value).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Данные успешно сохранены');
          this.oneQuestionForm.reset();
          this.oneQuestionForm.patchValue({subject: this.selectedSubject});
          this.manyQuestionForm.patchValue({subject: this.selectedSubject});
          this.contextQuestionForm.patchValue({subject: this.selectedSubject});
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

  onSubmitMany() {
    if (this.manyQuestionForm.invalid) {
      this.alert.warn('Форма содержит ошибки');
      return;
    }

    this.questionService.saveQuestion(this.manyQuestionForm.value).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Данные успешно сохранены');
          this.manyQuestionForm.reset();
          this.oneQuestionForm.patchValue({subject: this.selectedSubject});
          this.manyQuestionForm.patchValue({subject: this.selectedSubject});
          this.contextQuestionForm.patchValue({subject: this.selectedSubject});
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

  onSubmitContext() {
    if (this.contextQuestionForm.invalid) {
      this.alert.warn('Форма содержит ошибки');
      return;
    }
    console.log(this.contextQuestionForm.get('subject')?.value);

    this.questionService.saveContext(this.contextQuestionForm.value).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Данные успешно сохранены');
          this.oneQuestionForm.patchValue({subject: this.selectedSubject});
          this.manyQuestionForm.patchValue({subject: this.selectedSubject});
          this.contextQuestionForm.patchValue({subject: this.selectedSubject});
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
    this.oneQuestionForm.patchValue({subject: this.selectedSubject});
    this.manyQuestionForm.patchValue({subject: this.selectedSubject});
    this.contextQuestionForm.patchValue({subject: this.selectedSubject});

    this.dialog.closeAll();
  }

  public editOneQuestionForm = this.fb.group({
    id: [''], // Поле для хранения ID вопроса
    subject: [{value: this.selectedSubject, disabled: true}],
    help_text: [''],
    text: [''],
    lvl: [''],
    status: [this.status],
    theme_id: [''],
    type: ['has_one_answer'], // Зафиксированный тип
    answers: this.fb.array([])
  });

  public editManyQuestionForm = this.fb.group({
    id: [''], // Поле для хранения ID вопроса
    subject: [{value: this.selectedSubject, disabled: true}],
    help_text: [''],
    text: [''],
    lvl: [''],
    status: [this.status],
    theme_id: [''],
    type: ['has_many_answers'], // Зафиксированный тип
    answers: this.fb.array([]), // Фиксированные ответы
  });

  public editMatchingQuestionForm = this.fb.group({
    id: [''], // ID для редактирования
    subject: [{ value: this.selectedSubject, disabled: true }],
    help_text: [''],
    text: [''],
    status: [this.status],
    theme_id: [''],
    questions: this.fb.array([]), // Массив вопросов сопоставления
    answers: this.fb.array([]), // Массив неправильных ответов
  });

  get editAnswers(): FormArray {
    return this.editOneQuestionForm.get('answers') as FormArray;
  }

  get editManyAnswers(): FormArray {
    return this.editManyQuestionForm.get('answers') as FormArray;
  }

  get editMatchingQuestions(): FormArray {
    return this.editMatchingQuestionForm.get('questions') as FormArray;
  }

  get editMatchingAnswers(): FormArray {
    return this.editMatchingQuestionForm.get('answers') as FormArray;
  }

  addEditMatchingAnswer(): void {
    const answerGroup = this.fb.group({
      text: [''],
    });
    this.editMatchingAnswers.push(answerGroup);
  }

  removeEditMatchingAnswer(index: number): void {
    this.editMatchingAnswers.removeAt(index);
  }


  addAnswerToEditForm(): void {
    const answersArray = this.editAnswers; // Используем геттер editAnswers
    if (answersArray.length < this.maxAnswers) {
      answersArray.push(
        this.fb.group({
          text: [''],
          is_correct: [false],
        })
      );
    }
  }

  removeAnswerFromEditForm(index: number): void {
    if (this.editAnswers.length > 1) {
      this.editAnswers.removeAt(index);
    } else {
      this.alert.warn('Нельзя удалить последний ответ.');
    }
  }

  toggleCorrectAnswer(index: number): void {
    const answers = this.editAnswers;
    const currentControl = answers.at(index);

    if (currentControl.get('is_correct')?.value) {
      // Если ответ уже выбран, снимаем выбор
      currentControl.patchValue({is_correct: false});
    } else {
      // Сбрасываем выбор у других ответов
      answers.controls.forEach((control, i) => {
        control.patchValue({is_correct: i === index});
      });
    }
  }

  toggleCorrectManyAnswer(index: number): void {
    const answers = this.editManyAnswers;
    const maxCorrectAnswers = 3;
    const selectedIndices: number[] = [];
    answers.controls.forEach((control, i) => {
      if (control.get('is_correct')?.value) {
        selectedIndices.push(i);
      }
    });

    const isCurrentlyCorrect = answers.at(index).get('is_correct')?.value;

    if (isCurrentlyCorrect) {
      answers.at(index).patchValue({is_correct: false});
    } else {
      if (selectedIndices.length < maxCorrectAnswers) {
        answers.at(index).patchValue({is_correct: true});
      } else {
        const oldestIndex = selectedIndices.shift();
        if (oldestIndex !== undefined) {
          answers.at(oldestIndex).patchValue({is_correct: false});
        }
        answers.at(index).patchValue({is_correct: true});
      }
    }
  }


  openEditDialog(question: any, enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.editOneQuestionForm.reset();
    this.editManyQuestionForm.reset();
    this.matchingQuestionForm.reset();
    this.contextQuestionForm.reset();

    switch (this.selectedValue) {
      case 'has_one_answer':
        this.questionService.getStandardQuestion(question.id).subscribe(
          (data) => {
            this.selectedValue = data.type;
            this.editOneQuestionForm.patchValue({
              id: data.id,
              subject: this.selectedSubject,
              help_text: data.help_text,
              text: data.text,
              lvl: data.lvl,
              status: data.status_display,
              theme_id: data.sub_theme_id,
              type: data.type,
            });

            const answersArray = this.editAnswers;
            answersArray.clear();
            data.answers.forEach((answer: any) => {
              answersArray.push(this.fb.group({ text: [answer.text], is_correct: [answer.is_correct] }));
            });

            this.openDialogTemplate(enterAnimationDuration, exitAnimationDuration, 'has_one_answer');
          },
          (error) => {
            this.alert.error('Ошибка загрузки данных вопроса');
          }
        );
        break;

      case 'has_many_answers':
        this.questionService.getStandardQuestion(question.id).subscribe(
          (data) => {
            this.selectedValue = data.type;
            this.editManyQuestionForm.patchValue({
              id: data.id,
              subject: this.selectedSubject,
              help_text: data.help_text,
              text: data.text,
              lvl: data.lvl,
              status: data.status_display,
              theme_id: data.sub_theme_id,
              type: data.type,
            });

            const answersArray = this.editManyAnswers;
            answersArray.clear();
            data.answers.forEach((answer: any) => {
              answersArray.push(this.fb.group({ text: [answer.text], is_correct: [answer.is_correct] }));
            });

            this.openDialogTemplate(enterAnimationDuration, exitAnimationDuration, 'has_many_answers');
          },
          (error) => {
            this.alert.error('Ошибка загрузки данных вопроса');
          }
        );
        break;

      case 'context-question':
        this.questionService.getContextQuestion(question.id).subscribe(
          (data) => {
            this.contextQuestionForm.patchValue({
              help_text: data.help_text,
              subject: this.selectedSubject,
              text: data.text,
              status: data.status_display,
            });

            const questionsArray = this.questions;
            questionsArray.clear();
            data.questions.forEach((question: any) => {
              const questionGroup = this.fb.group({
                text: [question.question],
                answers: this.fb.array([]),
              });

              this.initializeContextAnswers(questionsArray.length, 5);
              questionsArray.push(questionGroup);
            });

            this.openDialogTemplate(enterAnimationDuration, exitAnimationDuration, 'context-question');
          },
          (error) => {
            this.alert.error('Ошибка загрузки данных контекста');
          }
        );
        break;

      case 'match-question':
        this.questionService.getMatchingQuestion(question.id).subscribe(
          (data) => {
            this.matchingQuestionForm.patchValue({
              help_text: data.help_text,
              subject: this.selectedSubject,
              text: data.text,
              status: data.status_display,
            });

            const questionsArray = this.matchingQuestion;
            questionsArray.clear();
            data.questions.forEach((matchQuestion: any) => {
              questionsArray.push(this.fb.group({
                question: [matchQuestion.question],
                answer: [matchQuestion.answer],
              }));
            });

            const answersArray = this.matchingAnswers;
            answersArray.clear();
            data.answers.forEach((answer: any) => {
              answersArray.push(this.fb.group({ text: [answer.text] }));
            });

            this.openDialogTemplate(enterAnimationDuration, exitAnimationDuration, 'match-question');
          },
          (error) => {
            this.alert.error('Ошибка загрузки данных матчинг-вопроса');
          }
        );
        break;

      default:
        this.alert.error('Неизвестный тип вопроса');
        break;
    }
  }

  private openDialogTemplate(enterAnimationDuration: string, exitAnimationDuration: string, type: string): void {
    this.selectedType = type;
    const dialogHeight = this.getDialogHeightByType(type);

    this.dialogRef = this.dialog.open(this.editDialogTemplate, {
      maxWidth: '50vw',
      height: dialogHeight,
      width: '100%',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true,
    });
    setTimeout(() => {
      this.reinitializeEditors();
    }, 0);
  }



  reinitializeEditors(): void {
    this.editManyAnswers.controls.forEach((_, index) => {
      const toolbarId = `toolbar-many-${index}`;
      const toolbarElement = document.getElementById(toolbarId);

      if (!toolbarElement) {
        console.error(`Toolbar element with id ${toolbarId} not found`);
      } else {
        console.log(`Toolbar element with id ${toolbarId} successfully found.`);
      }
    });
  }


  saveEditedQuestion(): void {
    const selectedForm =
      this.selectedValue === 'has_one_answer'
        ? this.editOneQuestionForm
        : this.editManyQuestionForm;

    if (selectedForm.invalid) {
      this.alert.warn('Форма содержит ошибки');
      return;
    }

    if (this.selectedValue === 'has_many_answers') {
      const correctAnswersCount = this.editManyAnswers.controls.filter(
        (control) => control.get('is_correct')?.value
      ).length;
      if (correctAnswersCount > 3) {
        this.alert.warn('Можно выбрать не более 3 правильных ответов.');
        return;
      }
    }

    // Отправка данных на сервер
    this.questionService.saveQuestion(selectedForm.getRawValue()).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Вопрос успешно сохранен');
          this.closeDialog();
          window.location.reload();
        }
      },
      (error) => {
        this.alert.error('Ошибка сохранения вопроса');
      }
    );
  }

  onSubThemeChange(): void {
    this.offset = 0;
    this.currentPage = 1;
    if (this.selectedValue === 'match-question') {
      this.loadMatchingQuestions();
    } else {
      this.loadQuestions();
    }
  }

  onStatusChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedText = selectElement.options[selectElement.selectedIndex].value;
    this.offset = 0;
    this.currentPage = 1;

    if (this.selectedValue === 'context-question') {
      this.loadContextQuestions();
    } else if (this.selectedValue === 'match-question') {
      this.loadMatchingQuestions();
    } else {
      this.loadQuestions();
    }
  }


}
