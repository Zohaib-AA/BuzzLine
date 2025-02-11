import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../interfaces&constants/auth.interface';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Url } from '../interfaces&constants/url.constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private token!: string;
  private authListener = new Subject<boolean>();
  tokenTimer: any;
  private userId: string = '';

  constructor(private http: HttpClient, private route: Router) { }

  get authToken(): string {
    return this.token;
  }

  get userAuthentication(): boolean {
    return this.isAuthenticated;
  }

  get userAuthorized() {
    return this.userId;
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
    const url =  environment.apiUrl + Url.account + sig;
    this.http.post<{ token: string, expiresIn: number, userId: string }>(url, auth).subscribe(response => {
      if (mode == 'login') {
        this.token = response.token;
        this.isAuthenticated = true;
        if (this.token) {
          const expiresIn = response.expiresIn;
          this.setTimerForExpiration(expiresIn);
          const now = new Date();
          const exp = new Date(now.getTime() + expiresIn * 1000);
          this.userId = response.userId;
          this.setSession(this.token, exp, this.userId);
        }
        this.authListener.next(true);
        this.route.navigate(['/']);
      }
    }, err => {
      this.authListener.next(false);
    })
  }
  logout() {
    clearTimeout(this.tokenTimer);
    this.isAuthenticated = false;
    this.token = '';
    this.userId = '';
    this.authListener.next(false);
    this.clearSession();
    this.route.navigate(['/']);
  }

  setSession(token: string, expiresIn: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiresIn', expiresIn.toISOString());
    localStorage.setItem('userId', userId);
  }

  clearSession() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresIn');
    localStorage.removeItem('userId');
  }

  private getAuthData() {
    const token = localStorage.getItem('token');
    const expiresIn = localStorage.getItem('expiresIn');
    const userId = localStorage.getItem('userId');
    if (!token || !expiresIn) {
      return;
    }
    return {
      token: token,
      expiresIn: new Date(expiresIn),
      userId: userId
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
      this.userId = authData?.userId ?? '';
      this.setTimerForExpiration(duration / 1000);
      this.authListener.next(true);
    }
  }
}
