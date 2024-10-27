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
    if (!this.authService.getToken()) {
      return of(true); // allow access if not authenticated
    } else {
      this.router.navigate(['main']); // redirect to MainPage if authenticated
      return of(false);
    }
  }
}
