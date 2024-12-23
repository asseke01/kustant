import {AfterViewInit, Component, ElementRef, HostListener, inject, OnInit, ViewChild} from '@angular/core';
import {NavBarComponent} from "../../helpers/navbar/nav-bar.component";
import {MatProgressBar} from '@angular/material/progress-bar';
import {UserService} from '../../../services/user-services/user.service';
import {AlertService} from '../../../services/helper-services/alert.service';
import {AuthService} from '../../../services/auth-services/auth.service';
import {NgForOf, NgIf, NgStyle} from '@angular/common';
import {UserFooterComponent} from '../user-footer/user-footer.component';
import {TestingService} from '../../../services/user-services/testing.service';
import {Router} from '@angular/router';
import {GetPassedTests} from '../../../../assets/interfaces/getPassedTests.interface';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    NavBarComponent,
    MatProgressBar,
    NgIf,
    UserFooterComponent,
    NgForOf,
    NgStyle
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit, AfterViewInit{
  private userService = inject(UserService)
  private alert = inject(AlertService)
  private authService = inject(AuthService)
  private testingService = inject(TestingService)
  private router = inject(Router)

  public userData: any;
  public ubtRecord!: number;
  public passedTests: GetPassedTests[] = [];
  public maxUbtScore: number = 140; // Max possible score for UBT

  get ubtRecordPercentage(): string {
    // Return "0%" if ubtRecord is undefined to avoid NaN
    if (this.ubtRecord == null || isNaN(this.ubtRecord)) {
      return '0%';
    }
    const percentage = (this.ubtRecord / this.maxUbtScore) * 100;
    return `${percentage}%`;
  }

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

  ngOnInit(): void {
    this.userData = this.authService.getUserData()
    this.getLearnerCurrentTestingExist()
    this.getUbtRecord()
    this.getPassedTests()
  }

  private getLearnerCurrentTestingExist() {
    this.testingService.getLearnerCurrentTestingExist().subscribe(data => {
      if (data.current_testing_exists) {
        this.router.navigate(['start-test']);
      }
    })
  }

  private getUbtRecord() {
    this.testingService.getUbtRecord().subscribe(data => {
      this.ubtRecord = data;
    })
  }

  private getPassedTests() {
    this.testingService.getPassedTests().subscribe(data => {
      this.passedTests = data;
    })
  }

  public navigateToTestResults(id: number){
    this.router.navigate(['test-result', id]);
  }

  @ViewChild('tableContainer', { static: false }) tableContainer!: ElementRef;

  ngAfterViewInit() {
    const container = this.tableContainer.nativeElement;

    const updateGradientVisibility = () => {
      const isScrollable = container.scrollHeight > container.clientHeight; // Проверяем, есть ли прокрутка
      const scrollPosition = container.scrollTop; // Текущее положение прокрутки
      const scrollThreshold = container.scrollHeight - container.clientHeight * 1.55; // Граница (20% от высоты)

      if (isScrollable && scrollPosition < scrollThreshold) {
        container.classList.add('overflow-active'); // Показываем градиент
      } else {
        container.classList.remove('overflow-active'); // Скрываем градиент
      }
    };

    // Проверка при загрузке
    updateGradientVisibility();

    // Обновление при скролле
    container.addEventListener('scroll', updateGradientVisibility);

    // Обновление при изменении размера окна
    window.addEventListener('resize', updateGradientVisibility);
  }

}
