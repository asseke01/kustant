import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {AuthService} from './auth.service';

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

  checkCode(phone:string|null|undefined, code:string|null|undefined):Observable<any>{
    const body = {
      phone_number: phone,
      code:code
    }

    return this.http.post<any>(`${this.userUrl}check_code/`, body).pipe(
      tap(response => {
        if (response.sessionid) {
          console.log('Received sessionid in checkCode:', response.sessionid);
          this.authService.setToken(response.sessionid);

        }
      })
    );
  }

  submitStudent(phone:string|null|undefined, code:string|null|undefined, fullname:string|null|undefined,subjects:string|null|undefined,):Observable<any>{
    const body = {
      phone_number: phone,
      code:code,
      fullname:fullname,
      subjects:subjects
    }

    return this.http.post<any>(`${this.userUrl}save_learner/`, body).pipe(
      tap(response => {
        if (response.sessionId) {
          this.authService.setToken(response.sessionId);
        }
      }))

  }
}
