import {Component, inject, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {NgxMaskDirective} from "ngx-mask";
import {ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from '@angular/router';
import {animate, group, style, transition, trigger} from '@angular/animations';
import {TestActionsService} from '../../../../services/user-services/test-actions.service';
import {GetLearnerSubjects} from '../../../../../assets/interfaces/get_learner_subjects';
import {GetLvlData, lvlData} from '../../../../../assets/interfaces/getLvlData';

@Component({
  selector: 'app-test-type-page',
  standalone: true,
  imports: [
    NgIf,
    NgxMaskDirective,
    ReactiveFormsModule,
    NgStyle,
    NgForOf
  ],
  templateUrl: './test-type-page.component.html',
  styleUrl: './test-type-page.component.css',
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
export class TestTypePageComponent implements OnInit {
  private router = inject(Router);
  private testActionsService = inject(TestActionsService);
  private route = inject(ActivatedRoute);

  public subjectName!: string;
  public title!: string;
  public sub_title!: string;
  public lvlData: lvlData[] = [];
  public levelTwo = false;
  public levelThree = false;
  public levelFour = false;
  public imageUrl!: string;
  public currentLvl = 1;
  public isLastLvl = false;

  private levelTwoOption!: number;
  private levelThreeOption!: number;

  ngOnInit() {
    this.subjectName = this.route.snapshot.paramMap.get('subject_name') || '';
    this.getLevelData(this.subjectName, 1, null);
  }

  private getLevelData(subject: string, lvl: number, lvlOption: number | null) {
    this.testActionsService.getLvlData(subject, lvl, lvlOption).subscribe(data => {
      this.title = data.title;
      this.sub_title = data.sub_title;
      this.lvlData = data.lvl_data;
      this.imageUrl = `http://127.0.0.1:8000${data.poster}`;
      this.isLastLvl = data.is_last_lvl;
    });
  }

  public onLevelTwo() {
    this.currentLvl = 2;
    this.getLevelData(this.subjectName, this.currentLvl, null);
    this.levelTwo = true;
    this.levelThree = false;
    this.levelFour = false;
  }

  public onLevelThree(lvlOption: number) {
    console.log('Selected Level Two Option:', lvlOption);
    this.levelTwoOption = lvlOption;
    this.currentLvl = 3;
    this.getLevelData(this.subjectName, this.currentLvl, lvlOption);
    this.levelTwo = false;
    this.levelThree = true;
    this.levelFour = false;
  }

  public onLevelFour(lvlOption: number) {
    console.log('Selected Level Three Option:', lvlOption);
    this.levelThreeOption = lvlOption;
    this.currentLvl = 4;
    this.getLevelData(this.subjectName, this.currentLvl, lvlOption);
    this.levelTwo = false;
    this.levelThree = false;
    this.levelFour = true;
  }

  public goBack(): void {
    if (this.levelFour) {
      this.levelFour = false;
      if (this.levelThreeOption !== null) {
        this.getLevelData(this.subjectName, 3, this.levelTwoOption);
        this.levelThree = true;
      }
    } else if (this.levelThree) {
      this.levelThree = false;
      this.getLevelData(this.subjectName, 2, null);
      this.levelTwo = true;
    } else if (this.levelTwo) {
      this.levelTwo = false;
    } else {
      this.router.navigate(['main']);
    }
  }

  public startSubjectTest() {
    this.testActionsService.startSubjectTest(this.subjectName).subscribe(response => {
      if (response.success) {
        this.router.navigate(['start-test'], { queryParams: { subject: this.subjectName } });
      }
    });
  }

}
