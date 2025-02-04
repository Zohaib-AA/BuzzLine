import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../interfaces&constants/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  createUser(email: string, password: string) {
    const auth: Auth = {
      email: email,
      password: password
    }
    this.http.post('http://localhost:3000/api/sign/login', auth).subscribe(response => {
      console.log(response);
    })
  }
}
