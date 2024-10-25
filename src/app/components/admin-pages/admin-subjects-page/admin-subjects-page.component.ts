import {Component, inject, TemplateRef, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {SubjectsService} from '../../../services/admin-services/subjects.service';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {NgxMaskDirective} from 'ngx-mask';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {AlertService} from '../../../services/helper-services/alert.service';

@Component({
  selector: 'app-admin-subjects-page',
  standalone: true,
  imports: [
    NgForOf,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    NgIf,
    NgxMaskDirective,
    ReactiveFormsModule
  ],
  templateUrl: './admin-subjects-page.component.html',
  styleUrl: './admin-subjects-page.component.css'
})
export class AdminSubjectsPageComponent {

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  dialog = inject(MatDialog);

  subjects = [
    { name:'history', displayName: 'Қазақстан тарихы', editLabel: 'Өзгерту' },
    { name:'reading_grammar', displayName: 'Оқу сауаттылығы', editLabel: 'Өзгерту' },
    { name:'math_grammar', displayName: 'Мат. сауаттылық', editLabel: 'Өзгерту' },
    { name:'math', displayName: 'Математика', editLabel: 'Өзгерту' },
    { name:'physics', displayName: 'Физика', editLabel: 'Өзгерту' },
    { name:'chemistry', displayName: 'Химия', editLabel: 'Өзгерту' },
    { name:'biology', displayName: 'Биология', editLabel: 'Өзгерту' },
    { name:'geography', displayName: 'География', editLabel: 'Өзгерту' },
    { name:'world_history', displayName: 'Дүниежүзі тарихы', editLabel: 'Өзгерту' },
    { name:'en_lang', displayName: 'Ағылшын тілі', editLabel: 'Өзгерту' },
    { name:'it', displayName: 'Информатика', editLabel: 'Өзгерту' },
    { name:'laws', displayName: 'Құқық негіздері', editLabel: 'Өзгерту' },
    { name:'kz_lang', displayName: 'Қазақ тілі', editLabel: 'Өзгерту' },
    { name:'ru_lang', displayName: 'Орыс тілі', editLabel: 'Өзгерту' },
    { name:'kz_literature', displayName: 'Қазақ әдебиеті', editLabel: 'Өзгерту' },
    { name:'ru_literature', displayName: 'Орыс әдебиеті', editLabel: 'Өзгерту' },
    { name:'general_eng', displayName: 'General English', editLabel: 'Өзгерту' },
  ];

  private subjectService = inject(SubjectsService);
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);

  subjectName :string = ''

  public subjectForm = this.fb.group({
    subject:[''],
    duration :[''],
    questions_count : [''],
    contexts_count :[''],
    questions_with_many_answers_count:[''],
    matchings_count:[''],
    lvl_a_percent:[''],
    lvl_b_percent:[''],
    lvl_c_percent:[''],
  })

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, selectedSubject: string, selectedName:string): void {
      this.subjectService.getSubject(selectedSubject).subscribe(
        (subjectData) => {
          if (subjectData) {
            this.populateForm(subjectData);
            this.subjectName = selectedName;
            this.dialog.open(this.dialogTemplate, {
              width: '800px',
              enterAnimationDuration,
              exitAnimationDuration,
            });
          } else {
            console.error('Сотрудник с таким ID не найден');
          }
        },
        (error) => {
          console.error('Ошибка при получении данных сотрудника:', error);
        }
      );
  }

  populateForm(subjectData: any): void {
    this.subjectForm.patchValue({
      subject:subjectData.subject,
      duration :subjectData.duration,
      questions_count : subjectData.questions_count,
      contexts_count :subjectData.contexts_count,
      questions_with_many_answers_count:subjectData.questions_with_many_answers_count,
      matchings_count:subjectData.matchings_count,
      lvl_a_percent:subjectData.lvl_a_percent,
      lvl_b_percent:subjectData.lvl_b_percent,
      lvl_c_percent:subjectData.lvl_c_percent
    });
  }

  saveForm(){
    if (this.subjectForm.invalid) {
      this.alert.warn('Форма содержит ошибки');
      return;
    }

    this.subjectService.saveGroup(this.subjectForm.value).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Данные успешно сохранены');
          this.subjectForm.reset();
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
    this.subjectForm.reset();
  }

}
