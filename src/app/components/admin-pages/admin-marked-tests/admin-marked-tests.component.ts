import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {TestService} from '../../../services/admin-services/test.service';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {NgxMaskDirective} from 'ngx-mask';
import {FormArray, FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {UserService} from '../../../services/user-services/user.service';
import {AlertService} from '../../../services/helper-services/alert.service';
import {environment} from '../../../../environments/environment';
import {PopupService} from '../../../services/helper-services/popup.service';
import {AuthService} from '../../../services/auth-services/auth.service';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-admin-marked-tests',
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
  templateUrl: './admin-marked-tests.component.html',
  styleUrl: './admin-marked-tests.component.css'
})
export class AdminMarkedTestsComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  @ViewChild('resultsDialogTemplate') resultsDialogTemplate!: TemplateRef<any>;

  private dialog = inject(MatDialog);
  private form = inject(FormBuilder);
  private testService = inject(TestService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private alert = inject(AlertService);
  private popupService = inject(PopupService);

  selectedModal: string = '';
  status = 'active';
  test: any[] = []
  schools: any[] = [];
  uploadedFile: File | null = null;
  selectedId!: number | undefined;
  testResults: any[] = [];
  excelDownloadLink: string = '';
  selectedTestId!: number;
  public userUrl = environment.apiUrl;
  public userData: any;
  public role: string = '';
  subjects: any[] = [];
  subThemes: any[] = [];

  public testForm = this.form.group({
    id: [null],
    name: ['', Validators.required],
    starts_at: ['', Validators.required],
    ends_at: ['', Validators.required],
    test_type: ['ubt', [Validators.required]],
    group_id: ['', Validators.required],
    subject: [''],
    theme_id: [''], // Поле для выбора темы
    excel: ['', [Validators.required]],
    uploaded_excel_file: ['', Validators.required],
  });

  ngOnInit(): void {
    this.loadUserData();
    this.loadTest();
    this.loadSubjects();
  }

  loadUserData(): void {
    this.userData = this.authService.getUserData()
    this.role = this.userData?.role;
  }

  loadTest() {
    this.testService.getSpecifiedTest(this.status).subscribe(data => {
      this.test = data;
    })
  }

  loadSchools() {
    if (this.role === 'teacher') {
      this.userService.getGroups().subscribe({
        next: (data) => {
          this.schools = data;
        },
        error: (err) => {
          this.alert.error('Не удалось загрузить группы.');
        }
      });
    } else {
      this.userService.getSchool().subscribe({
        next: (data) => {
          this.schools = data;
        },
        error: (err) => {
          this.alert.error('Не удалось загрузить школы.');
        }
      })
    }
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, selectedModal: string, id?: number): void {
    this.loadSchools();
    this.selectedModal = selectedModal;
    this.selectedId = id;

    console.log('selectedModal:', selectedModal);
    console.log('Перед открытием диалога, состояние формы:', this.testForm.value);

    if (selectedModal === 'update') {
      this.testService.getSpecifiedTestId(this.selectedId).subscribe((data) => {
        console.log('Данные для update:', data);
        if (data) {
          this.populateForm(data);
          this.dialog.open(this.dialogTemplate, {
            width: '100%',
            maxWidth: '40vw',
            enterAnimationDuration,
            exitAnimationDuration,
          });
        }
      });
    } else {
      console.log('Сброс формы для create');
      this.testForm.reset({
        test_type: 'ubt',
        group_id: '' // Сброс значения group_id
      });
      this.dialog.open(this.dialogTemplate, {
        width: '100%',
        maxWidth: '40vw',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true,
      });
    }
  }


  closeDialog(): void {
    this.dialog.closeAll();
    this.testForm.reset({
      test_type: 'ubt',
      group_id: null
    });
  }


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input && input.files && input.files.length > 0) {
      const file = input.files![0];
      this.uploadedFile = file;
      this.testForm.get('uploaded_excel_file')?.setValue(file.name);
    }
  }


  populateForm(data: any): void {
    this.testForm.patchValue({
      id: data.id || '',
      name: data.name || '',
      starts_at: data.starts_at || '',
      ends_at: data.ends_at || '',
      group_id: data.group_id || '',
      test_type: data.test_type || 'ubt',
      subject: data.subject || '',
      theme_id: data.theme_id || '', // Устанавливаем существующую тему
      excel: data.excel || '',
      uploaded_excel_file: data.uploaded_excel_file || ''
    });

    if (data.test_type === 'theme' && data.subject) {
      this.loadThemes(data.subject); // Загружаем темы для существующего subject
    }

    // Отслеживаем изменение test_type и subject
    this.testForm.get('test_type')?.valueChanges.subscribe((value) => {
      if (value === 'theme' && this.testForm.get('subject')?.value) {
        this.loadThemes(this.testForm.get('subject')?.value!);
      }
    });

    this.testForm.get('subject')?.valueChanges.subscribe((subject) => {
      if (this.testForm.get('test_type')?.value === 'theme') {
        this.loadThemes(subject!); // Обновляем список тем при изменении subject
      }
    });
  }


  saveTest(type: string) {
    if (type == 'create') {
      const formData = new FormData();
      const formValues = this.testForm.value;

      formData.append('name', formValues.name || '');
      formData.append('starts_at', formValues.starts_at || '');
      formData.append('ends_at', formValues.ends_at || '');
      formData.append('test_type', formValues.test_type || '');
      formData.append('group_id', formValues.group_id || '');

      if (formValues.test_type !== 'ubt' && formValues.subject) {
        formData.append('subject', formValues.subject);
      }

      if (formValues.test_type === 'theme' && formValues.theme_id) {
        formData.append('theme_id', formValues.theme_id); // Передаём тему только для theme
      }

      if (this.uploadedFile) {
        formData.append('uploaded_excel_file_key', this.uploadedFile);
        formData.append('uploaded_excel_file', 'uploaded_excel_file_key');
      } else {
        this.alert.error('Файлды жүктеп алыңыз');
        return;
      }


      this.testService.saveSpecifiedData(formData).subscribe((response) => {
        if (response.success) {
          this.alert.success('Деректер сәтті сақталды');
          this.loadTest();
          this.uploadedFile = null;
          this.closeDialog();
        }
      });
    } else {
      const formData = new FormData();
      const formValues = this.testForm.value;
      formData.append('id', formValues.id || '');
      formData.append('name', formValues.name || '');
      formData.append('starts_at', formValues.starts_at || '');
      formData.append('ends_at', formValues.ends_at || '');
      formData.append('test_type', formValues.test_type || '');
      formData.append('group_id', formValues.group_id || '');

      if (formValues.test_type !== 'ubt' && formValues.subject) {
        formData.append('subject', formValues.subject);
      }

      if (formValues.test_type === 'theme' && formValues.theme_id) {
        formData.append('theme_id', formValues.theme_id); // Передаём тему только для theme
      }

      if (this.uploadedFile) {
        formData.append('uploaded_excel_file_key', this.uploadedFile);
        formData.append('uploaded_excel_file', 'uploaded_excel_file_key');
      } else {
        const existingFilePath = this.testForm.get('excel')?.value;
        if (existingFilePath) {
          formData.append('uploaded_excel_file', existingFilePath);
        } else {
          console.warn('No file uploaded and no existing file path available.');
        }
      }

      this.testService.saveSpecifiedData(formData).subscribe((response) => {
        if (response.success) {
          this.alert.success('Деректер сәтті сақталды');
          this.uploadedFile = null;
          this.loadTest();
          this.closeDialog();
        }
      });
    }

  }

  onDelete(): void {
    this.popupService.openDialog(() => {
      this.testService.deleteSpecifiedTest(this.selectedId).subscribe({
        next: (response) => {
          if (response.success) {
            this.closeDialog();
            this.alert.success('Успешно удален!');
            this.uploadedFile = null;
            this.loadTest();
          }
        },
        error: (err) => {
          this.alert.error('Ошибка при удалении!');
        },
      });
    });
  }

  onArchieve(): void {
    this.popupService.openDialog(() => {
      this.testService.archiveSpecifiedTest(this.selectedId).subscribe({
        next: (response) => {
          if (response.success) {
            this.closeDialog();
            this.alert.success('Успешно архивирован!');
            this.uploadedFile = null;
            this.loadTest();
          }
        },
        error: (err) => {
          this.alert.error('Ошибка при архивировании!');
        },
      });
    });
  }

  openResultsDialog(testId: number): void {
    this.selectedTestId = testId; // Сохраняем ID текущего теста
    this.testService.getSpecifiedTestResults(testId).subscribe({
      next: (response) => {
        this.testResults = response.testings;
        this.excelDownloadLink = `/api/test/get_specified_test_results_in_excel/?id=${testId}`; // Формируем ссылку
        this.dialog.open(this.resultsDialogTemplate, {
          width: '1060px',
          height: 'fit-content',
          maxHeight: '90vh',
          disableClose: false,
          panelClass: 'custom-results-dialog',
        });
      },
      error: () => {
        this.alert.error('Ошибка при загрузке результатов теста.');
      },
    });
  }

  public changeStatus(status: string) {
    if (status === 'archive') {
      this.status = 'active'
    } else {
      this.status = 'archive';
    }
    this.loadTest();
  }

  downloadExcel(testId: number): void {
    this.testService.downloadSpecifiedTestResults(testId).subscribe({
      next: (response) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `test_results_${testId}.xlsx`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.alert.error('Ошибка при скачивании файла.');
      },
    });
  }

  loadSubjects(): void {
    this.testService.getSubjects().subscribe({
      next: (subjects) => {
        this.subjects = subjects; // Сохраняем список предметов в переменной
      },
      error: () => {
        this.alert.error('Ошибка загрузки предметов.');
      }
    });
  }

  loadThemes(subject: string): void {
    if (!subject) {
      this.subThemes = [];
      return;
    }

    this.testService.getSubThemes(subject).subscribe({
      next: (themes) => {
        this.subThemes = themes;
        console.log('Загруженные темы:', themes);
      },
      error: () => {
        this.alert.error('Ошибка при загрузке тем.');
      },
    });
  }

}
