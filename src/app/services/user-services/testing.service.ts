import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {GetLearnerSpecifiedTests} from '../../../assets/interfaces/get_learner_specified_tests';
import {GetQuestion} from '../../../assets/interfaces/getQuestion';
import {GetTestReview} from '../../../assets/interfaces/getTestReview.interface';
import {GetPassedTests} from '../../../assets/interfaces/getPassedTests.interface';

@Injectable({
  providedIn: 'root'
})
export class TestingService {

  private apiUrl = 'http://127.0.0.1:8000/api/testing/';

  private http = inject(HttpClient);

  public getQuestion(subject: string, number: number): Observable<GetQuestion> {
    return this.http.get<GetQuestion>(`${this.apiUrl}get_question/`, {
      params: {
        subject: subject,
        number: number
      }
    });
  }

  public saveAnswer(answerPayload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}save_answers/`, answerPayload);
  }

  public getLastTestId(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}get_last_test/`);
  }

  public getTestReview(test_id: number): Observable<GetTestReview> {
    const params = new HttpParams().set('test_id', test_id.toString());
    return this.http.get<GetTestReview>(`${this.apiUrl}get_test_review/`, {params});
  }

  public getQuestionResult(number: number, subject: string, test_id: number): Observable<GetQuestion> {
    return this.http.get<GetQuestion>(`${this.apiUrl}get_question_result/`, {
      params: {
        number: number,
        test_id: test_id,
        subject: subject,
      }
    });
  }

  public getLearnerCurrentTestingExist(): Observable<{ current_testing_exists: boolean }> {
    return this.http.get<{ current_testing_exists: boolean }>(`${this.apiUrl}get_learner_current_testing_existing/`);
  }

  public getUbtRecord(learnerId: number): Observable<number> {
    const params = new HttpParams().set('learner_id', learnerId);
    return this.http.get<number>(`${this.apiUrl}get_ubt_record/`, { params });
  }


  public getPassedTests(learnerId: number, limit: number = 0): Observable<GetPassedTests[]> {
    const params = new HttpParams()
      .set('learner_id', learnerId)
      .set('limit', limit);
    return this.http.get<GetPassedTests[]>(`${this.apiUrl}get_passed_tests/`, { params });
  }
}
