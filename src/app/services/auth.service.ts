import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../interfaces&constants/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token!: string;

  constructor(private http: HttpClient) { }

  get authToken(): string {
    return this.token
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
      }
    })
  }
}
