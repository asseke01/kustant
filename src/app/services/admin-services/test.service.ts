import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../auth-services/auth.service';
import {Observable} from 'rxjs';
import {GetTestResult} from '../../../assets/interfaces/getTestResult';

@Injectable({
  providedIn: 'root'
})
export class TestService {
  private http = inject(HttpClient)
  private apiUrl = 'http://127.0.0.1:8000/api/test/';

  constructor() {
  }

  getTest(subject: string): Observable<any> {
    let params: any = {};
    if (subject) {
      params.subject = subject;
    }

    return this.http.get(`${this.apiUrl}get_categories/`, {params});
  }

  saveCategory(categoryData: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}save_categories_order/`, categoryData, {
      headers: {'Content-Type': 'application/json'}
    });
  }

  saveThemes(categoryData: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}save_themes_order/`, categoryData, {
      headers: {'Content-Type': 'application/json'}
    });
  }

  saveSubThemes(categoryData: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}save_sub_themes_order/`, categoryData, {
      headers: {'Content-Type': 'application/json'}
    });
  }


  getThemes(subject: string, category_id?: number): Observable<any> {
    let params: any = {};
    if (subject) {
      params.subject = subject;
    }
    if (category_id !== undefined) {
      params.category_id = category_id;
    }

    return this.http.get(`${this.apiUrl}get_themes/`, {params});
  }


  getSubThemes(subject: string, theme_id?: number): Observable<any> {
    let params: any = {};
    if (subject) {
      params.subject = subject;
    }
    if (theme_id !== undefined) {
      params.theme_id = theme_id;
    }

    return this.http.get(`${this.apiUrl}get_sub_themes/`, {params});
  }


  getTestById(category_id: number | undefined) {
    if (category_id === undefined) {
      throw new Error("Invalid learnerId: 'undefined' is not allowed.");
    }
    const params = new HttpParams().set('category_id', category_id.toString());
    return this.http.get(`${this.apiUrl}get_category/`, {params});
  }

  getThemeById(theme_id: number | undefined) {
    if (theme_id === undefined) {
      throw new Error("Invalid learnerId: 'undefined' is not allowed.");
    }
    const params = new HttpParams().set('theme_id', theme_id.toString());
    return this.http.get(`${this.apiUrl}get_theme/`, {params});
  }

  getSubThemeById(sub_theme_id: number | undefined) {
    if (sub_theme_id === undefined) {
      throw new Error("Invalid learnerId: 'undefined' is not allowed.");
    }
    const params = new HttpParams().set('sub_theme_id', sub_theme_id.toString());
    return this.http.get(`${this.apiUrl}get_sub_theme/`, {params});
  }

  saveCategoryData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}save_category/`, data,);
  }

  saveThemeData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}save_theme/`, data,);
  }

  saveSubThemeData(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}save_sub_theme/`, data,);
  }

  getTestResult(test_id: number): Observable<GetTestResult> {
    const params = new HttpParams().set('test_id', test_id.toString());
    return this.http.get<GetTestResult>(`${this.apiUrl}get_test_result/`, {params});
  }

  getSpecifiedTest(status: string): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.get(`${this.apiUrl}get_specified_tests/`, {params});
  }

  saveSpecifiedData(data: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}save_specified_test/`, data);
  }

  getSpecifiedTestId(id: number | undefined): Observable<any> {
    if (id === undefined) {
      throw new Error("Invalid id: 'undefined' is not allowed.");
    }
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(`${this.apiUrl}get_specified_test/`, {params});
  }

  deleteSpecifiedTest(testId: number | undefined): Observable<any> {
    return this.http.post(`${this.apiUrl}delete_specified_test/`, {id: testId});
  }

  archiveSpecifiedTest(testId: number | undefined): Observable<any> {
    return this.http.post(`${this.apiUrl}archive_specified_test/`, {id: testId});
  }

  getSpecifiedTestResults(id: number | undefined): Observable<any> {
    if (id === undefined) {
      throw new Error("Invalid id: 'undefined' is not allowed.");
    }
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(`${this.apiUrl}get_specified_test_results/`, {params});
  }

  downloadResult(id: number | undefined): Observable<any> {
    if (id === undefined) {
      throw new Error("Invalid id: 'undefined' is not allowed.");
    }
    const params = new HttpParams().set('id', id.toString());
    return this.http.get(`${this.apiUrl}get_specified_test_results_in_excel/`, {params});
  }
}
