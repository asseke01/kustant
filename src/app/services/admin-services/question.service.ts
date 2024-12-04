import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable, of, tap} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private http = inject(HttpClient)
  private apiUrl = 'http://127.0.0.1:8000/api/question/';
  private questionsCache: Map<string, any> = new Map();

  constructor() {
  }

  getQuestions(type: string, subject: string, themeId?: number, status?: string, offset: number = 0, limit: number = 20): Observable<any> {

    let params = new HttpParams()
      .set('type', type)
      .set('subject', subject)
      .set('offset', offset.toString())
      .set('limit', limit.toString());

    if (themeId !== undefined) {
      params = params.set('theme_id', themeId.toString());
    }

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<any>(`${this.apiUrl}get_questions/`, {params});
  }

  getQuestionsCached(type: string, subject: string, themeId?: number, status?: string, offset: number = 0, limit: number = 20): Observable<any> {
    const cacheKey = `${type}-${subject}-${themeId}-${status}-${offset}-${limit}`;
    if (this.questionsCache.has(cacheKey)) {
      return of(this.questionsCache.get(cacheKey)); // Возврат кеша
    }

    return this.getQuestions(type, subject, themeId, status, offset, limit).pipe(
      tap((data) => this.questionsCache.set(cacheKey, data)) // Сохранение в кеш
    );
  }

  saveQuestion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}save_question/`, data,);
  }

  notifyIncorrectQuestion(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}notify_incorrect_question/`, data,);
  }

  saveContext(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}save_context/`, data,);
  }

  getStandardQuestion(questionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}get_question/`, {
      params: {question_id: questionId},
    });
  }

}
