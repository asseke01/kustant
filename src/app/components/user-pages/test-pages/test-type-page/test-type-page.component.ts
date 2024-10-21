import {Component, inject} from '@angular/core';
import {NgIf, NgStyle} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";
import {ReactiveFormsModule} from "@angular/forms";
import {Router} from '@angular/router';
import {animate, group, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-test-type-page',
  standalone: true,
  imports: [
    NgIf,
    NgxMaskDirective,
    ReactiveFormsModule,
    NgStyle
  ],
  templateUrl: './test-type-page.component.html',
  styleUrl: './test-type-page.component.css',
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
export class TestTypePageComponent {
  private router = inject(Router);
  testType = false;

  imageUrl = '/assets/img/history_ico.svg';

  onClick(type:string){
    if(type == 'startTest'){
      this.router.navigate(['start-test']);
    }else{
      this.testType = true;
      this.imageUrl = '/assets/img/level_ico.svg';
    }
  }

  goBack(): void {
    if (this.testType) {
      this.testType = false;
      this.imageUrl = '/assets/img/history_ico.svg';
    } else {
      this.router.navigate(['main']);
    }
  }


}
