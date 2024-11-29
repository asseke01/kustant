import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './auth.service';

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
      this.redirectToLogin();
      return of(false);
    }
  }

  private verifyToken(): Observable<boolean> {
    const token = this.authService.getToken();

    if (!token) {
      this.redirectToLogin();
      return of(false);
    }

    const url = `http://127.0.0.1:8000/api/user/verify/?token=${token}`;

    return this.http.get<any>(url).pipe(
      map(response => {
        if (response && response.verified) {
          this.authService.setUserData(response.user_data);


          return true;
        } else {
          this.authService.clearUserData();
          this.redirectToLogin();
          return false;
        }
      }),
      catchError((error) => {
        this.authService.clearUserData();
        this.redirectToLogin();
        return of(false);
      })
    );
  }


  private redirectToLogin(): void {
    this.router.navigate(['/admin-login']);
  }

}




