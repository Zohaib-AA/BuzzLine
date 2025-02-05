import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../interfaces&constants/auth.interface';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token!: string;
  private authListener = new Subject<boolean>();
  tokenTimer: any;

  constructor(private http: HttpClient, private route: Router) { }

  get authToken(): string {
    return this.token;
  }

  get userAuthentication(): boolean {
    return this.isAuthenticated;
  }

  getAuthListener() {
    return this.authListener.asObservable();
  }

  createUser(email: string, password: string, mode: string) {
    const auth: Auth = {
      email: email,
      password: password
    }
    let sig = 'register';
    if (mode == 'login') {
      sig = mode;
    }
    const url = `http://localhost:3000/api/account/${sig}`;
    this.http.post<{ token: string, expiresIn: number }>(url, auth).subscribe(response => {
      console.log(response);
      if (mode == 'login') {
        this.token = response.token;
        if (this.token) {
          const expiresIn = response.expiresIn;
          this.setTimerForExpiration(expiresIn);
          this.isAuthenticated = true;
          const now = new Date();
          const exp = new Date(now.getTime() + expiresIn * 1000);
          this.setSession(this.token, exp);
          this.authListener.next(true);
          this.route.navigate(['/']);
        }
      }
    })
  }
  logout() {
    clearTimeout(this.tokenTimer);
    this.isAuthenticated = false;
    this.token = '';
    this.authListener.next(false);
    this.clearSession();
    this.route.navigate(['/']);
  }

  setSession(token: string, expiresIn: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expiresIn.toISOString());
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');
    if (!token || !expiresIn) {
      return;
    }
    return {
      token: token,
      expiresIn: new Date(expiresIn)
    }
  }

  setTimerForExpiration(expiresIn: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, expiresIn * 1000);
  }

  public autoAuthUser() {
    const authData = this.getAuthData();
    const now = new Date();
    let exT = 0;
    if (authData?.expiresIn) {
      exT = authData.expiresIn.getTime();
    }
    const duration = exT - now.getTime();
    if (duration > 0) {
      this.token = authData?.token ?? '';
      this.isAuthenticated = true;
      this.setTimerForExpiration(duration / 1000);
      this.authListener.next(true);
    }
  }
}
