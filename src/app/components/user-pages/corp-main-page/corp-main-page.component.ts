import {Component, HostListener, inject, OnInit} from '@angular/core';
import {UserFooterComponent} from '../user-footer/user-footer.component';
import {RecordService} from '../../../services/record-services/record.service';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-corp-main-page',
  standalone: true,
  imports: [
    UserFooterComponent,
    NgClass
  ],
  templateUrl: './corp-main-page.component.html',
  styleUrl: './corp-main-page.component.css'
})
export class CorpMainPageComponent implements OnInit {
  private recordService = inject(RecordService);
  records: any[] | null = null;
  error: string | null = null;

  ngOnInit(): void {
      this.getRecords();
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
        record_type: 'week',
        date: '01.12.2024',
        min_taken_marks: 50,
        limit: 20,
        offset: 0
      })
      .subscribe({
        next: (data) => {
          this.records = data;
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

}
