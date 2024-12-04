import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../auth-services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticService {
  private http = inject(HttpClient)
  private userUrl = 'http://127.0.0.1:8000/api/analytics/';
  private authService = inject(AuthService);
  constructor() { }

  getDashboard(): Observable<any> {
    return this.http.get(`${this.userUrl}get_dashboard_info/`);
  }

  getAnalytics(type: string): Observable<any> {
    let params = new HttpParams();

    if (type) {
      params = params.set('diagram_type', type);
    }

    return this.http.get(`${this.userUrl}get_active_learners_diagram/`, { params });
  }

  getLoadInfo(){
    return this.http.get(`${this.userUrl}get_load_info/`);
  }


}
