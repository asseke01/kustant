import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthService} from '../auth-services/auth.service';
import {GetTestResult} from '../../../assets/interfaces/getTestResult';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient)
  private userUrl = 'http://127.0.0.1:8000/api/user/';
  private authService = inject(AuthService);



  constructor() { }


  sendCode(phone: string | null | undefined): Observable<any> {
    const body = {
      phone_number: phone
    };
    return this.http.post<any>(`${this.userUrl}send_code/`, body);
  }

  checkCode(phone: string | null | undefined, code: string | null | undefined): Observable<any> {
    const body = {
      phone_number: phone,
      code: code
    };

    return this.http.post<any>(`${this.userUrl}check_code/`, body).pipe(
      tap(response => {
        if (response.token) {
          this.authService.setToken(response.token);
        }
      }))

  }

  submitStudent(phone:string|null|undefined,
                code:string|null|undefined,
                fullname:string|null|undefined,
                subjects:string|null|undefined,)
  {
    const body = {
      phone_number: phone,
      code:code,
      fullname:fullname,
      subjects:subjects
    }

    return this.http.post<any>(`${this.userUrl}save_learner/`, body).pipe(
      tap(response => {
        if (response.token) {
          this.authService.setToken(response.token);
        }
      }))
  }

  logout(): Observable<any> {
    return this.http.get<any>(`${this.userUrl}logout_api/`).pipe(
      tap(response => {
        if (response && response.success) {
          this.authService.clearToken();
          this.authService.clearUserData();
          console.log('Выход выполнен успешно');
        } else {
          console.log('Не удалось выполнить выход');
        }
      })
    );
  }

 adminLogin(data: { password: string | null | undefined; username: string | null | undefined }): Observable<any> {
    return this.http.post<any>(`${this.userUrl}admin/login_api/`, data).pipe(
      tap(response => {
        if (response && response.token) {
          this.authService.setToken(response.token);
        }
      })
    );
  }

  getSchool():Observable<any>{
    return this.http.get(`${this.userUrl}get_school_groups/`);
  }

}
