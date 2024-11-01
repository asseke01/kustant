import {Component, inject, OnInit} from '@angular/core';
import {NavBarComponent} from '../../helpers/navbar/nav-bar.component';
import {Router} from '@angular/router';
import {TestActionsService} from '../../../services/user-services/test-actions.service';
import {GetLearnerSubjects} from '../../../../assets/interfaces/get_learner_subjects';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    NavBarComponent,
    NgForOf
  ],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.css'
})
export class MainPageComponent implements OnInit{

  private testActionsService = inject(TestActionsService);
  private router = inject(Router);

  public getLearnerSubjects: GetLearnerSubjects[] = []

  ngOnInit() {
    this.getLearnerSubject()
  }

  private getLearnerSubject() {
    return this.testActionsService.getLearnerSubjects().subscribe(data => {
      this.getLearnerSubjects = data
    })
  }

  onClick(subject_name: string) {
    this.router.navigate(['test-type', subject_name]);
  }
}
