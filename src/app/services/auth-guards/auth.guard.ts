import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  constructor(private http: HttpClient, private router: Router) {}

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


    return this.http.get<any>('http://127.0.0.1:8000/api/user/verify/').pipe(
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




