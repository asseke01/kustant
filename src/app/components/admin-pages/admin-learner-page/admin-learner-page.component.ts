import {Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatDialog, MatDialogActions, MatDialogContent, MatDialogTitle} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {NgForOf, NgIf} from '@angular/common';
import {FormArray, FormBuilder, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {LearnerService} from '../../../services/admin-services/learner.service';
import {GroupService} from '../../../services/admin-services/group.service';
import {AlertService} from '../../../services/helper-services/alert.service';
import {NgxMaskDirective} from 'ngx-mask';

@Component({
  selector: 'app-admin-learner-page',
  standalone: true,
  imports: [
    MatDialogActions,
    MatDialogContent,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgxMaskDirective
  ],
  templateUrl: './admin-learner-page.component.html',
  styleUrl: './admin-learner-page.component.css'
})
export class AdminLearnerPageComponent implements OnInit{
  private learnerService = inject(LearnerService);
  private groupService = inject(GroupService);
  private fb = inject(FormBuilder);
  private alert = inject(AlertService);


  learner: any[]=[];
  group:any[]=[];
  groupTable:any[]=[];
  type: string = 'learner';
  groupForForm:any;
  groupId : number | undefined;
  selectedModal:string = '';
  selectedLeaner:number | undefined;

  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;
  dialog = inject(MatDialog);

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, selectedModal: string, id?: number): void {
    this.selectedModal = selectedModal;
    this.selectedLeaner = id;


    if (this.selectedModal === 'update' && id !== undefined) {
      this.learnerService.getLeanerById(id).subscribe(
        (learnerData) => {
          if (learnerData) {
            this.populateForm(learnerData);
            this.dialog.open(this.dialogTemplate, {
              width: '600px',
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
    } else if(this.selectedModal === 'create') {
      this.studentForm.reset();
      this.dialog.open(this.dialogTemplate, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    }else if(this.selectedModal === 'group'){
      this.groupFrom.reset();
      this.dialog.open(this.dialogTemplate, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
      });
    }else if(this.selectedModal === 'group-update' && id !== undefined){
      this.groupService.getGroupById(id).subscribe(
        (groupData) => {
          if (groupData) {
            this.populateGroup(groupData);
            this.dialog.open(this.dialogTemplate, {
              width: '600px',
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
  }

  public studentForm = this.fb.group({
    id : [null],
    fullname : [''],
    phone_number :[''],
    subject1 : [''],
    subject2 :[''],
    group_id:['']
  })

  public groupFrom = this.fb.group({
    id : [null],
    name:['']
  })

  closeDialog(): void {
    this.dialog.closeAll();
    this.studentForm.reset();
  }

  ngOnInit(): void {
    this.groupId = Number(this.groupId);
    this.loadGroups();

    if (this.type === 'learner') {
      this.loadData();
    }
  }

  loadData() {
      if (this.groupId !== undefined) {
        this.learnerService.getLearner(this.groupId).subscribe(data => {
          this.learner = data;
        }, error => {
          console.error('Ошибка при загрузке данных сотрудников', error);
        });
      }
  }

  loadGroups() {
      this.groupService.getGroup().subscribe(data => {
        this.group = data;
        this.groupForForm = data;
        if (this.group.length > 0) {
          this.groupId = this.group[0].id;
          this.loadData();
        }
      }, error => {
        console.error('Ошибка при загрузке групп', error);
      });
  }


  changeType(newType: string) {
    this.type = newType;
    if (this.type === 'learner') {
      this.loadData();
    } else if (this.type === 'group') {
      this.loadGroups();
    }
  }

  populateForm(learnerData: any): void {
    this.studentForm.patchValue({
      id : learnerData.id,
      fullname : learnerData.fullname,
      phone_number :learnerData.phone_number,
      subject1 : learnerData.subject1,
      subject2 :learnerData.subject2,
      group_id:learnerData.group_id
    });
  }

  populateGroup(groupData:any){
    this.groupFrom.patchValue({
      id:groupData.id,
      name:groupData.name
    })
  }


  getSelectedGroupName(): string {
    if (!this.group || this.groupId === undefined) {
      return 'Группа не выбрана';
    }

    const selectedGroup = this.group.find((g: any) => Number(g.id) === Number(this.groupId));

    return selectedGroup ? selectedGroup.name : 'Группа не выбрана';
  }

  saveForm(){
    let phone = this.studentForm.get('phone_number')?.value;

    if (phone) {
      phone = phone.replace(/\D/g, '');

      if (phone.length === 10) {
        phone = `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)} ${phone.slice(6, 8)} ${phone.slice(8, 10)}`;
        this.studentForm.get('phone_number')?.setValue(phone);
      } else {
        this.alert.warn('Некорректный формат телефона')
      }
    }

    if (this.studentForm.invalid) {
      this.alert.warn('Форма содержит ошибки');
      return;
    }

    this.learnerService.saveLearner(this.studentForm.value).subscribe(
      (response) => {
        if (response.success) {
          this.alert.success('Данные успешно сохранены');
          this.studentForm.reset();
          this.loadData();
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

  saveGroup(){
    if(this.groupFrom.invalid){
      this.alert.warn('Форма содержит ошибки');
      return;
    }

    this.groupService.saveGroup(this.groupFrom.value).subscribe((response)=>{
      if(response.success){
        this.alert.success('Данные успешно сохранены');
        this.groupFrom.reset();
        this.loadData();
        this.loadGroups();
        this.closeDialog();
      }
    },(error)=>{
      this.alert.error('Ошибка сохранения данных')
      }
    )
  }

}
