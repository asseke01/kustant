import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth-services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private http = inject(HttpClient)
  private userUrl = 'http://127.0.0.1:8000/api/staff/';
  private authService = inject(AuthService);


  constructor() { }

  getStaff(type:string): Observable<any> {
    let params: any = {};
    if (type) {
      params.type = type;
    }

    return this.http.get(`${this.userUrl}get_staffs/`,{params});
  }

  saveStaff(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}save_staff/`, data, );
  }
}
