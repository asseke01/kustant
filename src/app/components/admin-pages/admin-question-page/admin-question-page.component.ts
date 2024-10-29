import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TestService} from '../../../services/admin-services/test.service';
import {QuestionService} from '../../../services/admin-services/question.service';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {AlertService} from '../../../services/helper-services/alert.service';
import {QuillEditorComponent} from 'ngx-quill';
import Quill from 'quill';

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

  subThemes:any[]=[];
  questions:any[]=[];

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
        this.questions = data.questions;
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
      default:
        return '100%';
    }
  }

  public oneQuestionForm = this.fb.group({
    subject: [{ value: this.selectedSubject, disabled: true }],
    help_text:[''],
    text:[''],
    lvl:[''],
    status:['not_accepted'],
    theme_id:[''],
    type:['has_one_answer'],
    answers: this.fb.array([])
  })

  get answers(): FormArray {
    return this.oneQuestionForm.get('answers') as FormArray;
  }

  initializeAnswers(count: number): void {
    for (let i = 0; i < count; i++) {
      this.addAnswer();
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
    const content = event.html;
    this.answers.at(index).get('text')?.setValue(content);
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

  closeDialog(): void {
    this.dialog.closeAll();
    this.oneQuestionForm.reset();
  }

  //Контроль формы


}
