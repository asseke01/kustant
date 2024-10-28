import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TestService} from '../../../services/admin-services/test.service';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {NgxMaskDirective} from 'ngx-mask';

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


  public category = this.fb.group({
    id:[null],
    name: ['', Validators.required],
    subject:this.selectedSubject,
    min_questions_count_in_subject_test:['', Validators.required],
    max_questions_count_in_subject_test:['', Validators.required],
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

  onCategoryChange() {
    this.testService.getThemes(this.selectedSubject, this.selectedCategory).subscribe(data=>{
      this.themes = data;
    })
  }


  ngOnInit(): void {
    this.loadTest()
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
    if (this.activeTab === 'takyptar') {
      this.onCategoryChange();
    } else if (this.activeTab === 'takyrypwalar') {
      this.onCategoryChange();
      this.loadSubThemes();
    }
  }


  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, selectedModal: string, id?: number): void {
    this.selectedType = selectedModal;

    if(this.selectedType === 'bolim'){
      this.dialog.open(this.dialogTemplate, {
        width: '800px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    }



  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  onSubmitCategory(){

    this.testService.saveCategoryData(this.category.value).subscribe((response)=>{
      console.log('Save response:', response);
    })
  }
  protected readonly name = name;
}
