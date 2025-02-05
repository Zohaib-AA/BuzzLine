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
    this.http.post<{ token: string }>(url, auth).subscribe(response => {
      console.log(response);
      if (mode == 'login') {
        this.token = response.token;
        if (this.token) {
          this.isAuthenticated = true;
          this.authListener.next(true);
          this.route.navigate(['/']);
        }
      }
    })
  }
  logout() {
    this.isAuthenticated = false;
    this.token = '';
    this.authListener.next(false);
    this.route.navigate(['/']);
  }
}
