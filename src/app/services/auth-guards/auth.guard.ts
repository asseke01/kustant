import {inject, Injectable} from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import {Observable, of, tap} from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private authService = inject(AuthService);
  private router = inject(Router);
  private http = inject(HttpClient);

  constructor() {}

  canActivate(): Observable<boolean> {
    const token = this.authService.getSessionId();
    console.log('Session ID:', token);
    if (token) {
      return this.verifyToken().pipe(
        catchError((error) => {
          console.error('Verify error:', error);
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    } else {
      console.log('Session ID is missing or invalid');
      this.router.navigate(['/login']);
      return of(false);
    }
  }

  private verifyToken(): Observable<boolean> {
    return this.http.get<any>('http://127.0.0.1:8000/api/user/verify/').pipe(
      tap(response => {
        console.log('Verify response:', response);
      }),
      map(response => {
        if (response && response.verified) {
          console.log('Token verified successfully');
          return true;
        } else {
          console.log('Token verification failed');
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError((error) => {
        console.log('Verify error:', error);
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }




}
