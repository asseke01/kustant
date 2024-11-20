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
export class AdminMarkedTestsComponent implements OnInit{
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  private dialog = inject(MatDialog);
  private form = inject(FormBuilder);
  private testService = inject(TestService);
  private userService = inject(UserService);
  private alert = inject(AlertService);
  selectedModal:string='';
  status = 'active';
  test : any[]=[]
  schools: any[] = [];
  uploadedFile: File | null = null;
  selectedId!: number | undefined;
  public userUrl = environment.apiUrl;

  public testForm = this.form.group({
    id: [null],
    name: ['', Validators.required],
    starts_at: ['', Validators.required],
    ends_at: ['', Validators.required],
    test_type: ['UBT', [Validators.required]],
    group_id: ['', [Validators.required]],
    excel: ['', [Validators.required]],
    uploaded_excel_file: ['', Validators.required],
  })


  ngOnInit(): void {
    this.loadTest();
  }

  loadTest(){
    this.testService.getSpecifiedTest(this.status).subscribe(data=>{
      this.test=data;
    })
  }

  loadSchools(){
    this.userService.getSchool().subscribe(data=>{
      this.schools = data;
    })
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, selectedModal:string,id?:number): void {
    this.loadSchools();
    this.selectedModal = selectedModal;
    this.selectedId =  id;
    console.log(id);
    console.log(this.selectedModal);
    if (selectedModal == 'update') {
      this.testService.getSpecifiedTestId(this.selectedId).subscribe(
        (data) => {
          if (data) {
            this.populateForm(data);
            this.dialog.open(this.dialogTemplate, {
              width: '100%',
              maxWidth: '40vw',
              enterAnimationDuration,
              exitAnimationDuration,
            });
          }
        }
      );
    }else {
      this.dialog.open(this.dialogTemplate, {
        width: '100%',
        maxWidth: '40vw',
        enterAnimationDuration,
        exitAnimationDuration,
        disableClose: true
      });
    }
  }

  closeDialog(): void {
    this.dialog.closeAll();
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
      id: data.id,
      name: data.name,
      starts_at: data.starts_at,
      ends_at: data.ends_at,
      group_id: data.group_id,
      excel: data.excel,
      uploaded_excel_file: data.uploaded_excel_file
    });
  }


  saveTest(type:string) {
    if(type == 'create'){
      const formData = new FormData();
      const formValues = this.testForm.value;

      formData.append('name', formValues.name || '');
      formData.append('starts_at', formValues.starts_at || '');
      formData.append('ends_at', formValues.ends_at || '');
      formData.append('test_type', formValues.test_type || '');
      formData.append('group_id', formValues.group_id || '');

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
          this.testForm.reset({
            test_type: 'UBT'
          });
          this.loadTest();
          this.uploadedFile = null;
          this.closeDialog();
        }
      });
    }else{
      const formData = new FormData();
      const formValues = this.testForm.value;
      formData.append('id', formValues.id || '');
      formData.append('name', formValues.name || '');
      formData.append('starts_at', formValues.starts_at || '');
      formData.append('ends_at', formValues.ends_at || '');
      formData.append('test_type', formValues.test_type || '');
      formData.append('group_id', formValues.group_id || '');

      if (this.uploadedFile) {
        // Append new file if uploaded
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
          this.testForm.reset({
            test_type: 'UBT'
          });
          this.uploadedFile = null;
          this.loadTest();
          this.closeDialog();
        }
      });
    }

  }

}
