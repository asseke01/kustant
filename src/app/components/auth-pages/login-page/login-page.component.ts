import {Component, inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  loading = false;

  private form = inject(FormBuilder)

  constructor() {}

  public authForm = this.form.group({
    phone: ['']
  });

  onSubmit() {
    if (this.authForm.invalid) {
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      // После завершения действия можно сбросить форму или выполнить другие действия
      console.log('Форма отправлена', this.authForm.value);
    }, 30000); // Замена на реальный запрос
  }
}
