import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../services/user-services/user.service';
import {MatIcon} from '@angular/material/icon';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatIconButton} from '@angular/material/button';
import {NgxMaskDirective} from 'ngx-mask';
import {AlertService} from '../../../services/helper-services/alert.service';
import {StaffService} from '../../../services/admin-services/staff.service';

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
  @ViewChild('adminDialogTemplate') adminDialogTemplate!: TemplateRef<any>;

  private dialog = inject(MatDialog);
  private userService = inject(UserService);
  private staffService = inject(StaffService);
  private form = inject(FormBuilder);
  private alert = inject(AlertService);

  public searchQuery: string = '';
  public schools: any[] = [];
  public selectedModal: string = '';
  public selectedSchool: any = null; // Выбранная школа
  public viewMode: 'admins' | 'students' = 'admins';
  public learners: any[] = [];
  public schoolAdmins: any[] = [];
  public filteredLearners: any[] = [];
  public selectedAdminId: number | null = null;

  public type: string = 'teachers';
  private selectedSchoolId!: number | undefined;

  public schoolForm = this.form.group({
    id: [null],
    name: ['', Validators.required],
  })

  public adminForm = this.form.group({
    id: [null],
    fullname: ['', Validators.required],
    phone_number: ['', Validators.required],
    password: ['']
  });

  public openSchoolDetails(school: any): void {
    this.selectedSchool = school;
    this.viewMode = 'admins';
    this.schoolAdmins = [];
    this.learners = [];
    this.loadSchoolAdmins(school.id);
  }


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

  public openAdminDialog(enterAnimationDuration: string, exitAnimationDuration: string, admin: any = null): void {
    this.selectedModal = admin ? 'update' : 'create';
    this.selectedAdminId = admin?.id || null;

    if (this.selectedModal === 'update' && this.selectedAdminId !== null) {
      this.adminForm.patchValue({
        id: admin.id,
        fullname: admin.fullname,
        phone_number: admin.phone_number,
        password: admin.password || '' // Пароль только если есть
      });

      this.dialog.open(this.adminDialogTemplate, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration
      });
    } else {
      this.adminForm.reset();
      this.dialog.open(this.adminDialogTemplate, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration
      });
    }
  }

  public closeAdminDialog(): void {
    this.dialog.closeAll();
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
      this.loadSchools();
      return;
    }
    this.schools = this.schools.filter(school =>
      school.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  public filterLearners(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.filteredLearners = this.learners;
      return;
    }

    this.filteredLearners = this.learners.filter(learner =>
      learner.fullname.toLowerCase().includes(query) || learner.phone_number.includes(query)
    );
  }

  public saveSchoolGroup(): void {
    if (this.schoolForm.invalid) {
      this.alert.warn('Форма не заполнена');
      return;
    }

    const saveData = {
      id: this.schoolForm.value.id ?? undefined,
      name: this.schoolForm.value.name as string,
    };

    this.userService.saveSchool(saveData).subscribe(
      response => {
        if (response.success) {
          this.alert.success("Успешно!")
          this.closeDialog();
          this.loadSchools();
        }
      },
      error => {
        this.alert.error('Ошибка при запросе:');
      }
    );
  }

  public deleteSchoolGroup(): void {
    if (!this.selectedSchoolId) {
      this.alert.warn('ID школы не установлен');
      return;
    }

    if (!confirm('Вы уверены, что хотите удалить эту школу?')) {
      return;
    }

    this.userService.deleteSchoolGroup(this.selectedSchoolId).subscribe(
      response => {
        if (response.success) {
          this.alert.success('Школа успешно удалена');
          this.closeDialog();
          this.loadSchools(); // Обновляем список после удаления
        } else {
          this.alert.warn('Не удалось удалить школу');
        }
      },
      error => {
        this.alert.error('Ошибка при удалении школы:');
      }
    );
  }

  public onViewModeChange(mode: 'admins' | 'students'): void {
    this.viewMode = mode;


    if (mode === 'admins') {
      this.loadSchoolAdmins(this.selectedSchool.id);
    } else if (mode === 'students') {
      this.loadLearners(this.selectedSchool.id);
    }
  }

  private loadLearners(groupId?: number): void {
    this.userService.getLearners(groupId).subscribe(
      data => {
        this.learners = data.learners || [];
        this.filteredLearners = this.learners;
      },
      error => {
        this.alert.error('Ошибка при загрузке учеников:');
      }
    );
  }

  private loadSchoolAdmins(groupId: number): void {
    this.staffService.getSchoolAdmins(groupId).subscribe(
      data => {
        this.schoolAdmins = data.school_admins;
      },
      error => {
        this.alert.error('Ошибка при загрузке администраторов:');
      }
    );
  }

  public saveAdmin(): void {
    let phone = this.adminForm.get('phone_number')?.value;

    if (phone) {
      phone = phone.replace(/\D/g, '');

      if (phone.length === 10) {
        phone = `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)} ${phone.slice(6, 8)} ${phone.slice(8, 10)}`;
        this.adminForm.get('phone_number')?.setValue(phone);
      } else {
        this.alert.warn('Некорректный формат телефона')
      }
    }

    if (this.adminForm.invalid) {
      this.alert.warn('Форма не заполнена!');
      return;
    }

    const adminData = {
      ...this.adminForm.value,
      school_id: this.selectedSchool.id
    };

    this.staffService.saveSchoolAdmin(adminData).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Администратор успешно сохранен!');
          this.loadSchoolAdmins(this.selectedSchool.id);
          this.closeAdminDialog();
        }
      },
      (error) => {
        if (error.status === 409) {
          this.alert.warn('Пользователь с таким номером уже существует!');
        } else {
          this.alert.error('Ошибка при сохранении администратора.');
        }
      }
    );
  }

  public deleteAdmin(): void {
    if (!this.selectedAdminId) {
      this.alert.warn('Администратор не выбран!');
      return;
    }

    if (!confirm('Вы уверены, что хотите удалить этого администратора?')) {
      return;
    }

    const deleteData = {
      prev_type: 'school_admins',
      id: this.selectedAdminId,
    };

    this.staffService.deleteStaff(deleteData).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Администратор успешно удален!');
          this.loadSchoolAdmins(this.selectedSchool.id);
          this.closeAdminDialog();
        }
      },
      (error) => {
        this.alert.error('Ошибка при удалении администратора.');
      }
    );
  }


  public goBack(): void {
    this.selectedSchool = null;
  }
}
