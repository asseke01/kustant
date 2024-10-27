import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../auth-services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private http = inject(HttpClient)
  private apiUrl = 'http://127.0.0.1:8000/api/test/';
  constructor() { }

  getTest(subject:string): Observable<any> {
    let params: any = {};
    if (subject) {
      params.subject = subject;
    }

    return this.http.get(`${this.apiUrl}get_categories/`,{params});
  }

  saveCategory(category: any): Observable<any> {

    return this.http.post<any>(`${this.apiUrl}save_category/`, category);
  }

}
