import {Component, HostListener} from '@angular/core';
import {UserFooterComponent} from '../user-footer/user-footer.component';

@Component({
  selector: 'app-corp-main-page',
  standalone: true,
  imports: [
    UserFooterComponent
  ],
  templateUrl: './corp-main-page.component.html',
  styleUrl: './corp-main-page.component.css'
})
export class CorpMainPageComponent {
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
}
