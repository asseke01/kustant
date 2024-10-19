import { Routes } from '@angular/router';
import {StartPageComponent} from './components/start-page/start-page.component';
import {LoginPageComponent} from './components/auth-pages/login-page/login-page.component';

export const routes: Routes = [

  {
    path:'', component:StartPageComponent
  },
  {
    path:'login', component:LoginPageComponent
  }

];
