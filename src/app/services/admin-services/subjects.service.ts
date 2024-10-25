import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../auth-services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubjectsService {
  private http = inject(HttpClient)
  private apiUrl = 'http://127.0.0.1:8000/api/test/';
  constructor() { }

  getSubject(subject: string | undefined) {
    if (subject === undefined) {
      throw new Error("Invalid learnerId: 'undefined' is not allowed.");
    }
    const params = new HttpParams().set('subject', subject.toString());
    return this.http.get(`${this.apiUrl}get_subject/`, { params });
  }

  saveGroup(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}change_subject/`, data, );
  }
}
