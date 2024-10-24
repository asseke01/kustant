import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../auth-services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {
  private http = inject(HttpClient)
  private userUrl = 'http://127.0.0.1:8000/api/user/';
  private authService = inject(AuthService);


  constructor() { }

  getGroup(): Observable<any> {
    return this.http.get(`${this.userUrl}get_groups/`);
  }

  getGroupById(group_id: number | undefined) {
    if (group_id === undefined) {
      throw new Error("Invalid learnerId: 'undefined' is not allowed.");
    }
    const params = new HttpParams().set('group_id', group_id.toString());
    return this.http.get(`${this.userUrl}get_group/`, { params });
  }

  saveGroup(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}save_group/`, data, );
  }
}
