import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../services/user-services/user.service';
import {MatIcon} from '@angular/material/icon';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatIconButton} from '@angular/material/button';
import {NgxMaskDirective} from 'ngx-mask';

@Component({
  selector: 'app-admin-schools-page',
  standalone: true,
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    MatIcon,
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIconButton,
    NgxMaskDirective
  ],
  templateUrl: './admin-schools-page.component.html',
  styleUrl: './admin-schools-page.component.css'
})
export class AdminSchoolsPageComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  private form = inject(FormBuilder);

  public searchQuery: string = '';
  public schools: any[] = [];
  public selectedModal: string = '';

  public type: string = 'teachers';
  private selectedSchoolId!: number | undefined;

  public schoolForm = this.form.group({
    id: [null],
    name: ['', Validators.required],
  })


  ngOnInit() {
    this.loadSchools()
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, selectedModal: string, id?: number): void {
    this.selectedModal = selectedModal;
    this.selectedSchoolId = id;

    if (this.selectedModal === 'update' && id !== null) {
      const schoolData = this.getSchoolById(this.selectedSchoolId);
      if (schoolData) {
        this.populateForm(schoolData);
        this.dialog.open(this.dialogTemplate, {
          width: '600px',
          enterAnimationDuration,
          exitAnimationDuration,
        });
      } else {
        console.error('Сотрудник с таким ID не найден');
      }
    } else {
      this.schoolForm.reset();
      this.dialog.open(this.dialogTemplate, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    }
  }

  public closeDialog(): void {
    this.dialog.closeAll();
  }

  private getSchoolById(id?: number): any {
    return this.schools.find(school => school.id === id);
  }

  private populateForm(schoolData: any): void {
    this.schoolForm.patchValue({
      id: schoolData.id,
      name: schoolData.name,
    });
  }

  private loadSchools() {
    this.userService.getSchool().subscribe(data => {
      this.schools = data;
    })
  }

  public updateSearchQuery(query: string) {
    this.searchQuery = query;
    this.filterStaff();
  }

  public filterStaff() {
    if (!this.searchQuery.trim()) {
      this.loadSchools(); // Показать все школы, если запрос пуст
      return;
    }
    this.schools = this.schools.filter(school =>
      school.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  public saveSchoolGroup(): void {
    if (this.schoolForm.invalid) {
      console.error('Форма недействительна');
      return;
    }

    const saveData = {
      id: this.schoolForm.value.id ?? undefined, // Преобразуем null в undefined
      name: this.schoolForm.value.name as string, // Преобразуем в string, так как поле валидируется
    };

    this.userService.saveSchool(saveData).subscribe(
      response => {
        if (response.success) {
          this.closeDialog();
          this.loadSchools();
        }
      },
      error => {
        console.error('Ошибка при запросе:', error);
      }
    );
  }

  public deleteSchoolGroup(id: number): void {
    if (!confirm('Вы уверены, что хотите удалить эту школу?')) {
      return;
    }

    this.userService.deleteSchoolGroup(id).subscribe(
      response => {
        if (response.success) {
          console.log('Школа успешно удалена');
          this.loadSchools(); // Обновляем список после удаления
        } else {
          console.error('Не удалось удалить школу');
        }
      },
      error => {
        console.error('Ошибка при удалении школы:', error);
      }
    );
  }

}
