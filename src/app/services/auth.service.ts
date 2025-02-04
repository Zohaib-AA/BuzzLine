import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '../interfaces&constants/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  createUser(email: string, password: string, mode: string) {
    const auth: Auth = {
      email: email,
      password: password
    }
    let sig = 'register';
    if(mode == 'login'){
      sig = mode;
    }
    const url = `http://localhost:3000/api/account/${sig}`;
    this.http.post(url , auth).subscribe(response => {
      console.log(response);
    })
  }
}
