import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../auth-services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StaffService {
  private http = inject(HttpClient)
  private userUrl = 'http://127.0.0.1:8000/api/staff/';
  private authService = inject(AuthService);


  constructor() {
  }

  getStaff(type: string): Observable<any> {
    let params: any = {};
    if (type) {
      params.type = type;
    }

    return this.http.get(`${this.userUrl}get_staffs/`, {params});
  }

  saveStaff(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}save_staff/`, data,);
  }

  getSchoolAdmins(groupId: number): Observable<any> {
    const params = groupId ? new HttpParams().set('group_id', groupId) : undefined;
    return this.http.get(`${this.userUrl}get_school_admins/`, {params});
  }

  saveSchoolAdmin(data: any): Observable<any> {
    return this.http.post<any>(`${this.userUrl}save_school_admin/`, data);
  }

  deleteStaff(data: { prev_type: string; id: number }): Observable<any> {
    return this.http.post<any>(`${this.userUrl}delete_staff/`, data);
  }
}
