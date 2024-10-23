import {Component, inject} from '@angular/core';
import {FormBuilder, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxMaskDirective} from "ngx-mask";
import {AlertService} from '../../../services/alert.service';
import {UserService} from '../../../services/user.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-admin-login-page',
  standalone: true,
  imports: [
    FormsModule,
    NgxMaskDirective,
    ReactiveFormsModule
  ],
  templateUrl: './admin-login-page.component.html',
  styleUrl: './admin-login-page.component.css'
})
export class AdminLoginPageComponent {
  private form = inject(FormBuilder);
  private alert = inject(AlertService);
  private userService = inject(UserService);
  private router = inject(Router);

  public adminForm = this.form.group({
    username: ['', [ Validators.required,Validators.pattern(/^7\d{9}$/)]],
    password: ['', [ Validators.required,]]
  })


  onSubmit() {
    if (this.adminForm.valid) {
      const formData = {
        username: this.adminForm.value.username,
        password: this.adminForm.value.password
      };

       this.userService.adminLogin(formData).subscribe({
          next: (response) => {
            if(response.logged_in){
              this.alert.success('Успешно авторизованы');
              this.adminForm.reset();
              this.router.navigate(['admin/employee'])
            }else{
              this.alert.error('У вас нет доступа')
            }
          },
          error: (error) => {
            this.alert.error('Ошибка при входе')
          }
        });
      } else {
        this.alert.warn('Форма невалидна')

      }
    }
}
