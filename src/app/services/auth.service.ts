import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private csrfTokenKey = 'csrftoken';

  constructor() {
  }

  setSessionId(sessionId: string): void {
    console.log('Saving Session ID:', sessionId);
    localStorage.setItem('sessionid', sessionId);
  }
  // Метод для получения SessionID
  getSessionId(): string | null {
    return localStorage.getItem('sessionid');
  }

  // Метод для сохранения CSRF токена
  setCsrfToken(csrfToken: string): void {
    console.log('Saving CSRF Token:', csrfToken);
    localStorage.setItem('csrftoken', csrfToken);
  }

  // Метод для получения CSRF токена
  getCsrfToken(): string | null {
    return localStorage.getItem('csrftoken');
  }

  // Метод для очистки данных
  clearTokens(): void {
    localStorage.removeItem('csrftoken');
    localStorage.removeItem('sessionid');
  }
}
