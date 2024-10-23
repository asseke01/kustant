import {inject, Injectable} from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Observable, of } from 'rxjs';
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
    const token = this.authService.getToken();
    if (token) {
      return this.verifyToken();
    } else {
      this.router.navigate(['/login']);
      return of(false);
    }
  }

  private verifyToken(): Observable<boolean> {
    return this.http.get<any>('http://127.0.0.1:8000/api/user/verify/', { withCredentials: true }).pipe(
      map(response => {
        if (response && response.verified) {
          return true;
        } else {
          this.router.navigate(['/login']);
          return false;
        }
      }),
      catchError((error) => {
        this.router.navigate(['/login']);
        return of(false);
      })
    );
  }

}
