import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {AuthService} from '../auth-services/auth.service';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LearnerService {
  private http = inject(HttpClient)
  private userUrl = 'http://127.0.0.1:8000/api/user/';
  private authService = inject(AuthService);


  constructor() { }

  getLearner(group_id: number | undefined): Observable<any> {
    let params: any = {};
    if (group_id) {
      params.group_id = group_id;
    }

    return this.http.get(`${this.userUrl}get_learners/`,{params});
  }


  getLeanerById(leanerId: number | undefined) {
    if (leanerId === undefined) {
      throw new Error("Invalid learnerId: 'undefined' is not allowed.");
    }
    const params = new HttpParams().set('learner_id', leanerId.toString());
    return this.http.get(`${this.userUrl}get_learner/`, { params });
  }

  saveLearner(data: any): Observable<any> {
    return this.http.post(`${this.userUrl}admin/save_learner/`, data, );
  }
}
