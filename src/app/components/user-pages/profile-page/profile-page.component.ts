import {Component, inject} from '@angular/core';
import {NavBarComponent} from "../../helpers/navbar/nav-bar.component";
import {MatProgressBar} from '@angular/material/progress-bar';
import {UserService} from '../../../services/user.service';
import {AlertService} from '../../../services/alert.service';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    NavBarComponent,
    MatProgressBar
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  private userService = inject(UserService)
  private alert = inject(AlertService)


  onLogout() {
    this.userService.logout().subscribe({
      next: () => {
        this.alert.success('Успешно вышли с аккаунта')
      },
      error: (error) => {
        this.alert.error('Ошибка при выходе')
      }
    });
  }
}
