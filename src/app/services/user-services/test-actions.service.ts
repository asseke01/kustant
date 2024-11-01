import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GetLearnerSubjects} from '../../../assets/interfaces/get_learner_subjects';
import {GetLvlData} from '../../../assets/interfaces/getLvlData';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestActionsService {

  private http = inject(HttpClient)
  private userUrl = 'http://127.0.0.1:8000/api/test/';

  public getLearnerSubjects() {
    return this.http.get<GetLearnerSubjects[]>(`${this.userUrl}get_learner_subjects/`);
  }

  public getLvlData(subject: string, lvl: number, lvl_option: number | null) {
    let params = new HttpParams()
      .set('subject', subject)
      .set('lvl', lvl);

    // Only add lvl_option if it's not null
    if (lvl_option !== null) {
      params = params.set('lvl_option', lvl_option);
    }

    return this.http.get<GetLvlData>(`${this.userUrl}get_lvl_data/`, { params });
  }

  public startSubjectTest(subject: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.userUrl}start_subject_test/`, { subject });
  }

}
