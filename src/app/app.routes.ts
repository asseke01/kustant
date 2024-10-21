import { Routes } from '@angular/router';
import {StartPageComponent} from './components/user-pages/start-page/start-page.component';
import {LoginPageComponent} from './components/auth-pages/login-page/login-page.component';
import {MainPageComponent} from './components/user-pages/main-page/main-page.component';
import {TestTypePageComponent} from './components/user-pages/test-pages/test-type-page/test-type-page.component';
import {StartTestPageComponent} from './components/user-pages/test-pages/start-test-page/start-test-page.component';
import {AdminPagesComponent} from './components/admin-pages/admin-pages.component';
import {AdminEmployeePageComponent} from './components/admin-pages/admin-employee-page/admin-employee-page.component';

export const routes: Routes = [

  {
    path:'', component:StartPageComponent
  },
  {
    path:'login', component:LoginPageComponent
  },
  {
    path:'main',component:MainPageComponent
  },
  {
    path:'test-type', component:TestTypePageComponent
  },
  {
    path:'start-test', component:StartTestPageComponent
  },
  {
    path:'admin', component:AdminPagesComponent,
    children:[
      {
        path:'employee', component:AdminEmployeePageComponent
      }
    ]
  }

];
