import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {GetLearnerSubjects} from '../../../assets/interfaces/get_learner_subjects';
import {GetLvlData} from '../../../assets/interfaces/getLvlData';
import {Observable} from 'rxjs';
import {GetLearnerSpecifiedTests} from '../../../assets/interfaces/get_learner_specified_tests';
import {GetCurrentTesting} from '../../../assets/interfaces/getCurrentTesting';
import {GetSpecifiedTestResults} from '../../../assets/interfaces/get_specified_test_results.interface';

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

    return this.http.get<GetLvlData>(`${this.userUrl}get_lvl_data/`, {params});
  }

  public startSubjectTest(subject: string): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.userUrl}start_subject_test/`, {subject});
  }

  public startUbtTest(): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.userUrl}start_ubt_test/`, {});
  }

  public startThemeTest(theme_id: number): Observable<{ success: boolean }> {
    return this.http.post<{ success: boolean }>(`${this.userUrl}start_theme_test/`, {theme_id: theme_id});
  }

  public getLearnerSpecifiedTests(): Observable<GetLearnerSpecifiedTests[]> {
    return this.http.get<GetLearnerSpecifiedTests[]>(`${this.userUrl}get_learner_specified_tests/`);
  }

  public getCurrentTesting() {
    return this.http.get<GetCurrentTesting>(`${this.userUrl}get_current_testing/`);
  }

  public finishTest() {
    return this.http.post(`${this.userUrl}finish_test/`, {})
  }

}
