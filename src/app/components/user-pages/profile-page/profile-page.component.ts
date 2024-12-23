import {ChangeDetectorRef, Component, inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
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
import {
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    NavBarComponent,
    MatProgressBar,
    NgIf,
    UserFooterComponent,
    NgForOf,
    NgStyle,
    MatDialogTitle,
    MatIcon,
    MatIconButton,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    FormsModule
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent implements OnInit, AfterViewInit{
export class ProfilePageComponent implements OnInit {
  @ViewChild('dialogTemplate') dialogTemplate!: TemplateRef<any>;

  private dialog = inject(MatDialog);
  private dialogRef: MatDialogRef<any> | null = null;

  private userService = inject(UserService)
  private alert = inject(AlertService)
  private authService = inject(AuthService)
  private testingService = inject(TestingService)
  private cdr = inject(ChangeDetectorRef)
  private router = inject(Router)

  public userData: any;
  private learnerId!: number;
  public ubtRecord!: number;
  public passedTests: GetPassedTests[] = [];
  public maxUbtScore: number = 140;
  public paySum!: number;
  public isPaymentPending: boolean = false;
  private invoiceId: string | null = null;

  get ubtRecordPercentage(): string {
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
    this.learnerId = this.userData.id
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
    this.testingService.getUbtRecord(this.learnerId).subscribe(data => {
      this.ubtRecord = data;
    })
  }

  private getPassedTests() {
    this.testingService.getPassedTests(this.learnerId).subscribe(data => {
      this.passedTests = data;
    })
  }

  public navigateToTestResults(id: number) {
    this.router.navigate(['test-result', id]);
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string,) {

    this.dialogRef = this.dialog.open(this.dialogTemplate, {
      maxWidth: '30vw',
      width: '100%',
      enterAnimationDuration,
      exitAnimationDuration,
      disableClose: true
    });
  }

  closeDialog(): void {
    this.dialog.closeAll();
  }

  doPay() {
    if (this.paySum) {
      this.isPaymentPending = true;
      this.cdr.detectChanges(); // Принудительно обновляем интерфейс
      this.userService.createOrder(this.paySum).subscribe((response: any) => {
        this.invoiceId = response.invoice_id;
        const paymentObject: Record<string, any> = {
          auth: response.auth,
          invoiceId: response.invoice_id,
          terminal: response.terminal,
          amount: response.amount,
          postLink: response.post_link,
          backLink: window.location.origin + '/',
          language: 'kaz',
          currency: 'KZT',
          description: `${response.amount} тг баланс толтыру`,
        };

        let payUrl = '/pay?';
        for (const key in paymentObject) {
          if (paymentObject.hasOwnProperty(key)) {
            payUrl += encodeURIComponent(key) + '=' + encodeURIComponent(
              key === 'auth' ? JSON.stringify(paymentObject[key]) : paymentObject[key]
            ) + '&';
          }
        }

        payUrl = payUrl.slice(0, -1);
        window.open(payUrl, '_blank');
      });
    }
  }


  checkPaymentStatus() {
    if (this.invoiceId) {
      this.userService.checkOrder(this.invoiceId).subscribe((response: any) => {
        if (response.credited) {
          this.alert.success('Оплата успешно завершена');
          this.isPaymentPending = false; // Сбрасываем состояние ожидания
        } else {
          this.alert.error('Оплата не завершена. Попробуйте снова');
        }
      });
    }
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
