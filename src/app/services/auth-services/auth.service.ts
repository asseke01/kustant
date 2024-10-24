import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'token';
  private userDataKey = 'userData';

  constructor() { }
  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
  clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  setUserData(userData: any) {
    localStorage.setItem(this.userDataKey, JSON.stringify(userData));
  }

  getUserData() {
    const data = localStorage.getItem(this.userDataKey);
    return data ? JSON.parse(data) : null;
  }

  clearUserData() {
    localStorage.removeItem(this.userDataKey);
  }
}
