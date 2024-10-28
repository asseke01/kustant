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

  saveCategory(categoryData: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}save_categories_order/`, categoryData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveThemes(categoryData: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}save_themes_order/`, categoryData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }

  saveSubThemes(categoryData: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}save_sub_themes_order/`, categoryData, {
      headers: { 'Content-Type': 'application/json' }
    });
  }


  getThemes(subject:string, category_id?:number): Observable<any> {
    let params: any = {};
    if (subject) {
      params.subject = subject;
    }
    if (category_id !== undefined) {
      params.category_id = category_id;
    }

    return this.http.get(`${this.apiUrl}get_themes/`,{params});
  }


  getSubThemes(subject:string,theme_id?:number): Observable<any> {
    let params: any = {};
    if (subject) {
      params.subject = subject;
    }
    if (theme_id !== undefined) {
      params.theme_id = theme_id;
    }

    return this.http.get(`${this.apiUrl}get_sub_themes/`,{params});
  }

  saveCategoryData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}save_category/`, data, );
  }
}
