import {Component, inject, OnInit} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {NgForOf, NgIf} from "@angular/common";
import {TestService} from '../../../services/admin-services/test.service';
import {CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-admin-test-page',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './admin-test-page.component.html',
  styleUrl: './admin-test-page.component.css'
})
export class AdminTestPageComponent implements OnInit{
  private testService = inject(TestService)

  selectedSubject: string = 'history';
  test:any[]=[];

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

  getDisplayName(name: string): string {
    const subject = this.subjects.find(item => item.name === name);
    return subject ? subject.displayName : 'Неизвестный предмет';
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

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.test, event.previousIndex, event.currentIndex);
    this.test.forEach(item => {
      this.saveCategory(item);
    });
  }

  saveCategory(item: any) {
    const categoryData = {
      id: item.id,
      name: item.name,
      subject: this.selectedSubject,
      min_questions_count_in_subject_test: item.min_questions_count_in_subject_test,
      max_questions_count_in_subject_test: item.max_questions_count_in_subject_test
    };

    this.testService.saveCategory(categoryData).subscribe(
      response => {
        console.log('Save response:', response);
      },
      error => {
        console.error('Save error:', error);
      }
    );
  }
}
