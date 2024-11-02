import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnauthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    console.log("UnauthGuard: Checking if user is unauthenticated");
    if (!this.authService.getToken()) {
      console.log("UnauthGuard: User is unauthenticated, allowing access to StartPage");
      return of(true); // разрешить доступ к StartPage
    } else {
      console.log("UnauthGuard: User is authenticated, redirecting to MainPage");
      this.router.navigate(['main']); // перенаправить на главную страницу
      return of(false);
    }
  }
}
