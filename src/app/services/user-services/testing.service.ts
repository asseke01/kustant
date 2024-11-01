import {inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {GetLearnerSpecifiedTests} from '../../../assets/interfaces/get_learner_specified_tests';

@Injectable({
  providedIn: 'root'
})
export class TestingService {

  private apiUrl = 'http://127.0.0.1:8000/api/testing/';

  private http = inject(HttpClient);

  public getQuestion(subject: string, number: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}get_question/`, {
      params: {
        subject: subject,
        number: number
      }
    });
  }

  public saveAnswer(questionId: number, answerId: number, type: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}save_answers/`, {
      question_id: questionId,
      answers: `[${answerId}]`,
      type: type
    });
  }

  public getLastTestId(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}get_last_test/`);
  }

}
