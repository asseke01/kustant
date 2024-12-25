import {Component, HostListener, inject, OnInit} from '@angular/core';
import {UserFooterComponent} from '../user-footer/user-footer.component';
import {RecordService} from '../../../services/record-services/record.service';
import {NgClass, NgIf} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../services/auth-services/auth.service';

@Component({
  selector: 'app-corp-main-page',
  standalone: true,
  imports: [
    UserFooterComponent,
    NgClass,
    RouterLink,
    NgIf
  ],
  templateUrl: './corp-main-page.component.html',
  styleUrl: './corp-main-page.component.css'
})
export class CorpMainPageComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private recordService = inject(RecordService);
  records: any[]=[];
  recordsWeek: any[]=[];
  todayDate: string = '';
  error: string | null = null;
  userData:any;


  ngOnInit(): void {
    this.setTodayDate();
    this.getRecords();
      this.getWeekRecords();
    this.userData = this.authService.getUserData();
  }


  setTodayDate(): void {
    const now = new Date();
    this.todayDate = `${this.padZero(now.getDate())}.${this.padZero(
      now.getMonth() + 1
    )}.${now.getFullYear()}`;
  }


  @HostListener('window:scroll', [])
  onWindowScroll() {
    const schoolCards = document.querySelectorAll('.school-card');
    schoolCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 300 && rect.bottom > 0) {
        card.classList.add('visible');
      }
    });

    const testCards = document.querySelectorAll('.test-card');
    testCards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 200 && rect.bottom > 0) {
        card.classList.add('visible');
      }
    });

    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 100 && rect.bottom > 0) {
        setTimeout(() => {
          card.classList.add('visible-card');
        }, index * 200);
      }
    });

    const recordCard = document.querySelectorAll('.records-card');
    recordCard.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < window.innerHeight - 150 && rect.bottom > 0) {
        setTimeout(() => {
          card.classList.add('visible-card');
        }, index * 200);
      }
    });
  }

  getRecords(): void {
    this.recordService
      .getUBTRecords({
        record_type: 'all_time',
        limit: 20,
        offset: 0
      })
      .subscribe({
        next: (data) => {
          this.records = data.records;
        },
        error: (err) => {
          this.error = 'Failed to load records: ' + err.message;
        }
      });
  }

  getWeekRecords(){
    this.recordService
      .getUBTRecords({
        record_type: 'week',
        date: this.todayDate,
        limit: 20,
        offset: 0
      })
      .subscribe({
        next: (data) => {
          this.recordsWeek = data.records;
        },
        error: (err) => {
          this.error = 'Failed to load records: ' + err.message;
        }
      });
  }

  isMenuOpen = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  referToMain(){
    if(this.userData != null){
      this.router.navigate(['main'])
    }else{
      this.router.navigate(['login'])
    }
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

}
