import { Routes } from '@angular/router';
import {StartPageComponent} from './components/user-pages/start-page/start-page.component';
import {LoginPageComponent} from './components/auth-pages/login-page/login-page.component';
import {MainPageComponent} from './components/user-pages/main-page/main-page.component';

export const routes: Routes = [

  {
    path:'', component:StartPageComponent
  },
  {
    path:'login', component:LoginPageComponent
  },
  {
    path:'main',component:MainPageComponent
  }

];
