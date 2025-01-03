import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgForOf, NgIf, NgStyle} from '@angular/common';
import {animate, group, keyframes, state, style, transition, trigger} from '@angular/animations';
import {AlertService} from '../../../services/helper-services/alert.service';
import {Router} from '@angular/router';
import {NgxMaskDirective} from 'ngx-mask';
import {UserService} from '../../../services/user-services/user.service';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgStyle,
    NgClass,
    NgxMaskDirective,
    NgForOf,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  animations: [
    trigger('slideLeftRight', [
      transition(':enter', [
        style({transform: 'translateX(100%)', opacity: 0}),
        group([
          animate('500ms ease-out', style({transform: 'translateX(0)'})),
          animate('600ms ease-out', style({opacity: 1}))
        ])
      ]),
      transition(':leave', [
        group([
          animate('500ms ease-in', style({transform: 'translateX(-100%)'})),
          animate('600ms ease-in', style({opacity: 0}))
        ])
      ])
    ])
  ]
})

export class LoginPageComponent {
  private form = inject(FormBuilder);
  private alert = inject(AlertService);
  private userService = inject(UserService)
  private router = inject(Router)

  loading = false;
  isPhoneSubmitted = false;
  isCodeSubmitted = false;
  imageUrl = '/assets/img/auth_ico.svg';
  activeGrade: number | null = null;

  setActiveGrade(grade: number): void {
    this.activeGrade = grade;
    this.studentForm.patchValue({grade});
  }

  constructor() {
  }

  public phoneForm = this.form.group({
    phone: ['', [Validators.required, Validators.pattern(/^7\d{9}$/)]]
  })

  public codeForm = this.form.group({
    code: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(6)]]
  });

  public studentForm = this.form.group({
      fullname: [''],
      subjects: [''],
      grade: [0]
    }
  )


  onSubmitPhone() {
    let phoneControl = this.phoneForm.get('phone');

    if (!phoneControl?.valid) {
      if (phoneControl) {
        phoneControl.markAsTouched();
      }

      let formElement = document.querySelector('input');
      formElement?.classList.add('shake');
      setTimeout(() => {
        formElement?.classList.remove('shake');
      }, 500);

      this.alert.warn('Пожалуйста, введите номер телефона, начинающийся с +7.');
      return;
    }

    let phone = this.phoneForm.get('phone')?.value;

    if (phone) {
      phone = phone.replace(/\D/g, '');
      phone = `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)} ${phone.slice(6, 8)} ${phone.slice(8, 10)}`;
    }

    this.loading = true;
    this.userService.sendCode(phone).subscribe(response => {
        setTimeout(() => {
          this.loading = false;
          this.isPhoneSubmitted = true;
          this.alert.success('Смс успешно отправлен!');

          this.changeImage('/assets/img/login_second_ico.svg');
        }, 1000);
      }, (error) => {
        this.loading = false;
        this.alert.error('Ошибка при отправке номера телефона')
      }
    );

  }

  onSubmitCode() {
    if (this.codeForm.valid) {
      this.loading = true;

      let code = this.codeForm.get('code')?.value
      let phone = this.phoneForm.get('phone')?.value;


      if (phone) {
        phone = phone.replace(/\D/g, '');
        phone = `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)} ${phone.slice(6, 8)} ${phone.slice(8, 10)}`;
      }

      if (code) {
        code = code.replace(/\D/g, '');
        if (code.length === 6) {
          code = `${code.slice(0, 3)} ${code.slice(3)}`;
        }
      }


      this.userService.checkCode(phone, code).subscribe(response => {
          setTimeout(() => {
            this.loading = false;
            if (response.code_is_correct) {
              if (!response.logged_in) {
                this.isCodeSubmitted = true;
                this.changeImage('/assets/img/login_three_ico.svg');
                this.alert.success('Код проверен! Пройдите регистрацию');
              } else if (response.logged_in) {
                this.alert.success('Успешно авторизован!');

                this.router.navigate(['main']).then(navigationSuccess => {
                  if (navigationSuccess) {
                  } else {
                  }
                });
              }
            } else {
              this.alert.error('Неправилньый код');
              this.loading = false;
            }


          }, 1000);
        }, (error) => {
          this.alert.error('Ошибка при проверке смс кода')
          this.loading = false;
        }
      )
    }
  }

  onSubmitStudent() {
    if (this.studentForm.valid) {
      this.loading = true


      let code = this.codeForm.get('code')?.value;

      if (code) {
        code = code.replace(/\D/g, '');
        if (code.length === 6) {
          code = `${code.slice(0, 3)} ${code.slice(3)}`;
        }
      }

      let phone = this.phoneForm.get('phone')?.value;

      if (phone) {
        phone = phone.replace(/\D/g, '');
        phone = `+7 (${phone.slice(0, 3)}) ${phone.slice(3, 6)} ${phone.slice(6, 8)} ${phone.slice(8, 10)}`;
      }

      let fullname = this.studentForm.get('fullname')?.value;
      let subjects = this.studentForm.get('subjects')?.value;
      const class_number = this.studentForm.get('grade')?.value;


      this.userService.submitStudent(phone, code, fullname, subjects, class_number).subscribe(response => {
          this.loading = false;
          this.router.navigate(['main'])
          this.alert.success('Успешно зарегестрирован!');
        }, (error) => {
          this.loading = false;
          this.alert.error('Ошибка при отправке формы')
        }
      );
    }
  }

  changeImage(newUrl: string) {
    this.imageUrl = newUrl;
  }

  goBack(): void {
    if (this.isCodeSubmitted) {
      this.isCodeSubmitted = false;
      this.isPhoneSubmitted = true;
      this.imageUrl = '/assets/img/login_second_ico.svg';
    } else if (this.isPhoneSubmitted) {
      this.isPhoneSubmitted = false;
      this.codeForm.reset();
      this.loading = false;
      this.imageUrl = '/assets/img/auth_ico.svg';
    } else {
      this.router.navigate(['']);
    }
  }


}
