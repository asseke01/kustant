import {AfterViewInit, Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {StaffService} from '../../../services/admin-services/staff.service';
import {NgxMaskDirective} from 'ngx-mask';
import {AlertService} from '../../../services/helper-services/alert.service';

@Component({
  selector: 'app-admin-employee-page',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatDialogActions,
    MatButton,
    MatIconButton,
    MatIcon,
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    NgxMaskDirective
  ],
  templateUrl: './admin-employee-page.component.html',
  styleUrl: './admin-employee-page.component.css'
})
export class AdminEmployeePageComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  private dialog = inject(MatDialog);
  private form = inject(FormBuilder);
  private alert = inject(AlertService);
  private staffService = inject(StaffService);

  staff: any[] = [];
  filteredStaff: any[] = [];
  type: string = 'teachers';
  searchQuery: string = '';
  selectedModal:string='';
  selectedStaffId!: number | undefined ;


  public staffForm = this.form.group({
    id: [null],
    prev_type: ['teachers', Validators.required], // начальное значение
    type: ['teachers', Validators.required],
    fullname: ['', Validators.required],
    phone_number: ['', [Validators.required, Validators.pattern(/^\+7 \(\d{3}\) \d{3} \d{2} \d{2}$/)]],
    subjects: this.form.array([this.createSubject()])
  })


  ngOnInit(): void {
    this.loadStaffData();
  }

  loadStaffData() {
    this.staffService.getStaff(this.type).subscribe(data => {
      this.staff = data;
      this.filterStaff();
    }, error => {
      console.error('Ошибка при загрузке данных сотрудников', error);
    });
  }


  changeType(newType: string) {
    this.type = newType;
    this.loadStaffData();
  }

  filterStaff() {
    this.filteredStaff = this.staff.filter(staffMember => {
      const matchesType = staffMember.type === this.type;
      const matchesSearch = this.searchQuery
        ? (staffMember.fullname.includes(this.searchQuery) || staffMember.phone_number.includes(this.searchQuery))
        : true;
      return matchesType && matchesSearch;
    });
  }

  updateSearchQuery(query: string) {
    this.searchQuery = query;
    this.filterStaff();
  }

  getStaffById(id?: number): any {
    return this.staff.find(staffMember => staffMember.id === id);
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, selectedModal:string, id?:number): void {
    this.selectedModal = selectedModal;
    this.selectedStaffId = id;

    if (this.selectedModal === 'update' && id !== null) {
      const staffData = this.getStaffById(this.selectedStaffId);
      if (staffData) {
        this.populateForm(staffData);
        this.dialog.open(this.dialogTemplate, {
          width: '600px',
          enterAnimationDuration,
          exitAnimationDuration,
        });
      } else {
        console.error('Сотрудник с таким ID не найден');
      }
    } else {
      this.staffForm.reset();
      this.dialog.open(this.dialogTemplate, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    }

  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  createSubject(): FormGroup {
    return this.form.group({
      name: ['', Validators.required]
    });
  }

  get subjects(): FormArray {
    return this.staffForm.get('subjects') as FormArray;
  }

  addSubject() {
    this.subjects.push(this.createSubject());
  }

  removeSubject(index: number) {
    this.subjects.removeAt(index);
  }


  populateForm(staffData: any): void {
    this.staffForm.patchValue({
      id: staffData.id,
      prev_type: staffData.prev_type,
      type: staffData.type,
      fullname: staffData.fullname,
      phone_number: staffData.phone_number,
    });

    const subjectsFormArray = this.staffForm.get('subjects') as FormArray;
    subjectsFormArray.clear();

    if (staffData.subjects && staffData.subjects.length) {
      staffData.subjects.forEach((subject: any) => {
        subjectsFormArray.push(this.form.group({
          name: [subject.name, Validators.required]
        }));
      });
    }
  }


  saveStaff() {
    let phone = this.staffForm.get('phone_number')?.value;

    if (phone) {
      phone = phone.replace(/\D/g, '');

      if (phone.length === 10) {
        phone = `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)} ${phone.slice(6, 8)} ${phone.slice(8, 10)}`;
        this.staffForm.get('phone_number')?.setValue(phone);
      } else {
        this.alert.warn('Некорректный формат телефона')
      }
    }

    if (this.staffForm.invalid) {
      this.alert.warn('Форма содержит ошибки');
      this.getFormValidationErrors()
      return;
    }

    this.staffService.saveStaff(this.staffForm.value).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Данные успешно сохранены');
          this.staffForm.reset();
          this.loadStaffData();
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

  getFormValidationErrors() {
    const errorMessages: any = {};
    Object.keys(this.staffForm.controls).forEach(key => {
      const controlErrors = this.staffForm.get(key)?.errors;
      if (controlErrors) {
        errorMessages[key] = [];
        Object.keys(controlErrors).forEach(keyError => {
          let errorMessage = '';

          switch (keyError) {
            case 'required':
              errorMessage = 'Это поле обязательно для заполнения';
              break;
            case 'pattern':
              errorMessage = 'Некорректный формат';
              break;
            default:
              errorMessage = 'Ошибка: ' + keyError;
              break;
          }

          errorMessages[key].push(errorMessage);
        });
      }
    });
    return errorMessages;
  }

}
