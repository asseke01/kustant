import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {GetLearnerSpecifiedTests} from '../../../assets/interfaces/get_learner_specified_tests';
import {GetQuestion} from '../../../assets/interfaces/getQuestion';
import {GetTestReview} from '../../../assets/interfaces/getTestReview.interface';

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

}
