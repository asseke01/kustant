import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../auth-services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  private http = inject(HttpClient)
  private userUrl = 'http://127.0.0.1:8000/api/records/';
  private authService = inject(AuthService);
  constructor() { }

  getUBTRecords(params: {
    date?: string;
    record_type: 'week' | 'day' | 'all_time';
    limit: number;
    offset: number;
  }): Observable<any> {
    const httpParams = new HttpParams({ fromObject: { ...params } });
    return this.http.get(`${this.userUrl}get_ubt_records/`, { params: httpParams });
  }


}

