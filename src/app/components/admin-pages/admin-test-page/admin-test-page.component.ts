import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TestService} from '../../../services/admin-services/test.service';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {NgxMaskDirective} from 'ngx-mask';
import {AlertService} from '../../../services/helper-services/alert.service';

@Component({
  selector: 'app-admin-test-page',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    NgxMaskDirective
  ],
  templateUrl: './admin-test-page.component.html',
  styleUrl: './admin-test-page.component.css'
})
export class AdminTestPageComponent implements OnInit{
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  dialog = inject(MatDialog);

  private testService = inject(TestService);
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);


  selectedType:string = '';
  selectedSubject: string = 'history';
  selectedCategory: number | undefined;
  selectedThemes: number | undefined = undefined;
  activeTab: string = 'bolimder';
  test:any[]=[];
  themes:any[]=[];
  subThemes:any[]=[];

  subjects = [
    { name:'history', displayName: 'Қазақстан тарихы' },
    { name:'reading_grammar', displayName: 'Оқу сауаттылығы' },
    { name:'math_grammar', displayName: 'Мат. сауаттылық' },
    { name:'math', displayName: 'Математика'},
    { name:'physics', displayName: 'Физика'},
    { name:'chemistry', displayName: 'Химия'},
    { name:'biology', displayName: 'Биология'},
    { name:'geography', displayName: 'География'},
    { name:'world_history', displayName: 'Дүниежүзі тарихы'},
    { name:'en_lang', displayName: 'Ағылшын тілі'},
    { name:'it', displayName: 'Информатика'},
    { name:'laws', displayName: 'Құқық негіздері'},
    { name:'kz_lang', displayName: 'Қазақ тілі'},
    { name:'ru_lang', displayName: 'Орыс тілі'},
    { name:'kz_literature', displayName: 'Қазақ әдебиеті'},
    { name:'ru_literature', displayName: 'Орыс әдебиеті'},
    { name:'general_eng', displayName: 'General English'},
  ];



  ngOnInit(): void {
    this.loadTest()

  }


  public categoryForm = this.fb.group({
    id:[null],
    name: ['', Validators.required],
    subject: [{ value: this.selectedSubject, disabled: true }],
    min_questions_count_in_subject_test:['', Validators.required],
    max_questions_count_in_subject_test:['', Validators.required],
  })

  public themeForm = this.fb.group({
    id:[null],
    subject: [{ value: this.selectedSubject, disabled: true }],
    name: ['', Validators.required],
    category_id: ['', Validators.required]
  })

  public subThemeForm = this.fb.group({
    id:[null],
    subject: [{ value: this.selectedSubject, disabled: true }],
    name: ['', Validators.required],
    theme_id: ['', Validators.required],
    duration: ['', Validators.required],
    questions_count: ['', Validators.required],
    questions_with_many_answers_count: ['', Validators.required],
    matchings_count: ['', Validators.required],
    lvl_a_percent: ['', Validators.required],
    lvl_b_percent: ['', Validators.required],
    lvl_c_percent: ['', Validators.required],
  })

  getDisplayName(name: string): string {
    const subject = this.subjects.find(item => item.name === name);
    return subject ? subject.displayName : 'Не найдено';
  }

  getDisplayCategory(id: number | undefined): string {
    const selectedItem = this.test.find(item => item.id === Number(id));
    if (selectedItem) {
      return selectedItem.name;
    } else {
      return 'Барлығы';
    }
  }

  getDisplayTheme(id: number | undefined): string {
    const selectedItem = this.themes.find(item => item.id === Number(id));
    if (selectedItem) {
      return selectedItem.name;
    } else {
      return 'Барлығы';
    }
  }

  loadThemes() {
    this.testService.getThemes(this.selectedSubject, this.selectedCategory).subscribe(data=>{
      this.themes = data;
    })
  }


  loadAll(event: Event) {
    this.loadTest();
    this.loadThemes();
    this.loadSubThemes();

    const newValue = (event.target as HTMLSelectElement).value;
    this.selectedSubject = newValue;
    this.categoryForm.patchValue({ subject: newValue });
    this.themeForm.patchValue({ subject: newValue });
    this.subThemeForm.patchValue({ subject: newValue });
  }

  loadTest(){
    this.testService.getTest(this.selectedSubject).subscribe(data=>{
      this.test = data;
      }
    )
  }

  loadSubThemes() {
    this.testService.getSubThemes(this.selectedSubject, this.selectedThemes).subscribe(data => {
      this.subThemes = data;
    });
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.test, event.previousIndex, event.currentIndex);

    this.test.forEach((item, index) => {
      item.index = index;
    });

    this.saveCategory(this.test);
  }

  saveCategory(items: any[]) {
    const categoryData = items.map(item => ({
      id: item.id,
      index: item.index
    }));

    this.testService.saveCategory(categoryData).subscribe(
      response => {
        console.log('Save response:', response);
      },
      error => {
        console.error('Save error:', error);
      }
    );
  }

  dropThemes(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.themes, event.previousIndex, event.currentIndex);

    this.themes.forEach((item, index) => {
      item.index = index;
    });

    this.saveThemes(this.themes);
  }

  saveThemes(items: any[]) {
    const categoryData = items.map(item => ({
      id: item.id,
      index: item.index
    }));

    this.testService.saveThemes(categoryData).subscribe(
      response => {
        console.log('Save response:', response);
      },
      error => {
        console.error('Save error:', error);
      }
    );
  }


  dropSubThemes(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.subThemes, event.previousIndex, event.currentIndex);

    this.subThemes.forEach((item, index) => {
      item.index = index;
    });

    this.saveSubThemes(this.subThemes);
  }

  saveSubThemes(items: any[]) {
    const categoryData = items.map(item => ({
      id: item.id,
      index: item.index
    }));

    this.testService.saveSubThemes(categoryData).subscribe(
      response => {
        console.log('Save response:', response);
      },
      error => {
        console.error('Save error:', error);
      }
    );
  }


  changeType(newType: string) {
    this.activeTab = newType;
    if (this.activeTab === 'takyryptar') {
      this.loadThemes();
      this.selectedCategory = undefined;
      this.selectedThemes = undefined;
    } else if (this.activeTab === 'takyrypwalar') {
      this.selectedCategory = undefined;
      this.selectedThemes = undefined;
      this.loadThemes();
      this.loadSubThemes();
    }
  }


  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, selectedModal: string, id?: number): void {
    this.selectedType = selectedModal;
    this.selectedCategory = undefined;
    this.selectedThemes = undefined;
    if(this.selectedType === 'bolim'){
      this.dialog.open(this.dialogTemplate, {
        width: '800px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true
      });
    }else if(this.selectedType === 'takyryp'){

      this.dialog.open(this.dialogTemplate, {
        width: '800px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true
      });
    }else if(this.selectedType === 'takyrypwalar'){
      this.loadThemes();
      this.subThemeForm.get('theme_id')?.setValue('');
      this.dialog.open(this.dialogTemplate, {
        width: '800px',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true
      });
    }else if(this.selectedType === 'bolim-update' && id !== undefined){
      this.testService.getTestById(id).subscribe(
        (Data) => {
          if (Data) {
            this.populateCategoryForm(Data);
            this.dialog.open(this.dialogTemplate, {
              width: '600px',
              enterAnimationDuration,
              exitAnimationDuration,
              disableClose: true
            });
          } else {
            console.error('Сотрудник с таким ID не найден');
          }
        },
        (error) => {
          console.error('Ошибка при получении данных сотрудника:', error);
        }
      );
    }else if(this.selectedType === 'takyryp-update' && id !== undefined){
      this.testService.getThemeById(id).subscribe(
        (Data) => {
          if (Data) {
            this.populateThemeForm(Data);
            this.dialog.open(this.dialogTemplate, {
              width: '600px',
              enterAnimationDuration,
              exitAnimationDuration,
              disableClose: true
            });
          } else {
            console.error('Сотрудник с таким ID не найден');
          }
        },
        (error) => {
          console.error('Ошибка при получении данных сотрудника:', error);
        }
      );
    }else if(this.selectedType === 'takyrypwalar-update' && id !== undefined){
      this.testService.getSubThemeById(id).subscribe(
        (Data) => {
          if (Data) {
            this.populateSubThemeForm(Data);
            this.dialog.open(this.dialogTemplate, {
              width: '600px',
              enterAnimationDuration,
              exitAnimationDuration,
              disableClose: true
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
  }

  closeDialog(): void {
    this.categoryForm.reset();
    this.subThemeForm.reset();
    this.themeForm.reset();

    this.categoryForm.patchValue({ subject: this.selectedSubject });
    this.subThemeForm.patchValue({ subject: this.selectedSubject });
    this.themeForm.patchValue({ subject: this.selectedSubject });

    this.dialog.closeAll();
  }

  onSubmitCategory() {
    const formData = {
      ...this.categoryForm.value,
      subject: this.selectedSubject
    };

    if (!formData.id) {
      delete formData.id;
    }

    this.testService.saveCategoryData(formData).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Данные успешно сохранены');
          this.categoryForm.reset();
          this.categoryForm.patchValue({ subject: this.selectedSubject });
          this.loadTest();
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


  onSubmitTheme() {
    const formData = {
      ...this.themeForm.value,
      subject: this.selectedSubject
    };

    if (!formData.id) {
      delete formData.id;
    }

    this.testService.saveThemeData(formData).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Данные успешно сохранены');
          this.themeForm.reset();
          this.themeForm.patchValue({ subject: this.selectedSubject });
          this.loadTest();
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

  onSubmitSubTheme(){
    const formData = {
      ...this.subThemeForm.value,
      subject: this.selectedSubject
    };

    if (!formData.id) {
      delete formData.id;
    }

    this.testService.saveSubThemeData(formData).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Данные успешно сохранены');
          this.subThemeForm.reset();
          this.subThemeForm.patchValue({ subject: this.selectedSubject });
          this.loadSubThemes();
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


  populateCategoryForm(Data: any): void {
    this.categoryForm.patchValue({
      id:Data.id,
      name: Data.name,
      subject: Data.subject,
      min_questions_count_in_subject_test:Data.min_questions_count_in_subject_test,
      max_questions_count_in_subject_test:Data.max_questions_count_in_subject_test,
    });
  }

  populateThemeForm(Data: any): void {
    this.themeForm.patchValue({
      id:Data.id,
      subject: Data.subject,
      name: Data.name,
      category_id: Data.category_id
    });
  }

  populateSubThemeForm(Data: any): void {
    this.subThemeForm.patchValue({
      id:Data.id,
      subject: Data.subject,
      name: Data.name,
      theme_id: Data.theme_id,
      duration: Data.duration,
      questions_count: Data.questions_count,
      questions_with_many_answers_count: Data.questions_with_many_answers_count,
      matchings_count: Data.matchings_count,
      lvl_a_percent: Data.lvl_a_percent,
      lvl_b_percent: Data.lvl_b_percent,
      lvl_c_percent: Data.lvl_c_percent,
    });
  }


}
