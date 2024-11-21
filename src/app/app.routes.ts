import {Routes} from '@angular/router';
import {StartPageComponent} from './components/user-pages/start-page/start-page.component';
import {LoginPageComponent} from './components/auth-pages/login-page/login-page.component';
import {MainPageComponent} from './components/user-pages/main-page/main-page.component';
import {TestTypePageComponent} from './components/user-pages/test-pages/test-type-page/test-type-page.component';
import {StartTestPageComponent} from './components/user-pages/test-pages/start-test-page/start-test-page.component';
import {AdminPagesComponent} from './components/admin-pages/admin-pages.component';
import {AdminEmployeePageComponent} from './components/admin-pages/admin-employee-page/admin-employee-page.component';
import {AdminLearnerPageComponent} from './components/admin-pages/admin-learner-page/admin-learner-page.component';
import {AdminTestPageComponent} from './components/admin-pages/admin-test-page/admin-test-page.component';
import {AdminSubjectsPageComponent} from './components/admin-pages/admin-subjects-page/admin-subjects-page.component';
import {AdminQuestionPageComponent} from './components/admin-pages/admin-question-page/admin-question-page.component';
import {
  AdminWrongQuestionPageComponent
} from './components/admin-pages/admin-wrong-question-page/admin-wrong-question-page.component';
import {AuthGuard} from './services/auth-services/auth.guard';
import {AdminLoginPageComponent} from './components/auth-pages/admin-login-page/admin-login-page.component';
import {ProfilePageComponent} from './components/user-pages/profile-page/profile-page.component';
import {TestRequest} from '@angular/common/http/testing';
import {TestResultPageComponent} from './components/user-pages/test-pages/test-result-page/test-result-page.component';
import {TestReviewComponent} from './components/user-pages/test-pages/test-review/test-review.component';
import {AdminMarkedTestsComponent} from './components/admin-pages/admin-marked-tests/admin-marked-tests.component';

export const routes: Routes = [

  {
    path: '', component: StartPageComponent,
  },
  {
    path: 'login', component: LoginPageComponent
  },
  {
    path: 'admin-login', component: AdminLoginPageComponent
  },
  {
    path: 'main', component: MainPageComponent, canActivate: [AuthGuard]
  },
  {
    path: 'profile', component: ProfilePageComponent, canActivate: [AuthGuard]
  },
  {
    path: 'test-type/:subject_name', component: TestTypePageComponent, canActivate: [AuthGuard]
  },
  {
    path: 'start-test', component: StartTestPageComponent, canActivate: [AuthGuard]
  },
  {
    path: 'test-result/:test_id', component: TestResultPageComponent, canActivate: [AuthGuard]
  },

  {
    path: 'test-review/:test_id', component: TestReviewComponent, canActivate: [AuthGuard]
  },


  {
    path: 'admin', component: AdminPagesComponent, canActivate: [AuthGuard],
    children: [
      {
        path: 'employee', component: AdminEmployeePageComponent
      },
      {
        path: 'learner', component: AdminLearnerPageComponent
      },
      {
        path: 'subjects', component: AdminSubjectsPageComponent
      },
      {
        path: 'test', component: AdminTestPageComponent
      },
      {
        path: 'question', component: AdminQuestionPageComponent
      },
      {
        path: 'wrong-questions', component: AdminWrongQuestionPageComponent
      },
      {
        path: 'marked-tests', component: AdminMarkedTestsComponent
      }
    ]
  },
  {path: '**', redirectTo: '', pathMatch: 'full'},

];
