import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgClass, NgIf, NgStyle} from '@angular/common';
import {animate, group, keyframes, state, style, transition, trigger} from '@angular/animations';
import {AlertService} from '../../../services/alert.service';
import {Router} from '@angular/router';
import {NgxMaskDirective} from 'ngx-mask';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule,
    NgStyle,
    NgClass,
    NgxMaskDirective,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css',
  animations: [
    trigger('slideLeftRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        group([
          animate('500ms ease-out', style({ transform: 'translateX(0)' })),
          animate('600ms ease-out', style({ opacity: 1 }))
        ])
      ]),
      transition(':leave', [
        group([
          animate('500ms ease-in', style({ transform: 'translateX(-100%)' })),
          animate('600ms ease-in', style({ opacity: 0 }))
        ])
      ])
    ])
  ]
})

export class LoginPageComponent {
  private form = inject(FormBuilder);
  private alert = inject(AlertService);
  private router = inject(Router)

  loading = false;
  isPhoneSubmitted = false;
  imageUrl = '/assets/img/auth_ico.svg';

  constructor() {}

  public phoneForm = this.form.group({
    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^7\d{9}$/)
      ]    ]
  });

  public codeForm = this.form.group({
    code: [
      '',
      [Validators.required, Validators.minLength(4), Validators.maxLength(6)]]
  });



  onSubmitPhone() {
    const phoneControl = this.phoneForm.get('phone');

    if (!phoneControl?.valid) {
      if (phoneControl) {
        phoneControl.markAsTouched();
      }

      let formElement = document.querySelector('input');
      formElement?.classList.add('shake');
      setTimeout(() => {
        formElement?.classList.remove('shake');
      }, 500);
      console.log(phoneControl);

      this.alert.warn('Пожалуйста, введите номер телефона, начинающийся с +7.');
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this.isPhoneSubmitted = true;
      this.alert.success('Смс успешно отправлен!');

      this.changeImage('/assets/img/login_second_ico.svg');
    }, 1000);
  }

  onSubmitCode() {
    if (this.codeForm.valid) {
      this.loading = true;

      setTimeout(() => {
        this.loading = false;
        this.router.navigate(['main'])
        this.alert.success('Успешно авторизован!');

      }, 1000);
    }
  }

  changeImage(newUrl: string) {
    this.imageUrl = newUrl;
  }

  goBack(): void {
    if (this.isPhoneSubmitted) {
      this.isPhoneSubmitted = false;
      this.changeImage('/assets/img/auth_ico.svg');
    } else {
      this.router.navigate(['']);
    }
  }

}
