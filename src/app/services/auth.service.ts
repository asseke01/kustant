import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private csrfTokenKey = 'csrfToken';

  constructor() { }

  setToken(sessionId: string) {
    const expirationDate = new Date();
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);
    const expiresString = expirationDate.toUTCString();

    document.cookie = `sessionId=${sessionId}; path=/; secure; SameSite=Lax; expires=${expiresString}`;

  }

  getToken(): string | null {
    const match = document.cookie.match(new RegExp('(^| )sessionId=([^;]+)'));
    return match ? match[2] : null;
  }

  clearToken() {
    document.cookie = 'sessionId=; path=/; secure; SameSite=Lax; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }
}
